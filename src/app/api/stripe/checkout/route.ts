import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  listingId: z.string().min(1),
  tier: z.enum(["featured", "spotlight"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 422 });
    }

    const { listingId, tier } = result.data;

    // Verify the listing belongs to this user and is approved
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        submittedById: (session.user as any).id,
        status: "APPROVED",
      },
      select: { id: true, name: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or not eligible" },
        { status: 404 }
      );
    }

    // Get price ID from server-only env vars
    const priceId =
      tier === "featured"
        ? process.env.STRIPE_FEATURED_PRICE_ID
        : process.env.STRIPE_SPOTLIGHT_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://www.agentshelf.io";

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email!,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        listingId: listing.id,
        tier,
        userId: (session.user as any).id,
      },
      success_url: `${baseUrl}/promote/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/promote/cancel`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[POST /api/stripe/checkout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
