import * as React from "react";
import { ThumbsUp } from "lucide-react";
import { type ReviewWithAuthor } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: ReviewWithAuthor;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const authorInitials =
    review.author.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "??";

  // Parse pros/cons — stored as JSON string or string array
  const pros: string[] = (() => {
    try {
      const p = (review as any).pros;
      if (Array.isArray(p)) return p;
      if (typeof p === "string") return JSON.parse(p);
      return [];
    } catch {
      return [];
    }
  })();

  const cons: string[] = (() => {
    try {
      const c = (review as any).cons;
      if (Array.isArray(c)) return c;
      if (typeof c === "string") return JSON.parse(c);
      return [];
    } catch {
      return [];
    }
  })();

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={review.author.image ?? undefined}
                alt={review.author.name ?? "Reviewer"}
              />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {review.author.name ?? "Anonymous"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        {review.title && (
          <h4 className="mt-2 font-semibold text-slate-900 dark:text-slate-100">
            {review.title}
          </h4>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {review.body}
        </p>

        {(pros.length > 0 || cons.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {pros.map((pro, i) => (
              <Badge
                key={`pro-${i}`}
                variant="outline"
                className="border-teal-300 bg-teal-50 text-teal-700 text-xs dark:border-teal-700 dark:bg-teal-950 dark:text-teal-300"
              >
                + {pro}
              </Badge>
            ))}
            {cons.map((con, i) => (
              <Badge
                key={`con-${i}`}
                variant="outline"
                className="border-red-300 bg-red-50 text-red-700 text-xs dark:border-red-700 dark:bg-red-950 dark:text-red-300"
              >
                − {con}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{(review as any).helpfulCount ?? 0} found this helpful</span>
        </div>
      </CardContent>
    </Card>
  );
}
