"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItem = {
  q: string;
  a: string;
};

type FAQSection = {
  title: string;
  items: FAQItem[];
};

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What is AgentShelf?",
        a: "AgentShelf is a curated directory of AI tools, agents, and workflows. We help individuals and teams discover, compare, and save the best AI tools available — organized by category, pricing, and community ratings.",
      },
      {
        q: "Is AgentShelf free to use?",
        a: "Yes, browsing and bookmarking tools on AgentShelf is completely free. We offer optional paid promotional placements for tool developers who want more visibility, but there's no paywall for users.",
      },
      {
        q: "Do I need an account to browse tools?",
        a: "No account is required to browse or search the directory. You'll need to create a free account if you want to bookmark tools to your personal shelf, leave reviews, or submit a listing.",
      },
    ],
  },
  {
    title: "Submitting Tools",
    items: [
      {
        q: "How do I submit my AI tool to AgentShelf?",
        a: "Head to the Submit page and fill out the listing form with your tool's name, URL, category, description, and pricing model. Submissions are reviewed by our team before going live.",
      },
      {
        q: "How long does it take to get a listing approved?",
        a: "Most submissions are reviewed within 2–5 business days. During high-volume periods it may take a bit longer. You'll receive an email notification once your listing is approved or if we need more information.",
      },
      {
        q: "What are the requirements for submitting a tool?",
        a: "The tool must be AI-powered, publicly accessible (free trial or paid), and have a working website. We accept tools in beta as long as they're functional. Submissions must include an accurate description and correct pricing model.",
      },
      {
        q: "Can I edit my listing after it's approved?",
        a: "Yes. Log in and visit your dashboard to view your submitted listings. From there you can request edits — significant changes go through a brief re-review to maintain accuracy.",
      },
      {
        q: "Why was my submission rejected?",
        a: "Common reasons include: the tool isn't AI-powered, the website isn't functional, the description is too thin or promotional, or it duplicates an existing listing. You'll receive feedback in the rejection email so you can resubmit with corrections.",
      },
    ],
  },
  {
    title: "Promoted Listings",
    items: [
      {
        q: "How does Featured/Spotlight placement work?",
        a: "Featured listings appear with a teal badge and get priority placement in search results and category pages. Spotlight listings get top-of-page placement and an amber badge. Both are monthly subscriptions managed through the Promote page.",
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, all promotional subscriptions can be cancelled at any time from your dashboard. Your promotion remains active until the end of the current billing period — there are no long-term contracts.",
      },
      {
        q: "Do you offer refunds?",
        a: "We offer refunds within 48 hours of purchase if your promoted listing hasn't received any impressions yet. After that window, refunds are evaluated on a case-by-case basis. Contact us at support@agentshelf.io for assistance.",
      },
    ],
  },
  {
    title: "Reviews & Ratings",
    items: [
      {
        q: "How does the rating system work?",
        a: "Users rate tools on a 1–5 star scale and can leave a written review. Each tool displays its average rating and total review count. Ratings are recalculated in real time as new reviews come in.",
      },
      {
        q: "Can I review a tool I haven't used?",
        a: "We ask that you only review tools you've genuinely used. Reviews that appear fabricated or unhelpful may be removed. Our goal is to keep reviews trustworthy and useful for the community.",
      },
      {
        q: "How do you prevent fake reviews?",
        a: "Reviews require a verified account. We monitor for patterns like sudden review spikes, identical phrasing, and accounts created solely to review a single tool. Suspicious reviews are flagged for manual inspection.",
      },
      {
        q: "Can a tool owner remove negative reviews?",
        a: "No. Tool owners cannot remove or edit user reviews. If a review violates our content policy (spam, harassment, off-topic), you can flag it and our moderation team will evaluate it.",
      },
    ],
  },
  {
    title: "Account & Privacy",
    items: [
      {
        q: "How is my data used?",
        a: "We use your email to send account-related notifications and, if you opt in, our weekly digest. We don't sell your personal data to third parties. See our Privacy Policy for full details.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes. Go to your dashboard Settings tab and you'll find the option to delete your account. This permanently removes your profile, bookmarks, and reviews. Submitted listings may be retained in anonymized form.",
      },
      {
        q: "Do you sell my email?",
        a: "No. We never sell, rent, or share your email address with advertisers or third parties. Your email is only used for authentication and optional communications you explicitly opt into.",
      },
    ],
  },
  {
    title: "Technical & Other",
    items: [
      {
        q: "I found a broken link or incorrect info. How do I report it?",
        a: "Use the Contact page and select 'Listing Issue' as the subject. Include the tool name and what's incorrect. We typically fix reported issues within 24–48 hours.",
      },
      {
        q: "Can I use AgentShelf data for research or my own project?",
        a: "For personal research or academic use, reach out via the Contact page and describe what you need. Commercial scraping or bulk data extraction without permission is not permitted under our Terms of Service.",
      },
      {
        q: "How do I contact the team?",
        a: "Use the Contact page for general inquiries, bug reports, or partnership discussions. For urgent account issues, email support@agentshelf.io directly.",
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-medium text-foreground">{item.q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 mt-0.5",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
          {item.a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              Contact us →
            </Link>
          </p>
        </div>

        {/* FAQ sections */}
        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {section.title}
              </h2>
              <div className="rounded-xl border border-border bg-card divide-y-0 px-5">
                {section.items.map((item) => (
                  <AccordionItem key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 rounded-xl border border-border bg-card p-8 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            Our team is happy to help with anything not covered above.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get in touch →
          </Link>
        </div>
      </div>
    </div>
  );
}
