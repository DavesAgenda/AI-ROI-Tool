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
          backgroundColor: '#F1F5F9', // Light Slate
          borderColor: tokens.colors.border,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 80,
        },
      ]}
      wrap={false}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={{ fontSize: 10, lineHeight: 1.5, color: '#475569' }}>
          Staying manual is an active decision to burn <Text style={{ fontWeight: 700, color: tokens.colors.accent }}>{formatCurrency(annualCost)}</Text> every year.
          This is not just "busywork"—it’s a drain on your culture and your capital.
          {"\n\n"}
          By automating these workflows, you reclaim <Text style={{ fontWeight: 700 }}>{hoursPerYear.toLocaleString()}</Text> expert hours annually.
        </Text>
      </View>
      <View style={{ width: 140, borderLeft: `1px solid ${tokens.colors.border}`, paddingLeft: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: tokens.colors.accent }}>
          {formatCurrency(annualCost)}
        </Text>
        <Text style={{ fontSize: 7, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginTop: 4 }}>
          Annual Waste Projection
        </Text>
      </View>
    </View>
  );
}
