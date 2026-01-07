import { StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: 'Manrope',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/sharanda/manrope-font@3.0/fonts/ttf/Manrope-Regular.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/gh/sharanda/manrope-font@3.0/fonts/ttf/Manrope-Medium.ttf', fontWeight: 500 },
    { src: 'https://cdn.jsdelivr.net/gh/sharanda/manrope-font@3.0/fonts/ttf/Manrope-SemiBold.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/gh/sharanda/manrope-font@3.0/fonts/ttf/Manrope-Bold.ttf', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/gh/sharanda/manrope-font@3.0/fonts/ttf/Manrope-ExtraBold.ttf', fontWeight: 800 },
  ]
});

export const tokens = {
  colors: {
    accent: "#F48847", // Brand Orange
    dark: "#134061",   // Brand Navy
    text: "#1E293B",   // Slate 800
    muted: "#64748b",
    lightBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
    white: "#FFFFFF",
  },
  spacing: {
    page: 40,
    section: 24,
    card: 20,
    gap: 12,
  },
  radius: {
    lg: 12,
    md: 8,
    full: 999,
  },
  type: {
    h1: { fontSize: 32, fontWeight: 800 },
    h2: { fontSize: 24, fontWeight: 700 },
    h3: { fontSize: 18, fontWeight: 700 },
    body: { fontSize: 11, fontWeight: 400, leading: 1.5 },
    small: { fontSize: 9, fontWeight: 500 },
    tiny: { fontSize: 7, fontWeight: 400 },
  }
};

export const styles = StyleSheet.create({
  page: {
    backgroundColor: tokens.colors.white,
    padding: tokens.spacing.page,
    fontFamily: "Manrope",
    color: tokens.colors.text,
  },
  pageBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: tokens.colors.lightBg,
    zIndex: -1,
  },
  coverPage: {
    backgroundColor: tokens.colors.dark,
    padding: tokens.spacing.page * 1.5,
    height: '100%',
    justifyContent: "space-between",
    color: tokens.colors.white,
  },
  section: {
    marginBottom: tokens.spacing.section,
  },
  card: {
    backgroundColor: tokens.colors.cardBg,
    borderRadius: tokens.radius.md,
    border: `1px solid ${tokens.colors.border}`,
    padding: tokens.spacing.card,
    marginBottom: tokens.spacing.gap,
  },
  gridRow: {
    flexDirection: "row",
    gap: tokens.spacing.gap,
    justifyContent: "space-between",
    marginBottom: tokens.spacing.gap,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: `1px solid ${tokens.colors.border}`,
  },
  headerTitleRight: {
    fontSize: 10,
    fontWeight: 700,
    color: tokens.colors.dark,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footerBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `1px solid ${tokens.colors.border}`,
    color: tokens.colors.muted,
    fontSize: 8,
  },
});
