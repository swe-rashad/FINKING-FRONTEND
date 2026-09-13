export const colors = {
  primary: {
    50: "#E3F2FD",
    200: "#90CAF9",
    500: "#2196F3",
    900: "#0D47A1",
  },
  text: {
    black: "#000000",
    white: "#FFFFFF",
    lightestBlue: "#E3F2FD",
    lightBlue: "#90CAF9",
    primaryBlue: "#2196F3",
    darkBlue: "#0D47A1",
  },
  background: {
    light: "#FFFFFF",
    dark: "#0A0A0A",
    cardLight: "#E3F2FD",
  },
} as const;

export type ColorTokens = typeof colors;
