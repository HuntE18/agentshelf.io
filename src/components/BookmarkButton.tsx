"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  listingSlug: string;
  variant?: "icon" | "full";
};

export function BookmarkButton({ listingSlug, variant = "icon" }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/listings/${listingSlug}/bookmark`)
      .then((r) => r.json())
      .then((data) => setBookmarked(data.bookmarked ?? false))
      .catch(() => {});
  }, [listingSlug, session]);

  const toggle = async () => {
    if (!session) {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }
    // Optimistic update — flip immediately, revert on failure
    const prev = bookmarked;
    setBookmarked(!prev);
    setLoading(true);
    try {
      const method = prev ? "DELETE" : "POST";
      const res = await fetch(`/api/listings/${listingSlug}/bookmark`, { method });
      if (!res.ok) {
        setBookmarked(prev); // revert
      }
    } catch {
      setBookmarked(prev); // revert
    } finally {
      setLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all disabled:opacity-60",
          bookmarked
            ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
            : "border-border bg-card text-foreground hover:bg-secondary"
        )}
      >
        <Heart className={cn("h-4 w-4", bookmarked ? "fill-white" : "")} />
        {bookmarked ? "Saved to favorites" : "Add to favorites"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all disabled:opacity-60",
        bookmarked
          ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Heart className={cn("h-4 w-4", bookmarked ? "fill-white" : "")} />
      )}
    </button>
  );
}
