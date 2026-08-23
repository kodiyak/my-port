import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MiniTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-4 border-b", className)}>
      <h2 className="text-xs text-muted-foreground font-mono">{children}</h2>
    </div>
  );
}
