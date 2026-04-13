import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "text-foreground border-border",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        // Custom AgentShelf variants
        featured:
          "border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
        spotlight:
          "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        free:
          "border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
        freemium:
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        paid:
          "border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
        open_source:
          "border-transparent bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
