import Link from "next/link";
import { PORTFOLIO_CONFIG } from "@/lib/config";

export default function SocialLinks() {
  return (
    <>
      {PORTFOLIO_CONFIG.social.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className="text-[10px] text-muted-foreground font-mono font-semibold hover:text-foreground hover:underline"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
