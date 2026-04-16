"use client";

import { Suspense } from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { ListingCardSkeleton } from "@/components/ListingCardSkeleton";

type Listing = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logoUrl: string | null;
  websiteUrl: string;
  pricingModel: string;
  premiumTier: string;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  category: { id: string; name: string; icon: string };
  reviews: { rating: number }[];
  _count: { reviews: number; bookmarks: number };
};

type Category = { id: string; name: string; icon: string };

const PRICING_OPTIONS = ["Free", "Freemium", "Paid", "Open Source"];
const SORT_OPTIONS = [
  { value: "top_rated", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "most_reviewed", label: "Most Reviewed" },
  { value: "a_z", label: "A–Z" },
];

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const pricingParams = searchParams.getAll("pricing");
  const sort = searchParams.get("sort") || "top_rated";
  const page = Number(searchParams.get("page") || "1");
  const PAGE_SIZE = 12;

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateParam = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      if (value === null) {
        // removed
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when changing filters, but not when changing page itself
      if (key !== "page") {
        params.delete("page");
      }
      router.push(`/browse?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categoryParam) params.set("category", categoryParam);
    pricingParams.forEach((p) => params.append("pricing", p));
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    fetch(`/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setListings(data.listings || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, categoryParam, pricingParams.join(","), sort, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse AI Tools
          </h1>
          <p className="text-muted-foreground">
            Discover and compare the best AI agents and tools
          </p>
          {/* Search bar */}
          <div className="mt-5 flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tools..."
                defaultValue={query}
                onChange={(e) => {
                  const val = e.target.value;
                  if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                  searchTimeoutRef.current = setTimeout(() => {
                    updateParam("q", val || null);
                  }, 400);
                }}
                className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              className="sm:hidden rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${filtersOpen ? "block" : "hidden"} sm:block w-full sm:w-64 shrink-0`}
          >
            <div className="sticky top-6 rounded-xl border border-border bg-card p-5 space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Category
                </h3>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={categoryParam === ""}
                      onChange={() => updateParam("category", null)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-foreground">All</span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={categoryParam === cat.name}
                        onChange={() => updateParam("category", cat.name)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground">
                        {cat.icon} {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Pricing Model
                </h3>
                <div className="space-y-1.5">
                  {PRICING_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={pricingParams.includes(opt)}
                        onChange={(e) => {
                          const newPricing = e.target.checked
                            ? [...pricingParams, opt]
                            : pricingParams.filter((p) => p !== opt);
                          updateParam(
                            "pricing",
                            newPricing.length ? newPricing : null
                          );
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm text-foreground">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
                  Sort By
                </h3>
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear filters */}
              {(query || categoryParam || pricingParams.length > 0) && (
                <button
                  onClick={() => router.push("/browse")}
                  className="w-full text-sm text-destructive hover:underline text-left"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Count + active filters */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="animate-pulse bg-muted rounded w-24 h-4 inline-block" />
                ) : (
                  <span>
                    <strong className="text-foreground">{total}</strong> tools
                    found
                  </span>
                )}
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Listings grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tools found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => router.push("/browse")}
                  className="rounded-full border border-border bg-card px-6 py-2 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing as any} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam("page", "1")}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  « First
                </button>
                <button
                  disabled={page <= 1}
                  onClick={() =>
                    updateParam("page", String(Math.max(1, page - 1)))
                  }
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  ‹ Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : page <= 3
                        ? i + 1
                        : page >= totalPages - 2
                          ? totalPages - 4 + i
                          : page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateParam("page", String(pageNum))}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                        pageNum === page
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card hover:bg-secondary"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    updateParam("page", String(Math.min(totalPages, page + 1)))
                  }
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  Next ›
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParam("page", String(totalPages))}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-secondary transition-colors"
                >
                  Last »
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BrowseContent />
    </Suspense>
  );
}