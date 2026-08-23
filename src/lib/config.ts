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
} as const;

export type PortfolioConfig = typeof PORTFOLIO_CONFIG;

export const LANGUAGES = ["pt-br", "en-us"] as const;
export type Language = (typeof LANGUAGES)[number];
