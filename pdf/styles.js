import { StyleSheet } from "@react-pdf/renderer";

export const tokens = {
  colors: {
    accent: "#F48847",
    dark: "#134061",
    muted: "#4a5b6d",
    lightBg: "#f7f9fc",
    cardBg: "#ffffff",
    border: "#e6edf5",
    tableHeaderBg: "#eef4fb",
    pillBg: "#fff3ec",
    pillBorder: "#f6c3aa",
  },
  radii: {
    card: 10,
    pill: 999,
    image: 8,
  },
  spacing: {
    pageX: 28,
    pageY: 24,
    gap: 12,
    columnGap: 16,
  },
  type: {
    h1: { fontSize: 18, fontWeight: 600 },
    h2: { fontSize: 12.5, fontWeight: 600 },
    body: { fontSize: 10.5, fontWeight: 400 },
    small: { fontSize: 9, fontWeight: 400 },
    tiny: { fontSize: 8, fontWeight: 400 },
  },
};

export const styles = StyleSheet.create({
  page: {
    paddingTop: tokens.spacing.pageY + 56,
    paddingBottom: tokens.spacing.pageY,
    paddingHorizontal: tokens.spacing.pageX,
    fontSize: tokens.type.body.fontSize,
    color: tokens.colors.dark,
    fontFamily: "Helvetica",
  },
  pageBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colors.lightBg,
  },
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: tokens.colors.dark,
  },
  headerContent: {
    position: "absolute",
    top: 0,
    left: tokens.spacing.pageX,
    right: tokens.spacing.pageX,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleBlock: {
    alignItems: "flex-end",
  },
  section: {
    marginBottom: tokens.spacing.gap,
  },
  sectionTitle: {
    fontSize: tokens.type.h2.fontSize,
    fontWeight: tokens.type.h2.fontWeight,
    color: tokens.colors.dark,
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: tokens.spacing.columnGap,
  },
  card: {
    backgroundColor: tokens.colors.cardBg,
    borderColor: tokens.colors.border,
    borderWidth: 1,
    borderRadius: tokens.radii.card,
    padding: 12,
  },
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.pillBg,
    borderColor: tokens.colors.pillBorder,
    borderWidth: 1,
    color: tokens.colors.accent,
    fontSize: tokens.type.tiny.fontSize,
    marginBottom: 4,
  },
  muted: {
    color: tokens.colors.muted,
  },
});
