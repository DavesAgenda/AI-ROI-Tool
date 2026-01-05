import React from "react";
import { Document, Page, View } from "@react-pdf/renderer";
import { Header } from "./components/Header";
import { SummaryTiles } from "./components/SummaryTiles";
import { Opportunities } from "./components/Opportunities";
import { TaskTable } from "./components/TaskTable";
import { MatrixSection } from "./components/MatrixSection";
import { DoNothingCallout } from "./components/DoNothingCallout";
import { CTA } from "./components/CTA";
import { styles, tokens } from "./styles";
import { formatCurrency, formatHours, formatDate } from "./utils/format";
import { truncate } from "./utils/truncate";

const priorityRank = {
  "Quick Win": 1,
  "Strategic Bet": 2,
  Trap: 3,
  Hobby: 4,
};

function buildTiles(data) {
  return [
    { label: "Current annual cost", value: formatCurrency(data.currentAnnualCost), accent: true },
    { label: "Potential savings (50%)", value: formatCurrency(data.potentialSavings), accent: true },
    { label: "Weekly hours captured", value: formatHours(data.weeklyHoursCaptured) },
    { label: "Capacity returned (weekly)", value: formatHours(data.capacityReturnedWeekly) },
  ];
}

function normalizeOpportunities(list = []) {
  const sorted = [...list].sort((a, b) => (b.savings || 0) - (a.savings || 0));
  return sorted.slice(0, 2).map((t) => ({
    title: t.title || "Untitled task",
    annualCost: t.annualCost || 0,
    savings: t.savings || 0,
    tag: t.tag || "Priority",
    description: t.description || "",
  }));
}

function normalizeTasks(tasks = []) {
  const sorted = [...tasks].sort((a, b) => {
    const rankA = priorityRank[a.priority] || 99;
    const rankB = priorityRank[b.priority] || 99;
    if (rankA !== rankB) return rankA - rankB;
    return (b.savings || 0) - (a.savings || 0);
  });
  const sliced = sorted.slice(0, 8);
  return { rows: sliced, footnote: tasks.length > 8 ? "Showing top 8 tasks. Full list available on request." : null };
}

export function Report({ data }) {
  const tiles = buildTiles(data);
  const opps = normalizeOpportunities(data.opportunities || []);
  const { rows, footnote } = normalizeTasks(data.tasks || []);
  const preparedForName = data.preparedForName || "your team";
  const preparedForEmail = data.preparedForEmail || "";
  const reportDate = formatDate(data.reportDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBg} fixed />
        <Header logoSrc={data.logoSrc} preparedForName={preparedForName} preparedForEmail={preparedForEmail} reportDate={reportDate} />
        <View style={styles.section}>
          <SummaryTiles tiles={tiles} />
        </View>
        <View style={styles.section}>
          <Opportunities items={opps} />
        </View>
        <View style={styles.section}>
          <TaskTable rows={rows} footnote={footnote} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.pageBg} fixed />
        <Header logoSrc={data.logoSrc} preparedForName={preparedForName} preparedForEmail={preparedForEmail} reportDate={reportDate} />
        <View style={styles.section}>
          <MatrixSection imageSrc={data.matrixImageSrc} caption={data.matrixCaption || "Impact vs effort portfolio view"} />
        </View>
        <View style={styles.section}>
          <DoNothingCallout annualCost={data.doNothingAnnualCost} hoursPerYear={data.doNothingHoursPerYear} />
        </View>
        <View style={[styles.section, { backgroundColor: tokens.colors.dark, borderRadius: tokens.radii.card, padding: 0 }]} wrap={false}>
          <CTA bookingUrl={data.bookingUrl} qrDataUri={data.bookingQrDataUri} />
        </View>
      </Page>
    </Document>
  );
}
