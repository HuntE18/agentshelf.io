"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AdminTab = "pending" | "all" | "users" | "contacts";

type Listing = {
  id: string;
  name: string;
  slug: string;
  status: string;
  pricingModel: string;
  createdAt: string;
  websiteUrl: string;
  submittedBy: { name: string | null; email: string } | null;
  category: { name: string; icon: string };
};

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  _count: { listings: number; reviews: number };
};

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("pending");
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [allSearch, setAllSearch] = useState("");
  const [allStatusFilter, setAllStatusFilter] = useState("ALL");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (status === "authenticated") {
      const user = session?.user as { role?: string } | undefined;
      if (user?.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session) return;
    const user = session.user as { role?: string } | undefined;
    if (user?.role !== "ADMIN") return;

    setLoading(true);
    Promise.all([
      fetch("/api/admin/listings?status=PENDING").then((r) => r.json()),
      fetch("/api/admin/listings").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/contacts").then((r) => r.json()),
    ])
      .then(([pending, all, usrs, ctcts]) => {
        setPendingListings(pending.listings || []);
        setAllListings(all.listings || []);
        setUsers(usrs.users || []);
        setContacts(ctcts.contacts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const showToast = (text: string, type: "success" | "error") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAction = async (
    listingId: string,
    action: "APPROVED" | "REJECTED"
  ) => {
    setActioning(listingId);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPendingListings((prev) => prev.filter((l) => l.id !== listingId));
      setAllListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status: action } : l))
      );
      showToast(
        `${updated.listing?.name || "Listing"} ${action === "APPROVED" ? "approved" : "rejected"} successfully`,
        "success"
      );
    } catch {
      showToast("Action failed. Please try again.", "error");
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

  const filteredAllListings = allListings.filter((l) => {
    const matchSearch =
      !allSearch ||
      l.name.toLowerCase().includes(allSearch.toLowerCase()) ||
      l.websiteUrl.toLowerCase().includes(allSearch.toLowerCase());
    const matchStatus = allStatusFilter === "ALL" || l.status === allStatusFilter;
    return matchSearch && matchStatus;
  });

  const TABS: { id: AdminTab; label: string; count?: number }[] = [
    { id: "pending", label: "Pending", count: pendingListings.length },
    { id: "all", label: "All Listings", count: allListings.length },
    { id: "users", label: "Users", count: users.length },
    { id: "contacts", label: "Contact Submissions", count: contacts.length },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toastMsg.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toastMsg.text}
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Admin
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            AgentShelf Dashboard
          </h1>
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
              {t.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    t.id === "pending" && t.count > 0
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Pending */}
        {tab === "pending" && (
          <div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : pendingListings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-foreground">
                  All caught up!
                </h3>
                <p className="text-muted-foreground mt-2">
                  No pending submissions to review
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {listing.name}
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                          {listing.category.icon} {listing.category.name}
                        </span>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                          {listing.pricingModel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {listing.websiteUrl}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        By {listing.submittedBy?.name || listing.submittedBy?.email || "Unknown"} •{" "}
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={listing.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        View Site
                      </a>
                      <button
                        onClick={() => handleAction(listing.id, "REJECTED")}
                        disabled={actioning === listing.id}
                        className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(listing.id, "APPROVED")}
                        disabled={actioning === listing.id}
                        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {actioning === listing.id ? "..." : "Approve"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Listings */}
        {tab === "all" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Search listings..."
                value={allSearch}
                onChange={(e) => setAllSearch(e.target.value)}
                className="flex-1 max-w-sm rounded-lg border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={allStatusFilter}
                onChange={(e) => setAllStatusFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
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
                  {filteredAllListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <a
                          href={`/listing/${listing.slug}`}
                          className="font-medium text-foreground hover:text-primary"
                        >
                          {listing.name}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">
                        {listing.category.icon} {listing.category.name}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[listing.status] || "bg-secondary text-foreground"}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5">
                        {listing.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(listing.id, "APPROVED")}
                              disabled={actioning === listing.id}
                              className="text-xs font-medium text-green-600 hover:underline disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(listing.id, "REJECTED")}
                              disabled={actioning === listing.id}
                              className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                            >
                              Reject
                            </button>
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

        {/* Users */}
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
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <Image src={u.image} alt={u.name || ""} width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {(u.name || u.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{u.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_COLORS[u.role] || "bg-secondary text-foreground"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{u._count.listings}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden sm:table-cell">{u._count.reviews}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contact Submissions */}
        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📬</div>
                <h3 className="text-xl font-semibold text-foreground">No contact submissions</h3>
              </div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl border bg-card p-5 ${c.read ? "border-border" : "border-indigo-400/50 dark:border-indigo-600/50"}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{c.name}</span>
                        {!c.read && (
                          <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email} • {c.subject}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
