import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — AgentShelf",
  description:
    "AgentShelf is the curated shelf for AI agents and tools, built to help you find, review, and collect the best AI tools available.",
};

const STATS = [
  { value: "50+", label: "Tools Listed" },
  { value: "12", label: "Categories" },
  { value: "Free", label: "Forever" },
  { value: "100%", label: "Community Reviews" },
];

const STEPS = [
  {
    number: "01",
    title: "Browse",
    description:
      "Explore 50+ AI tools organized by category, pricing model, and community ratings. Use filters and search to find exactly what you need.",
    icon: "🔍",
  },
  {
    number: "02",
    title: "Review",
    description:
      "Read honest community reviews from real users. Write your own reviews to help others make better decisions.",
    icon: "⭐",
  },
  {
    number: "03",
    title: "Collect",
    description:
      "Bookmark tools to your personal shelf. Build a curated collection of AI tools organized for your workflow.",
    icon: "📚",
  },
];

const VALUES = [
  {
    title: "Honest curation",
    description:
      "We review every submission before it goes live. No pay-to-list, no hidden promotions in organic results — just tools that meet our quality bar.",
    icon: "🏆",
  },
  {
    title: "Community-first",
    description:
      "Reviews, ratings, and bookmarks are all powered by real users. We amplify community signal, not marketing budgets.",
    icon: "👥",
  },
  {
    title: "Kept current",
    description:
      "The AI tool landscape changes fast. We regularly audit listings for accuracy, remove dead links, and update stale information.",
    icon: "🔄",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
            Our story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The curated shelf for{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              AI tools
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AgentShelf started with a simple observation: the AI tool space is
            overwhelming. New tools launch daily. Marketing hype is everywhere.
            Honest, independent information is hard to find.
          </p>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mt-4">
            We built AgentShelf to be the directory we wished existed — curated,
            honest, and built around community knowledge rather than paid
            placement.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center py-8 px-4">
                <span className="text-3xl font-bold text-primary">{stat.value}</span>
                <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              How AgentShelf works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple loop: discover, evaluate, and save the tools that work for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl mb-5">
                  {step.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Step {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For tool makers */}
      <section className="py-16 md:py-20 bg-secondary/40 border-y border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                For tool builders
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Built an AI tool? List it on AgentShelf for free. Every
                submission is reviewed by our team before going live — which
                means when your tool appears, it&apos;s alongside others that
                meet our quality bar.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Want more visibility? Our{" "}
                <Link href="/pricing" className="text-primary hover:underline font-medium">
                  Featured and Spotlight tiers
                </Link>{" "}
                put your tool at the top of category pages, on our homepage, and
                in our monthly newsletter.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                List your tool →
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7 space-y-4">
              <h3 className="font-semibold text-foreground mb-5">
                Listing tiers at a glance
              </h3>
              {[
                { name: "Basic", price: "Free", desc: "List your tool, get reviews" },
                { name: "Featured", price: "$29/mo", desc: "Category top placement, featured badge" },
                { name: "Spotlight", price: "$79/mo", desc: "Homepage feature, newsletter, gold ring" },
              ].map((tier) => (
                <div key={tier.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">{tier.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{tier.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              What we stand for
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-card p-7"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-foreground italic leading-relaxed mb-6">
            &ldquo;I spent hours every week trying to keep up with new AI tools.
            Every week there&apos;d be another one that changed everything —
            or so the marketing said. AgentShelf is my attempt to cut through
            that noise with something that actually helps.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Alex Chen</p>
              <p className="text-xs text-muted-foreground">Founder, AgentShelf</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to explore the shelf?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse 50+ AI tools, save your favorites, and join a community of AI
            enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Browse AI tools
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
