// Serverless PDF generator for Vercel using @react-pdf/renderer.

const { pdf, Document, Page, View, Text, Image, Link, StyleSheet } = require("@react-pdf/renderer");
const React = require("react");
module.exports.config = {
  runtime: "nodejs",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const buildPriorityNote = (priority) => {
  if (priority === "Quick Win") return "Fast to deliver with low/no-code. Unlock savings quickly.";
  if (priority === "Strategic Bet") return "Higher effort, higher upside. Best planned as a scoped project.";
  if (priority === "Hobby") return "Good learning opportunity, lower business impact.";
  if (priority === "Trap") return "Complexity outweighs value. Do not automate first.";
  return "Reviewed against readiness and pain.";
};

const topTasks = (tasks = []) => [...tasks].sort((a, b) => (b.metrics?.savings || 0) - (a.metrics?.savings || 0)).slice(0, 2);

async function renderPdf(payload, origin) {
  const h = React.createElement;
  const { tasks = [], totals = {}, lead = {}, matrixDataUrl, qrDataUrl, logoUrl, meetingUrl } = payload || {};
  const accent = "#F48847";
  const dark = "#134061";
  const muted = "#4a5b6d";
  const light = "#eef3f8";
  const leadName = [lead.firstName, lead.lastName, lead.email].filter(Boolean).join(" ").trim() || "your team";
  const dateStr = new Date().toLocaleDateString();
  const bestTasks = topTasks(tasks);

  const styles = StyleSheet.create({
    page: { padding: 28, fontSize: 11, fontFamily: "Helvetica", backgroundColor: "#f7f9fc" },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    logo: { width: 140, height: 46, objectFit: "contain" },
    titleBox: { alignItems: "flex-end" },
    title: { fontSize: 16, color: dark, fontWeight: 700 },
    meta: { fontSize: 11, color: muted },
    section: { marginBottom: 14 },
    sectionTitle: { fontSize: 14, color: dark, fontWeight: 700, marginBottom: 8, borderLeftColor: accent, borderLeftWidth: 4, paddingLeft: 8 },
    tiles: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 10 },
    tile: { backgroundColor: "#fff", padding: 10, borderRadius: 10, borderColor: light, borderWidth: 1, width: "48%", marginBottom: 8 },
    tileLabel: { fontSize: 11, color: dark, fontWeight: 700, marginBottom: 4 },
    tileValue: { fontSize: 14, color: dark, fontWeight: 700 },
    tileValueAccent: { color: accent },
    oppGrid: { flexDirection: "row", justifyContent: "space-between" },
    oppCard: { backgroundColor: "#fff", padding: 10, borderRadius: 10, borderColor: light, borderWidth: 1, width: "48%" },
    oppTitle: { fontSize: 12.5, color: dark, fontWeight: 700, marginBottom: 4 },
    oppMeta: { fontSize: 11, color: muted, marginBottom: 6 },
    oppNote: { fontSize: 11, color: dark, lineHeight: 1.4 },
    pill: { borderColor: accent, borderWidth: 1, color: accent, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, fontSize: 10, alignSelf: "flex-start" },
    table: { borderRadius: 10, borderColor: light, borderWidth: 1, overflow: "hidden" },
    tableRow: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 6, alignItems: "center" },
    tableHead: { backgroundColor: "#eef3f8" },
    tableCell: { fontSize: 10, color: dark, flex: 1 },
    cellTight: { flex: 0.8, textAlign: "right" },
    cellWide: { flex: 1.4 },
    mutedText: { fontSize: 10, color: muted, marginTop: 4 },
    matrixImg: { width: "100%", height: 240, objectFit: "cover", marginTop: 6, marginBottom: 4 },
    callout: { backgroundColor: "#fff", padding: 10, borderRadius: 10, borderColor: light, borderWidth: 1 },
    body: { fontSize: 11, color: dark, marginBottom: 4, lineHeight: 1.4 },
    cta: { backgroundColor: dark, color: "#fff", padding: 14, borderRadius: 12, marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    ctaText: { color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 4 },
    ctaLink: { color: accent, fontSize: 11, textDecoration: "underline" },
    qr: { width: 70, height: 70, objectFit: "contain" },
  });

  const tile = (label, value, accentValue = false) =>
    h(
      View,
      { style: styles.tile },
      h(Text, { style: styles.tileLabel }, label),
      h(Text, { style: [styles.tileValue, accentValue && styles.tileValueAccent] }, value)
    );

  const oppCard = (task) =>
    h(
      View,
      { style: styles.oppCard },
      h(View, { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } }, [
        h(Text, { style: styles.oppTitle }, task.task || "Untitled task"),
        h(Text, { style: styles.pill }, task.priority || "Priority"),
      ]),
      h(Text, { style: styles.oppMeta }, `Annual cost ${formatCurrency(task.metrics?.annualCost || 0)} · Savings ${formatCurrency(task.metrics?.savings || 0)}`),
      h(Text, { style: styles.oppNote }, buildPriorityNote(task.priority))
    );

  const headerRow = h(
    View,
    { style: [styles.tableRow, styles.tableHead] },
    [
      h(Text, { style: [styles.tableCell, styles.cellWide] }, "Task"),
      h(Text, { style: styles.tableCell }, "Role"),
      h(Text, { style: [styles.tableCell, styles.cellTight] }, "Weekly hours"),
      h(Text, { style: [styles.tableCell, styles.cellTight] }, "Annual cost"),
      h(Text, { style: [styles.tableCell, styles.cellTight] }, "Savings (50%)"),
      h(Text, { style: [styles.tableCell, styles.cellTight] }, "Priority"),
    ]
  );

  const row = (t, idx) =>
    h(
      View,
      { key: (t.task || "task") + idx, style: [styles.tableRow, idx % 2 === 0 && { backgroundColor: "#f9fbfd" }] },
      [
        h(Text, { style: [styles.tableCell, styles.cellWide] }, t.task || "Untitled"),
        h(Text, { style: styles.tableCell }, t.role || "Owner"),
        h(Text, { style: [styles.tableCell, styles.cellTight] }, (t.metrics?.weeklyHours || 0).toFixed(1)),
        h(Text, { style: [styles.tableCell, styles.cellTight] }, formatCurrency(t.metrics?.annualCost || 0)),
        h(Text, { style: [styles.tableCell, styles.cellTight] }, formatCurrency(t.metrics?.savings || 0)),
        h(Text, { style: [styles.tableCell, styles.cellTight] }, t.priority || ""),
      ]
    );

  const resolvedLogo =
    logoUrl && (logoUrl.startsWith("http") || logoUrl.startsWith("data:"))
      ? logoUrl
      : origin
      ? `${origin}/assets/va-logo-wide.png`
      : null;

  const doc = h(
    Document,
    null,
    h(
      Page,
      { size: "A4", style: styles.page },
      [
        h(
          View,
          { style: styles.header },
          [
            resolvedLogo ? h(Image, { src: resolvedLogo, style: styles.logo }) : null,
            h(
              View,
              { style: styles.titleBox },
              [
                h(Text, { style: styles.title }, "Automation ROI Report"),
                h(Text, { style: styles.meta }, `Prepared for ${leadName}`),
                h(Text, { style: styles.meta }, `Date: ${dateStr}`),
              ]
            ),
          ]
        ),
        h(
          View,
          { style: styles.tiles },
          [
            tile("Current annual cost", formatCurrency(totals.annualCost), true),
            tile("Potential savings (50%)", formatCurrency(totals.savings), true),
            tile("Weekly hours captured", `${Number(totals.weeklyHours || 0).toFixed(1)} hrs`),
            tile("Capacity returned (weekly)", `${(Number(totals.weeklyHours || 0) * 0.5).toFixed(1)} hrs`),
          ]
        ),
        h(
          View,
          { style: styles.section },
          [
            h(Text, { style: styles.sectionTitle }, "Top opportunities"),
            h(View, { style: styles.oppGrid }, bestTasks.map((t) => oppCard(t))),
          ]
        ),
        h(
          View,
          { style: styles.section },
          [
            h(Text, { style: styles.sectionTitle }, "What you captured"),
            h(View, { style: styles.table }, [headerRow, ...tasks.slice(0, 8).map((t, idx) => row(t, idx))]),
            tasks.length > 8 ? h(Text, { style: styles.mutedText }, `+${tasks.length - 8} more tasks not shown`) : null,
          ]
        ),
        h(
          View,
          { style: styles.section },
          [
            h(Text, { style: styles.sectionTitle }, "Portfolio view"),
            matrixDataUrl ? h(Image, { src: matrixDataUrl, style: styles.matrixImg }) : null,
            h(Text, { style: styles.mutedText }, "Impact uses annual cost. Effort uses readiness toggles."),
          ]
        ),
        h(
          View,
          { style: styles.section },
          [
            h(Text, { style: styles.sectionTitle }, "If you do nothing"),
            h(View, { style: styles.callout }, [
              h(Text, { style: styles.body }, `You are currently spending ~${formatCurrency(totals.annualCost)} per year on these tasks.`),
              h(Text, { style: styles.body }, `At 50% automation, you could reclaim ~${(Number(totals.annualHours || 0) * 0.5).toFixed(1)} hours per year.`),
            ]),
          ]
        ),
        h(
          View,
          { style: [styles.section, styles.cta] },
          [
            h(View, null, [
              h(Text, { style: styles.ctaText }, "Book an Evaluate Session"),
              h(Text, { style: { color: "#dfe9f5", fontSize: 11, marginBottom: 6 } }, "Confirm your top Quick Win and leave with a 30/60/90 plan."),
              meetingUrl ? h(Link, { src: meetingUrl, style: styles.ctaLink }, meetingUrl) : null,
            ]),
            qrDataUrl ? h(Image, { src: qrDataUrl, style: styles.qr }) : null,
          ]
        ),
      ]
    )
  );

  const pdfBuf = await pdf(doc).toBuffer();
  return pdfBuf;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0];
    const origin = host ? `${proto}://${host}` : null;
    const pdfBuffer = await renderPdf(payload || {}, origin);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Valid-Agenda-Automation-ROI-Report.pdf");
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
};
