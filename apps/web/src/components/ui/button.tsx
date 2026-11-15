import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils.js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-accent disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-landing-accent text-landing-bg font-semibold hover:bg-landing-accent-strong shadow-sm",
        destructive: "border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20",
        outline: "border border-landing-border bg-transparent text-landing-text hover:bg-landing-panel hover:text-landing-text",
        secondary: "bg-landing-panel text-landing-text hover:bg-landing-panel-strong border border-landing-border",
        ghost: "text-landing-muted hover:bg-landing-panel hover:text-landing-text",
        link: "text-landing-accent underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
