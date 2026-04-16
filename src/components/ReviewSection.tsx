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
  user: { id?: string; name: string | null; image: string | null };
};

type Props = {
  listingSlug: string;
  listingName: string;
  reviews: Review[];
  avgRating: number;
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <svg className={`h-6 w-6 ${star <= (hovered || value) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
            fill="currentColor" viewBox="0 0 20 20">
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
        <svg key={star} className={`h-4 w-4 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewForm({
  listingSlug,
  listingName,
  initial,
  onSuccess,
  onCancel,
}: {
  listingSlug: string;
  listingName: string;
  initial?: { id: string; rating: number; title: string; body: string };
  onSuccess: (review: Review) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ratingError, setRatingError] = useState("");
  const isEdit = !!initial;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setRatingError("");
    if (rating === 0) { setRatingError("Please select a rating"); return; }
    if (title.trim().length < 5) { setError("Title must be at least 5 characters"); return; }
    if (body.trim().length < 20) { setError("Review must be at least 20 characters"); return; }

    setSubmitting(true);
    try {
      const url = isEdit
        ? `/api/listings/${listingSlug}/reviews/${initial.id}`
        : `/api/listings/${listingSlug}/reviews`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title: title.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = data.details ? Object.values(data.details as Record<string, string[]>).flat() : [];
        setError(msgs.join(" • ") || data.error || "Failed to submit review");
        return;
      }
      const review: Review = {
        id: data.id,
        rating: data.rating,
        title: data.title,
        body: data.body,
        createdAt: data.createdAt,
        user: data.author ? { id: data.author.id, name: data.author.name, image: data.author.image } : { name: null, image: null },
      };
      onSuccess(review);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-secondary/30 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        {isEdit ? "Edit your review" : `Your review of ${listingName}`}
      </h3>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">Rating</label>
        <StarPicker value={rating} onChange={setRating} />
        {ratingError && <p className="mt-1 text-xs text-destructive">{ratingError}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Review title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Summarize your experience in a sentence" maxLength={100}
          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full review</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
          placeholder="Share your honest experience — what worked, what didn't, who it's best for..."
          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
        <p className="mt-1 text-xs text-muted-foreground text-right">{body.length} / 5000</p>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors">
          {submitting ? "Saving..." : isEdit ? "Save Changes" : "Submit Review"}
        </button>
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ReviewSection({ listingSlug, listingName, reviews: initialReviews, avgRating }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sessionUserId = (session?.user as any)?.id as string | undefined;
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const handleNewReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
    setShowForm(false);
  };

  const handleEditSave = (updated: Review) => {
    setReviews(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    setEditingId(null);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    setDeletingId(reviewId);
    try {
      const res = await fetch(`/api/listings/${listingSlug}/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) setReviews(prev => prev.filter(r => r.id !== reviewId));
    } finally {
      setDeletingId(null);
    }
  };

  const userHasReviewed = reviews.some(r => r.user?.id === sessionUserId);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Community Reviews</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            {reviews.length > 0 && avgRating > 0 && ` • ${avgRating.toFixed(1)} average`}
          </p>
        </div>
        {!showForm && !userHasReviewed && (
          <button
            onClick={() => { if (!session) { router.push(`/signin?callbackUrl=${window.location.pathname}`); return; } setShowForm(true); }}
            className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all">
            Write a review
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          listingSlug={listingSlug}
          listingName={listingName}
          onSuccess={handleNewReview}
          onCancel={() => setShowForm(false)}
        />
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-sm font-medium text-foreground mb-1">No reviews yet</p>
          <p className="text-xs text-muted-foreground">Be the first to share your experience with {listingName}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => {
            const canModify = sessionUserId === review.user?.id || isAdmin;
            return (
              <div key={review.id} className="border-b border-border last:border-0 pb-5 last:pb-0">
                {editingId === review.id ? (
                  <ReviewForm
                    listingSlug={listingSlug}
                    listingName={listingName}
                    initial={{ id: review.id, rating: review.rating, title: review.title, body: review.body }}
                    onSuccess={handleEditSave}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-start gap-3">
                    {review.user?.image ? (
                      <Image src={review.user.image} alt={review.user.name || "User"} width={36} height={36}
                        className="rounded-full border border-border shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                        {(review.user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-foreground">{review.user?.name || "Anonymous"}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          {canModify && (
                            <div className="flex items-center gap-2">
                              {/* Only author (not admin) can edit */}
                              {sessionUserId === review.user?.id && (
                                <button onClick={() => setEditingId(review.id)}
                                  className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                  Edit
                                </button>
                              )}
                              <button onClick={() => handleDelete(review.id)} disabled={deletingId === review.id}
                                className="text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50">
                                {deletingId === review.id ? "..." : "Delete"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <StarRow rating={review.rating} />
                      {review.title && <p className="mt-1.5 text-sm font-medium text-foreground">{review.title}</p>}
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{review.body}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
