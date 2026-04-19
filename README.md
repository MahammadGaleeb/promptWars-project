# DarshanFlow — Command Center Dashboard

> An AI-powered, real-time crowd management and pilgrim experience dashboard for large-scale temple environments handling 50,000–100,000+ daily devotees.

![Dashboard Preview](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🎯 Overview

DarshanFlow is an intelligent command center dashboard that provides real-time monitoring and management of crowd flow, queue systems, facility usage, staff deployment, and safety alerts for large-scale pilgrimage venues like Tirumala Tirupati Devasthanams (TTD).

### Key Features

- **🗺️ Live Crowd Heatmap** — Real-time zone-level density visualization with color-coded alerts
- **🚪 Gate Status Monitor** — Occupancy and wait time tracking for all 11 gates (General, Priority, VIP)
- **⚡ Priority Queue System** — Fair, weighted queue management for senior citizens, pregnant women, differently abled, children, VIP, and general devotees
- **⏱️ Wait Time Trends** — Predicted vs. actual wait time charts with historical analysis
- **🚨 Active Alerts** — Auto-generated alerts for overcrowding, supply shortages, and anomalies
- **🏛️ Facility Management** — Real-time monitoring of restrooms, meals, water, parking, prasadam, and medical stations
- **📊 KPI Dashboard** — Throughput, satisfaction, density, lost person recovery, and meals served
- **👷 Staff Deployment** — Live staff role and zone assignment tracking
- **🛤️ Devotee Journey Tracker** — End-to-end pipeline from booking to exit
- **🌊 Flow Rate Monitor** — Inflow vs. outflow bar chart for capacity management

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/darshanflow-command-center.git
cd darshanflow-command-center

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at **http://localhost:3000**.

### Alternative (No Install)

Since this is a pure HTML/CSS/JS project, you can also open `index.html` directly in any modern browser — no build step required.

---

## 📁 Project Structure

```
darshanflow-command-center/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS design system (dark theme)
├── dashboard.js        # Dashboard engine (simulation, charts, live updates)
├── package.json        # Project metadata & scripts
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | Semantic HTML5 |
| **Styling** | Vanilla CSS (custom properties, grid, flexbox, animations) |
| **Logic** | Vanilla JavaScript (Canvas 2D API for charts/heatmap) |
| **Fonts** | Google Fonts (Inter, JetBrains Mono) |
| **Dev Server** | [serve](https://www.npmjs.com/package/serve) |

**Zero external dependencies** — no React, no Chart.js, no D3. Everything is built from scratch using native browser APIs for maximum performance and zero bundle overhead.

---

## 📊 Simulated Data

The dashboard runs a **live simulation** that updates every 4 seconds:

- Gate occupancy and wait times fluctuate realistically
- Crowd heatmap density shifts dynamically
- New alerts are auto-generated (queue optimizations, supply warnings, scan anomalies)
- KPIs animate smoothly between values
- Devotee counts, meal counters, and facility usage update in real-time

This simulation demonstrates how the dashboard would look connected to real IoT sensors and backend services.

---

## 🎨 Design Principles

1. **Dark Theme** — Optimized for control room / command center environments
2. **Information Density** — Maximum data visibility without clutter
3. **Accessibility** — Color-coded alerts (green → yellow → orange → red) with text labels
4. **Performance** — Canvas-based charts render at 60fps with no library overhead
5. **Responsive** — Adapts from 1920px widescreen down to tablet layouts

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Designed as an intelligent crowd management system concept for large-scale pilgrimage venues.
