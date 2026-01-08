// Serverless PDF generator for Vercel using @react-pdf/renderer.
import React from "react";
import fs from "fs";
import path from "path";
import { pdf } from "@react-pdf/renderer";
import { Report } from "../../pdf/Report";
import { makeQrDataUri } from "../../pdf/utils/qr";
import { formatCurrency } from "../../pdf/utils/format";

export const config = {
  runtime: "nodejs",
};

const priorityRank = {
  "Quick Win": 1,
  "Strategic Bet": 2,
  Trap: 3,
  Hobby: 4,
};

const buildPriorityNote = (priority) => {
  if (priority === "Quick Win") return "High recovery potential with minimal technical complexity. Immediate payback.";
  if (priority === "Strategic Bet") return "Substantial upside with moderate complexity. Requires defined guardrails.";
  if (priority === "Hobby") return "Low business impact. Not recommended for initial automation phases.";
  if (priority === "Trap") return "High complexity with diminishing returns. Avoid for now.";
  return "Standard repeatable workflow with measurable savings potential.";
};

function mapOpportunities(tasks = []) {
  const sorted = [...tasks].sort((a, b) => (b.metrics?.savings || 0) - (a.metrics?.savings || 0));
  return sorted.slice(0, 2).map((t) => ({
    title: t.task || "Untitled task",
    annualCost: t.metrics?.annualCost || 0,
    savings: t.metrics?.savings || 0,
    tag: t.priority || "Priority",
    reason: buildPriorityNote(t.priority),
  }));
}

function mapTasks(tasks = []) {
  const sorted = [...tasks].sort((a, b) => {
    const rankA = priorityRank[a.priority] || 99;
    const rankB = priorityRank[b.priority] || 99;
    if (rankA !== rankB) return rankA - rankB;
    return (b.metrics?.savings || 0) - (a.metrics?.savings || 0);
  });
  return sorted.map((t) => ({
    task: t.task || "Untitled task",
    role: t.role || "Owner",
    weeklyHours: t.metrics?.weeklyHours || 0,
    annualCost: t.metrics?.annualCost || 0,
    savings: t.metrics?.savings || 0,
    priority: t.priority || "",
  }));
}

function buildReportData(payload, origin) {
  const { tasks = [], totals = {}, lead = {}, matrixImage, logoUrl, meetingUrl } = payload || {};
  const weeklyHours = totals.annualHours ? totals.annualHours / 52 : 0;
  const annualHours = totals.annualHours || 0;

  let resolvedLogo = logoUrl;
  if (!resolvedLogo || !resolvedLogo.startsWith("data:")) {
    try {
      const logoPath = path.join(process.cwd(), "public/assets/va-logo-wide.png");
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        resolvedLogo = `data:image/png;base64,${logoData.toString("base64")}`;
      } else {
        // Confirmed high-quality PNG fallback
        resolvedLogo = "https://images.squarespace-cdn.com/content/v1/68be735ae1149470271397b1/ac720f0d-aaec-4804-a91d-aa90d32e7d22/VA+Wide+Lockup+White+%28geo%29.png";
      }
    } catch (e) {
      resolvedLogo = "https://images.squarespace-cdn.com/content/v1/68be735ae1149470271397b1/ac720f0d-aaec-4804-a91d-aa90d32e7d22/VA+Wide+Lockup+White+%28geo%29.png";
    }
  }

  return {
    preparedForName: [lead.firstName, lead.lastName].filter(Boolean).join(" ").trim() || "your team",
    preparedForEmail: lead.email || "",
    reportDate: new Date().toISOString(),
    logoSrc: resolvedLogo,
    currentAnnualCost: totals.annualCost || 0,
    potentialSavings: totals.savings || 0,
    weeklyHoursCaptured: weeklyHours,
    capacityReturnedWeekly: weeklyHours * 0.5,
    opportunities: mapOpportunities(tasks),
    tasks: mapTasks(tasks),
    matrixImageSrc: matrixImage || null,
    matrixCaption: "Impact vs effort portfolio view. High-payback opportunities appear in the top-right.",
    doNothingAnnualCost: totals.annualCost || 0,
    doNothingHoursPerYear: annualHours * 0.5,
    bookingUrl: meetingUrl || "https://validagenda.com/book",
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
    const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0];
    const origin = host ? `${proto}://${host}` : null;
    const data = buildReportData(payload || {}, origin);
    const qr = await makeQrDataUri(data.bookingUrl);
    data.bookingQrDataUri = qr;

    const doc = <Report data={data} />;
    const pdfBuffer = await pdf(doc).toBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Valid-Agenda-Automation-ROI-Report.pdf");
    res.status(200).send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation failed", err);
    res.status(500).json({ error: "PDF generation failed" });
  }
}
