import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SearchBar } from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AgentShelf — AI Agent & Tool Directory",
  description:
    "Every AI agent, one shelf. Browse, review, and collect the best AI tools — curated for builders, creators, and curious minds.",
};

const POPULAR_CATEGORIES = [
  "Coding",
  "Writing",
  "Image Generation",
  "Research",
  "Productivity",
  "Data Analysis",
];

async function getHomeData() {
  const [featuredListings, categories, recentListings] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "APPROVED", featured: true },
      take: 6,
      orderBy: { viewCount: "desc" },
      include: {
        category: true,
        tags: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    }),
    prisma.category.findMany({
      take: 8,
      orderBy: { listings: { _count: "desc" } },
      include: { _count: { select: { listings: true } } },
    }),
    prisma.listing.findMany({
      where: { status: "APPROVED" },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        tags: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    }),
  ]);

  return { featuredListings, categories, recentListings };
}

export default async function HomePage() {
  const { featuredListings, categories, recentListings } = await getHomeData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
            The AI tool directory built by the community
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Every AI agent,{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              one shelf.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse and discover the best AI agents, tools, and assistants —
            curated, reviewed, and organized so you can find exactly what you
            need.
          </p>
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/browse?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-slate-700 bg-slate-800/50 px-4 py-1.5 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: "Tools Listed", value: "50+" },
              { label: "Categories", value: "12" },
              { label: "Community Reviews", value: "100%" },
              { label: "Always", value: "Free" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-6 px-4"
              >
                <span className="text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Shelf Picks */}
      {featuredListings.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                    Curated
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Top Shelf Picks
                </h2>
                <p className="text-muted-foreground mt-2">
                  Hand-selected tools that set the standard
                </p>
              </div>
              <Link
                href="/browse?filter=spotlight"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Grid */}
      {categories.length > 0 && (
        <section className="py-16 md:py-20 bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Browse by Category
              </h2>
              <p className="text-muted-foreground mt-2">
                Find the right tool for every job
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                Browse all tools →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New on the Shelf */}
      {recentListings.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal-500">
                    Just added
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  New on the Shelf
                </h2>
                <p className="text-muted-foreground mt-2">
                  Recently added tools worth checking out
                </p>
              </div>
              <Link
                href="/browse?sort=newest"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                See all new →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have an AI tool to share?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-xl mx-auto">
            List your AI tool for free. Reach thousands of developers, creators,
            and AI enthusiasts browsing the shelf every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 hover:bg-indigo-50 shadow-lg transition-all hover:scale-105"
            >
              List your AI tool
            </Link>
            <Link
              href="/signup"
              className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-all"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
