import type { Metadata } from "next";
import Link from "next/link";
import { TUTORIALS } from "@/content/tutorials";

export const metadata: Metadata = {
  title: "AI Tutorials & Guides — AgentShelf",
  description:
    "In-depth tutorials on using AI tools: ChatGPT API, LangChain, CrewAI, Midjourney, prompt engineering, and more. Written by the AgentShelf team.",
};

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Tutorials &amp; Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            In-depth guides to help you get the most out of AI tools — written by the AgentShelf team.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TUTORIALS.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{tutorial.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        DIFFICULTY_COLORS[tutorial.difficulty]
                      }`}
                    >
                      {tutorial.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">{tutorial.readTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 leading-snug">
                    {tutorial.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tutorial.description}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {tutorial.category} · {tutorial.author}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
