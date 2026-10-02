import { type InputHTMLAttributes, type LabelHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/cn";

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("mb-1 block text-sm font-medium text-paxo-ink", className)} {...props} />
  )
);
Label.displayName = "Label";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-xl border border-paxo-neutral-dark bg-white px-3 text-sm text-paxo-ink placeholder:text-paxo-ink-light/60 focus:outline-none focus:ring-2 focus:ring-paxo-blue",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-xl border border-paxo-neutral-dark bg-white px-3 py-2 text-sm text-paxo-ink placeholder:text-paxo-ink-light/60 focus:outline-none focus:ring-2 focus:ring-paxo-blue",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
