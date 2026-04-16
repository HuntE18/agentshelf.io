import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const stack = await prisma.stack.findUnique({ where: { slug: params.slug } });
  if (!stack) return {};
  return {
    title: `${stack.name} — AgentShelf`,
    description: stack.description,
  };
}

export default async function StackPage({ params }: Props) {
  const stack = await prisma.stack.findUnique({
    where: { slug: params.slug },
    include: {
      listings: {
        where: { status: "APPROVED" },
        include: {
          category: true,
          tags: true,
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true, bookmarks: true } },
        },
      },
    },
  });

  if (!stack) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/stacks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            ← All Stacks
          </Link>
          <div className="flex items-start gap-5">
            <div className="text-5xl">{stack.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{stack.name}</h1>
              <p className="text-lg text-muted-foreground">{stack.description}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stack.listings.length} tools in this stack</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stack.listings.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
