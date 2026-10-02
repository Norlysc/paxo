import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paxo-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        primary: "bg-paxo-red text-white shadow-soft hover:bg-paxo-red-dark",
        secondary: "bg-paxo-blue text-white shadow-soft hover:bg-paxo-blue-dark",
        outline: "border border-paxo-blue/30 bg-white text-paxo-blue hover:bg-paxo-neutral",
        ghost: "text-paxo-blue hover:bg-paxo-neutral",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1DA851]",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
