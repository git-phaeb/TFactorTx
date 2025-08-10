import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-white",
        outline:
          "text-foreground",
        // Custom variants for TFactorTx application
        proLongevity:
          "border-transparent bg-[#440154] text-white",
        antiLongevity:
          "border-transparent bg-[#fde725] text-gray-800",
        unclear:
          "border-transparent bg-[#1f9e89] text-white",
        humanYes:
          "border-transparent bg-[#440154] text-white",
        humanNo:
          "border-transparent bg-[#fde725] text-gray-800",
        developmentHigh:
          "border-transparent bg-[#440154] text-white",
        developmentMedium:
          "border-transparent bg-[#1f9e89] text-white",
        developmentLow:
          "border-transparent bg-[#fde725] text-gray-800",
        tdlTclin:
          "border-transparent bg-transparent text-[#440154]",
        tdlTchem:
          "border-transparent bg-transparent text-[#31688e]",
        tdlTbio:
          "border-transparent bg-transparent text-[#1f9e89]",
        tdlTdark:
          "border-transparent bg-transparent text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
