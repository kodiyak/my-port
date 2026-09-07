import Link from "next/link";
import ToggleMode from "./toggle-mode";

export default function AppHeader() {
  const username = "mathews536";
  return (
    <div className="flex h-14 border-b border-dashed">
      <div className="w-full max-w-xl h-full mx-auto border-x border-dashed px-4">
        <div className="flex items-center gap-4 h-full">
          <Link href={`/`} className="text-2xl font-mono">
            {`@${username}`}
          </Link>
          <div className="flex-1 flex">
            <div className="flex-1"></div>
            <ToggleMode />
          </div>
        </div>
      </div>
    </div>
  );
}
