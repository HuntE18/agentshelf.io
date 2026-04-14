import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment Cancelled — AgentShelf" };

export default function PromoteCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-4xl">
          😔
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Payment cancelled</h1>
        <p className="text-muted-foreground mb-8">
          No worries — you weren&apos;t charged. You can try again anytime.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/promote" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            Try again
          </Link>
          <Link href="/pricing" className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors">
            View pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
