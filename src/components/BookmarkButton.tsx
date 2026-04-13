"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
    setLoading(true);
    try {
      const method = bookmarked ? "DELETE" : "POST";
      const res = await fetch(`/api/listings/${listingSlug}/bookmark`, { method });
      if (res.ok) {
        setBookmarked((prev) => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
          bookmarked
            ? "border-teal-500 bg-teal-500 text-white hover:bg-teal-600"
            : "border-border bg-card text-foreground hover:bg-secondary"
        } disabled:opacity-60`}
      >
        <svg
          className="h-4 w-4"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarked ? "Saved to shelf" : "Add to your shelf"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={bookmarked ? "Remove from shelf" : "Add to shelf"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
        bookmarked
          ? "border-teal-500 bg-teal-500 text-white hover:bg-teal-600"
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
      } disabled:opacity-60`}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <svg
          className="h-4 w-4"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  );
}
