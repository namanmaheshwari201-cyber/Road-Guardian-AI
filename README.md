# DriveLegal & RoadWatch: Integrated Motorist & Municipal Safety Hub

An immersive, full-stack digital safety portal designed to make Indian highways safer and legal compliance transparent. By combining server-side AI intelligence (**Google Gemini**), real-time driving telemetry analytics, interactive regional road health maps, and a comprehensive Motor Vehicle Act legal desk, this application bridges the gap between motorists, legal statutes, and municipal infrastructure preservation.

---

## 🌟 Key Application Modules

### 🚨 1. Sovereign Command Overview (Control Deck)
*   **Bento-Grid Dashboard**: A consolidated visual control center summarizing telemetry metrics, distress alerts, financial budgets, and log files.
*   **Physical Driver Simulator**: Allows real-time interactive adjustments of sudden braking incidents and speed limits to instantly recalculate driver safety compliance ratings.
*   **Log Auditor**: A continuous stream tracking security, GPS connections, and system anomalies.

### ⚖️ 2. DriveLegal AI Advisory Portal
*   **Statutory Chatbot**: Backed by a full-stack Gemini API endpoint designed to answer legal, speed limit, and safety questions regarding the **Indian Motor Vehicles (Amendment) Act**.
*   **Dynamic Fallback Engine**: Fully resilient to API limits or network issues with an embedded high-fidelity database of sections, offenses, and penalty calculations.
*   **Challan Calculator**: Interactive regional fine calculator that aggregates offenses across multiple vehicle classes (*Cars, Two-Wheelers, Heavy Vehicles*) to estimate exact legislative fines.

### 🛣️ 3. RoadWatch Asset Health Twin (Municipal Portal)
*   **Asphalt Decay Ledger**: A live geo-referenced overview tracking wear patterns, road structural health ratings, and continuous predictive maintenance forecasts.
*   **Citizen Distress Desk**: Interactive form for report submissions, damage classification (*potholes, structural wear, waterlogging*), and AI-aided report analysis.
*   **Interactive Maps**: Simulated digital-twin overlays featuring real-time rainfall, mechanical load, and traffic stresses.

### 📊 4. Safety Analytics & Trauma Guidance
*   **Statistical Analytics**: Deep comparative data visualizers using custom `Recharts` lines showing relative surface quality and expenditure records of major municipal corridors.
*   **Voice first-aid guidelines**: Interactive localized emergency voice guide to assist responders during trauma scenarios.
*   **Direct Agency Dialers**: Pre-configured emergency dispatch hotlines (National Highway Patrol — `1033`, Trauma Care — `102`/`108`).

---

## 🛠️ Technology Stack

| Layer | Technology | Key Usage |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Responsive UI render speed |
| **Styling** | Tailwind CSS v4, Lucide React | Modern dark aesthetic layout, high-contrast typography |
| **Animations**| Motion (`motion/react`) | Cinematic slide-ins and interactive state transitions |
| **Data Viz** | Recharts, D3 | High performance, fully fluid line and bar graphs |
| **Backend** | Express, tsx, Node.js | Multi-route API endpoints and server-side secret handling |
| **GenAI** | `@google/genai` TypeScript SDK | Powering the Intelligent Legal Bot and Distress Ticket Scanner |

---

## 📂 Project Directory Structure

```text
├── server.ts                  # Unified Express + Vite proxy backend server (handles all AI API requests)
├── package.json               # Modular script handlers, server bundles, and project dependencies
├── .env.example               # Documentation of necessary API keys (GEMINI_API_KEY)
├── public/                    # Static image banners and custom vehicle graphics
└── src/
    ├── App.tsx                # Layout shell featuring sidebar tab routes
    ├── index.css              # Global custom typography and Tailwind CSS configurations
    ├── types.ts               # Centralised TypeScript schema interfaces
    └── components/
        ├── CommandOverview.tsx # Master bento-grid control deck and driver simulator
        ├── DriveLegal.tsx      # Multi-state challan engine and AI legal chatbot dialogue UI
        ├── RoadWatch.tsx       # Interactive municipal twins visualizer
        ├── SafetyAnalytics.tsx # Neural road health visualizer charts and stats
        └── DisasterAid.tsx     # Trauma instructions, distress hotlines, and text-to-speech loops
