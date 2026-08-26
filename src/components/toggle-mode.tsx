"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Button } from "./ui/button";

const MODES = [
  {
    icon: <SunIcon />,
    value: "light",
  },
  {
    icon: <MoonIcon />,
    value: "dark",
  },
  {
    icon: <MonitorIcon />,
    value: "system",
  },
] as const;

export default function ToggleMode() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="flex flex-row items-center gap-0.5">
      {MODES.map((mode) => (
        <Button
          key={`mode.${mode.value}`}
          size={"icon-xs"}
          variant={theme === mode.value ? "default" : "ghost"}
          onClick={() => setTheme(mode.value)}
        >
          {mode.icon}
        </Button>
      ))}
    </div>
  );
}
