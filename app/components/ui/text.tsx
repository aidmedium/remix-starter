import React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("scroll-m-20 font-semibold font-heading", {
  variants: {
    variant: {
      h1: "text-3xl font-bold",
      h2: "text-2xl",
      h3: "text-xl",
      h4: "",
    },
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLParagraphElement, HeadingProps>(
  ({ className, variant = "h1", ...props }, ref) => {
    const Comp = variant!;

    return <Comp className={cn(headingVariants({ variant, className }))} {...props} ref={ref} />;
  }
);

Heading.displayName = "Heading";

export { Heading, headingVariants };

const paragraphVariants = cva("", {
  variants: {
    variant: {
      default: "",
      label: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  as?: "span" | "p";
}

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, as, variant, ...props }, ref) => {
    const Comp = as || "p";
    return <Comp className={paragraphVariants({ variant, className })} {...props} ref={ref} />;
  }
);

Paragraph.displayName = "Paragraph";

export { Paragraph };
