import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { Cover } from "./components/Cover";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SummaryTiles } from "./components/SummaryTiles";
import { Opportunities } from "./components/Opportunities";
import { MatrixSection } from "./components/MatrixSection";
import { DoNothingCallout } from "./components/DoNothingCallout";
import { Philosophy } from "./components/Philosophy";
import { CTA } from "./components/CTA";
import { SectionHeader } from "./components/SectionHeader";
import { styles, tokens } from "./styles";
import { formatCurrency, formatHours, formatDate } from "./utils/format";

export function Report({ data }) {
  const preparedForName = data.preparedForName || "your team";
  const reportDate = formatDate(data.reportDate);

  const tiles = [
    { label: "Cost of Inaction", value: formatCurrency(data.currentAnnualCost), accent: true },
    { label: "Reclaimable Capital", value: formatCurrency(data.potentialSavings), accent: true },
    { label: "Expert Hours Wasted", value: formatHours(data.weeklyHoursCaptured * 52) },
    { label: "Recovery Potential", value: "50%" },
  ];

  return (
    <Document title={`AI Payback Blueprint - ${preparedForName}`}>
      {/* Page 1: Cover */}
      <Page size="A4" style={styles.page} padding={0}>
        <Cover preparedForName={preparedForName} logoSrc={data.logoSrc} />
      </Page>

      {/* Page 2: Executive Summary & Cost of Inaction */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBg} fixed />
        <Header logoSrc={data.logoSrc} preparedForName={preparedForName} reportDate={reportDate} />
        <Footer />

        <View style={{ marginTop: 20 }}>
          <SectionHeader chipLabel="THE NUMBERS" title="The Capital Opportunity" first />
          <SummaryTiles tiles={tiles} />
        </View>

        <View style={{ marginTop: 30 }}>
          <SectionHeader chipLabel="THE STAKES" title="The Cost of Inaction" />
          <DoNothingCallout annualCost={data.doNothingAnnualCost} hoursPerYear={data.doNothingHoursPerYear} />
        </View>

        <Philosophy />
      </Page>

      {/* Page 3: The Portfolio View */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBg} fixed />
        <Header logoSrc={data.logoSrc} preparedForName={preparedForName} reportDate={reportDate} />
        <Footer />

        <View style={{ marginTop: 20 }}>
          <SectionHeader chipLabel="THE PORTFOLIO" title="Strategic Priority Matrix" first />
          <View style={{ height: 350, marginTop: 10 }}>
            <MatrixSection imageSrc={data.matrixImageSrc} caption="Impact vs. Viability. We focus on the high-payback, high-readiness workflows in the top right." />
          </View>
        </View>

        <View style={{ marginTop: 20, padding: 15, borderLeft: `2px solid ${tokens.colors.accent}`, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 10, lineHeight: 1.6, color: tokens.colors.text }}>
            <Text style={{ fontWeight: '800' }}>Outcomes beat activity.</Text> Most teams start with the "smartest" ideas. We start with the ones that pay back.
            Our matrix categorizes tasks by their immediate recovery potential and technical readiness.
          </Text>
        </View>
      </Page>

      {/* Page 4: Roadmap & CTA */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBg} fixed />
        <Header logoSrc={data.logoSrc} preparedForName={preparedForName} reportDate={reportDate} />
        <Footer />

        <View style={{ marginTop: 20 }}>
          <SectionHeader chipLabel="THE ROADMAP" title="Top Payback Opportunities" first />
          <Opportunities items={data.opportunities || []} />
        </View>

        <View style={{ bottom: 40, left: tokens.spacing.page, right: tokens.spacing.page, position: 'absolute' }}>
          <SectionHeader chipLabel="NEXT STEPS" title="Move from estimates to outcomes" />
          <CTA bookingUrl={data.bookingUrl} qrDataUri={data.bookingQrDataUri} />
        </View>
      </Page>
    </Document>
  );
}
