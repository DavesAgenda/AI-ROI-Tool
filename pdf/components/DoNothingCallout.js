import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { formatCurrency, formatHours } from "../utils/format";

export function DoNothingCallout({ annualCost, hoursPerYear }) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tokens.colors.pillBg,
          borderColor: tokens.colors.pillBorder,
        },
      ]}
      wrap={false}
    >
      <Text style={{ fontSize: tokens.type.h2.fontSize, fontWeight: tokens.type.h2.fontWeight, color: tokens.colors.dark, marginBottom: 6 }}>If you do nothing</Text>
      <Text style={{ fontSize: tokens.type.body.fontSize, color: tokens.colors.dark, marginBottom: 4 }}>
        You are currently spending ~{formatCurrency(annualCost)} per year on these tasks.
      </Text>
      <Text style={{ fontSize: tokens.type.body.fontSize, color: tokens.colors.dark }}>
        At 50% automation, you could reclaim ~{formatHours(hoursPerYear, "hours")} per year.
      </Text>
    </View>
  );
}
