"use client";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Overview",
    content: `AgentShelf ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use AgentShelf.io (the "Service"). By using the Service, you agree to the collection and use of information as described in this policy. This policy applies to all users, including visitors who do not create accounts.`,
  },
  {
    id: "data-collected",
    title: "2. Data We Collect",
    content: `We collect the following categories of data:

Account information: When you register, we collect your name, email address, and (optionally) a profile photo. If you sign in with Google, we receive your name, email, and profile photo from Google.

Submitted content: Reviews, ratings, tool submissions, contact form messages, and profile bio text that you voluntarily provide.

Usage data: Pages visited, search queries, listings clicked, time spent on pages, and browser/device information collected automatically through our servers and analytics tools.

Payment information: If you subscribe to a Featured or Spotlight plan, payment is processed by Stripe. We receive a confirmation token but never store your full card number, CVV, or billing address.`,
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Data",
    content: `We use collected data to: operate and improve the Service; authenticate your account; display your reviews and bookmarks; process payments via Stripe; send transactional emails (account confirmation, submission status updates); respond to contact form inquiries; monitor for abuse and enforce our Terms of Service; and generate aggregate analytics about how the Service is used. We do not sell your personal data to third parties.`,
  },
  {
    id: "data-sharing",
    title: "4. Data Sharing",
    content: `We share your data only with the following trusted service providers, and only as necessary to provide the Service:

Stripe: Payment processing for Featured and Spotlight subscriptions. Stripe's privacy policy is available at stripe.com/privacy.

Google: OAuth sign-in. When you choose "Sign in with Google," your session is authenticated via Google's OAuth 2.0 system. Google's privacy policy is available at policies.google.com/privacy.

Vercel: Our hosting platform. Your requests and server logs are processed by Vercel's infrastructure. Vercel's privacy policy is available at vercel.com/legal/privacy-policy.

Resend: Transactional email delivery. Your email address is passed to Resend to send account and notification emails. Resend's privacy policy is available at resend.com/legal/privacy-policy.

We do not share your personal information with advertisers, data brokers, or any other third parties not listed above.`,
  },
  {
    id: "cookies",
    title: "5. Cookies",
    content: `We use cookies and similar tracking technologies to maintain your session, remember your preferences (including dark/light mode), and collect aggregate analytics. Session cookies are required for authentication and will be set when you sign in. Analytics cookies are minimal and do not track you across other websites. You can disable cookies in your browser settings, but doing so may prevent certain features from working correctly.`,
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: `We retain your account information and submitted content for as long as your account is active. If you delete your account, we will delete your personal information within 30 days, except where we are required to retain it for legal or compliance purposes. Aggregated, anonymized analytics data may be retained indefinitely.`,
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

Access: Request a copy of the personal data we hold about you.
Correction: Request that we correct inaccurate or incomplete data.
Deletion: Request that we delete your personal data (right to be forgotten).
Export: Request a machine-readable copy of your data.

If you are a resident of the European Economic Area (EEA), your rights are governed by the General Data Protection Regulation (GDPR). If you are a California resident, your rights are governed by the California Consumer Privacy Act (CCPA).

To exercise any of these rights, email privacy@agentshelf.io. We will respond within 30 days. We may need to verify your identity before processing your request.`,
  },
  {
    id: "security",
    title: "8. Security",
    content: `We take reasonable technical and organizational measures to protect your personal data against unauthorized access, disclosure, alteration, or destruction. Passwords are hashed using bcrypt before storage — we never store plaintext passwords. Payment data is handled exclusively by Stripe and is never stored on our servers. All data is transmitted over HTTPS. Despite these measures, no internet transmission is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: `The Service is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have inadvertently collected personal information from a child under 13, we will delete it promptly. If you believe we may have collected data from a child, please contact us at privacy@agentshelf.io.`,
  },
  {
    id: "international",
    title: "10. International Users",
    content: `AgentShelf is operated from the United States. If you access the Service from outside the United States, your data may be transferred to, stored in, and processed in the United States, where data protection laws may differ from those in your country. By using the Service, you consent to this transfer. We will take appropriate steps to ensure that your data receives adequate protection in accordance with this Privacy Policy.`,
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify registered users by email and post a notice on the Service. The updated policy will be effective upon posting. Your continued use of the Service after the updated policy becomes effective constitutes your acceptance of the changes.`,
  },
  {
    id: "contact-privacy",
    title: "12. Contact",
    content: `For privacy-related questions, requests to exercise your rights, or concerns about our data practices, contact us at privacy@agentshelf.io. We will respond within 30 days.`,
  },
];

export default function PrivacyPage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: April 10, 2026
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="block w-full text-left text-xs text-muted-foreground hover:text-primary hover:bg-secondary rounded-md px-2 py-1.5 transition-colors"
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-3 space-y-10">
            <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-5 text-sm text-teal-800 dark:text-teal-200">
              We believe privacy is a right, not a feature. We collect only what
              we need, we don&apos;t sell your data, and we make it easy for you
              to access or delete your information.
            </div>

            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}

            <div className="border-t border-border pt-8 text-sm text-muted-foreground">
              <p>
                Questions about this Privacy Policy? Email us at{" "}
                <a
                  href="mailto:privacy@agentshelf.io"
                  className="text-primary hover:underline"
                >
                  privacy@agentshelf.io
                </a>
                .
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
