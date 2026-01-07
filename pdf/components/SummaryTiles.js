import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

function Tile({ label, value, accent }) {
  return (
    <View style={[styles.card, { padding: 15, width: "23%", marginBottom: 0 }]}>
      <Text style={{ fontSize: 7, fontWeight: 700, color: tokens.colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: 800, color: accent ? tokens.colors.accent : tokens.colors.dark }}>
        {value}
      </Text>
    </View>
  );
}

export function SummaryTiles({ tiles }) {
  return (
    <View style={styles.gridRow}>
      {tiles.map((tile, idx) => (
        <Tile key={idx} {...tile} />
      ))}
    </View>
  );
}
