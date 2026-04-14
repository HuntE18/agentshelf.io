"use client";

import { useState } from "react";
import Link from "next/link";

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type Tutorial = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author: string;
};

export function TutorialsClient({ tutorials }: { tutorials: Tutorial[] }) {
  const [filter, setFilter] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(tutorials.map(t => t.difficulty)))];

  const filtered = filter === "All" ? tutorials : tutorials.filter(t => t.difficulty === filter);
  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {featured && (
        <Link
          href={`/tutorials/${featured.slug}`}
          className="group mb-6 flex flex-col md:flex-row gap-6 rounded-2xl border border-border bg-card p-7 hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-center text-7xl shrink-0 w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800">
            {featured.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_COLORS[featured.difficulty]}`}>
                {featured.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">{featured.readTime}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{featured.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
              {featured.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">{featured.description}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Read tutorial →
            </div>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {rest.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{tutorial.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFFICULTY_COLORS[tutorial.difficulty]}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{tutorial.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                    {tutorial.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{tutorial.category} · {tutorial.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No tutorials yet for this level.
        </div>
      )}
    </div>
  );
}
