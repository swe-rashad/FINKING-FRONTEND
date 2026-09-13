export const spacing = {
  14: "0.875rem",
  16: "1rem",
  18: "1.125rem",
  24: "1.5rem",
  32: "2rem",
  40: "2.5rem",
  48: "3rem",
  64: "4rem"
} as const;

export type SpacingTokens = typeof spacing;
