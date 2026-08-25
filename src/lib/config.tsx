import XIcon from "@/components/ui/icons";

export const PORTFOLIO_CONFIG = {
  me: {
    firstName: "Mathews",
    lastName: "William T. de Oliveira",
    domain: "mathw.space",
    email: "localhost@mathw.space",
    location: {
      tz: "America/Sao_Paulo",
      address: "São Paulo, Brazil",
      street: "Av. Rubens Montanaro de Borba, 464",
    },
  },
  social: [
    {
      label: "x.com",
      icon: <XIcon />,
      href: "https://www.x.com/mathews536",
      external: true,
    },
    {
      label: "github.com",
      icon: <XIcon />,
      href: "https://www.github.com/kodiyak",
      external: true,
    },
    {
      label: "linkedin.com",
      icon: <XIcon />,
      href: "https://www.linkedin.com/in/mathews-william-62356ab7/",
      external: true,
    },
    {
      label: "instagram.com",
      icon: <XIcon />,
      href: "https://www.instagram.com/math_gfx",
      external: true,
    },
  ],
} as const;

export type PortfolioConfig = typeof PORTFOLIO_CONFIG;

export const LANGUAGES = ["pt-br", "en-us"] as const;
export type Language = (typeof LANGUAGES)[number];
