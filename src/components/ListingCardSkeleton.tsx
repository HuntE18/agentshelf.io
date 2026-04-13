export function ListingCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl bg-secondary shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-secondary" />
          <div className="h-3 w-1/2 rounded bg-secondary" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-3 w-5/6 rounded bg-secondary" />
        <div className="h-3 w-4/6 rounded bg-secondary" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-secondary" />
        <div className="h-3 w-16 rounded bg-secondary" />
      </div>
    </div>
  );
}
