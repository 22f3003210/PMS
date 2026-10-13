// ==========================================================================
// RETAIL OPERATIONS DASHBOARD CONTROLLER
// ==========================================================================

const DASHBOARD_PROJECTS = [
    { project: "Business Audit", client: "ABC Jewellers", phase: "Audit", progress: 45, risk: "medium", due: "12 Jun 2025" },
    { project: "ERP Implementation", client: "XYZ Gold", phase: "Implementation", progress: 82, risk: "low", due: "30 Jun 2025" },
    { project: "Process Re-engineering", client: "DEF Diamonds", phase: "Planning", progress: 18, risk: "high", due: "20 Jun 2025" },
    { project: "CRM Deployment", client: "GHI Ornaments", phase: "Implementation", progress: 60, risk: "medium", due: "15 Jun 2025" },
    { project: "KPI Dashboard", client: "JKL Jewellers", phase: "Monitoring", progress: 75, risk: "low", due: "25 Jun 2025" },
    { project: "Supply Chain Audit", client: "MNO Platinum", phase: "Audit", progress: 90, risk: "low", due: "05 Jun 2025" },
    { project: "Visual Merchandising SOP", client: "PQR Retail", phase: "Discovery", progress: 30, risk: "medium", due: "18 Jun 2025" }
];

const ALL_ALERTS = [
    { type: "red", text: "3 projects are delayed. Need attention." },
    { type: "orange", text: "5 tasks are overdue." },
    { type: "blue", text: "2 proposals awaiting client response." },
    { type: "yellow", text: "Resource conflict in next 7 days." },
    { type: "blue", text: "Compliance audit scheduled for showroom." },
    { type: "green", text: "Surat branch reached 100% VM compliance." }
];

const UPCOMING_MEETINGS = [
    { title: "Client Review Meeting - ABC Jewellers", time: "28 May 2025, 11:00 AM" },
    { title: "Audit Presentation - XYZ Gold", time: "29 May 2025, 03:00 PM" },
    { title: "Project Kickoff - New Client", time: "30 May 2025, 10:30 AM" },
    { title: "Financial Closing SOP Sync", time: "02 Jun 2025, 02:00 PM" },
    { title: "Artisan Ledger ERP Training", time: "04 Jun 2025, 04:30 PM" }
];

function initPlanner() {
    renderActiveProjects();
    bindDashboardEvents();
}

function renderActiveProjects() {
    const tbody = document.getElementById("dashboard-active-projects-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    
    // Only show top 5 active projects in dashboard main table view
    DASHBOARD_PROJECTS.slice(0, 5).forEach(p => {
        const tr = document.createElement("tr");
        
        let riskClass = "green-dot";
        let riskLabel = "Low";
        if (p.risk === "medium") {
            riskClass = "yellow-dot";
            riskLabel = "Medium";
        } else if (p.risk === "high") {
            riskClass = "red-dot";
            riskLabel = "High";
        }

        tr.innerHTML = `
            <td class="bold-text">${p.project}</td>
            <td>${p.client}</td>
            <td><span class="table-phase-badge">${p.phase}</span></td>
            <td>
                <div class="table-progress-container">
                    <div class="table-progress-bar blue" style="width: ${p.progress}%"></div>
                    <span class="table-progress-pct">${p.progress}%</span>
                </div>
            </td>
            <td>
                <span class="risk-indicator ${riskClass}"></span>
                <span class="risk-label">${riskLabel}</span>
            </td>
            <td>${p.due}</td>
        `;
        tbody.appendChild(tr);
    });
}

function bindDashboardEvents() {
    // 1. View All Projects Click
    const btnProjects = document.getElementById("btn-dashboard-view-projects");
    if (btnProjects) {
        btnProjects.addEventListener("click", () => {
            let listStr = "📁 ALL ENGAGED PROJECTS:\n\n";
            DASHBOARD_PROJECTS.forEach((p, idx) => {
                listStr += `${idx + 1}. ${p.project} [${p.client}] - ${p.phase} Phase (${p.progress}% Complete) - Risk: ${p.risk.toUpperCase()}\n`;
            });
            alert(listStr);
        });
    }

    // 2. View Calendar Click
    const btnCalendar = document.getElementById("btn-dashboard-view-calendar");
    if (btnCalendar) {
        btnCalendar.addEventListener("click", () => {
            let listStr = "📅 UPCOMING ACTIVITIES:\n\n";
            UPCOMING_MEETINGS.forEach((m, idx) => {
                listStr += `• ${m.title}\n  Time: ${m.time}\n\n`;
            });
            alert(listStr);
        });
    }

    // 3. View All Tasks Click -> Routes straight to the Task Hub!
    const btnTasks = document.getElementById("btn-dashboard-view-tasks");
    if (btnTasks) {
        btnTasks.addEventListener("click", () => {
            if (typeof window.switchView === "function") {
                window.switchView("dashboard-view");
            }
        });
    }

    // 4. View All Alerts Click
    const btnAlerts = document.getElementById("btn-dashboard-view-alerts");
    if (btnAlerts) {
        btnAlerts.addEventListener("click", () => {
            let listStr = "🔔 ALERTS LOG:\n\n";
            ALL_ALERTS.forEach((a, idx) => {
                const icon = a.type === "red" || a.type === "orange" || a.type === "yellow" ? "⚠️" : "ℹ️";
                listStr += `${icon} ${a.text}\n`;
            });
            alert(listStr);
        });
    }

    // Bind inline alert trigger buttons
    document.querySelectorAll(".alert-link-action").forEach((link, idx) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const alertItem = ALL_ALERTS[idx];
            if (alertItem) {
                alert(`Triggering Action for Alert:\n"${alertItem.text}"`);
            }
        });
    });
}

// Hook planner activation into global scope
window.initPlanner = initPlanner;

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    initPlanner();
});
