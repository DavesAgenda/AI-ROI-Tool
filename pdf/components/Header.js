import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate } from "../utils/truncate";

export function Header({ logoSrc, preparedForName, preparedForEmail, reportDate }) {
  const preparedLine = preparedForEmail ? `${preparedForName} · ${preparedForEmail}` : preparedForName;
  return (
    <View style={styles.header} wrap={false}>
      <View style={styles.headerRow}>
        {logoSrc ? <Image src={logoSrc} style={{ height: 18, width: 120, objectFit: "contain" }} /> : <Text style={{ fontSize: 12, color: tokens.colors.dark }}>Valid Agenda</Text>}
        <View style={styles.headerTitleBlock}>
          <Text style={{ fontSize: tokens.type.h1.fontSize, fontWeight: tokens.type.h1.fontWeight, color: tokens.colors.dark }}>Automation ROI Report</Text>
          <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted }}>{truncate(preparedLine || "your team", 60)}</Text>
          <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted }}>{reportDate}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );
}
