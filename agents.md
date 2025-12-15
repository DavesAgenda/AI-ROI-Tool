## Automation ROI Tool – Working Notes

- **Purpose**: Single-page ROI calculator (`index.html`) to capture repetitive workflows, estimate time/cost, and rank automation candidates for Valid Agenda prospects.

- **Core flow**:
  - Part 1: Hero explainer + “Start adding tasks”.
  - Part 2: Workflow Inventory form collects task name, weekly frequency, minutes, hourly rate, role, pain level chips, and readiness toggles (documented, digital, repeatable, safe, approval). Saved tasks render as cards with edit/delete controls; form state is mirrored in `localStorage` (`va-roi-state`).
  - Part 3: ROI Summary table lists weekly/annual hours, annual cost, and a fixed 50% savings view per task plus totals. Bar chart visualizes current vs automated spend.
  - Part 4: Decision Matrix plots each task on a canvas (impact = annual cost, effort = readiness/pain mix) with quadrant tags: Quick Win, Strategic Bet, Hobby, Trap. Classification table mirrors the plotted priorities.
  - Lead magnet: email + consent gate to download a PDF report; “Next steps” CTA links to booking page.

- **Calculations**:
  - Weekly hours = freq * minutes / 60; annual hours = weekly * 52; annual cost = annual hours * hourly; savings = 50% of annual cost.
  - Readiness score = proportion of toggles on; effort bucket: Low (>=0.6), Medium (>=0.4), High (<0.4). Impact bucket: High if annual cost >= 20k.
  - Priority classification derives from impact/effort combos; badges set styling and matrix colors.

- **State + persistence**:
  - `state.tasks` items: `{ id, task, freq, minutes, hourly, role, pain, readiness }`.
  - Form/edit mode stored alongside tasks in `localStorage`; restored on load.
  - ID `current` used for unsaved form state; saved tasks get timestamp-based IDs.

- **Lead capture & PDF**:
  - Webhook target: `https://hooks.validagenda.dev/webhook/eb31e5cf-774c-4aa1-b914-8b5fa20be96c`.
  - On submit, validates email + consent, builds payload with tasks, totals, and metrics, then posts JSON via `fetch` (sendBeacon fallback). PDF is omitted from the beacon to stay under size limits.
  - PDF is generated client-side: draws summary cards, top tasks, and the decision matrix onto a canvas, embeds a QR to the booking URL, then triggers a download Blob. Status messaging updates the CTA button and `#lead-status`.
  - Meeting/QR URL: `https://validagenda.com/book`; logo embedded as base64 PNG within the script (also stored as `assets/va-logo-wide.png` and `assets/va-logo-circle.png`).

- **Styling**:
  - Brand variables live inline in `index.html` and mirror Valid Agenda palette; heavy CSS for cards, tables, chips, matrix, footer, and download banner.
  - `n8n form.css` is a standalone stylesheet to skin embedded n8n forms with the same typography, spacing, and button treatments.
  - `site.css` and `va.html` are Squarespace exports/reference assets; not used by the standalone ROI calculator.

- **Integration points / extension ideas**:
  - Adjust savings factor or introduce scenario sliders in `calculateTaskMetrics`.
  - Add persistence sync to a backend by extending the webhook payload or adding a secondary POST with the PDF bytes.
  - Drop-in embed by hosting `index.html` and pointing forms or CTAs to live booking URLs; swap `WEBHOOK_URL` and `MEETING_URL` as needed.
