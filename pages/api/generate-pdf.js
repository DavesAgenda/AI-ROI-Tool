import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import path from "path";
import { ReportTemplate } from "../../pdf/templates/ReportTemplate";
import { makeQrDataUri } from "../../pdf/utils/qr";

export const config = {
  maxDuration: 60, // Increase timeout for Puppeteer
};

const priorityRank = {
  "Quick Win": 1,
  "Strategic Bet": 2,
  Trap: 3,
  Hobby: 4,
  "Low Hanging Fruit": 5
};

// ... Data mapping functions (Same as before) ...
const buildPriorityNote = (priority) => {
  if (priority === "Quick Win") return "High recovery potential with minimal technical complexity. Immediate payback.";
  if (priority === "Strategic Bet") return "Substantial upside with moderate complexity. Requires defined guardrails.";
  if (priority === "Hobby") return "Low business impact. Not recommended for initial automation phases.";
  if (priority === "Trap") return "High complexity with diminishing returns. Avoid for now.";
  return "Repeatable workflow with measurable savings potential.";
};

const calculatePriority = (impactScore, viabilityScore) => {
  if (impactScore >= 50 && viabilityScore >= 50) return "Quick Win";
  if (impactScore < 50 && viabilityScore >= 50) return "Hobby";
  if (impactScore >= 50 && viabilityScore < 50) return "Strategic Bet";
  return "Trap";
};

function recalibrateTasks(tasks = []) {
  const validTasks = tasks.filter(t => t && t.task);
  const maxAnnualCost = Math.max(...validTasks.map(t => t.metrics?.annualCost || 0), 1000);

  return validTasks.map(t => {
    // Deep clone and ensure metrics exists
    const metrics = t.metrics ? { ...t.metrics } : {
      annualCost: 0,
      savings: 0,
      annualHours: 0,
      weeklyHours: 0
    };

    // Fallback for missing annualCost
    if (!metrics.annualCost && t.freq && t.minutes && t.hourly) {
      const dailyMins = parseFloat(t.freq) * parseFloat(t.minutes);
      metrics.annualHours = (dailyMins * 261) / 60;
      metrics.annualCost = metrics.annualHours * parseFloat(t.hourly);
    }

    if (!metrics.savings && metrics.annualCost) {
      metrics.savings = metrics.annualCost * 0.5;
    }

    let priority = t.priority;
    if (!priority && metrics.annualCost) {
      const impactScore = (metrics.annualCost / maxAnnualCost) * 100;
      const readiness = t.readinessScore || 0.5;
      const pain = (t.pain || 5) / 10;
      const viabilityScore = (readiness * 0.6 + pain * 0.4) * 100;
      priority = calculatePriority(impactScore, viabilityScore);
    }

    return {
      ...t,
      metrics,
      priority: priority || "Quick Win"
    };
  });
}

function mapOpportunities(tasks = []) {
  const recalibrated = recalibrateTasks(tasks);
  const sorted = [...recalibrated].sort((a, b) => (b.metrics?.savings || 0) - (a.metrics?.savings || 0));
  return sorted.slice(0, 2).map((t) => ({
    title: t.task || "Untitled task",
    annualCost: t.metrics?.annualCost || 0,
    savings: t.metrics?.savings || 0,
    tag: t.priority || "Priority",
    reason: buildPriorityNote(t.priority),
  }));
}

async function buildReportData(payload, origin) {
  const { tasks = [], totals = {}, lead = {}, matrixImage, meetingUrl } = payload || {};

  const weeklyHours = totals.annualHours ? totals.annualHours / 52 : 0;
  const annualHours = totals.annualHours || 0;

  // Resolve Dark Logo from local assets
  let resolvedLogo = null;
  try {
    const logoRelPath = "public/assets/va-logo-dark.png";
    const logoPath = path.join(process.cwd(), logoRelPath);
    if (fs.existsSync(logoPath)) {
      const logoData = fs.readFileSync(logoPath);
      // Ensure we have a valid base64 string
      resolvedLogo = `data:image/png;base64,${logoData.toString("base64")}`;
    }
  } catch (e) {
    console.warn("Failed to read local dark logo", e);
    resolvedLogo = "https://images.squarespace-cdn.com/content/v1/68be735ae1149470271397b1/ac720f0d-aaec-4804-a91d-aa90d32e7d22/VA+Wide+Lockup+White+%28geo%29.png";
  }

  // Also pass the external URL one as a fallback for the template if base64 fails (though base64 is preferred for PDF)
  // Actually, for Puppeteer with proper args, base64 images work fine.

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
    tasks: recalibrateTasks(tasks),
    matrixImageSrc: matrixImage && matrixImage.startsWith("data:") ? matrixImage : null,
    matrixCaption: "Strategic Priority Matrix. High-payback opportunities appear in the top-right.",
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
    const data = await buildReportData(payload || {});
    const qr = await makeQrDataUri(data.bookingUrl);
    data.bookingQrDataUri = qr;

    // Render React to HTML
    const reportHtml = ReactDOMServer.renderToStaticMarkup(<ReportTemplate data={data} />);

    // Wrap in full HTML document with Tailwind and Fonts
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Manrope', sans-serif; }
            /* Safe area for printing */
            @page {
                size: A4;
                margin: 0;
            }
          </style>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    brand: {
                      dark: "#134061",
                      orange: "#F48847"
                    }
                  }
                }
              }
            }
          </script>
        </head>
        <body class="bg-slate-100">
          ${reportHtml}
        </body>
      </html>
    `;

    let browser;
    // Launch logic
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      // Vercel / Production
      console.log("Environment: Vercel/Production");
      const chromium = require("@sparticuz/chromium-min");
      const puppeteer = require("puppeteer-core");

      const executablePath = await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
      );

      console.log("Puppeteer Launch Config:", {
        executablePath,
        headless: chromium.headless,
        args: chromium.args
      });

      if (!executablePath) {
        throw new Error("Chromium executablePath is null or undefined");
      }

      browser = await puppeteer.launch({
        args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      // Local Development
      console.log("Environment: Local Development");
      // Use dynamic import to avoid bundling full puppeteer in production
      // Note: 'puppeteer' is a dev dependency
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 30000 });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Valid-Agenda-Automation-ROI-Report.pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF generation failed", err);
    res.status(500).json({ error: "PDF generation failed", details: err.message });
  }
}
