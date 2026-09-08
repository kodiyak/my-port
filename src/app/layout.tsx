import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PORTFOLIO_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const fontSerif = Fraunces({
  variable: "--font-serif",
  weight: ["200", "400", "600", "800"],
});

const SITE_HANDLE = "@mathews536";

const SITE_DESCRIPTION =
  "Engenheiro de software desde 2016. Construo software e escrevo sobre as decisões — este site é o registro dos dois.";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${PORTFOLIO_CONFIG.me.domain}`),
  title: {
    default: SITE_HANDLE,
    template: `%s — ${SITE_HANDLE}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_HANDLE,
    title: SITE_HANDLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        fontSerif.variable,
        "dark antialiased font-sans",
      )}
      suppressHydrationWarning
    >
      <head />
      <body className="bg-background text-foreground flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppHeader />
          {children}
          <AppFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
