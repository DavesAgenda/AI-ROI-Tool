import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function Header({ logoSrc, reportDate }) {
  return (
    <View style={styles.headerContent} fixed>
      {logoSrc ? (
        <Image src={logoSrc} style={{ height: 18, maxWidth: 120, objectFit: "contain" }} />
      ) : (
        <Text style={{ fontSize: 10, fontWeight: 700, color: tokens.colors.dark }}>VALID AGENDA</Text>
      )}
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.headerTitleRight}>AI Payback Blueprint</Text>
        <Text style={{ fontSize: 7, color: tokens.colors.muted, marginTop: 2 }}>{reportDate}</Text>
      </View>
    </View>
  );
}
