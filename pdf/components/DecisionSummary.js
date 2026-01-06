import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { formatCurrency, formatHours } from "../utils/format";
import { truncate, limits } from "../utils/truncate";

const bullet = () => (
  <View
    style={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: tokens.colors.accent,
      marginRight: 6,
      marginTop: 4,
    }}
  />
);

function BulletLine({ text }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
      {bullet()}
      <Text style={{ fontSize: tokens.type.body.fontSize, color: tokens.colors.dark, flex: 1 }}>{text}</Text>
    </View>
  );
}

export function DecisionSummary({ weeklyHours, potentialSavings, bestOpportunityTitle }) {
  const leftBullets = [
    `You have ~${formatHours(weeklyHours)} tied up in repeatable work.`,
    `At 50% automation, that is ~${formatCurrency(potentialSavings)}/year in savings capacity.`,
    `Best starting point: ${truncate(bestOpportunityTitle || "Top quick win", limits.opportunityTitle)}.`,
  ];
  const rightBullets = [
    "Workflow first, tools second.",
    "Low/no-code first where reliable.",
    "If payback is unclear, do not build.",
  ];

  return (
    <View style={[styles.card, { padding: 12, flexDirection: "row", justifyContent: "space-between", position: "relative" }]} wrap={false}>
      <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 3, backgroundColor: tokens.colors.accent, borderTopLeftRadius: tokens.radii.card, borderBottomLeftRadius: tokens.radii.card }} />
      <View style={{ width: "48%" }}>
        <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: tokens.colors.dark, marginBottom: 6 }}>What this estimate suggests</Text>
        {leftBullets.map((b, idx) => (
          <BulletLine key={idx} text={b} />
        ))}
      </View>
      <View style={{ width: "48%" }}>
        <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: tokens.colors.dark, marginBottom: 6 }}>Guardrails</Text>
        {rightBullets.map((b, idx) => (
          <BulletLine key={idx} text={b} />
        ))}
      </View>
    </View>
  );
}
