import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { styles, tokens } from "../styles";
import { truncate, limits } from "../utils/truncate";
import { formatCurrency, formatHours } from "../utils/format";

const headerCells = [
  { label: "Task", flex: 0.24, align: "left" },
  { label: "Role", flex: 0.18, align: "left" },
  { label: "Weekly hours", flex: 0.12, align: "right" },
  { label: "Annual cost", flex: 0.16, align: "right" },
  { label: "Savings (50%)", flex: 0.16, align: "right" },
  { label: "Priority", flex: 0.14, align: "right" },
];

const pillStyles = {
  Quick: { bg: tokens.colors.pillBg, border: tokens.colors.pillBorder, text: tokens.colors.accent },
  "Quick Win": { bg: tokens.colors.pillBg, border: tokens.colors.pillBorder, text: tokens.colors.accent },
  "Strategic Bet": { bg: tokens.colors.tableHeaderBg, border: "#cfe0f3", text: tokens.colors.dark },
  Trap: { bg: "#fbecee", border: "#f3c7cf", text: "#8a2f3d" },
  Hobby: { bg: "#f1f1f1", border: "#d7d7d7", text: tokens.colors.muted },
};

const Pill = ({ label }) => {
  const style = pillStyles[label] || pillStyles["Strategic Bet"];
  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: tokens.radii.pill,
        borderColor: style.border,
        borderWidth: 1,
        backgroundColor: style.bg,
      }}
    >
      <Text style={{ fontSize: tokens.type.tiny.fontSize, color: style.text }}>{label}</Text>
    </View>
  );
};

function TableRow({ row, idx }) {
  const cells = [
    truncate(row.task, limits.task),
    truncate(row.role, limits.role),
    formatHours(row.weeklyHours),
    formatCurrency(row.annualCost),
    formatCurrency(row.savings),
    row.priority || "",
  ];
  const isEven = idx % 2 === 0;
  return (
    <View style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isEven ? "#f9fbfd" : "#ffffff" }} wrap={false}>
      {cells.map((cell, i) => (
        <View key={i} style={{ flex: headerCells[i].flex, alignItems: headerCells[i].align === "right" ? "flex-end" : "flex-start" }}>
          {i === 5 ? (
            <Pill label={cell} />
          ) : (
            <Text style={{ fontSize: tokens.type.small.fontSize, color: tokens.colors.dark }}>{cell}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

export function TaskTable({ rows, footnote }) {
  return (
    <View style={[styles.card, { padding: 0 }]} wrap={false}>
      <View style={{ flexDirection: "row", backgroundColor: tokens.colors.tableHeaderBg, paddingHorizontal: 10, paddingVertical: 6 }} wrap={false}>
        {headerCells.map((cell) => (
          <View key={cell.label} style={{ flex: cell.flex, alignItems: cell.align === "right" ? "flex-end" : "flex-start" }}>
            <Text style={{ fontSize: tokens.type.small.fontSize, fontWeight: 600, color: tokens.colors.dark }}>{cell.label}</Text>
          </View>
        ))}
      </View>
      {rows.map((row, idx) => (
        <TableRow key={`${row.task}-${idx}`} row={row} idx={idx} />
      ))}
      {footnote ? (
        <View style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ fontSize: tokens.type.tiny.fontSize, color: tokens.colors.muted }}>{footnote}</Text>
        </View>
      ) : null}
    </View>
  );
}
