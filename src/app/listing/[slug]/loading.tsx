import { Skeleton } from "@/components/ui/skeleton";

export default function ListingLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-6">
            <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
