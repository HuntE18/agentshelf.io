"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onRate,
  size = "md",
  className,
  showValue = false,
}: StarRatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  };

  const displayRating = hovered !== null ? hovered : rating;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => {
        const isFilled = star <= displayRating;
        const isHalfFilled =
          !isFilled && star - 0.5 <= displayRating && displayRating < star;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={cn(
              "focus:outline-none",
              interactive
                ? "cursor-pointer transition-transform hover:scale-110"
                : "cursor-default"
            )}
            aria-label={`Rate ${star} out of ${maxRating}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalfFilled
                  ? "fill-amber-200 text-amber-400"
                  : "fill-none text-slate-300 dark:text-slate-600"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
