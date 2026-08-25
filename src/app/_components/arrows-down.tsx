"use client";

import { ChevronDownIcon } from "lucide-react";
import { useAnimate } from "motion/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const STAGGER = 0.4;
const FADE = 0.4;
const HOLD = 0.7;
const FADE_OUT = 0.2;
const HOLD_OUT = 0.5;

const OPACITY = 1;
const OPACITY_OUT = 0.2;

export default function ArrowsDown({ className }: { className?: string }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(
          "[data-arrow]",
          { opacity: OPACITY_OUT },
          { duration: 0 },
        );

        await animate(
          "[data-arrow]",
          { opacity: OPACITY },
          {
            duration: FADE,
            delay: (index) => index * STAGGER,
          },
        );

        await new Promise((resolve) => setTimeout(resolve, HOLD * 1000));

        await animate(
          "[data-arrow]",
          { opacity: OPACITY_OUT },
          { duration: FADE_OUT },
        );

        await new Promise((resolve) => setTimeout(resolve, HOLD_OUT * 1000));
      }
    };

    sequence();
  }, [animate]);

  return (
    <div ref={scope} className={cn("flex flex-col", className)}>
      {[0, 1, 2].map((index) => (
        <div key={index} data-arrow={index} className="arrow opacity-0">
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </div>
      ))}
    </div>
  );
}
