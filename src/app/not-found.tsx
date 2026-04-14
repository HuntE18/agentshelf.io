import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Shelf icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/40">
          <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="36" width="40" height="4" rx="2" fill="#4F46E5" />
            <rect x="4" y="20" width="40" height="4" rx="2" fill="#4F46E5" />
            <rect x="4" y="8" width="4" height="32" rx="2" fill="#6366F1" />
            <rect x="40" y="8" width="4" height="32" rx="2" fill="#6366F1" />
            <rect x="12" y="24" width="8" height="12" rx="1.5" fill="#A5B4FC" />
            <rect x="22" y="26" width="6" height="10" rx="1.5" fill="#C7D2FE" />
            <rect x="30" y="23" width="8" height="13" rx="1.5" fill="#A5B4FC" />
          </svg>
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-2">404</p>
        <h1 className="text-3xl font-bold text-foreground mb-3">This shelf is empty</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/browse">Browse tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
