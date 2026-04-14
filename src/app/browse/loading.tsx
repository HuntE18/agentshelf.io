import { ListingCardSkeleton } from "@/components/ListingCardSkeleton";

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-40 bg-muted rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
