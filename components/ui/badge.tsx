import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full px-3 py-0 text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:outline-none has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:ring-destructive/40 dark:aria-invalid:ring-destructive/60 [&>svg]:pointer-events-none [&>svg]:size-3! [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-200/50 hover:shadow-blue-300/70",
        secondary: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm shadow-gray-200/50 hover:shadow-gray-300/70",
        success: "bg-emerald-500 text-white",
        warning: "bg-amber-500 text-white",
        destructive: "bg-rose-500 text-white",
        outline: "bg-transparent text-gray-700 shadow-sm shadow-gray-200/30 hover:shadow-gray-300/50 border-2 border-gray-300 hover:border-gray-400",
        ghost: "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80 backdrop-blur-sm",
        soft: "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50 hover:shadow-blue-200/70 hover:bg-blue-100/80",
        softSecondary: "bg-gray-50 text-gray-700 shadow-sm shadow-gray-100/50 hover:shadow-gray-200/70 hover:bg-gray-100/80",
        softSuccess: "bg-emerald-50 text-emerald-700",
        softWarning: "bg-amber-50 text-amber-700",
        softDestructive: "bg-rose-50 text-rose-700",
        gradient: "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-sm shadow-purple-200/50 hover:shadow-purple-300/70",
      },
      size: {
        sm: "h-5 px-2 text-[10px] font-medium",
        md: "h-6 px-3 text-xs font-semibold",
        lg: "h-7 px-4 text-sm font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

function Badge({
  className,
  variant = "default",
  size = "md",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      size,
    },
  });
}

export { Badge, badgeVariants };