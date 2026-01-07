import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

const bullet = (text, maxLines = 1) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tokens.colors.accent, marginRight: 6, marginTop: 4 }} />
    <Text style={{ fontSize: tokens.type.body.fontSize, color: "#f0f6ff", flex: 1 }} maxLines={maxLines}>
      {text}
    </Text>
  </View>
);

export function CTA({ bookingUrl, qrDataUri }) {
  return (
    <View
      style={[
        styles.card,
        {
          padding: 12,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: tokens.colors.dark,
          borderColor: tokens.colors.dark,
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: "#fff", marginBottom: 4 }}>
          The AI Payback Sprint
        </Text>
        <Text style={{ fontSize: 10, color: "#cbd5e1", marginBottom: 12, lineHeight: 1.4 }}>
          The math above shows the opportunity. The Sprint makes it real.
          In 30 days, we baseline one critical workflow, install the guardrails,
          and prove the payback. No "transformation" fluff. Just outcomes.
        </Text>
        {bullet("Confirm the baseline (Time, Cost, Accuracy)", 1)}
        {bullet("Install Guardrails (Ownership & Safety)", 1)}
        {bullet("Deploy 30/60/90 Day Implementation Path", 1)}
        <Text style={{ fontSize: 10, color: tokens.colors.accent, fontWeight: '700', marginTop: 12 }}>
          Book your sprint evaluation: validagenda.com/book
        </Text>
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#a3a3a3", marginTop: 4 }} maxLines={1}>
          This is an estimate. The Sprint confirms the baseline and payback.
        </Text>
      </View>
    </View>
  );
}
