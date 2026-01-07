import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function MatrixSection({ imageSrc, caption }) {
  return (
    <View style={styles.card} wrap={false}>
      {imageSrc ? (
        <View style={{ borderRadius: tokens.radius.md, overflow: 'hidden' }}>
          <Image src={imageSrc} style={{ width: "100%", height: 300, objectFit: "contain" }} />
        </View>
      ) : (
        <View
          style={{
            width: "100%",
            height: 300,
            borderRadius: tokens.radius.md,
            borderColor: tokens.colors.border,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: tokens.colors.lightBg
          }}
        >
          <Text style={{ fontSize: 9, color: tokens.colors.muted }}>Portfolio visualization unavailable</Text>
        </View>
      )}
      <Text style={{ fontSize: 7, color: tokens.colors.muted, marginTop: 10, textAlign: 'center' }}>
        {caption || "Impact vs Effort portfolio view"}
      </Text>
    </View>
  );
}
