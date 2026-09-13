export const typography = {
  fonts: {
    sans: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"SF Pro Text"',
      '"SF Pro Display"',
      '"SF Pro"',
      '"San Francisco"',
      '"Helvetica Neue"',
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(", "),
  },
} as const;

export type TypographyTokens = typeof typography;
