import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate } from "../utils/truncate";

export function Header({ logoSrc, preparedForName, preparedForEmail, reportDate }) {
  const preparedLine = preparedForEmail ? `${preparedForName} · ${preparedForEmail}` : preparedForName;
  return (
    <View wrap={false}>
      <View style={styles.headerBar} fixed />
      <View style={styles.headerContent} fixed>
        {logoSrc ? <Image src={logoSrc} style={{ height: 18, width: 120, objectFit: "contain" }} /> : <Text style={{ fontSize: 12, color: "#fff" }}>Valid Agenda</Text>}
        <View style={styles.headerTitleBlock}>
          <Text style={{ fontSize: tokens.type.h1.fontSize, fontWeight: tokens.type.h1.fontWeight, color: "#fff" }}>Automation ROI Report</Text>
          <Text style={{ fontSize: tokens.type.small.fontSize, color: "rgba(255,255,255,0.85)" }}>{truncate(preparedLine || "your team", 60)}</Text>
          <Text style={{ fontSize: tokens.type.small.fontSize, color: "rgba(255,255,255,0.7)" }}>{reportDate}</Text>
        </View>
      </View>
    </View>
  );
}
