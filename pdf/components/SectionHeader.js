import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function SectionHeader({ chipLabel, title, first }) {
  return (
    <View style={{ marginBottom: 16, marginTop: first ? 0 : 12 }}>
      <View style={{
        backgroundColor: tokens.colors.dark,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8
      }}>
        <Text style={{ fontSize: 7, fontWeight: 800, color: '#fff', letterSpacing: 1 }}>{chipLabel}</Text>
      </View>
      {title ? <Text style={{ fontSize: 18, fontWeight: 800, color: tokens.colors.dark }}>{title}</Text> : null}
    </View>
  );
}
