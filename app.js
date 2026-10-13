// ==========================================================================
// FRAMEWORK METHODOLOGY DATA
// ==========================================================================

const frameworkData = [
    {
        id: 1,
        title: "Lead Management",
        desc: "Initial outreach, qualification of the jewellery retail/manufacturing business, and alignment of client expectations with consulting capabilities.",
        industryDetails: "Focuses on identifying whether the lead is a retail boutique chain, a wholesale dealer, or a vertically-integrated atelier.",
        client: [],
        internal: []
    },
    {
        id: 2,
        title: "Discovery & Requirements Gathering",
        desc: "Deep-dive workshops and data collection to extract current operational metrics, challenges, and team structures.",
        industryDetails: "Gathering specific data on jewelry inventory turns, vendor sheets, design-to-shelf timelines, and security policies.",
        client: [
            "Complete Business Questionnaire detailing operational pain-points",
            "Collect Stakeholder & Business Documents (e.g., current SOPs, inventory logs)",
            "Share information on current software in use (POS, ERP, RFID track sheets)"
        ],
        internal: [
            "Review client answers and highlight discrepancies in data",
            "Conduct Induction Call with department heads (Retail, Design, Inventory)",
            "Prepare Discovery Report summarizing current-state hypotheses",
            "Establish on-site Audit Scheduling and timeline commitments"
        ]
    },
    {
        id: 3,
        title: "Business Audit",
        desc: "Rigorous observation of physical stores, manufacturing ateliers, security protocols, and inventory control processes.",
        industryDetails: "Conducting metal weight-balancing audits, loose stone tracking, vault-to-showroom security handoffs, and customer service observation.",
        client: [
            "Provide physical and digital access to core systems (ERP, POS, Vault Logs)",
            "Arrange site access for consultants (Ateliers, Showrooms, Corporate offices)",
            "Review preliminary audit findings and provide context"
        ],
        internal: [
            "Execute department-wise audit (Sales Floor, Merchandising, Back-office, Atelier)"
        ],
        special: {
            title: "Supporting Activities",
            items: [
                "Audit Task Templates (Standardized checklists for jewelry security & layouts)",
                "Evidence Repository (Secure vault photo logs, system screenshots, stock audits)",
                "Progress Dashboards (Real-time completion trackers for audit activities)"
            ]
        }
    },
    {
        id: 4,
        title: "Gap Analysis",
        desc: "Comparing the audited operational state against industry benchmarks and identifying roots of inefficiencies.",
        industryDetails: "Analyzing discrepancies in stone weight variance, gold wastage ratios during manufacturing, and long cycle times for custom designs.",
        client: [
            "Attend observation review and validation meetings",
            "Validate audit findings and operational realities",
            "Prioritize improvement areas based on business impact"
        ],
        internal: [
            "Conduct Root Cause Analysis on major gaps (e.g. inventory discrepancies, slow replenishment)",
            "Develop a Prioritization Matrix (effort vs. financial impact)",
            "Prepare strategic Recommendation Reports"
        ],
        special: {
            title: "Governance",
            items: [
                "Approval Workflow (Client sign-offs on audit findings and critical gaps)",
                "Recommendation Tracking (Maintaining status log of approved solutions)"
            ]
        }
    },
    {
        id: 5,
        title: "Project & Transformation Planning",
        desc: "Co-creating the master transformation roadmap, budgets, timelines, and establishing SOP preparation tasks.",
        industryDetails: "Defining project scopes for RFID inventory implementation, training programs for boutique advisors, and streamlining atelier supply lines.",
        client: [
            "Confirm overall Project Scope and transformation objectives",
            "Confirm prioritized recommendations to be implemented",
            "Finalize execution timelines and phased milestones",
            "Approve budget allocations for new initiatives, systems (e.g. RFID), and training"
        ],
        internal: [
            "Create detailed Project & Work Plans",
            "Define specific project deliverables per phase",
            "Establish milestones and project success metrics (KPIs)",
            "Break initiatives into workstreams and draft Standard Operating Procedures (SOPs)"
        ]
    },
    {
        id: 6,
        title: "Implementation",
        desc: "Executing the approved roadmap, rolling out updated policies, setting up new tracking tech, and aligning showrooms.",
        industryDetails: "Installing RFID scanners, deploying updated CRM clienteling techniques, and standardizing the precious metals scrap-weight ledger.",
        client: [
            "Implement approved recommendations (e.g. software rollouts, layout updates)",
            "Coordinate activities across departments (Retail managers, Atelier smiths, HR)",
            "Adopt new operational processes and policy guidelines",
            "Assign departmental Points of Contact (POCs) to lead workstreams"
        ],
        internal: [
            "Guide implementation process and troubleshoot issues",
            "Prepare detailed weekly/monthly Implementation Schedules",
            "Maintain and update the master Implementation Tracker",
            "Provide direct support and coaching to Client Department Heads"
        ]
    },
    {
        id: 7,
        title: "Change Management & Training",
        desc: "Ensuring staff adoption of the new workflows through hands-on coaching, roleplay, and structured reference manuals.",
        industryDetails: "Training showroom consultants on luxury guest-handling, vault procedures, and atelier tracking.",
        client: [
            "Ensure team members attend training sessions",
            "Follow newly established SOPs during daily operations",
            "Provide adoption feedback and highlight operational friction points"
        ],
        internal: [
            "Deliver training workshops (e.g., Luxury Clienteling, SOP Compliance, ERP Usage)",
            "Update training handbooks and references to reflect customized processes",
            "Conduct awareness and alignment sessions to build cultural buy-in"
        ]
    },
    {
        id: 8,
        title: "Performance Monitoring",
        desc: "Reviewing metrics, monitoring compliance, and ensuring that gains in efficiency and accuracy are sustained.",
        industryDetails: "Tracking inventory shrinkage, customer retention metrics, and atelier manufacturing lead times.",
        client: [
            "Participate in operational review meetings",
            "Discuss performance gaps and alignment issues frankly"
        ],
        internal: [
            "Monitor established KPIs (shrinkage rates, inventory turn, customer acquisition cost)",
            "Conduct structured Weekly & Monthly Business Reviews (WBR/MBR)",
            "Recommend continuous improvements and tweak active processes"
        ],
        special: {
            title: "Deliverables",
            items: [
                "Executive Dashboards (C-level dashboard containing KPIs, inventory accuracy, and retail sales analytics)"
            ]
        }
    },
    {
        id: 9,
        title: "Strategic Advisory (Ongoing)",
        desc: "Long-term partnership to guide the jewelry brand through market expansions, design innovations, and portfolio growth.",
        industryDetails: "Consulting on expansion to new luxury markets, multi-channel distribution networks, and laboratory-grown diamond strategies.",
        client: [
            "Schedule regular Strategic Reviews with the consulting team",
            "Discuss emerging business opportunities and market developments",
            "Prioritize future transformation initiatives"
        ],
        internal: [
            "Analyze long-term business performance and competitive standing",
            "Propose high-level strategic insights to board members",
            "Identify next-generation transformation opportunities",
            "Update long-term expansion roadmaps",
            "Provide executive decision support"
        ]
    }
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================

let activeView = "home-view";
let currentSlideIndex = 0;
window.dashboardActivePhaseIndex = 0;

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavigation();
    initPresentation();
    initDashboard();
    initJourneyMap();
    
    // Register keyboard events for Slide Deck
    document.addEventListener("keydown", handleKeyboardNav);
});

// ==========================================================================
// THEME CONTROLLER
// ==========================================================================

function initTheme() {
    const savedTheme = localStorage.getItem("aura-theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    }

    const toggleBtn = document.getElementById("theme-toggle-btn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (document.body.classList.contains("dark-theme")) {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
                localStorage.setItem("aura-theme", "light");
            } else {
                document.body.classList.remove("light-theme");
                document.body.classList.add("dark-theme");
                localStorage.setItem("aura-theme", "dark");
            }
        });
    }
}

// ==========================================================================
// SPA ROUTING
// ==========================================================================

function initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const target = btn.getAttribute("data-target");
            switchView(target);
        });
    });

    const logo = document.getElementById("nav-logo");
    if (logo) {
        logo.addEventListener("click", () => switchView("home-view"));
    }
}

function switchView(viewId) {
    if (!document.getElementById(viewId)) return;
    
    // Deactivate previous view
    const currentActiveView = document.querySelector(".app-view.active");
    if (currentActiveView) {
        currentActiveView.classList.remove("active");
    }

    // Activate new view
    const targetView = document.getElementById(viewId);
    targetView.classList.add("active");
    activeView = viewId;

    // Update Nav bar
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        if (btn.getAttribute("data-target") === viewId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // If switching to presentation/dashboard/planner, trigger their specific update logic
    if (viewId === "presentation-view") {
        renderActiveSlide();
    } else if (viewId === "dashboard-view") {
        renderDashboardPhase(dashboardActivePhaseIndex);
        updateOverallProgress();
    } else if (viewId === "planner-view") {
        if (typeof initPlanner === "function") {
            initPlanner();
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================================================
// PRESENTATION / SLIDE DECK
// ==========================================================================

function initPresentation() {
    const prevBtn = document.getElementById("prev-slide-btn");
    const nextBtn = document.getElementById("next-slide-btn");
    const dotsContainer = document.getElementById("slide-timeline-dots");

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    // Build timeline dots
    if (dotsContainer) {
        dotsContainer.innerHTML = "";
        frameworkData.forEach((phase, idx) => {
            const dot = document.createElement("button");
            dot.className = `timeline-dot ${idx === currentSlideIndex ? 'active' : ''}`;
            dot.title = `Phase ${phase.id}: ${phase.title}`;
            dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
            dot.addEventListener("click", () => {
                goToSlide(idx);
            });
            dotsContainer.appendChild(dot);
        });
    }
}

function handleKeyboardNav(e) {
    if (activeView !== "presentation-view") return;
    
    if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
    }
}

function renderActiveSlide() {
    const phase = frameworkData[currentSlideIndex];
    if (!phase) return;

    // Update slide UI numbers & labels
    document.getElementById("current-slide-num").textContent = currentSlideIndex + 1;
    document.getElementById("slide-phase-lbl").textContent = `PHASE ${phase.id}`;
    document.getElementById("slide-title").textContent = phase.title;
    document.getElementById("slide-desc").textContent = phase.desc;
    document.getElementById("slide-tag-industry").textContent = phase.industryDetails;

    // Load Lists
    const clientList = document.getElementById("slide-client-list");
    clientList.innerHTML = "";
    if (phase.client.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No formal requirements (collaborative framework support)";
        li.className = "text-muted";
        clientList.appendChild(li);
    } else {
        phase.client.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            clientList.appendChild(li);
        });
    }

    const internalList = document.getElementById("slide-internal-list");
    internalList.innerHTML = "";
    phase.internal.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        internalList.appendChild(li);
    });

    // Special items card (Supporting activities, Governance, Deliverables)
    const extraCard = document.getElementById("slide-extra-activity");
    if (phase.special) {
        extraCard.classList.remove("hide");
        let html = `<h4>${phase.special.title}</h4><ul class="slide-list">`;
        phase.special.items.forEach(item => {
            html += `<li>${item}</li>`;
        });
        html += `</ul>`;
        extraCard.innerHTML = html;
    } else {
        extraCard.classList.add("hide");
        extraCard.innerHTML = "";
    }

    // Update dots
    const dots = document.querySelectorAll(".timeline-dot");
    dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    // Slide transition animation hook
    const activeSlideCard = document.getElementById("active-slide-card");
    if (activeSlideCard) {
        activeSlideCard.style.animation = 'none';
        activeSlideCard.offsetHeight; // trigger reflow
        activeSlideCard.style.animation = null;
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderActiveSlide();
    }
}

function nextSlide() {
    if (currentSlideIndex < frameworkData.length - 1) {
        currentSlideIndex++;
        renderActiveSlide();
    }
}

function goToSlide(idx) {
    if (idx >= 0 && idx < frameworkData.length) {
        currentSlideIndex = idx;
        renderActiveSlide();
    }
}

// ==========================================================================
// METHODOLOGY DASHBOARD / TASK HUB
// ==========================================================================

function initDashboard() {
    // Generate Sidebar list
    const sidebarContainer = document.getElementById("phase-sidebar-nav");
    if (!sidebarContainer) return;

    sidebarContainer.innerHTML = "";
    frameworkData.forEach((phase, idx) => {
        const item = document.createElement("button");
        item.className = `phase-select-item ${idx === window.dashboardActivePhaseIndex ? 'active' : ''}`;
        item.setAttribute("id", `sb-phase-${idx}`);
        item.innerHTML = `
            <span class="phase-select-lbl">Phase ${phase.id}</span>
            <span class="phase-select-title">${phase.title}</span>
        `;
        item.addEventListener("click", () => {
            selectDashboardPhase(idx);
        });
        sidebarContainer.appendChild(item);
    });

    renderDashboardPhase(window.dashboardActivePhaseIndex);
    updateOverallProgress();
}

function selectDashboardPhase(idx) {
    window.dashboardActivePhaseIndex = idx;
    
    // Update active Sidebar state
    const items = document.querySelectorAll(".phase-select-item");
    items.forEach((item, index) => {
        if (index === idx) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    renderDashboardPhase(idx);
}

function renderDashboardPhase(idx) {
    const phase = frameworkData[idx];
    if (!phase) return;

    // Title / descriptions
    document.getElementById("work-phase-num").textContent = `Phase ${phase.id}`;
    document.getElementById("work-phase-title").textContent = phase.title;
    document.getElementById("work-phase-desc").textContent = phase.desc;

    // Load tasks into a unified step-wise timeline sorted by sequence number
    const unifiedList = document.getElementById("work-unified-task-list");
    if (unifiedList) {
        unifiedList.innerHTML = "";
        const allTasks = [];
        
        // Collect client tasks
        phase.client.forEach((task, taskIdx) => {
            const seqNum = getTaskSequenceNumber(phase.id, 'client', taskIdx, task);
            allTasks.push({
                phaseId: phase.id,
                type: 'client',
                taskIdx: taskIdx,
                taskText: task,
                seqNum: seqNum
            });
        });
        
        // Collect internal tasks
        phase.internal.forEach((task, taskIdx) => {
            const seqNum = getTaskSequenceNumber(phase.id, 'internal', taskIdx, task);
            allTasks.push({
                phaseId: phase.id,
                type: 'internal',
                taskIdx: taskIdx,
                taskText: task,
                seqNum: seqNum
            });
        });
        
        // Sort by sequence number numerically
        allTasks.sort((a, b) => parseInt(a.seqNum) - parseInt(b.seqNum));
        
        if (allTasks.length === 0) {
            unifiedList.innerHTML = `<div class="text-muted" style="font-size:13.5px; padding:16px 0; text-align:center;">No tasks configured for this phase.</div>`;
        } else {
            allTasks.forEach(item => {
                const card = createTaskCard(item.phaseId, item.type, item.taskIdx, item.taskText);
                unifiedList.appendChild(card);
            });
        }
    }

    // Special items (Governance, Deliverables, etc.)
    const specialSection = document.getElementById("work-governance-section");
    const specialList = document.getElementById("work-special-list");
    if (phase.special) {
        specialSection.classList.remove("hide");
        document.getElementById("work-special-title").textContent = phase.special.title;
        specialList.innerHTML = "";
        phase.special.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            specialList.appendChild(li);
        });
    } else {
        specialSection.classList.add("hide");
    }

    // Refresh phase progress metrics
    updatePhaseProgress(phase.id);
}

function getTaskSequenceNumber(phaseId, type, taskIdx, taskText) {
    const txt = taskText.toLowerCase();
    
    if (type === 'client') {
        // Specific checks for final confirmation/acknowledgement steps
        const isConfirmation = 
            taskIdx === 3 || // 4th task is always 07
            txt.includes("acknowledg") || 
            txt.includes("confirm") || 
            txt.includes("validate") || 
            txt.includes("review preliminary") || 
            txt.includes("adoption feedback") || 
            txt.includes("discuss performance gaps") || 
            txt.includes("prioritize future");
            
        if (isConfirmation) {
            return "07";
        }
        
        return (taskIdx + 1).toString().padStart(2, '0');
    } else {
        // Internal tasks
        if (taskIdx === 0) return "04";
        if (taskIdx === 1) return "05";
        if (taskIdx === 2) return "06";
        if (taskIdx === 3) return "08";
        if (taskIdx === 4) return "09";
        return (taskIdx + 4).toString().padStart(2, '0');
    }
}

function createTaskCard(phaseId, type, taskIdx, taskText) {
    const card = document.createElement("div");
    card.className = `task-item-card ${type}-task-card`;
    
    const inputKey = `aura-task-p${phaseId}-${type}-${taskIdx}`;
    const isChecked = localStorage.getItem(inputKey) === "true";
    
    // Generate description and button text based on task details
    let desc = "Collaborative workspace for data collection, documents, and progress tracking.";
    let btnText = "Open Workspace";
    
    // Custom labels for Phase 2 Client
    if (phaseId === 2 && type === 'client') {
        if (taskIdx === 0) { desc = "Provide company statistics, scale details, and select core operational pain points."; btnText = "Start Questionnaire"; }
        else if (taskIdx === 1) { desc = "Enter legal company info, list department heads, and upload active SOP/org logs."; btnText = "Open Document Forms"; }
        else if (taskIdx === 2) { desc = "Perform technical validation of current POS, ERP, CRM, and RFID systems."; btnText = "System Assessment"; }
        else if (taskIdx === 3) { desc = "Set primary transformation objectives, timelines, and budget constraints."; btnText = "Transformation Goals"; }
    }
    // Custom labels for Phase 2 Internal
    else if (phaseId === 2 && type === 'internal') {
        if (taskIdx === 0) { desc = "Review questionnaire responses, log auditor observations, and approve data."; btnText = "Review Responses"; }
        else if (taskIdx === 1) { desc = "Schedule the introductory client meeting, select heads, and set meeting links."; btnText = "Schedule Induction Call"; }
        else if (taskIdx === 2) { desc = "Generate automated discovery state hypothesis reports and download PDF summaries."; btnText = "Generate Discovery Report"; }
        else if (taskIdx === 3) { desc = "Create site visit schedules, assign auditors, and book hotel/flight details."; btnText = "Schedule Audit"; }
    }
    // Custom labels for Phase 3 Client
    else if (phaseId === 3 && type === 'client') {
        if (taskIdx === 0) { desc = "Grant digital access to POS, ERP, and vault logs."; btnText = "Access Checklist"; }
        else if (taskIdx === 1) { desc = "Coordinate site access schedules for showroom and factory floors."; btnText = "Schedule Site Access"; }
        else if (taskIdx === 2) { desc = "Acknowledge receipt of preliminary observations and submit confirmations."; btnText = "Acknowledge Findings"; }
    }
    // Custom labels for Phase 3 Internal
    else if (phaseId === 3 && type === 'internal') {
        if (taskIdx === 0) { desc = "Execute department-wise audit checklists for Sales, Inventory, and HR with photo uploads."; btnText = "Open Audit Checklist"; }
        else if (taskIdx === 1) { desc = "Maintain centralized register for logging, assigning, and tracking audit issues."; btnText = "Observation Log"; }
        else if (taskIdx === 2) { desc = "Assign drivers, schedule site visits, and coordinate field expenses."; btnText = "Travel Planning"; }
    }

    // Dynamic Icon Selection
    let iconSvg = '';
    const iconIndex = taskIdx % 6;
    if (iconIndex === 0) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`;
    } else if (iconIndex === 1) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (iconIndex === 2) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`;
    } else if (iconIndex === 3) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
    } else if (iconIndex === 4) {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`;
    } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="task-card-icon"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;
    }

    const badgeText = type === 'client' ? 'Client Task' : 'Internal Task';
    const badgeClass = `task-badge badge-${type}`;
    const seqNum = getTaskSequenceNumber(phaseId, type, taskIdx, taskText);
    
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; gap:12px; z-index: 2;">
            <span class="${badgeClass}">${badgeText}</span>
            <label class="custom-checkbox task-card-chk">
                <input type="checkbox" class="checkbox-input" data-key="${inputKey}" data-phase="${phaseId}" ${isChecked ? 'checked' : ''}>
                <span class="checkbox-box">
                    <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </span>
            </label>
        </div>
        <div class="task-card-header" style="z-index: 2; margin-top: 4px;">
            <div style="display:flex; align-items:center; gap:8px;">
                ${iconSvg}
                <h5 class="task-card-title">${taskText}</h5>
            </div>
        </div>
        <p class="task-card-desc" style="z-index: 2; margin-bottom: 4px;">${desc}</p>
        <div style="display:flex; z-index: 2; margin-top: auto;">
            <button class="btn btn-secondary btn-task-action" onclick="if (typeof openExecutionDrawer === 'function') { openExecutionDrawer(${phaseId}, '${type}', ${taskIdx}); }">${btnText}</button>
        </div>
        <span class="task-card-number">${seqNum}</span>
    `;
    
    // Listen to checkbox changes
    const input = card.querySelector(".checkbox-input");
    input.addEventListener("change", (e) => {
        localStorage.setItem(inputKey, e.target.checked);
        updatePhaseProgress(phaseId);
        updateOverallProgress();
    });
    
    return card;
}

function updatePhaseProgress(phaseId) {
    const checkboxes = document.querySelectorAll(`.checkbox-input[data-phase="${phaseId}"]`);
    const container = document.querySelector(".progress-bar-container");
    if (!container) return;

    if (checkboxes.length === 0) {
        container.innerHTML = `<div class="progress-segment filled"></div>`;
        const valEl = document.getElementById("work-phase-progress-val");
        if (valEl) valEl.textContent = "100%";
        return;
    }

    let checkedCount = 0;
    checkboxes.forEach(chk => {
        if (chk.checked) checkedCount++;
    });

    const percent = Math.round((checkedCount / checkboxes.length) * 100);
    const valEl = document.getElementById("work-phase-progress-val");
    if (valEl) valEl.textContent = `${percent}%`;

    // Render segmented progress bar partitions
    container.innerHTML = "";
    checkboxes.forEach(chk => {
        const segment = document.createElement("div");
        segment.className = "progress-segment";
        if (chk.checked) {
            segment.classList.add("filled");
        }
        container.appendChild(segment);
    });
}

function updateOverallProgress() {
    let totalTasks = 0;
    let totalChecked = 0;

    frameworkData.forEach(phase => {
        // Client tasks
        phase.client.forEach((_, idx) => {
            totalTasks++;
            if (localStorage.getItem(`aura-task-p${phase.id}-client-${idx}`) === "true") {
                totalChecked++;
            }
        });
        // Internal tasks
        phase.internal.forEach((_, idx) => {
            totalTasks++;
            if (localStorage.getItem(`aura-task-p${phase.id}-internal-${idx}`) === "true") {
                totalChecked++;
            }
        });
    });

    const overallPct = totalTasks > 0 ? Math.round((totalChecked / totalTasks) * 100) : 0;
    const badge = document.getElementById("overall-progress-badge");
    if (badge) {
        badge.textContent = `${overallPct}% Done`;
    }
}

// ==========================================================================
// HOME PAGE INTERACTIVE TIMELINE / JOURNEY MAP
// ==========================================================================

function initJourneyMap() {
    const container = document.getElementById("journey-flowchart");
    if (!container) return;

    container.innerHTML = "";
    frameworkData.forEach((phase, idx) => {
        const node = document.createElement("div");
        node.className = "flow-node";
        node.setAttribute("id", `map-node-${phase.id}`);
        node.innerHTML = `
            <span class="flow-node-num">PHASE ${phase.id}</span>
            <span class="flow-node-title">${phase.title}</span>
        `;
        node.addEventListener("click", () => {
            // Focus on this phase in the presentation and switch view
            currentSlideIndex = idx;
            switchView("presentation-view");
        });
        container.appendChild(node);
    });
}

// Expose functions globally for interactive tools
window.updateOverallProgress = updateOverallProgress;
window.updatePhaseProgress = updatePhaseProgress;
window.renderDashboardPhase = renderDashboardPhase;

