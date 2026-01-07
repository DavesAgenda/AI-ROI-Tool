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
          minHeight: 70,
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1, paddingRight: 20 }}>
        <Text style={{ fontSize: 11, lineHeight: 1.5, color: '#475569' }}>
          Staying manual is an active decision to burn {formatCurrency(annualCost)} every year.
          This is not just "busywork"—it’s a drain on your culture and your capital.
          {"\n\n"}
          By automating the high-impact workflows identified in this report,
          you reclaim {hoursPerYear.toLocaleString()} expert hours to focus on strategy, not basic processing.
        </Text>
      </View>
      <View style={{ width: 120, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: tokens.colors.accent }}>
          {formatCurrency(annualCost)}
        </Text>
        <Text style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', marginTop: 4 }}>
          Annual Waste
        </Text>
      </View>
    </View>
  );
}
