# AURA Consulting & Transformation Web App
> **Business Consulting & Transformation Framework tailored for the Luxury Jewellery Industry**

AURA is a premium Single Page Application (SPA) designed to present and manage the 9-Phase Business Consulting & Transformation Framework. Specially calibrated for jewelry boutique chains, ateliers, and manufacturers, the app provides tools to present the framework, track client-side/internal tasks, and simulate project resourcing.

---

## 💎 Features

1. **Brand Overview / Journey Flowchart**:
   - Welcome dashboard introducing the transformation strategy.
   - Interactive, animated journey timeline linking directly to specific stages.

2. **Luxury Slide-Deck Presentation**:
   - Interactive slides summarizing each of the 9 phases.
   - Visual segregation of Client-Side Responsibilities and Internal Team Tasks.
   - Accessible keyboard controls (Left/Right Arrows, Spacebar) and custom slider indicators.

3. **Task Hub (Interactive Checklists)**:
   - Full checklist breakdown of every phase.
   - Real-time progress metrics with local storage persistence (retains checked state across page reloads).
   - Sidebar selector reflecting phase-wise progress.

4. **Resource Allocation & Budget Estimator**:
   - Dynamic simulation engine supporting different enterprise scales (Boutique, Regional Chain, Global Brand).
   - Core staffing selection controls (Transformation Lead, Retail Auditor, SOP Trainer, Operations Analyst).
   - Real-time professional fee calculations, total hours, and project duration forecasts.
   - SVG-based resource utilization metrics illustrating effort distribution.

---

## 🛠️ Technology Stack

- **Markup & Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 Custom Properties (CSS variables), Grid/Flex layouts, Keyframe animations
- **Logic**: ES6 JavaScript (Vanilla SPA view-routing, calculation engine, localStorage states)
- **Fonts**:
  - `Playfair Display` (Luxury serif for headings, branding, and numbers)
  - `Inter` (Clean, legible sans-serif for UI components, data, and checklists)

---

## 🚀 How to Run

Since the application uses pure native web technologies with zero dependencies or compile steps, you can run it immediately:

1. **Option A (Double-Click)**:
   - Open [index.html](file:///c:/Users/sayed/OneDrive/ACME-RMS/index.html) directly in any modern web browser.
   
2. **Option B (Local Dev Server)**:
   - If you prefer a live-reload server, navigate to the folder and run:
     ```bash
     npx -y browser-sync start --server --files "*.html, *.css, *.js"
     ```
   - Alternatively, open the directory in VS Code and use the **Live Server** extension.

---

## 🎨 Theme Toggle

Click the circular sun/moon action icon in the top right corner of the header navigation bar to swap between:
- **Obsidian Dark Theme**: High-contrast dark charcoal with glowing brushed champagne gold accents.
- **Ivory Light Theme**: Warm light cream with premium deep-gold trim and emerald indicators.

---

*Delivering operational clarity to high-end jewelry brands.*
