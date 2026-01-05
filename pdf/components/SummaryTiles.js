import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

function Tile({ label, value, accent }) {
  return (
    <View style={[styles.card, { padding: 14, width: "48%" }]} wrap={false}>
      <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted, marginBottom: 4 }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: 600, color: accent ? tokens.colors.accent : tokens.colors.dark }}>{value}</Text>
    </View>
  );
}

export function SummaryTiles({ tiles }) {
  return (
    <View style={[styles.gridRow, { flexWrap: "wrap" }]} wrap={false}>
      {tiles.map((tile, idx) => (
        <Tile key={idx} {...tile} />
      ))}
    </View>
  );
}
