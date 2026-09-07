"use client";

import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/config";

export default function LangPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (lang: string) => void;
}) {
  return (
    <div className="flex border-b border-dashed p-2">
      {LANGUAGES.map((l) => (
        <Button
          key={`lang.${l}`}
          variant={"ghost"}
          size={"xs"}
          className={"font-mono"}
          onClick={() => onChange(l)}
          data-state={l === value ? "open" : undefined}
        >
          {l}
        </Button>
      ))}
    </div>
  );
}
