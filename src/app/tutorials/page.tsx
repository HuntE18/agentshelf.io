import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Tutorials & Guides — AgentShelf",
  description:
    "Learn how to use AI tools effectively. Tutorials on ChatGPT, LangChain, CrewAI, Midjourney, and more.",
};

type Tutorial = {
  title: string;
  description: string;
  category: string;
  readTime: string;
  href: string;
  emoji: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

const TUTORIALS: Tutorial[] = [
  {
    title: "Getting Started with the ChatGPT API",
    description:
      "A hands-on guide to integrating OpenAI's ChatGPT API into your projects. We cover authentication, streaming responses, function calling, and building a simple chatbot in under 100 lines of code.",
    category: "API & Development",
    readTime: "12 min read",
    href: "https://platform.openai.com/docs/guides/gpt",
    emoji: "🤖",
    difficulty: "Beginner",
  },
  {
    title: "Building AI Agents with CrewAI",
    description:
      "CrewAI lets you create multi-agent systems that collaborate to complete complex tasks. This tutorial walks through building a research agent crew that autonomously gathers, analyzes, and summarizes information.",
    category: "AI Agents",
    readTime: "18 min read",
    href: "https://docs.crewai.com",
    emoji: "🕵️",
    difficulty: "Intermediate",
  },
  {
    title: "Prompt Engineering 101",
    description:
      "Stop guessing and start engineering. This guide covers the core principles of effective prompt design — chain-of-thought reasoning, few-shot examples, role assignment, and output format control — with tested examples.",
    category: "Prompting",
    readTime: "10 min read",
    href: "https://www.promptingguide.ai",
    emoji: "✍️",
    difficulty: "Beginner",
  },
  {
    title: "Midjourney Tips & Tricks",
    description:
      "Unlock Midjourney's full potential with advanced parameters, style references, and aspect ratio tricks. Includes a curated library of prompt formulas for photorealistic, cinematic, and illustrated outputs.",
    category: "Image Generation",
    readTime: "15 min read",
    href: "https://docs.midjourney.com",
    emoji: "🎨",
    difficulty: "Intermediate",
  },
  {
    title: "LangChain for Beginners",
    description:
      "LangChain is the go-to framework for building LLM-powered applications. This tutorial introduces chains, memory, retrievers, and agents — and shows you how to build a document Q&A system from scratch.",
    category: "Frameworks",
    readTime: "20 min read",
    href: "https://python.langchain.com/docs/get_started/introduction",
    emoji: "🔗",
    difficulty: "Beginner",
  },
  {
    title: "Comparing Top Coding Assistants",
    description:
      "GitHub Copilot, Cursor, Codeium, Tabnine — the AI coding assistant space is crowded. We put the leading tools through a battery of real-world coding tasks and break down where each one shines and falls short.",
    category: "Coding Tools",
    readTime: "8 min read",
    href: "https://github.com/features/copilot",
    emoji: "💻",
    difficulty: "Beginner",
  },
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-5">
            📖 Learn
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tutorials & Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical guides to help you get the most out of AI tools. From API
            basics to advanced agent architectures.
          </p>
        </div>
      </div>

      {/* Tutorials grid */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TUTORIALS.map((tutorial) => (
            <article
              key={tutorial.title}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{tutorial.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {tutorial.category}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[tutorial.difficulty]}`}
                    >
                      {tutorial.difficulty}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {tutorial.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {tutorial.readTime}
                    </span>
                    <a
                      href={tutorial.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      Read guide
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Want to contribute a tutorial?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
            Share your AI expertise with the AgentShelf community. Write a guide
            about a tool you use and love.
          </p>
          <Link
            href="/contact?subject=Tutorial%20contribution"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            Get in touch →
          </Link>
        </div>
      </div>
    </div>
  );
}
