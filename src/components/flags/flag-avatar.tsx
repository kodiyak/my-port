import type * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { type FlagCode, flagNames } from "./flag-data";
import { getFlagUrl } from "./flag-utils";

export interface FlagAvatarProps
  extends Omit<React.ComponentProps<typeof Avatar>, "children"> {
  code: FlagCode;
  alt?: string;
}

export function FlagAvatar({
  code,
  alt = `${flagNames[code]} flag`,
  className,
  ...props
}: FlagAvatarProps) {
  return (
    <Avatar className={cn("t-avatar rounded-sm", className)} {...props}>
      <AvatarImage
        src={getFlagUrl(code, { format: "webp", ratio: "1x1", width: 80 })}
        alt={alt}
        className={"rounded-sm"}
      />
      <AvatarFallback className={"rounded-sm"}>
        {code.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
