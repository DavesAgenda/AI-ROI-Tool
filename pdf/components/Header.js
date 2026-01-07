import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate } from "../utils/truncate";

export function Header({ logoSrc, preparedForName, preparedForEmail, reportDate }) {
  return (
    <>
      <View style={styles.headerBar} fixed />
      <View style={styles.headerContent} fixed>
        {logoSrc ? (
          <Image src={logoSrc} style={{ height: 18, maxWidth: 140, objectFit: "contain", alignSelf: "center" }} />
        ) : (
          <Text style={{ fontSize: 12, color: "#fff" }}>Valid Agenda</Text>
        )}
        <View style={styles.headerRight}>
          <Text style={styles.headerTitleRight}>Your Payback Blueprint</Text>
        </View>
      </View>
    </>
  );
}
