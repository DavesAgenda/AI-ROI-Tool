import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function Footer() {
    return (
        <View style={styles.footerBar} fixed>
            <Text>© {new Date().getFullYear()} Valid Agenda. All rights reserved.</Text>
            <Text>validagenda.com</Text>
        </View>
    );
}
