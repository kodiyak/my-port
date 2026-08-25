import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MiniTitle({
  children,
  className,
  actions,
}: {
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <div
      className={cn("p-4 border-b border-dashed flex items-center", className)}
    >
      <h2 className="text-xs text-muted-foreground font-mono">{children}</h2>
      <div className="flex items-center ml-auto">{actions}</div>
    </div>
  );
}
