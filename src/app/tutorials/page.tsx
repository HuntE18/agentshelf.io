import type { Metadata } from "next";
import { TutorialsClient } from "./TutorialsClient";
import { TUTORIALS } from "@/content/tutorials";

export const metadata: Metadata = {
  title: "AI Tutorials & Guides — AgentShelf",
  description:
    "Step-by-step guides to help you master AI tools. Tutorials on ChatGPT API, CrewAI, Midjourney, LangChain, prompt engineering, and more.",
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 dark:bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-5">
            📚 AgentShelf Tutorials
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            Learn from the Shelf
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step guides to help you master AI tools — from your first API call to building autonomous agents.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {TUTORIALS.filter(t => t.difficulty === "Beginner").length} Beginner
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {TUTORIALS.filter(t => t.difficulty === "Intermediate").length} Intermediate
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {TUTORIALS.filter(t => t.difficulty === "Advanced").length} Advanced
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <TutorialsClient tutorials={TUTORIALS} />
      </div>
    </div>
  );
}
