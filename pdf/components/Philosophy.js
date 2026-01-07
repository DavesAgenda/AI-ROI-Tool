import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";

export function Philosophy() {
    return (
        <View style={{ marginTop: 20, padding: 20, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: tokens.colors.dark, marginBottom: 8 }}>
                Payback-first AI. No science projects.
            </Text>
            <Text style={{ fontSize: 10, lineHeight: 1.5, color: tokens.colors.text }}>
                AI is not a strategy—it is leverage. We believe outcomes beat activity.
                If it doesn’t reduce cost, save time, or lower risk, it’s not work; it’s entertainment.
                {"\n\n"}
                Our approach is simple: Baseline the workflow, choose the high-payback intervention,
                install guardrails, and measure the math. Every week.
            </Text>
        </View>
    );
}
