"use client";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using AgentShelf.io (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. These terms apply to all visitors, registered users, and tool submitters.`,
  },
  {
    id: "use-of-service",
    title: "2. Use of Service",
    content: `You may use the Service for lawful purposes only. You agree not to use the Service to transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable. You agree not to attempt to gain unauthorized access to any part of the Service, its related systems, or networks. We reserve the right to terminate access for any user who violates these terms.`,
  },
  {
    id: "accounts",
    title: "3. Accounts",
    content: `To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You must be at least 13 years of age to create an account. We reserve the right to suspend or terminate accounts that violate these terms.`,
  },
  {
    id: "user-content",
    title: "4. User Content",
    content: `You retain ownership of any content you submit to the Service, including reviews and profile information. By submitting content, you grant AgentShelf a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content in connection with operating and improving the Service. You are solely responsible for the accuracy of content you submit. We do not endorse user-submitted content and reserve the right to remove any content that violates these terms or our community standards without notice.`,
  },
  {
    id: "listings",
    title: "5. Listings & Submissions",
    content: `All tool submissions are subject to manual review. We reserve the right to approve, reject, or remove any listing at our sole discretion. Submitting a listing does not guarantee approval. Submitted listings must be accurate representations of actual AI-powered tools or agents. Spam submissions, duplicate entries, and listings for non-AI products will be rejected. By submitting a listing, you confirm that you have the right to do so and that the information provided is accurate to the best of your knowledge.`,
  },
  {
    id: "payments",
    title: "6. Premium Payments & Refunds",
    content: `Featured ($29/month) and Spotlight ($79/month) tiers are subscription-based products billed monthly. All payments are processed securely through Stripe. We do not store your payment card information. Subscriptions automatically renew monthly until cancelled. You may cancel at any time; your placement will remain active until the end of the current billing period. Refunds are available within 48 hours of purchase. After 48 hours, refunds are at our sole discretion. To request a refund, contact billing@agentshelf.io.`,
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    content: `The AgentShelf name, logo, website design, and all original content created by AgentShelf are the intellectual property of AgentShelf and are protected by applicable copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without express written permission. Tool names, logos, and descriptions submitted by tool makers remain the property of their respective owners.`,
  },
  {
    id: "third-party",
    title: "8. Third-Party Links",
    content: `The Service contains links to third-party websites and tools. These links are provided for your convenience. AgentShelf does not endorse, control, or assume responsibility for the content, privacy policies, or practices of third-party websites. We encourage you to review the terms and privacy policies of any third-party sites you visit. Your use of third-party services is at your own risk.`,
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. AgentShelf does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Reviews and ratings on the Service represent the opinions of individual users and are not endorsed or verified by AgentShelf.`,
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    content: `To the fullest extent permitted by law, AgentShelf and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Service, even if we have been advised of the possibility of such damages. In no event shall our total liability to you exceed the greater of $100 or the amount you paid to us in the twelve months preceding the claim.`,
  },
  {
    id: "termination",
    title: "11. Termination",
    content: `We reserve the right to suspend or terminate your access to the Service at any time, with or without cause, and with or without notice. Upon termination, your right to use the Service will immediately cease. Provisions of these terms that by their nature should survive termination shall survive, including intellectual property provisions, disclaimers, and limitations of liability.`,
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions. Any disputes arising from or relating to these terms or the Service shall be subject to the exclusive jurisdiction of the courts located in New York, New York.`,
  },
  {
    id: "changes",
    title: "13. Changes to Terms",
    content: `We reserve the right to modify these terms at any time. We will notify registered users of material changes by email and by posting a notice on the Service. Your continued use of the Service after changes become effective constitutes your acceptance of the revised terms. If you do not agree to the updated terms, you must stop using the Service.`,
  },
  {
    id: "contact",
    title: "14. Contact",
    content: `If you have questions about these Terms of Service, please contact us at legal@agentshelf.io or by mail at AgentShelf, New York, NY, United States.`,
  },
];

export default function TermsPage() {
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
            Terms of Service
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
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Please read these Terms of Service
              carefully before using AgentShelf. By using the Service, you agree
              to be bound by these terms.
            </div>

            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-xl font-bold text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-7">
                  {section.content}
                </p>
              </section>
            ))}

            <div className="border-t border-border pt-8 text-sm text-muted-foreground">
              <p>
                These Terms of Service were last updated on April 10, 2026. For
                questions, contact{" "}
                <a
                  href="mailto:legal@agentshelf.io"
                  className="text-primary hover:underline"
                >
                  legal@agentshelf.io
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
