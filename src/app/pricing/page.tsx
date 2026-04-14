import type { Metadata } from "next";
import Link from "next/link";
import { PricingCTA } from "@/components/PricingCTA";

export const metadata: Metadata = {
  title: "Pricing — AgentShelf",
  description:
    "List your AI tool for free or upgrade for premium placement. Featured and Spotlight tiers get top billing on AgentShelf.",
};

const FAQ = [
  {
    q: "Can I list my tool for free?",
    a: "Yes. Basic listings are always free. You can submit your tool, get community reviews, and appear in search results at no cost.",
  },
  {
    q: "What's included in the Featured tier?",
    a: "Featured tools get a teal border card, priority placement at the top of their category, a 'Featured' badge, and priority indexing in search results.",
  },
  {
    q: "What's included in the Spotlight tier?",
    a: "Spotlight is our premium placement. Spotlight tools appear on the homepage in the 'Top Shelf Picks' section, get a gold ring treatment, a 'Top Shelf' badge, and are mentioned in our monthly newsletter.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Both Featured and Spotlight are monthly subscriptions. You can cancel at any time and you'll keep your placement until the end of the billing period.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a full refund within 48 hours of purchase if you're not satisfied. After 48 hours, refunds are at our discretion. See our Terms of Service for details.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards via Stripe. We do not store your payment information — all billing is handled securely by Stripe.",
  },
];

function CheckIcon() {
  return (
    <svg className="h-5 w-5 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-5 w-5 text-slate-300 dark:text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you need visibility. No hidden fees, no
            long-term contracts.
          </p>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Basic — Free */}
          <div className="rounded-2xl border border-border bg-card p-7 flex flex-col">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Basic
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">Free</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Get your tool in front of the community at no cost
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                [true, "List your AI tool"],
                [true, "Community reviews"],
                [true, "Basic analytics (views, bookmarks)"],
                [true, "Appear in search & browse"],
                [false, "Category top placement"],
                [false, "Homepage feature"],
                [false, "Newsletter mention"],
              ].map(([included, text]) => (
                <li key={text as string} className="flex items-center gap-3">
                  {included ? <CheckIcon /> : <XIcon />}
                  <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground"}`}>
                    {text as string}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/submit"
              className="block text-center rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Start for free
            </Link>
          </div>

          {/* Featured — $29/mo */}
          <div className="relative rounded-2xl border-2 border-teal-400 bg-card p-7 flex flex-col shadow-xl shadow-teal-100 dark:shadow-teal-900/30">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-teal-500 px-4 py-1 text-xs font-bold text-white shadow">
                Most Popular
              </span>
            </div>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-500 mb-1">
                Featured
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">$29</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Stand out in your category with premium placement
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                [true, "Everything in Basic"],
                [true, "Teal border card treatment"],
                [true, "Category top placement"],
                [true, '"Featured" badge on listing'],
                [true, "Priority in search results"],
                [true, "Enhanced analytics"],
                [false, "Homepage feature slot"],
                [false, "Newsletter mention"],
              ].map(([included, text]) => (
                <li key={text as string} className="flex items-center gap-3">
                  {included ? <CheckIcon /> : <XIcon />}
                  <span className={`text-sm ${included ? "text-foreground" : "text-muted-foreground"}`}>
                    {text as string}
                  </span>
                </li>
              ))}
            </ul>
            <PricingCTA
              tier="featured"
              label="Get Featured"
              className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all"
            />
          </div>

          {/* Spotlight — $79/mo */}
          <div className="relative rounded-2xl border-2 border-amber-400 bg-card p-7 flex flex-col"
               style={{ boxShadow: "0 0 0 2px rgb(245 158 11 / 0.2), 0 20px 40px -12px rgb(245 158 11 / 0.15)" }}>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-500 mb-1">
                Spotlight
              </p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-foreground">$79</span>
                <span className="text-muted-foreground mb-1">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum visibility — homepage feature and newsletter reach
              </p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                [true, "Everything in Featured"],
                [true, "Gold ring visual treatment"],
                [true, '"Top Shelf" badge on listing'],
                [true, "Homepage 'Top Shelf Picks' slot"],
                [true, "Monthly newsletter mention"],
                [true, "Pinned in category pages"],
                [true, "Priority support"],
                [true, "Full analytics suite"],
              ].map(([included, text]) => (
                <li key={text as string} className="flex items-center gap-3">
                  {included ? (
                    <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : <XIcon />}
                  <span className="text-sm text-foreground">{text as string}</span>
                </li>
              ))}
            </ul>
            <PricingCTA
              tier="spotlight"
              label="Get Spotlight"
              className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-all"
            />
          </div>
        </div>

        {/* Comparison note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include a 48-hour money-back guarantee. Cancel anytime.
          Prices in USD.
        </p>
      </div>

      {/* FAQ */}
      <div className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
