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
          borderColor: "#0f304e",
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: "#fff" }}>AI Payback Sprint (Evaluate)</Text>
        <Text style={{ fontSize: tokens.type.body.fontSize, color: "#f0f6ff" }} maxLines={2}>
          Confirm what pays back first, then decide what to build.
        </Text>
        {bullet("Baseline one workflow (time, cost, errors, cycle time)", 1)}
        {bullet("Prioritised shortlist with simple value math", 1)}
        {bullet("30/60/90 plan with owners and guardrails", 1)}
        <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.accent, textDecoration: "underline", marginTop: 4 }} maxLines={1}>
          Book: https://validagenda.com/book
        </Text>
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#c8d6e5", marginTop: 4 }} maxLines={1}>
          This is an estimate. The Sprint confirms the baseline and payback.
        </Text>
      </View>
    </View>
  );
}
