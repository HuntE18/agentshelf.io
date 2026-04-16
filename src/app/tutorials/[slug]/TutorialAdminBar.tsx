"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { type TutorialRow, TutorialModal } from "../TutorialsClient";

// Re-export a modal wrapper just for the slug page edit button
export function TutorialAdminBar({ tutorialId, slug }: { tutorialId: string; slug: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const [modal, setModal] = useState(false);
  const [fullData, setFullData] = useState<TutorialRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!isAdmin) return null;

  const openEdit = async () => {
    const res = await fetch(`/api/admin/tutorials/${tutorialId}`);
    const data = await res.json();
    setFullData({ ...data, relatedTools: data.relatedTools });
    setModal(true);
  };

  const handleSave = async (data: any) => {
    const res = await fetch(`/api/admin/tutorials/${tutorialId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { const j = await res.json(); throw new Error(j.error || "Save failed"); }
    router.refresh();
    setModal(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this tutorial? This cannot be undone.")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/tutorials/${tutorialId}`, { method: "DELETE" });
    if (res.ok) router.push("/tutorials");
    else setDeleting(false);
  };

  return (
    <>
      {modal && fullData && (
        <TutorialModal initial={fullData} onSave={handleSave} onClose={() => setModal(false)} />
      )}
      <div className="flex items-center gap-2">
        <button onClick={openEdit}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">
          <Trash2 className="h-3.5 w-3.5" /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </>
  );
}

