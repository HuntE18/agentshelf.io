"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Review = {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
};

type Props = {
  listingSlug: string;
  listingName: string;
  reviews: Review[];
  avgRating: number;
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg
            className={`h-6 w-6 ${star <= (hovered || value) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewSection({
  listingSlug,
  listingName,
  reviews: initialReviews,
  avgRating,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ratingError, setRatingError] = useState("");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRatingError("");

    if (!session) {
      router.push(`/signin?callbackUrl=${window.location.pathname}`);
      return;
    }
    if (rating === 0) {
      setRatingError("Please select a rating");
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }
    if (body.trim().length < 20) {
      setError("Review must be at least 20 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/listings/${listingSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Show field-level errors if present
        if (data.details) {
          const msgs = Object.values(data.details as Record<string, string[]>).flat();
          setError(msgs.join(" • ") || data.error || "Failed to submit review");
        } else {
          setError(data.error || "Failed to submit review");
        }
        setSubmitting(false);
        return;
      }
      // API returns the review object directly (not wrapped)
      const newReview: Review = {
        id: data.id,
        rating: data.rating,
        title: data.title,
        body: data.body,
        createdAt: data.createdAt,
        user: data.author ?? { name: (session.user?.name ?? null), image: (session.user?.image ?? null) },
      };
      setReviews((prev) => [newReview, ...prev]);
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Community Reviews
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            {reviews.length > 0 && avgRating > 0 && ` • ${avgRating.toFixed(1)} average`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              if (!session) {
                router.push(`/signin?callbackUrl=${window.location.pathname}`);
                return;
              }
              setShowForm(true);
            }}
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-6 rounded-xl border border-border bg-secondary/30 p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-foreground">
            Your review of {listingName}
          </h3>

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Rating
            </label>
            <StarPicker value={rating} onChange={setRating} />
            {ratingError && (
              <p className="mt-1 text-xs text-destructive">{ratingError}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Review title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience in a sentence"
              maxLength={100}
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Full review
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Share your honest experience — what worked, what didn't, who it's best for..."
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">
              {body.length} / 5000
            </p>
            {error && (
              <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
                setRatingError("");
                setTitle("");
                setBody("");
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-sm font-medium text-foreground mb-1">
            No reviews yet
          </p>
          <p className="text-xs text-muted-foreground">
            Be the first to share your experience with {listingName}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-border last:border-0 pb-5 last:pb-0"
            >
              <div className="flex items-start gap-3">
                {review.user?.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "User"}
                    width={36}
                    height={36}
                    className="rounded-full border border-border shrink-0"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {(review.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">
                      {review.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <StarRow rating={review.rating} />
                  {review.title && (
                    <p className="mt-1.5 text-sm font-medium text-foreground">
                      {review.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {review.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
