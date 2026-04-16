import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShareButtons } from "@/components/ShareButtons";
import { TutorialAdminBar } from "./TutorialAdminBar";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await prisma.tutorial.findUnique({ where: { slug: params.slug }, select: { title: true, description: true } });
  if (!t) return {};
  return { title: `${t.title} — AgentShelf`, description: t.description };
}

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as Record<string, string>;

export default async function TutorialPage({ params }: Props) {
  const tutorial = await prisma.tutorial.findUnique({ where: { slug: params.slug } });
  if (!tutorial) notFound();

  const allTutorials = await prisma.tutorial.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, slug: true, title: true },
  });
  const idx = allTutorials.findIndex((t: any) => t.slug === params.slug);
  const prev = idx > 0 ? allTutorials[idx - 1] : null;
  const next = idx < allTutorials.length - 1 ? allTutorials[idx + 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <Link href="/tutorials"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">
              ← All Tutorials
            </Link>
            <TutorialAdminBar tutorialId={tutorial.id} slug={tutorial.slug} />
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              {tutorial.emoji} {tutorial.category}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${DIFFICULTY_COLORS[tutorial.difficulty] ?? ""}`}>
              {tutorial.difficulty}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight tracking-tight">
            {tutorial.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">{tutorial.description}</p>
          <div className="mt-6 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AS</div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{tutorial.author}</span>
            </div>
            <span>·</span>
            <span>{new Date(tutorial.publishDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{tutorial.readTime}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-white dark:bg-slate-900/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Share this guide</span>
          <ShareButtons title={tutorial.title} slug={tutorial.slug} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 md:p-14 overflow-hidden">
          <article className="prose prose-lg prose-slate dark:prose-invert max-w-none break-words
            [&>h2:first-child]:mt-0 [&>h2:first-child]:pt-0
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-slate-900 dark:prose-h2:text-white prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-700 prose-h2:pb-4
            prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:leading-8 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:my-5
            prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:leading-7
            prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:text-indigo-600 prose-code:dark:text-indigo-400 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
            [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-200 [&_pre_code]:text-sm
            prose-pre:bg-slate-950 prose-pre:text-slate-200 prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-8 prose-pre:text-sm prose-pre:leading-6 prose-pre:shadow-md prose-pre:border prose-pre:border-slate-800 prose-pre:overflow-x-auto
            prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 dark:prose-blockquote:bg-indigo-950/30 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic"
            dangerouslySetInnerHTML={{ __html: tutorial.content }}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/tutorials/${prev.slug}`}
              className="group flex flex-col p-4 rounded-xl border border-border hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
              <span className="text-xs text-slate-500 mb-1.5 font-medium">← Previous</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/tutorials/${next.slug}`}
              className="group flex flex-col items-end p-4 rounded-xl border border-border hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-right">
              <span className="text-xs text-slate-500 mb-1.5 font-medium">Next →</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{next.title}</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
