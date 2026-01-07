import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function Footer() {
    return (
        <View style={styles.footerBar} fixed>
            <Text style={{ color: "#fff", fontSize: 8 }}>© Valid Agenda {new Date().getFullYear()}</Text>
        </View>
    );
}
