"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, X } from "lucide-react";

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

export type TutorialRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  publishDate: string;
  relatedTools: string;
  content: string;
  published: boolean;
  order: number;
};

const EMPTY_FORM = {
  slug: "", title: "", description: "", category: "", readTime: "5 min read",
  emoji: "📖", difficulty: "Beginner" as const, publishDate: new Date().toISOString().slice(0, 10),
  author: "AgentShelf Team", relatedTools: "", content: "", published: true,
};

export function TutorialModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<TutorialRow> & { relatedToolsStr?: string };
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...(initial ? {
      ...initial,
      relatedTools: initial.relatedToolsStr ?? (initial.relatedTools ? (() => { try { return JSON.parse(initial.relatedTools as string).join(", "); } catch { return initial.relatedTools ?? ""; } })() : ""),
    } : {}),
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true); setErr("");
    try {
      await onSave({
        ...form,
        relatedTools: form.relatedTools.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
    } catch (e: any) { setErr(e.message || "Save failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <h2 className="font-semibold text-foreground">{initial?.id ? "Edit Tutorial" : "New Tutorial"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          {err && <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-3">{err}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Slug</label>
              <input value={form.slug} onChange={e => set("slug", e.target.value)}
                placeholder="my-tutorial-slug"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Emoji</label>
              <input value={form.emoji} onChange={e => set("emoji", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Read Time</label>
              <input value={form.readTime} onChange={e => set("readTime", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Author</label>
              <input value={form.author} onChange={e => set("author", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Publish Date</label>
              <input type="date" value={form.publishDate} onChange={e => set("publishDate", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Related Tools (comma-separated)</label>
            <input value={form.relatedTools} onChange={e => set("relatedTools", e.target.value)}
              placeholder="ChatGPT, Claude, Midjourney"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Content (Markdown)</label>
            <textarea value={form.content} onChange={e => set("content", e.target.value)} rows={10}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)}
              className="accent-primary h-4 w-4" />
            <span className="text-sm text-foreground">Published</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border shrink-0">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {saving ? "Saving..." : "Save Tutorial"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TutorialsClient({ tutorials: initial }: { tutorials: TutorialRow[] }) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const [tutorials, setTutorials] = useState<TutorialRow[]>(initial);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; data?: TutorialRow } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const categories = ["All", ...Array.from(new Set(tutorials.map(t => t.difficulty)))];
  const filtered = filter === "All" ? tutorials : tutorials.filter(t => t.difficulty === filter);
  const [featured, ...rest] = filtered;

  const saveOrder = async (updated: TutorialRow[]) => {
    setReordering(true);
    try {
      await fetch("/api/admin/tutorials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated.map((t, i) => ({ id: t.id, order: i })) }),
      });
    } finally { setReordering(false); }
  };

  const move = (idx: number, dir: -1 | 1) => {
    const newList = [...tutorials];
    const target = newList.findIndex(t => t.id === filtered[idx].id);
    const swap = newList.findIndex(t => t.id === filtered[idx + dir]?.id);
    if (target === -1 || swap === -1) return;
    [newList[target], newList[swap]] = [newList[swap], newList[target]];
    setTutorials(newList);
    saveOrder(newList);
  };

  const handleSave = async (data: any) => {
    if (modal?.mode === "edit" && modal.data?.id) {
      const res = await fetch(`/api/admin/tutorials/${modal.data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Save failed"); }
      const updated = await res.json();
      setTutorials(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
      showToast("Tutorial updated");
    } else {
      const res = await fetch("/api/admin/tutorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Create failed"); }
      const created = await res.json();
      setTutorials(prev => [...prev, created]);
      showToast("Tutorial created");
    }
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tutorial? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tutorials/${id}`, { method: "DELETE" });
      if (res.ok) { setTutorials(prev => prev.filter(t => t.id !== id)); showToast("Tutorial deleted"); }
    } finally { setDeletingId(null); }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">{toast}</div>
      )}

      {/* Modal */}
      {modal && <TutorialModal initial={modal.data} onSave={handleSave} onClose={() => setModal(null)} />}

      {/* Admin toolbar */}
      {isAdmin && (
        <div className="flex items-center justify-between mb-6 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20 px-4 py-3">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Admin mode — use arrows to reorder, click Edit on any card
          </span>
          <button onClick={() => setModal({ mode: "create" })}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> New Tutorial
          </button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${filter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Featured card */}
      {featured && (
        <div className="relative group mb-6">
          <Link href={`/tutorials/${featured.slug}`}
            className="flex flex-col md:flex-row gap-6 rounded-2xl border border-border bg-card p-7 hover:border-primary/50 hover:shadow-md transition-all">
            <div className="flex items-center justify-center text-7xl shrink-0 w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800">{featured.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_COLORS[featured.difficulty]}`}>{featured.difficulty}</span>
                <span className="text-xs text-muted-foreground">{featured.readTime}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{featured.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">{featured.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{featured.description}</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read tutorial →</div>
            </div>
          </Link>
          {isAdmin && (
            <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {filtered.length > 1 && (
                <button onClick={e => { e.preventDefault(); move(0, 1); }} disabled={reordering}
                  className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary text-muted-foreground" title="Move down">
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={e => { e.preventDefault(); setModal({ mode: "edit", data: featured }); }}
                className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary text-muted-foreground" title="Edit">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={e => { e.preventDefault(); handleDelete(featured.id); }} disabled={deletingId === featured.id}
                className="p-1.5 rounded-lg bg-card border border-red-200 hover:bg-red-50 text-red-500" title="Delete">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((tutorial, i) => (
            <div key={tutorial.slug} className="relative group">
              <Link href={`/tutorials/${tutorial.slug}`}
                className="flex rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 w-full">
                  <div className="text-4xl shrink-0">{tutorial.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_COLORS[tutorial.difficulty]}`}>{tutorial.difficulty}</span>
                      <span className="text-xs text-muted-foreground">{tutorial.readTime}</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">{tutorial.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{tutorial.category} · {tutorial.author}</p>
                  </div>
                </div>
              </Link>
              {isAdmin && (
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => move(i + 1, -1)} disabled={reordering || i === 0}
                    className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary text-muted-foreground disabled:opacity-30" title="Move up">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => move(i + 1, 1)} disabled={reordering || i + 1 >= rest.length}
                    className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary text-muted-foreground disabled:opacity-30" title="Move down">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setModal({ mode: "edit", data: tutorial })}
                    className="p-1.5 rounded-lg bg-card border border-border hover:bg-secondary text-muted-foreground" title="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(tutorial.id)} disabled={deletingId === tutorial.id}
                    className="p-1.5 rounded-lg bg-card border border-red-200 hover:bg-red-50 text-red-500" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          {isAdmin ? "No tutorials yet. Click \"New Tutorial\" to create one." : "No tutorials yet for this level."}
        </div>
      )}
    </div>
  );
}
