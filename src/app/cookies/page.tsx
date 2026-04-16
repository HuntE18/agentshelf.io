"use client";

import Link from "next/link";

const LAST_UPDATED = "January 15, 2026";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-foreground">

          {/* What are cookies */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They allow the site to remember information about your visit — such as your login state or preferences — making your next visit easier and the site more useful to you. Cookies do not contain executable code and cannot access other data on your device.
            </p>
          </section>

          {/* Cookies we use */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Cookies We Use</h2>
            <div className="space-y-5">

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-foreground">Essential Cookies</span>
                  <span className="rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 text-xs font-medium">Required</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These cookies are necessary for the site to function. They include session tokens that keep you logged in and CSRF protection tokens that secure form submissions. You cannot opt out of these cookies — without them, features like sign-in and bookmarking will not work.
                </p>
                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                  <p><code className="bg-secondary px-1 py-0.5 rounded">next-auth.session-token</code> — Authentication session</p>
                  <p><code className="bg-secondary px-1 py-0.5 rounded">next-auth.csrf-token</code> — CSRF protection</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-foreground">Preference Cookies</span>
                  <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 text-xs font-medium">Optional</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These cookies remember your preferences so you don&apos;t have to re-set them each visit. This includes your dark/light mode setting and any dismissed banners or notifications. They expire after 1 year.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-foreground">Analytics Cookies</span>
                  <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 text-xs font-medium">Optional</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We use Vercel Analytics to understand how visitors use AgentShelf. This collects aggregated, anonymized data such as page view counts, referral sources, and general geographic regions. No personally identifiable information is collected. You can opt out via your browser&apos;s Do Not Track setting (see below).
                </p>
              </div>

            </div>
          </section>

          {/* Third-party cookies */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Some features on AgentShelf involve third-party services that may set their own cookies:
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-medium text-foreground w-20 shrink-0">Google</span>
                <span>If you sign in with Google, Google OAuth sets cookies to authenticate your session. These are governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google&apos;s Privacy Policy</a>.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-foreground w-20 shrink-0">Stripe</span>
                <span>If you purchase a promoted listing, Stripe sets cookies for fraud prevention and payment security. These are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stripe&apos;s Privacy Policy</a>.</span>
              </li>
            </ul>
          </section>

          {/* How to manage */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">How to Manage Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect site functionality, including your ability to stay logged in.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { name: "Chrome", href: "https://support.google.com/chrome/answer/95647" },
                { name: "Firefox", href: "https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer" },
                { name: "Safari", href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
                { name: "Edge", href: "https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-168dab11-0753-043d-7c16-ede5947fc64d" },
              ].map((b) => (
                <a
                  key={b.name}
                  href={b.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  {b.name}
                </a>
              ))}
            </div>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Do Not Track</h2>
            <p className="text-muted-foreground leading-relaxed">
              AgentShelf respects Do Not Track (DNT) signals. When your browser sends a DNT signal, we disable analytics cookies for your session. Essential cookies required for site functionality are not affected by DNT.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. When we make material changes, we&apos;ll update the &quot;last updated&quot; date at the top of this page. Continued use of AgentShelf after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, email us at{" "}
              <a href="mailto:privacy@agentshelf.io" className="text-primary hover:underline">
                privacy@agentshelf.io
              </a>{" "}
              or use the{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact page
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
