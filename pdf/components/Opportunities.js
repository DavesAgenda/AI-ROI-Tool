import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate } from "../utils/truncate";
import { formatCurrency } from "../utils/format";

function Card({ title, savings, tag, reason }) {
  return (
    <View style={[styles.card, { width: "48%", padding: 15, marginBottom: 0 }]} wrap={false}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <View style={{
          backgroundColor: tokens.colors.accent,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 4
        }}>
          <Text style={{ fontSize: 6, fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>{tag || "Priority"}</Text>
        </View>
        <Text style={{ fontSize: 10, fontWeight: 800, color: tokens.colors.dark }}>
          {formatCurrency(savings)} Recovery
        </Text>
      </View>
      <Text style={{ fontSize: 12, fontWeight: 800, color: tokens.colors.dark, marginBottom: 4 }}>
        {truncate(title, 35)}
      </Text>
      <Text style={{ fontSize: 9, color: tokens.colors.muted, lineHeight: 1.4 }}>
        {reason || "Repeatable work with predictable savings potential."}
      </Text>
    </View>
  );
}

export function Opportunities({ items }) {
  const topItems = items.slice(0, 2);
  return (
    <View style={styles.gridRow}>
      {topItems.map((op, idx) => (
        <Card key={idx} {...op} />
      ))}
    </View>
  );
}
