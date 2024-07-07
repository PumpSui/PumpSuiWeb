import {ThemeVars} from "@mysten/dapp-kit";

// Light theme copied from dapp-kit
export const customTheme: ThemeVars = {
  blurs: {
    modalOverlay: "blur(0)",
  },
  backgroundColors: {
    primaryButton: "",
    primaryButtonHover: "",
    outlineButtonHover: "#F4F4F5",
    modalOverlay: "rgba(24 36 53 / 20%)",
    modalPrimary: "#3a3a3a",
    modalSecondary: "#1d1d1d",
    iconButton: "transparent",
    iconButtonHover: "#F0F1F2",
    dropdownMenu: "#3a3a3a",
    dropdownMenuSeparator: "#F3F6F8",
    walletItemSelected: "",
    walletItemHover: "#3a3a3a",
  },
  borderColors: {
    outlineButton: "#4d4d4d",
  },
  colors: {
    primaryButton: "#ffffff",
    outlineButton: "#acacac",
    iconButton: "#000000",
    body: "#ffffff",
    bodyMuted: "#767A81",
    bodyDanger: "#FF794B",
  },
  radii: {
    small: "12px",
    medium: "16px",
    large: "24px",
    xlarge: "32px",
  },
  shadows: {
    primaryButton: "",
    walletItemSelected: "",
  },
  fontWeights: {
    normal: "700",
    medium: "800",
    bold: "1000",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "18px",
    xlarge: "20px",
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontStyle: "normal",
    lineHeight: "1.3",
    letterSpacing: "1",
  },
};
