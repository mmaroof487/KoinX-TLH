// components/ui/Tooltip.tsx
"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/utils/format";

export function Tooltip({ children, content, side = "top" }: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={5}
          className={cn(
            "z-50 max-w-xs px-3 py-1.5 rounded-lg text-xs text-white bg-ink-900 shadow-lg",
            "animate-fade-in"
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-ink-900" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
