import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none outline-none cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        grayscale:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400",
        outlined:
          "border border-gray-400 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400",
      },
      size: {
        big: "h-[50px] px-6 text-[16px] leading-[19px] font-semibold",
        small: "h-[32px] px-4 text-[12px] leading-[15px] font-medium gap-1.5",
      },
      rounded: {
        true: "rounded-[16px]",
        false: "rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "big",
      rounded: true,
    },
  }
);

function Button({
  className,
  variant,
  size,
  rounded = true,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    rounded?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
