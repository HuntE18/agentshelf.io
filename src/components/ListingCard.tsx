"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type ListingWithRelations, type PricingModel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/StarRating";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ─── Pricing label helpers ────────────────────────────────────────────────────

const pricingVariantMap: Record<PricingModel, string> = {
  FREE: "free",
  FREEMIUM: "freemium",
  PAID: "paid",
  OPEN_SOURCE: "open_source",
};

const pricingLabel: Record<PricingModel, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  OPEN_SOURCE: "Open Source",
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ListingCardProps {
  listing: ListingWithRelations;
  isBookmarked?: boolean;
  className?: string;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0 gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </CardFooter>
    </Card>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function ListingCard({
  listing,
  isBookmarked: initialBookmarked = false,
  className,
}: ListingCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = React.useState(initialBookmarked);
  const [bookmarkLoading, setBookmarkLoading] = React.useState(false);

  const isSpotlight = listing.premiumTier === "SPOTLIGHT";
  const isFeatured = listing.premiumTier === "FEATURED";

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/signin?callbackUrl=" + encodeURIComponent(`/listing/${listing.slug}`));
      return;
    }

    setBookmarkLoading(true);
    try {
      const res = await fetch(`/api/listings/${listing.slug}/bookmark`, {
        method: "POST",
      });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      toast({
        title: data.bookmarked ? "Added to shelf" : "Removed from shelf",
        description: data.bookmarked
          ? `${listing.name} is now on your shelf.`
          : `${listing.name} has been removed from your shelf.`,
        variant: data.bookmarked ? "success" : "default",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Could not update bookmark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Clearbit logo fallback
  const logoSrc =
    listing.logoUrl ||
    `https://logo.clearbit.com/${new URL(listing.websiteUrl).hostname}`;

  return (
    <Link href={`/listing/${listing.slug}`} className="block h-full">
      <Card
        className={cn(
          "group relative h-full cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md",
          isSpotlight &&
            "ring-2 ring-amber-400 shadow-amber-100 dark:shadow-amber-900/20",
          isFeatured && "ring-2 ring-teal-400",
          !isSpotlight && !isFeatured && "hover:border-indigo-300",
          className
        )}
      >
        {/* Premium badge */}
        {isSpotlight && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="spotlight">⭐ Spotlight</Badge>
          </div>
        )}
        {isFeatured && !isSpotlight && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant="featured">Featured</Badge>
          </div>
        )}

        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-slate-50 dark:bg-slate-900">
              <Image
                src={logoSrc}
                alt={`${listing.name} logo`}
                fill
                className="object-contain p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.name)}&background=4F46E5&color=fff&size=128`;
                }}
              />
            </div>

            {/* Name, tagline, rating */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {listing.name}
              </h3>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 truncate">
                {listing.tagline}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <StarRating rating={listing.avgRating ?? 0} size="sm" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({listing._count.reviews})
                </span>
              </div>
            </div>

            {/* Bookmark button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              aria-label={bookmarked ? "Remove from shelf" : "Add to shelf"}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  bookmarked
                    ? "fill-red-500 text-red-500"
                    : "text-slate-400 hover:text-red-500"
                )}
              />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex items-center gap-2 px-5 pb-4 pt-0 flex-wrap">
          {/* Category */}
          {listing.category && (
            <Badge variant="outline" className="text-xs">
              {listing.category.name}
            </Badge>
          )}

          {/* Pricing */}
          <Badge
            variant={
              pricingVariantMap[listing.pricingModel as PricingModel] as any
            }
            className="text-xs"
          >
            {pricingLabel[listing.pricingModel as PricingModel]}
          </Badge>

          {/* Tags */}
          {listing.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
