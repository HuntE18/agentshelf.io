"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

type Submission = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

function PromoteContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTier = searchParams.get("tier") === "spotlight" ? "spotlight" : "featured";

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedListing, setSelectedListing] = useState("");
  const [selectedTier, setSelectedTier] = useState<"featured" | "spotlight">(defaultTier);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/promote");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/user/submissions")
      .then((r) => r.json())
      .then((data) => {
        const subs = Array.isArray(data) ? data : (data.submissions || []);
        const approved = subs.filter((s: Submission) => s.status === "APPROVED");
        setSubmissions(approved);
        if (approved.length > 0) setSelectedListing(approved[0].id);
        setFetchingSubmissions(false);
      })
      .catch(() => setFetchingSubmissions(false));
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: selectedListing, tier: selectedTier }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950 py-12">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            ← Back to Pricing
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-3">Promote Your Tool</h1>
          <p className="text-muted-foreground">Get premium placement on AgentShelf and reach thousands of AI builders.</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
        {fetchingSubmissions ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-secondary rounded-xl animate-pulse" />)}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-border bg-card">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No approved listings yet</h3>
            <p className="text-muted-foreground mb-6">
              You need at least one approved listing to promote. Submit your tool first.
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Submit a Tool →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select listing */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <label className="block text-sm font-semibold text-foreground mb-3">Select your listing</label>
              <select
                value={selectedListing}
                onChange={(e) => setSelectedListing(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {submissions.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            {/* Select tier */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <label className="block text-sm font-semibold text-foreground mb-4">Select your plan</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Featured */}
                <label className={`relative flex flex-col cursor-pointer rounded-xl border-2 p-5 transition-all ${selectedTier === "featured" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="tier" value="featured" checked={selectedTier === "featured"} onChange={() => setSelectedTier("featured")} className="sr-only" />
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-bold text-foreground">Featured</div>
                  <div className="text-2xl font-bold text-foreground mt-1">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <li>✓ Featured badge on your card</li>
                    <li>✓ Priority in category results</li>
                    <li>✓ Teal border treatment</li>
                  </ul>
                </label>

                {/* Spotlight */}
                <label className={`relative flex flex-col cursor-pointer rounded-xl border-2 p-5 transition-all ${selectedTier === "spotlight" ? "border-amber-400 bg-amber-50/50 dark:bg-amber-900/10" : "border-border hover:border-amber-400/50"}`}>
                  <input type="radio" name="tier" value="spotlight" checked={selectedTier === "spotlight"} onChange={() => setSelectedTier("spotlight")} className="sr-only" />
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-bold text-foreground">Spotlight</div>
                  <div className="text-2xl font-bold text-foreground mt-1">$79<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <li>✓ Homepage Top Shelf Picks</li>
                    <li>✓ Gold ring treatment</li>
                    <li>✓ Newsletter mention</li>
                    <li>✓ Everything in Featured</li>
                  </ul>
                </label>
              </div>
            </div>

            {/* Optional reason */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Why should this tool be featured? <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 500))}
                placeholder="Tell us what makes your tool stand out..."
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{reason.length}/500</p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedListing}
              className="w-full rounded-xl bg-primary py-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Redirecting to checkout...
                </span>
              ) : (
                `Continue to Payment — ${selectedTier === "featured" ? "$29" : "$79"}/mo`
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Powered by Stripe. Cancel anytime.{" "}
              <Link href="/terms" className="underline hover:text-foreground">Terms</Link> apply.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PromotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PromoteContent />
    </Suspense>
  );
}
