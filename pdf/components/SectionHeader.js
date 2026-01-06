import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function SectionHeader({ chipLabel, title, subtitle, first = false }) {
  return (
    <View style={{ marginTop: first ? 0 : 0, marginBottom: 6 }} wrap={false}>
      <Text style={styles.chip}>{chipLabel}</Text>
      {title ? <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: tokens.colors.dark, lineHeight: tokens.type.h2.lineHeight }}>{title}</Text> : null}
      {subtitle ? <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted, lineHeight: tokens.type.small.lineHeight }}>{subtitle}</Text> : null}
    </View>
  );
}
