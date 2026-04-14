import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TUTORIALS } from "@/content/tutorials";
import { ShareButtons } from "@/components/ShareButtons";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return TUTORIALS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutorial = TUTORIALS.find((t) => t.slug === params.slug);
  if (!tutorial) return {};
  return {
    title: `${tutorial.title} — AgentShelf`,
    description: tutorial.description,
  };
}

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function TutorialPage({ params }: Props) {
  const tutorialIndex = TUTORIALS.findIndex((t) => t.slug === params.slug);
  if (tutorialIndex === -1) notFound();

  const tutorial = TUTORIALS[tutorialIndex];
  const prevTutorial = tutorialIndex > 0 ? TUTORIALS[tutorialIndex - 1] : null;
  const nextTutorial =
    tutorialIndex < TUTORIALS.length - 1 ? TUTORIALS[tutorialIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            ← Back to Tutorials
          </Link>
          <div className="flex items-start gap-4">
            <div className="text-5xl shrink-0">{tutorial.emoji}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    DIFFICULTY_COLORS[tutorial.difficulty]
                  }`}
                >
                  {tutorial.difficulty}
                </span>
                <span className="text-sm text-muted-foreground">{tutorial.readTime}</span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{tutorial.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                {tutorial.title}
              </h1>
              <p className="text-lg text-muted-foreground">{tutorial.description}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                By {tutorial.author} ·{" "}
                {new Date(tutorial.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article meta bar */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>✍️ {tutorial.author}</span>
            <span>·</span>
            <span>🕐 {tutorial.readTime}</span>
          </div>
          <ShareButtons title={tutorial.title} slug={tutorial.slug} />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <article
          className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
            prose-p:leading-7 prose-p:text-foreground/90
            prose-li:text-foreground/90
            prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:overflow-x-auto prose-pre:text-sm
            prose-table:text-sm prose-th:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: tutorial.content }}
        />

        {/* Prev/Next navigation */}
        <div className="mt-16 pt-8 border-t border-border flex justify-between gap-4">
          {prevTutorial ? (
            <Link
              href={`/tutorials/${prevTutorial.slug}`}
              className="group flex flex-col max-w-xs"
            >
              <span className="text-xs text-muted-foreground mb-1">← Previous</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {prevTutorial.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextTutorial && (
            <Link
              href={`/tutorials/${nextTutorial.slug}`}
              className="group flex flex-col items-end max-w-xs"
            >
              <span className="text-xs text-muted-foreground mb-1">Next →</span>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors text-right">
                {nextTutorial.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
