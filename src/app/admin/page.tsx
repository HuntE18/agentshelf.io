"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminTab = "pending" | "all" | "users" | "reviews" | "tutorials" | "contacts" | "top-picks";

type Listing = {
  id: string; name: string; slug: string; status: string; pricingModel: string;
  createdAt: string; websiteUrl: string;
  submittedBy: { name: string | null; email: string } | null;
  category: { name: string; icon: string };
  featured: boolean; avgRating?: number;
};

type User = {
  id: string; name: string | null; email: string; image: string | null;
  role: string; createdAt: string;
  _count: { listings: number; reviews: number };
};

type ContactSubmission = {
  id: string; name: string; email: string; subject: string;
  message: string; createdAt: string; read: boolean;
};

type Review = {
  id: string; rating: number; title: string; body: string; createdAt: string;
  author: { id: string; name: string | null; email: string };
  listing: { id: string; name: string; slug: string };
};

type Tutorial = {
  id: string; slug: string; title: string; category: string;
  difficulty: string; published: boolean; publishDate: string;
  emoji: string; readTime: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  USER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const DIFF_COLORS: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`h-3.5 w-3.5 ${s <= rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

// ─── Tutorial form modal ──────────────────────────────────────────────────────

function TutorialModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Tutorial & { description?: string; content?: string; author?: string; relatedTools?: string[] };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "",
    readTime: initial?.readTime ?? "5 min read",
    emoji: initial?.emoji ?? "📖",
    difficulty: initial?.difficulty ?? "Beginner",
    publishDate: initial?.publishDate ?? new Date().toISOString().slice(0, 10),
    author: initial?.author ?? "AgentShelf Team",
    relatedTools: (initial?.relatedTools ?? []).join(", "),
    content: initial?.content ?? "",
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSave = async () => {
    setSaving(true); setErr("");
    try {
      await onSave({
        ...form,
        relatedTools: form.relatedTools.split(",").map((s: string) => s.trim()).filter(Boolean),
        published: form.published,
      });
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, type: string = "text", rows?: number) => (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {rows ? (
        <textarea
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={rows}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      ) : (
        <input
          type={type}
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">{initial ? "Edit Tutorial" : "New Tutorial"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="p-5 space-y-4">
          {err && <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-3">{err}</p>}
          <div className="grid grid-cols-2 gap-4">
            {field("Slug", "slug")}
            {field("Emoji", "emoji")}
          </div>
          {field("Title", "title")}
          {field("Description", "description", "text", 2)}
          <div className="grid grid-cols-3 gap-4">
            {field("Category", "category")}
            {field("Read Time", "readTime")}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("Author", "author")}
            {field("Publish Date", "publishDate", "date")}
          </div>
          {field("Related Tools (comma-separated)", "relatedTools")}
          {field("Content (Markdown)", "content", "text", 12)}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
              className="accent-primary h-4 w-4"
            />
            <span className="text-sm text-foreground">Published</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving..." : "Save Tutorial"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("pending");
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSearch, setAllSearch] = useState("");
  const [allStatusFilter, setAllStatusFilter] = useState("ALL");
  const [reviewSearch, setReviewSearch] = useState("");
  const [featuredSearch, setFeaturedSearch] = useState("");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);
  const [tutorialModal, setTutorialModal] = useState<{ mode: "create" | "edit"; data?: any } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/signin"); return; }
    if (status === "authenticated") {
      const user = session?.user as { role?: string } | undefined;
      if (user?.role !== "ADMIN") router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session) return;
    const user = session.user as { role?: string } | undefined;
    if (user?.role !== "ADMIN") return;

    setLoading(true);
    Promise.all([
      fetch("/api/admin/listings?status=PENDING&limit=100").then(r => r.json()),
      fetch("/api/admin/listings?limit=100").then(r => r.json()),
      fetch("/api/admin/users").then(r => r.json()),
      fetch("/api/admin/contacts").then(r => r.json()),
      fetch("/api/admin/reviews").then(r => r.json()),
      fetch("/api/admin/tutorials").then(r => r.json()),
    ])
      .then(([pending, all, usrs, ctcts, revs, tuts]) => {
        // API returns { data: [...] } for listings (fixed key)
        setPendingListings(pending.data || pending.listings || []);
        setAllListings(all.data || all.listings || []);
        setUsers(usrs.users || []);
        setContacts(ctcts.contacts || []);
        setReviews(revs.reviews || []);
        setTutorials(tuts.tutorials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const showToast = (text: string, type: "success" | "error") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAction = async (listingId: string, action: "APPROVED" | "REJECTED") => {
    setActioning(listingId);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPendingListings(prev => prev.filter(l => l.id !== listingId));
      setAllListings(prev => prev.map(l => l.id === listingId ? { ...l, status: action } : l));
      showToast(`${updated.listing?.name || "Listing"} ${action === "APPROVED" ? "approved" : "rejected"}`, "success");
    } catch {
      showToast("Action failed. Please try again.", "error");
    } finally {
      setActioning(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setActioning(reviewId);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      showToast("Review deleted", "success");
    } catch {
      showToast("Failed to delete review", "error");
    } finally {
      setActioning(null);
    }
  };

  const handleSaveTutorial = async (data: any) => {
    if (tutorialModal?.mode === "edit" && tutorialModal.data?.id) {
      const res = await fetch(`/api/admin/tutorials/${tutorialModal.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Save failed");
      }
      const updated = await res.json();
      setTutorials(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
      showToast("Tutorial updated", "success");
    } else {
      const res = await fetch("/api/admin/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Create failed");
      }
      const created = await res.json();
      setTutorials(prev => [created, ...prev]);
      showToast("Tutorial created", "success");
    }
    setTutorialModal(null);
  };

  const handleDeleteTutorial = async (id: string) => {
    if (!confirm("Delete this tutorial? This cannot be undone.")) return;
    setActioning(id);
    try {
      const res = await fetch(`/api/admin/tutorials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTutorials(prev => prev.filter(t => t.id !== id));
      showToast("Tutorial deleted", "success");
    } catch {
      showToast("Failed to delete tutorial", "error");
    } finally {
      setActioning(null);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const user = session.user as { role?: string } | undefined;
  if (user?.role !== "ADMIN") return null;

  const filteredAllListings = allListings.filter(l => {
    const matchSearch = !allSearch || l.name.toLowerCase().includes(allSearch.toLowerCase()) || l.websiteUrl.toLowerCase().includes(allSearch.toLowerCase());
    const matchStatus = allStatusFilter === "ALL" || l.status === allStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredReviews = reviews.filter(r =>
    !reviewSearch ||
    r.title.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    r.body.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    (r.author.name || "").toLowerCase().includes(reviewSearch.toLowerCase()) ||
    r.listing.name.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  const TABS: { id: AdminTab; label: string; count?: number }[] = [
    { id: "pending", label: "Pending", count: pendingListings.length },
    { id: "all", label: "All Listings", count: allListings.length },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "tutorials", label: "Tutorials", count: tutorials.length },
    { id: "users", label: "Users", count: users.length },
    { id: "contacts", label: "Contacts", count: contacts.length },
    { id: "top-picks", label: "⭐ Top Picks" },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg ${toastMsg.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toastMsg.text}
        </div>
      )}

      {tutorialModal && (
        <TutorialModal
          initial={tutorialModal.data}
          onSave={handleSaveTutorial}
          onClose={() => setTutorialModal(null)}
        />
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">AgentShelf Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded-full px-1.5 py-0.5 text-xs ${t.id === "pending" && t.count > 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-secondary text-muted-foreground"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Pending ── */}
        {tab === "pending" && (
          <div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />)}</div>
            ) : pendingListings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
                <p className="text-muted-foreground mt-2">No pending submissions to review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map(listing => (
                  <div key={listing.id} className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{listing.name}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{listing.category.icon} {listing.category.name}</span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{listing.pricingModel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{listing.websiteUrl}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {listing.submittedBy?.name || listing.submittedBy?.email || "Unknown"} • {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={listing.websiteUrl} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors">
                        View Site
                      </a>
                      <button onClick={() => handleAction(listing.id, "REJECTED")} disabled={actioning === listing.id}
                        className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50 transition-colors">
                        Reject
                      </button>
                      <button onClick={() => handleAction(listing.id, "APPROVED")} disabled={actioning === listing.id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
                        {actioning === listing.id ? "..." : "Approve"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Listings ── */}
        {tab === "all" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input type="text" placeholder="Search listings..." value={allSearch} onChange={e => setAllSearch(e.target.value)}
                className="flex-1 max-w-sm rounded-lg border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={allStatusFilter} onChange={e => setAllStatusFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tool</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Submitted</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAllListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <a href={`/listing/${listing.slug}`} className="font-medium text-foreground hover:text-primary">{listing.name}</a>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{listing.category.icon} {listing.category.name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[listing.status] || "bg-secondary text-foreground"}`}>{listing.status}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{new Date(listing.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        {listing.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleAction(listing.id, "APPROVED")} disabled={actioning === listing.id} className="text-xs font-medium text-green-600 hover:underline disabled:opacity-50">Approve</button>
                            <button onClick={() => handleAction(listing.id, "REJECTED")} disabled={actioning === listing.id} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50">Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        {tab === "reviews" && (
          <div>
            <input type="text" placeholder="Search reviews, authors, tools..." value={reviewSearch} onChange={e => setReviewSearch(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-5" />
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />)}</div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-20"><div className="text-5xl mb-4">💬</div><p className="text-muted-foreground">No reviews found</p></div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Review</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Tool</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Author</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Date</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredReviews.map(review => (
                      <tr key={review.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3.5 max-w-xs">
                          <StarRow rating={review.rating} />
                          <p className="font-medium text-foreground text-xs mt-1 truncate">{review.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{review.body}</p>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <a href={`/listing/${review.listing.slug}`} className="text-xs font-medium text-foreground hover:text-primary">{review.listing.name}</a>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground hidden md:table-cell">
                          <p>{review.author.name || "—"}</p>
                          <p className="text-[11px]">{review.author.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground hidden md:table-cell">{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => handleDeleteReview(review.id)} disabled={actioning === review.id}
                            className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50">
                            {actioning === review.id ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tutorials ── */}
        {tab === "tutorials" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">{tutorials.length} tutorials</p>
              <button onClick={() => setTutorialModal({ mode: "create" })}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                + New Tutorial
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-secondary animate-pulse" />)}</div>
            ) : tutorials.length === 0 ? (
              <div className="text-center py-20"><div className="text-5xl mb-4">📚</div><p className="text-muted-foreground">No tutorials yet</p></div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tutorial</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Difficulty</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tutorials.map(tut => (
                      <tr key={tut.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span>{tut.emoji}</span>
                            <div>
                              <p className="font-medium text-foreground">{tut.title}</p>
                              <p className="text-xs text-muted-foreground">{tut.readTime}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{tut.category}</td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${DIFF_COLORS[tut.difficulty] || ""}`}>{tut.difficulty}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tut.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500"}`}>
                            {tut.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-3">
                            <button onClick={() => setTutorialModal({ mode: "edit", data: tut })} className="text-xs font-medium text-primary hover:underline">Edit</button>
                            <button onClick={() => handleDeleteTutorial(tut.id)} disabled={actioning === tut.id} className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50">
                              {actioning === tut.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Listings</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Reviews</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.image ? <Image src={u.image} alt={u.name || ""} width={32} height={32} className="rounded-full" /> : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{(u.name || u.email).charAt(0).toUpperCase()}</div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{u.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[u.role] || "bg-secondary text-foreground"}`}>{u.role}</span></td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{u._count.listings}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{u._count.reviews}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Top Picks ── */}
        {tab === "top-picks" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top Shelf Picks</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Featured listings appear on the homepage. Maximum 12 at once.</p>
              </div>
              <div className="text-sm font-semibold text-foreground">{allListings.filter(l => l.featured).length} / 12 featured</div>
            </div>
            <input type="text" placeholder="Search listings..." value={featuredSearch} onChange={e => setFeaturedSearch(e.target.value)}
              className="w-full mb-5 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-secondary animate-pulse" />)}</div>
            ) : (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-secondary/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tool</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Rating</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Featured</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...allListings.filter(l => l.featured), ...allListings.filter(l => !l.featured)]
                      .filter(l => l.status === "APPROVED")
                      .filter(l => !featuredSearch || l.name.toLowerCase().includes(featuredSearch.toLowerCase()))
                      .map(listing => (
                        <tr key={listing.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              {listing.featured && <span className="text-amber-400">⭐</span>}
                              <span className="font-medium text-foreground">{listing.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{listing.category?.name}</td>
                          <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{listing.avgRating?.toFixed(1) ?? "—"}</td>
                          <td className="px-5 py-3 text-center">
                            <button
                              disabled={actioning === listing.id || (!listing.featured && allListings.filter(l => l.featured).length >= 12)}
                              onClick={async () => {
                                if (!listing.featured && allListings.filter(l => l.featured).length >= 12) { showToast("Maximum 12 featured listings reached", "error"); return; }
                                setActioning(listing.id);
                                try {
                                  const res = await fetch(`/api/admin/listings/${listing.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ featured: !listing.featured }),
                                  });
                                  if (res.ok) {
                                    setAllListings(prev => prev.map(l => l.id === listing.id ? { ...l, featured: !l.featured } : l));
                                    showToast(listing.featured ? "Removed from Top Picks" : "Added to Top Picks!", "success");
                                  }
                                } finally { setActioning(null); }
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${listing.featured ? "bg-amber-400" : "bg-slate-200 dark:bg-slate-700"}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${listing.featured ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Contacts ── */}
        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-20"><div className="text-5xl mb-4">📬</div><h3 className="text-xl font-semibold text-foreground">No contact submissions</h3></div>
            ) : contacts.map(c => (
              <div key={c.id} className={`rounded-xl border bg-card p-5 ${c.read ? "border-border" : "border-indigo-400/50 dark:border-indigo-600/50"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      {!c.read && <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">New</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.email} • {c.subject}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
