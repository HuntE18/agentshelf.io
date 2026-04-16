import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated AI Stacks — AgentShelf",
  description: "Hand-picked collections of AI tools for specific use cases. Find the perfect stack for your workflow.",
};

export default async function StacksPage() {
  const stacks = await prisma.stack.findMany({
    include: {
      listings: {
        where: { status: "APPROVED" },
        take: 5,
        select: { id: true, name: true, logoUrl: true, websiteUrl: true },
      },
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-slate-900 dark:to-indigo-950 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Curated Stacks</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked collections of AI tools grouped around specific workflows and use cases.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stacks.map((stack: any) => (
            <Link
              key={stack.id}
              href={`/stacks/${stack.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">{stack.emoji}</div>
              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {stack.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{stack.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {stack.listings.map((listing: any) => (
                    <div
                      key={listing.id}
                      className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary"
                      title={listing.name}
                    >
                      {listing.name[0]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {stack._count.listings} tools
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
