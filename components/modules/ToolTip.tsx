// components/ui/my_components/ToolTip.tsx

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils"; // or however you handle classNames

export function Tooltip({ children, ...props }: TooltipPrimitive.TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  markdown?: string; // We'll accept a Markdown string
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, markdown, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    side="bottom"
    align="start"
    sideOffset={sideOffset}
    className={cn(
      // Style the tooltip background, text, etc.
      "z-50 rounded-md bg-primary-medium px-3 py-2 text-sm font-[100]  text-white shadow-md",
      // Force a max width, wrap text, left-align
      "max-w-sm whitespace-normal break-words text-left",
      className
    )}
    {...props}
  >
    {markdown ? (
      // If 'markdown' is provided, parse it as standard Markdown
      <ReactMarkdown >{markdown}</ReactMarkdown>
    ) : (
      // Otherwise render children
      children
    )}
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
