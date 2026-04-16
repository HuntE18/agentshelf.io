"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ListingLogo } from "@/components/ListingLogo";

type Tab = "shelf" | "submissions" | "reviews" | "settings";

type BookmarkedListing = {
  id: string;
  listing: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    logoUrl: string | null;
    websiteUrl: string;
    pricingModel: string;
    category: { name: string; icon: string };
  };
};

type Submission = {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  category: { name: string; icon: string };
};

type Review = {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  listing: { name: string; slug: string };
};

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(300, "Bio must be under 300 characters").optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-3.5 w-3.5 ${s <= rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("shelf");
  const [bookmarks, setBookmarks] = useState<BookmarkedListing[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    reset({
      name: session.user?.name || "",
      bio: (session.user as { bio?: string })?.bio || "",
    });
  }, [session, reset]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    Promise.all([
      fetch("/api/user/bookmarks").then((r) => r.json()),
      fetch("/api/user/submissions").then((r) => r.json()),
      fetch("/api/user/reviews").then((r) => r.json()),
    ])
      .then(([b, s, r]) => {
        setBookmarks(Array.isArray(b) ? b : (b.bookmarks || []));
        setSubmissions(Array.isArray(s) ? s : (s.submissions || []));
        setReviews(Array.isArray(r) ? r : (r.reviews || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const removeBookmark = async (listingId: string) => {
    await fetch(`/api/user/bookmarks/${listingId}`, { method: "DELETE" });
    setBookmarks((prev) => prev.filter((b) => b.listing.id !== listingId));
  };

  const onProfileSave = async (data: ProfileForm) => {
    setProfileSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await update(data);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      }
    } finally {
      setProfileSaving(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: "shelf", label: "My Shelf", count: bookmarks.length },
    { id: "submissions", label: "My Submissions", count: submissions.length },
    { id: "reviews", label: "My Reviews", count: reviews.length },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="mb-8 flex items-center gap-4">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={56}
              height={56}
              className="rounded-full border-2 border-border"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-white">
              {session.user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {session.user?.name}
            </h1>
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-xs">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* My Shelf */}
        {tab === "shelf" && (
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Your shelf is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Browse tools and bookmark them to build your personal shelf
                </p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Browse Tools →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="group rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0">
                        <ListingLogo
                          name={b.listing.name}
                          websiteUrl={b.listing.websiteUrl}
                          logoUrl={b.listing.logoUrl}
                          size={40}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/listing/${b.listing.slug}`}
                          className="block text-sm font-semibold text-foreground hover:text-primary truncate"
                        >
                          {b.listing.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {b.listing.category.icon} {b.listing.category.name}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {b.listing.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs rounded-full bg-secondary px-2 py-0.5">
                        {b.listing.pricingModel}
                      </span>
                      <button
                        onClick={() => removeBookmark(b.listing.id)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Submissions */}
        {tab === "submissions" && (
          <div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No submissions yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Know a great AI tool? Add it to the shelf.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Submit a Tool →
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Tool
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/listing/${sub.slug}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">
                          {sub.category.icon} {sub.category.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[sub.status] || "bg-secondary text-foreground"}`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* My Reviews */}
        {tab === "reviews" && (
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No reviews written
                </h3>
                <p className="text-muted-foreground mb-6">
                  Share your experience with AI tools you&apos;ve tried
                </p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Browse Tools →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Link
                        href={`/listing/${review.listing.slug}`}
                        className="font-semibold text-foreground hover:text-primary"
                      >
                        {review.listing.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <StarRow rating={review.rating} />
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="max-w-lg">
            <form
              onSubmit={handleSubmit(onProfileSave)}
              className="rounded-xl border border-border bg-card p-6 space-y-5"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Profile Settings
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Display Name
                </label>
                <input
                  {...register("name")}
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Bio{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  placeholder="Tell the community a bit about yourself..."
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.bio && (
                  <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
                {profileSaved && (
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ Saved!
                  </span>
                )}
              </div>
            </form>

            <div className="mt-4 rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                Email
              </h3>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Email address cannot be changed. Contact support if you need help.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
