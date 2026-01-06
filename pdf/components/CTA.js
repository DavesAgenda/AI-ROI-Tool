import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

const bullet = (text) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 4 }}>
    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tokens.colors.accent, marginRight: 6, marginTop: 4 }} />
    <Text style={{ fontSize: tokens.type.body.fontSize, color: "#f0f6ff", flex: 1 }}>{text}</Text>
  </View>
);

export function CTA({ bookingUrl, qrDataUri }) {
  return (
    <View
      style={[
        styles.card,
        {
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor: tokens.colors.dark,
          borderColor: "#0f304e",
          minHeight: 220,
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1, paddingRight: 12, gap: 6 }}>
        <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: "#fff" }}>AI Payback Sprint (Evaluate)</Text>
        <Text style={{ fontSize: tokens.type.body.fontSize, color: "#f0f6ff" }}>
          Confirm what pays back first—then decide if anything should be built.
        </Text>
        <Text style={{ fontSize: tokens.type.small.fontSize, color: "#f0f6ff", marginTop: 4, marginBottom: 2 }}>What you get</Text>
        {bullet("Baseline of one workflow (time, cost, errors, cycle time)")}
        {bullet("3-5 prioritised initiatives with simple value math")}
        {bullet("30/60/90 plan with owners and guardrails")}
        <Text style={{ fontSize: tokens.type.small.fontSize, color: "#f0f6ff", marginTop: 4, marginBottom: 2 }}>Good fit if</Text>
        {bullet("You have repeatable admin, reporting, sales ops, or customer comms")}
        {bullet("You want payback clarity before tools or vendors")}
        {bookingUrl ? (
          <Link src={bookingUrl} style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.accent, textDecoration: "underline", marginTop: 6 }}>
            {bookingUrl}
          </Link>
        ) : null}
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#c8d6e5", marginTop: 4 }}>
          This report is an estimate—the Sprint confirms the baseline and the true payback.
        </Text>
      </View>
      <View style={{ width: 120, alignItems: "center", gap: 4 }}>
        {qrDataUri ? <Image src={qrDataUri} style={{ width: 96, height: 96, objectFit: "contain", borderRadius: 8 }} /> : null}
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#f0f6ff" }}>Scan to book</Text>
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#c8d6e5", textAlign: "center" }}>Bring one workflow and one operator.</Text>
      </View>
    </View>
  );
}
