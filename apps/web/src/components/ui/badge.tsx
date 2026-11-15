import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-landing-accent",
  {
    variants: {
      variant: {
        default: "border-transparent bg-landing-accent text-landing-bg font-medium",
        secondary: "border-landing-border bg-landing-panel text-landing-text",
        outline: "border-landing-border text-landing-muted",
        destructive: "border-red-500/20 bg-red-500/10 text-red-300",
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

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

