import * as React from "react";
import Link from "next/link";
import { type CategoryWithCount } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Icon mapping for category slugs
const categoryIcons: Record<string, string> = {
  "writing-tools": "✍️",
  "image-generation": "🎨",
  "coding-assistants": "💻",
  "productivity": "⚡",
  "marketing": "📣",
  "data-analysis": "📊",
  "customer-support": "💬",
  "research": "🔬",
  "video-tools": "🎥",
  "audio-tools": "🎵",
  "automation": "🤖",
  "education": "📚",
  "finance": "💰",
  "design": "🎭",
  "seo": "🔍",
  "social-media": "📱",
};

interface CategoryCardProps {
  category: CategoryWithCount;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] ?? "🧠";
  const count = category._count.listings;

  return (
    <Link href={`/browse?category=${category.slug}`}>
      <Card
        className={cn(
          "group h-full cursor-pointer border-border transition-all duration-200 hover:border-indigo-400 hover:shadow-md dark:hover:border-indigo-500",
          className
        )}
      >
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-3xl transition-transform duration-200 group-hover:scale-110 dark:bg-indigo-950">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {category.name}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {count} {count === 1 ? "tool" : "tools"}
            </p>
          </div>
          {category.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
