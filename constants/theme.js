import { Platform } from "react-native";

// ReeferSense — visual identity
// Subject: cold-chain / reefer-container telemetry. The whole app is built
// around one motif — a dial/ring — reused as the selector nodes on Home,
// the gauge rings on the sensor screen, and the cap of the temperature bar.
export const colors = {
  bg: "#0A121F",
  bgAlt: "#0E1A2C",
  surface: "#111D33",
  surfaceAlt: "#182A46",
  border: "#243A5C",
  borderBright: "#2F4C78",

  frost: "#4FD6E8",
  frostDim: "#2C7C8C",
  frostSoft: "rgba(79, 214, 232, 0.14)",

  amber: "#F2A93B",
  amberSoft: "rgba(242, 169, 59, 0.14)",

  danger: "#FF6259",
  dangerSoft: "rgba(255, 98, 89, 0.16)",

  success: "#57D9A3",
  successSoft: "rgba(87, 217, 163, 0.14)",

  textPrimary: "#EAF2FB",
  textSecondary: "#AFC0D9",
  textMuted: "#6C7F9E",
};

export const fonts = {
  // Numeric / readout face — evokes an LCD panel on refrigeration equipment
  mono: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  // Label face — system sans, used with tracked-out uppercase for a
  // control-panel feel
  label: Platform.select({ ios: "System", android: "sans-serif-medium", default: "System" }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 18,
  lg: 28,
  pill: 999,
};
