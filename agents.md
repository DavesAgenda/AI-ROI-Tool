# Automation ROI Tool – Product & Architecture

## 1. Product Vision: The Blueprint Machine

*   **Mission**: "Payback-first AI. No science projects."
*   **Role**: A high-friction, high-value assessment tool. It intentionally avoids "chat" interfaces to force structured thinking and commitment from the user. It is the entry point (Lead Magnet) that converts "busy work" into a "Payback Blueprint".
*   **Output**: The PDF Report is the primary product—a tangible **Payback Blueprint** (Decision Matrix + Prioritized Roadmap).

## 2. Architecture (Antigravity Refactor)

### Tech Stack
*   **Framework**: Next.js (React)
*   **Styling**: Tailwind CSS
*   **Animation**: Framer Motion
*   **PDF Generation**: Server-side approach using **Puppeteer** to render a dedicated `/print-view`. This replaces the legacy `html2canvas` client-side approach to ensure high-fidelity, vector-quality reports.

### Data Model
*   **Persistence**: `localStorage` (`va-roi-state`).
    *   **Privacy-first**: No login required. Data stays on the user's device until submission.
    *   **Resumable**: Users can leave and return without losing their inventory.
*   **State Management**: Client-side `useState` orchestrator in `Calculator.js`.

### Key Components
*   **`Calculator.js`**: The central brain. Manages state (`tasks`, `lead`), handles persistence, and orchestrates the submission flow.
*   **`TaskWizard.js`**: The "Inventory" interface. Handles structured data collection (frequency, role, pain points) and validation.
*   **`DecisionMatrix.js`**: Visual logic engine. Plots tasks on the Impact vs. Viability canvas and determines the "Quadrant" (Quick Win, Strategic Bet, Hobby, Trap).

## 3. Future Roadmap

### Phase 1: Conversion & Content Tuning
*   **Objective**: Maximize the perceived value of the PDF report.
*   **Tasks**:
    *   **PDF Finalization**: Refine content and styling to ensure it feels like a $5k consultant's report, not a generic auto-generated summary.
    *   **Copy Optimization**: Refine on-page copy to boost form completion rates and reduce drop-off.
    *   **Self-Qualification**: Add "Qualifying Questions" to the wizard (e.g., "Do you have budget approval?", "Is this process documented?") to improve lead quality.

### Phase 2: Expansion
*   **Objective**: Broaden the funnel and capture different buyer personas.
*   **Tasks**:
    *   **Complementary Calculators**: Add new pages for simple, specific calculators (e.g., "Meeting Cost Calculator", "Email Fatigue Calculator").
    *   **Resource Library**: Create a library of "Free Blueprint" resources to attract traffic.

### Phase 3: Technical Hardening & PDF Migration
*   **Objective**: Ensure production-grade reliability and output.
*   **Tasks**:
    *   **Puppeteer Migration**: Replace `html2canvas` with a server-side Puppeteer flow for "Consultant-Grade" PDFs (vector charts, selectable text, perfect typography).
    *   **Edge Case Hardening**: Mitigate layout shifts and ensure the generated PDF is perfect regardless of the number of tasks entered.
