import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Maps Stripe price IDs → premium tier names
const PRICE_TO_TIER: Record<string, "FEATURED" | "SPOTLIGHT"> = {
  [process.env.STRIPE_FEATURED_PRICE_ID ?? ""]: "FEATURED",
  [process.env.STRIPE_SPOTLIGHT_PRICE_ID ?? ""]: "SPOTLIGHT",
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      // ── 1. Checkout session completed ──────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const listingId = session.metadata?.listingId;

        if (!listingId) {
          console.warn("[Stripe] checkout.session.completed: no listingId in metadata");
          break;
        }

        // Determine tier from subscription line items
        let tier: "FEATURED" | "SPOTLIGHT" = "FEATURED";

        if (session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = subscription.items.data[0]?.price.id;
          if (priceId && PRICE_TO_TIER[priceId]) {
            tier = PRICE_TO_TIER[priceId];
          }
        }

        await prisma.listing.update({
          where: { id: listingId },
          data: {
            premiumTier: tier,
            premiumUntil: addDays(new Date(), 30),
            stripeCustomerId: session.customer as string | null,
            stripeSubscriptionId: session.subscription as string | null,
          },
        });

        break;
      }

      // ── 2. Invoice paid — extend subscription ──────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        if (!customerId) break;

        const listing = await prisma.listing.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!listing) {
          console.warn(`[Stripe] invoice.paid: no listing found for customer ${customerId}`);
          break;
        }

        // Extend premiumUntil by 30 days from now (or from current expiry if future)
        const base =
          listing.premiumUntil && listing.premiumUntil > new Date()
            ? listing.premiumUntil
            : new Date();

        await prisma.listing.update({
          where: { id: listing.id },
          data: { premiumUntil: addDays(base, 30) },
        });

        break;
      }

      // ── 3. Subscription updated — sync tier ────────────────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;

        const listing = await prisma.listing.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!listing) {
          console.warn(`[Stripe] subscription.updated: no listing for customer ${customerId}`);
          break;
        }

        const newTier = priceId ? PRICE_TO_TIER[priceId] : undefined;

        if (newTier) {
          await prisma.listing.update({
            where: { id: listing.id },
            data: { premiumTier: newTier },
          });
        }
        break;
      }

      // ── 4. Subscription deleted — downgrade to BASIC ───────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const listing = await prisma.listing.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!listing) {
          console.warn(`[Stripe] subscription.deleted: no listing for customer ${customerId}`);
          break;
        }

        await prisma.listing.update({
          where: { id: listing.id },
          data: {
            premiumTier: "BASIC",
            premiumUntil: null,
            stripeSubscriptionId: null,
          },
        });

        break;
      }

      default:
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Stripe Webhook] Handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
