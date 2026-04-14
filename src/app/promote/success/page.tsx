import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Successful — AgentShelf" };

export default function PromoteSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-4xl">
          🎉
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">You&apos;re on the shelf!</h1>
        <p className="text-muted-foreground mb-2">
          Your listing is now featured on AgentShelf. Premium placement goes live within a few minutes.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          You&apos;ll receive a confirmation email from Stripe with your receipt.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            View my dashboard
          </Link>
          <Link href="/browse" className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            Browse tools
          </Link>
        </div>
      </div>
    </div>
  );
}
