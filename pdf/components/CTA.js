import React from "react";
import { View, Text, Image, Link } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function CTA({ bookingUrl, qrDataUri }) {
  return (
    <View style={[styles.card, { padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]} wrap={false}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: "#fff", marginBottom: 6 }}>Book an Evaluate Session</Text>
        <Text style={{ fontSize: tokens.type.body.fontSize, color: "#f0f6ff", marginBottom: 6 }}>
          Confirm your top Quick Win and leave with a 30/60/90 plan and a costed estimate.
        </Text>
        {bookingUrl ? (
          <Link src={bookingUrl} style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.accent, textDecoration: "underline" }}>
            {bookingUrl}
          </Link>
        ) : null}
      </View>
      <View style={{ width: 110, alignItems: "center", gap: 4 }}>
        {qrDataUri ? <Image src={qrDataUri} style={{ width: 96, height: 96, objectFit: "contain", borderRadius: 8 }} /> : null}
        <Text style={{ fontSize: tokens.type.tiny.fontSize, color: "#f0f6ff" }}>Scan to book</Text>
      </View>
    </View>
  );
}
