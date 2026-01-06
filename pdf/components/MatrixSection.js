import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function MatrixSection({ imageSrc, caption }) {
  return (
    <View style={[styles.card, { padding: 12 }]} wrap={false}>
      {imageSrc ? (
        <Image src={imageSrc} style={{ width: "100%", height: 280, objectFit: "contain", borderRadius: tokens.radii.image }} />
      ) : (
        <View
          style={{
            width: "100%",
            height: 280,
            borderRadius: tokens.radii.image,
            borderColor: tokens.colors.border,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.muted }}>Portfolio view unavailable</Text>
        </View>
      )}
      <Text style={{ fontSize: tokens.type.tiny.fontSize, color: tokens.colors.muted, marginTop: 6 }}>{caption || "Impact vs Effort portfolio view"}</Text>
    </View>
  );
}
