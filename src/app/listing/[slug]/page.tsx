import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ListingLogo } from "@/components/ListingLogo";
import { prisma } from "@/lib/prisma";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ReviewSection } from "@/components/ReviewSection";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!listing) {
    return { title: "Tool Not Found — AgentShelf" };
  }

  return {
    title: `${listing.name} — AgentShelf`,
    description: listing.tagline,
    openGraph: {
      title: `${listing.name} on AgentShelf`,
      description: listing.tagline,
      images: listing.logoUrl ? [{ url: listing.logoUrl }] : [],
    },
  };
}

function calcAvgRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function StarRating({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= Math.round(value) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function ListingPage({ params }: Props) {
  const listing = await prisma.listing.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      tags: true,
      reviews: {
        include: { author: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { reviews: true, bookmarks: true } },
    },
  });

  if (!listing || listing.status !== "APPROVED") {
    notFound();
  }

  // Increment view count (fire and forget)
  prisma.listing
    .update({
      where: { id: listing.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {});

  const avgRating = calcAvgRating(listing.reviews);

  const relatedListings = await prisma.listing.findMany({
    where: {
      categoryId: listing.categoryId,
      status: "APPROVED",
      id: { not: listing.id },
    },
    take: 3,
    orderBy: { viewCount: "desc" },
    include: {
      category: true,
      tags: true,
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true, bookmarks: true } },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className={`border-b border-border ${listing.premiumTier === "SPOTLIGHT" ? "bg-gradient-to-br from-amber-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950" : "bg-card"}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Logo */}
            <div className="shrink-0">
              <ListingLogo name={listing.name} websiteUrl={listing.websiteUrl} size={80} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Link
                  href={`/browse?category=${encodeURIComponent(listing.category.name)}`}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                >
                  {listing.category.icon} {listing.category.name}
                </Link>
                {listing.premiumTier === "SPOTLIGHT" && (
                  <span className="rounded-full border border-amber-400/50 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    ⭐ Top Shelf
                  </span>
                )}
                {listing.featured && (
                  <span className="rounded-full border border-teal-400/50 bg-teal-50 dark:bg-teal-900/20 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                    Featured
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    listing.pricingModel === "FREE"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : listing.pricingModel === "OPEN_SOURCE"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {listing.pricingModel}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {listing.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                {listing.tagline}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <StarRating value={avgRating} size="sm" />
                  <span className="text-sm font-semibold text-foreground">
                    {avgRating > 0 ? avgRating.toFixed(1) : "No ratings"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({listing._count.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {listing.viewCount.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {listing._count.bookmarks} on shelves
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <BookmarkButton listingSlug={listing.slug} />
              <a
                href={listing.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-md transition-all hover:scale-105"
              >
                Visit Site
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                About {listing.name}
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed">
                <p className="whitespace-pre-wrap text-sm leading-7">
                  {listing.description}
                </p>
              </div>
            </section>

            {/* Reviews */}
            <ReviewSection
              listingSlug={listing.slug}
              listingName={listing.name}
              reviews={(listing.reviews ?? []).map((r) => ({
                id: r.id,
                rating: r.rating,
                body: r.body,
                createdAt: r.createdAt.toISOString(),
                user: r.author,
              }))}
              avgRating={avgRating}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Quick facts */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Quick Facts
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-muted-foreground mb-0.5">Website</dt>
                  <dd>
                    <a
                      href={listing.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate block"
                    >
                      {listing.websiteUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground mb-0.5">Category</dt>
                  <dd className="text-sm text-foreground">
                    {listing.category.icon} {listing.category.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground mb-0.5">Pricing</dt>
                  <dd className="text-sm text-foreground">{listing.pricingModel}</dd>
                </div>
                {listing.pricingDetails && (
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Pricing Details</dt>
                    <dd className="text-sm text-foreground">{listing.pricingDetails}</dd>
                  </div>
                )}
                {listing.tags && listing.tags.length > 0 && (
                  <div>
                    <dt className="text-xs text-muted-foreground mb-1.5">Tags</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {listing.tags.map((tag: { id: string; name: string }) => (
                        <Link
                          key={tag.id}
                          href={`/browse?q=${encodeURIComponent(tag.name)}`}
                          className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Add to shelf CTA */}
            <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 p-5">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Add to your shelf
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Bookmark tools to your personal shelf for quick access
              </p>
              <BookmarkButton listingSlug={listing.slug} variant="full" />
            </div>
          </aside>
        </div>

        {/* Related Tools */}
        {relatedListings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Related Tools in {listing.category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedListings.map((related) => (
                <ListingCard key={related.id} listing={related as any} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
