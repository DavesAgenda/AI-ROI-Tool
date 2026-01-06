import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate, limits } from "../utils/truncate";
import { formatCurrency } from "../utils/format";

const tagStyle = {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: tokens.radii.pill,
  borderColor: tokens.colors.pillBorder,
  borderWidth: 1,
  backgroundColor: tokens.colors.pillBg,
  color: tokens.colors.accent,
  fontSize: tokens.type.tiny.fontSize,
};

function Card({ title, annualCost, savings, tag, reason, path }) {
  return (
    <View style={[styles.card, { width: "48%", padding: 12 }]} wrap={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <Text style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.dark }}>{truncate(title, limits.opportunityTitle)}</Text>
        <Text style={tagStyle}>{tag || "Priority"}</Text>
      </View>
      <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted, marginBottom: 6 }}>
        Annual cost {formatCurrency(annualCost)} · Savings {formatCurrency(savings)}
      </Text>
      <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted, marginBottom: 2 }} wrap={true} maxLines={1}>
        Why it pays back: {truncate(reason || "Repeatable work with predictable savings.", limits.opportunityDesc)}
      </Text>
      <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted }} wrap={true} maxLines={1}>
        Lowest-risk path: {truncate(path || "Workflow first, low/no-code first.", limits.opportunityDesc)}
      </Text>
    </View>
  );
}

export function Opportunities({ items }) {
  return (
    <View style={[styles.gridRow]} wrap={false}>
      {items.map((op, idx) => (
        <Card key={idx} {...op} />
      ))}
    </View>
  );
}
