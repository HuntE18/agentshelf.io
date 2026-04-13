import Stripe from "stripe";

// Lazy singleton — only instantiated when first used at runtime, not at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}
