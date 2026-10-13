// ==========================================================================
// CONSULTING EXECUTION PLATFORM - INTERACTIVE DRAWER UTILITIES
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initDrawerEvents();
});

// ==========================================================================
// DRAWER STATE & NAVIGATION
// ==========================================================================

function initDrawerEvents() {
    const overlay = document.getElementById("drawer-overlay");
    const closeBtn = document.getElementById("drawer-close-btn");

    if (overlay) overlay.addEventListener("click", closeExecutionDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeExecutionDrawer);
}

window.openExecutionDrawer = function(phaseId, type, taskIdx) {
    const overlay = document.getElementById("drawer-overlay");
    const drawer = document.getElementById("execution-drawer");
    const metaLbl = document.getElementById("drawer-meta-lbl");
    const titleLbl = document.getElementById("drawer-title-lbl");
    const body = document.getElementById("drawer-body");

    if (!overlay || !drawer || !body) return;

    // Toggle wide mode for Audit Findings Dashboard View (Phase 3 Client, Task 2) and Audit Checklist (Phase 3 Internal, Task 0)
    if ((phaseId === 3 && type === 'client' && taskIdx === 2) || (phaseId === 3 && type === 'internal' && taskIdx === 0)) {
        drawer.classList.add("drawer-wide");
    } else {
        drawer.classList.remove("drawer-wide");
    }

    // Set Header Info
    const data = window.frameworkData || [];
    const phase = data.find(p => p.id === phaseId);
    const taskName = phase ? (type === 'client' ? phase.client[taskIdx] : phase.internal[taskIdx]) : '';
    
    metaLbl.textContent = `PHASE ${phaseId} - ${type.toUpperCase()}`;
    titleLbl.textContent = taskName;

    // Open Panels
    overlay.classList.add("active");
    drawer.classList.add("active");

    // Render Dynamic Tool Utility
    body.innerHTML = "";
    renderTool(phaseId, type, taskIdx, body);
};

window.closeExecutionDrawer = function() {
    const overlay = document.getElementById("drawer-overlay");
    const drawer = document.getElementById("execution-drawer");
    
    if (overlay) overlay.classList.remove("active");
    if (drawer) {
        drawer.classList.remove("active");
        drawer.classList.remove("drawer-wide");
    }
};

function markTaskComplete(phaseId, type, taskIdx) {
    const inputKey = `aura-task-p${phaseId}-${type}-${taskIdx}`;
    localStorage.setItem(inputKey, "true");

    // Trigger UI recalculations & updates
    if (typeof window.updateOverallProgress === "function") {
        window.updateOverallProgress();
    }
    if (typeof window.updatePhaseProgress === "function") {
        window.updatePhaseProgress(phaseId);
    }
    if (typeof window.renderDashboardPhase === "function" && typeof window.dashboardActivePhaseIndex !== "undefined") {
        window.renderDashboardPhase(window.dashboardActivePhaseIndex);
    }
}

// ==========================================================================
// TOOL WORKSPACE ROUTER
// ==========================================================================

function renderTool(phaseId, type, taskIdx, container) {
    // Phase 2 Client
    if (phaseId === 2 && type === 'client') {
        if (taskIdx === 0) renderBusinessQuestionnaire(container);
        else if (taskIdx === 1) renderStakeholderDocuments(container);
        else if (taskIdx === 2) renderTechnicalAssessment(container);
        else if (taskIdx === 3) renderTransformationGoals(container);
    }
    // Phase 2 Internal
    else if (phaseId === 2 && type === 'internal') {
        if (taskIdx === 0) renderReviewResponses(container);
        else if (taskIdx === 1) renderScheduleInduction(container);
        else if (taskIdx === 2) renderGenerateDiscoveryReport(container);
        else if (taskIdx === 3) renderScheduleAudit(container);
    }
    // Phase 3 Client
    else if (phaseId === 3 && type === 'client') {
        if (taskIdx === 0) renderProvideAccess(container);
        else if (taskIdx === 2) renderAcknowledgeFindings(container);
    }
    // Phase 3 Internal
    else if (phaseId === 3 && type === 'internal') {
        if (taskIdx === 0) renderDepartmentAuditChecklist(container);
        else if (taskIdx === 1) renderObservationRegister(container);
        else if (taskIdx === 2) renderInternalTravelPlanning(container);
    }
    // Reusable Fallback Workspace for other phases (1, 4, 5, 6, 7, 8, 9)
    else {
        renderFallbackWorkspace(phaseId, type, taskIdx, container);
    }
}

// ==========================================================================
// bespoke TOOL 2.1: BUSINESS QUESTIONNAIRE (WIZARD)
// ==========================================================================

function renderBusinessQuestionnaire(container) {
    // Generate markup for a 5-step wizard
    container.innerHTML = `
        <div class="wizard-progress">
            <div class="wizard-step-node active" data-step="1">1</div>
            <div class="wizard-step-node" data-step="2">2</div>
            <div class="wizard-step-node" data-step="3">3</div>
            <div class="wizard-step-node" data-step="4">4</div>
            <div class="wizard-step-node" data-step="5">5</div>
        </div>

        <form id="tool-questionnaire-form" onsubmit="event.preventDefault();">
            <!-- Step 1: Biz Info -->
            <div class="wizard-section active" data-step="1">
                <h4 class="wizard-section-title">Section 1: General Business Information</h4>
                <div class="form-grid">
                    <div class="form-group-full">
                        <label class="form-label">Jewellery Company Name</label>
                        <input type="text" class="form-control" id="q-comp-name" placeholder="e.g. Diamond Atelier">
                    </div>
                    <div>
                        <label class="form-label">Head Office Location (City)</label>
                        <input type="text" class="form-control" id="q-ho-location" placeholder="e.g. Mumbai, Delhi">
                    </div>
                    <div>
                        <label class="form-label">Boutique / Showroom Count</label>
                        <input type="number" class="form-control" id="q-branches" placeholder="e.g. 5">
                    </div>
                    <div class="form-group-full" id="branch-tags-container">
                        <label class="form-label">🗺️ Boutique & Atelier Branch Locations</label>
                        <div class="tags-input-container">
                            <div class="tags-list" id="selected-branch-tags"></div>
                            <input type="text" class="tag-search-input" id="branch-city-search" placeholder="Type city name to search & select (e.g. Mumbai, Jaipur)..." autocomplete="off">
                            <div class="search-suggestions-dropdown hide" id="branch-suggestions-dropdown"></div>
                        </div>
                    </div>
                    <div>
                        <label class="form-label">Headcount / Employees</label>
                        <input type="number" class="form-control" id="q-employees" placeholder="e.g. 150">
                    </div>
                    <div>
                        <label class="form-label">Annual Revenue Bracket (INR)</label>
                        <select class="form-control" id="q-revenue">
                            <option value="">Select Range...</option>
                            <option value="0-50">₹0 - ₹50 Crores</option>
                            <option value="50-100">₹50 Crore - ₹100 Crores</option>
                            <option value="100-300">₹100 Crore - ₹300 Crores</option>
                            <option value="300-500">₹300 Crore - ₹500 Crores</option>
                            <option value="500+">Above ₹500 Crores</option>
                        </select>
                    </div>
                    <div class="form-group-full">
                        <label class="form-label">Primary Business Model</label>
                        <select class="form-control" id="q-model">
                            <option value="retail">Pure Retailer</option>
                            <option value="atelier">Retail + Custom Atelier</option>
                            <option value="manufacturer">Vertically Integrated Manufacturer</option>
                            <option value="wholesale">Wholesale Trader</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Step 2: Pain Points Multi-select -->
            <div class="wizard-section" data-step="2">
                <h4 class="wizard-section-title">Section 2: Core Operational Pain Points</h4>
                <p class="form-helper" style="margin-bottom:12px;">Select all areas where your brand experiences operational friction or losses:</p>
                <div class="form-multiselect-grid">
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Inventory"><span>Inventory</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Sales"><span>Sales</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Manufacturing"><span>Manufacturing</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="CRM"><span>CRM</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="HR"><span>HR</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Finance"><span>Finance</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Marketing"><span>Marketing</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Procurement"><span>Procurement</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-pain" value="Reporting"><span>Reporting</span></label>
                </div>
                <div style="margin-top: 16px;">
                    <label class="form-label">Other Specific Pain Areas</label>
                    <textarea class="form-control" id="q-pain-other" placeholder="e.g. Custom order tracking delays, designer-craftsman handoffs..."></textarea>
                </div>
            </div>

            <!-- Step 3: Current Challenges -->
            <div class="wizard-section" data-step="3">
                <h4 class="wizard-section-title">Section 3: Primary Challenges</h4>
                <div>
                    <label class="form-label">Describe your biggest operational challenge</label>
                    <textarea class="form-control" id="q-challenge-text" style="min-height: 180px;" placeholder="Describe how metal weight variance, inventory reconciliation, or sales tracking issues affect your daily workflow..."></textarea>
                </div>
            </div>

            <!-- Step 4: Priorities Sortable -->
            <div class="wizard-section" data-step="4">
                <h4 class="wizard-section-title">Section 4: Strategic Priorities</h4>
                <p class="form-helper" style="margin-bottom:12px;">Order your primary focus areas from highest priority to lowest priority using the control arrows:</p>
                <div class="sortable-list" id="q-priority-list">
                    <div class="sort-item" data-val="High-Value Stock Custody & Control">
                        <span>📦 High-Value Stock Custody & Control</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Inventory Optimization">
                        <span>📊 Inventory Optimization</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="ERP & RFID Implementation">
                        <span>🛰️ ERP & RFID Implementation</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Sales & Clienteling Excellence">
                        <span>💎 Sales & Clienteling Excellence</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Profitability & Margin Improvement">
                        <span>💰 Profitability & Margin Improvement</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Order & Repair Management">
                        <span>🏭 Order & Repair Management</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Procurement & Vendor Management">
                        <span>🤝 Procurement & Vendor Management</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Customer Experience & Retention">
                        <span>❤️ Customer Experience & Retention</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Marketing & Brand Growth">
                        <span>📢 Marketing & Brand Growth</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Employee Performance & Training">
                        <span>👥 Employee Performance & Training</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Process Automation & SOP Standardization">
                        <span>⚙️ Process Automation & SOP Standardization</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Business Intelligence & Dashboards">
                        <span>📈 Business Intelligence & Dashboards</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Compliance & Risk Management">
                        <span>🛡️ Compliance & Risk Management</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Retail Operations Excellence">
                        <span>🏬 Retail Operations Excellence</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Business Expansion & Scalability">
                        <span>🚀 Business Expansion & Scalability</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                    <div class="sort-item" data-val="Leadership, Governance & Founder Independence">
                        <span>👑 Leadership, Governance & Founder Independence</span>
                        <div class="sort-item-handles">
                            <button type="button" class="btn-sort-move btn-move-up">▲</button>
                            <button type="button" class="btn-sort-move btn-move-down">▼</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Step 5: Outcomes -->
            <div class="wizard-section" data-step="5">
                <h4 class="wizard-section-title">Section 5: Expected Transformation Outcomes</h4>
                <div class="form-multiselect-grid">
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="Reduce Inventory Leakage"><span>Minimise Stock Shrinkage & Metal Leakage</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="Increase Sales Conversion"><span>Boost Showroom Conversion & Average Bill Value (ABV)</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="Live Stock Reporting"><span>Real-time Showroom & Stock Ledger Reconciliation</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="Atelier ERP Rollout"><span>Atelier Digitization & Job Card Weight-Tracking</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="SOP Standardization"><span>Standardise Showroom & Vault Operations Compliance</span></label>
                    <label class="custom-checkbox"><input type="checkbox" class="q-outcomes" value="Cost Optimization"><span>Reduce Metal Melting & Handcrafting Wastage</span></label>
                </div>
            </div>

            <!-- Buttons -->
            <div class="wizard-footer">
                <button type="button" class="btn btn-secondary btn-sm" id="wizard-prev-btn" style="visibility: hidden;">Back</button>
                <button type="button" class="btn btn-primary btn-sm" id="wizard-next-btn">Next</button>
            </div>
        </form>
    `;

    // Wizard navigation state
    let currentStep = 1;
    let selectedCities = [];

    const citiesOfIndia = [
        "Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Surat", 
        "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", 
        "Coimbatore", "Agra", "Madurai", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", 
        "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Jabalpur", "Gwalior", 
        "Vijayawada", "Jodhpur", "Raipur", "Kota", "Guwahati", "Chandigarh", "Mysore", "Kochi", "Dehradun", 
        "Jamshedpur", "Bhubaneswar", "Trichy", "Mangalore", "Udaipur", "Goa", "Noida", "Gurugram",
        "Eluru", "Guntur", "Nellore", "Kakinada", "Rajahmundry", "Kurnool", "Anantapur", "Kadapa", "Tirupati",
        "Vizianagaram", "Srikakulam", "Thrissur", "Kollam", "Kozhikode", "Palakkad", "Alappuzha", "Kottayam",
        "Kannur", "Salem", "Tiruppur", "Erode", "Vellore", "Tirunelveli", "Thoothukudi", "Nagercoil", "Shimla",
        "Mandi", "Dharamshala", "Solan", "Rohtak", "Panipat", "Karnal", "Ambala", "Yamunanagar", "Hisar",
        "Sonipat", "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Jammu", "Udhampur", "Anantnag",
        "Baramulla", "Kathua", "Samba", "Poonch", "Rourkela", "Cuttack", "Puri", "Sambalpur", "Balasore",
        "Bhadrak", "Baripada", "Jharsuguda", "Jalandhar", "Amritsar", "Patiala", "Bathinda", "Mohali", 
        "Hoshiarpur", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna"
    ];

    function renderSelectedTags() {
        const listDiv = document.getElementById("selected-branch-tags");
        if (!listDiv) return;
        listDiv.innerHTML = "";
        selectedCities.forEach(city => {
            const tag = document.createElement("div");
            tag.className = "tag-item";
            tag.innerHTML = `
                <span>${city}</span>
                <span class="tag-item-remove" data-city="${city}">&times;</span>
            `;
            listDiv.appendChild(tag);
        });
    }

    // Load saved data if present
    loadQuestionnaireData();

    // Event Bindings
    const nextBtn = document.getElementById("wizard-next-btn");
    const prevBtn = document.getElementById("wizard-prev-btn");
    const form = document.getElementById("tool-questionnaire-form");
    const searchInput = document.getElementById("branch-city-search");
    const dropdown = document.getElementById("branch-suggestions-dropdown");
    const tagsListDiv = document.getElementById("selected-branch-tags");

    if (searchInput && dropdown) {
        searchInput.addEventListener("input", (e) => {
            const rawVal = e.target.value.trim();
            const query = rawVal.toLowerCase();
            if (!query) {
                dropdown.classList.add("hide");
                return;
            }

            const matches = citiesOfIndia.filter(c => 
                c.toLowerCase().includes(query) && !selectedCities.includes(c)
            );

            dropdown.innerHTML = "";
            dropdown.classList.remove("hide");

            // Dynamic Option: Add custom location entered by user
            const customTitle = rawVal.charAt(0).toUpperCase() + rawVal.slice(1);
            if (!selectedCities.includes(customTitle)) {
                const addCustomItem = document.createElement("div");
                addCustomItem.className = "suggestion-item";
                addCustomItem.style.fontWeight = "bold";
                addCustomItem.style.borderBottom = "1px solid var(--border-color)";
                addCustomItem.innerHTML = `➕ Add Custom Location: "${customTitle}"`;
                addCustomItem.addEventListener("click", () => {
                    selectedCities.push(customTitle);
                    renderSelectedTags();
                    searchInput.value = "";
                    dropdown.classList.add("hide");
                });
                dropdown.appendChild(addCustomItem);
            }

            // Options: Pre-defined city database matches
            matches.slice(0, 8).forEach(match => {
                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.textContent = match;
                item.addEventListener("click", () => {
                    selectedCities.push(match);
                    renderSelectedTags();
                    searchInput.value = "";
                    dropdown.classList.add("hide");
                });
                dropdown.appendChild(item);
            });
        });

        // Add support for ENTER key to save custom location instantly
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const rawVal = searchInput.value.trim();
                if (rawVal) {
                    const customTitle = rawVal.charAt(0).toUpperCase() + rawVal.slice(1);
                    if (!selectedCities.includes(customTitle)) {
                        selectedCities.push(customTitle);
                        renderSelectedTags();
                    }
                    searchInput.value = "";
                    dropdown.classList.add("hide");
                }
            }
        });

        // Click outside closes suggestion box
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#branch-tags-container")) {
                dropdown.classList.add("hide");
            }
        });

        // Remove tag handler
        if (tagsListDiv) {
            tagsListDiv.addEventListener("click", (e) => {
                if (e.target.classList.contains("tag-item-remove")) {
                    const cityToRemove = e.target.getAttribute("data-city");
                    selectedCities = selectedCities.filter(c => c !== cityToRemove);
                    renderSelectedTags();
                }
            });
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentStep < 5) {
                currentStep++;
                toggleWizardStep(currentStep);
            } else {
                saveQuestionnaireData();
                markTaskComplete(2, 'client', 0);
                alert("Business Questionnaire Submitted Successfully!");
                closeExecutionDrawer();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentStep > 1) {
                currentStep--;
                toggleWizardStep(currentStep);
            }
        });
    }

    // Bind arrows for Priority sorting list
    const list = document.getElementById("q-priority-list");
    if (list) {
        list.addEventListener("click", (e) => {
            const item = e.target.closest(".sort-item");
            if (!item) return;

            if (e.target.classList.contains("btn-move-up")) {
                const prev = item.previousElementSibling;
                if (prev) list.insertBefore(item, prev);
            } else if (e.target.classList.contains("btn-move-down")) {
                const next = item.nextElementSibling;
                if (next) list.insertBefore(next, item);
            }
        });
    }

    function toggleWizardStep(step) {
        // Sections
        document.querySelectorAll(".wizard-section").forEach(sec => {
            sec.classList.remove("active");
            if (parseInt(sec.getAttribute("data-step")) === step) {
                sec.classList.add("active");
            }
        });

        // Step nodes
        document.querySelectorAll(".wizard-step-node").forEach(node => {
            const nodeStep = parseInt(node.getAttribute("data-step"));
            node.classList.remove("active", "completed");
            if (nodeStep === step) {
                node.classList.add("active");
            } else if (nodeStep < step) {
                node.classList.add("completed");
            }
        });

        // Navigation button configurations
        prevBtn.style.visibility = step === 1 ? "hidden" : "visible";
        nextBtn.textContent = step === 5 ? "Submit" : "Next";
    }

    function saveQuestionnaireData() {
        const data = {
            name: document.getElementById("q-comp-name").value,
            hoLocation: document.getElementById("q-ho-location").value,
            branches: document.getElementById("q-branches").value,
            branchLocations: selectedCities,
            employees: document.getElementById("q-employees").value,
            revenue: document.getElementById("q-revenue").value,
            model: document.getElementById("q-model").value,
            painpoints: Array.from(document.querySelectorAll(".q-pain:checked")).map(el => el.value),
            painOther: document.getElementById("q-pain-other").value,
            challenge: document.getElementById("q-challenge-text").value,
            priorities: Array.from(document.querySelectorAll(".sort-item")).map(el => el.getAttribute("data-val")),
            outcomes: Array.from(document.querySelectorAll(".q-outcomes:checked")).map(el => el.value),
            submitted: true
        };
        localStorage.setItem("aura-data-questionnaire", JSON.stringify(data));
    }

    function loadQuestionnaireData() {
        const raw = localStorage.getItem("aura-data-questionnaire");
        if (!raw) return;
        
        try {
            const data = JSON.parse(raw);
            document.getElementById("q-comp-name").value = data.name || "";
            document.getElementById("q-ho-location").value = data.hoLocation || "";
            document.getElementById("q-branches").value = data.branches || "";
            
            if (data.branchLocations) {
                if (Array.isArray(data.branchLocations)) {
                    selectedCities = data.branchLocations;
                } else {
                    selectedCities = data.branchLocations.split(",").map(c => c.trim()).filter(Boolean);
                }
            } else {
                selectedCities = [];
            }
            renderSelectedTags();

            document.getElementById("q-employees").value = data.employees || "";
            document.getElementById("q-revenue").value = data.revenue || "";
            document.getElementById("q-model").value = data.model || "";
            document.getElementById("q-pain-other").value = data.painOther || "";
            document.getElementById("q-challenge-text").value = data.challenge || "";

            // Check checkboxes
            if (data.painpoints) {
                document.querySelectorAll(".q-pain").forEach(el => {
                    if (data.painpoints.includes(el.value)) el.checked = true;
                });
            }
            if (data.outcomes) {
                document.querySelectorAll(".q-outcomes").forEach(el => {
                    if (data.outcomes.includes(el.value)) el.checked = true;
                });
            }

            // Restore sorted priorities
            if (data.priorities) {
                const list = document.getElementById("q-priority-list");
                const items = Array.from(document.querySelectorAll(".sort-item"));
                
                // Only clear and re-append if stored priorities match current options
                const validStored = data.priorities.filter(val => items.some(item => item.getAttribute("data-val") === val));
                if (validStored.length > 0) {
                    list.innerHTML = "";
                    // Append matched items in stored order
                    validStored.forEach(val => {
                        const match = items.find(item => item.getAttribute("data-val") === val);
                        if (match) list.appendChild(match);
                    });
                    // Append any new items that weren't in the stored priorities list
                    items.forEach(item => {
                        if (!validStored.includes(item.getAttribute("data-val"))) {
                            list.appendChild(item);
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Failed to parse saved questionnaire:", e);
        }
    }
}

// ==========================================================================
// bespoke TOOL 2.2: STAKEHOLDER & BUSINESS DOCUMENTS
// ==========================================================================

function renderStakeholderDocuments(container) {
    container.innerHTML = `
        <form id="tool-docs-form" onsubmit="event.preventDefault();">
            <h4 class="form-label" style="font-size:14px; margin-bottom:16px;">Corporate Profile Registry</h4>
            
            <div class="form-grid" style="margin-bottom: 24px;">
                <div class="form-group-full">
                    <label class="form-label">Legal Entity Name</label>
                    <input type="text" class="form-control" id="doc-legal-name" placeholder="e.g. Tiffany & Co. India Private Ltd">
                </div>
                <div>
                    <label class="form-label">GSTIN No.</label>
                    <input type="text" class="form-control" id="doc-gst" placeholder="e.g. 07AAAAA1111A1Z1">
                </div>
                <div>
                    <label class="form-label">CIN No. (Corporate ID)</label>
                    <input type="text" class="form-control" id="doc-cin" placeholder="e.g. U12345DL2020PTC123456">
                </div>
            </div>

            <!-- Dynamic Table: Department Heads -->
            <h4 class="form-label" style="font-size:14px; margin-bottom:12px;">Executive Department Leads</h4>
            <div class="dynamic-table-container" style="margin-bottom: 24px;">
                <table class="dynamic-table" id="heads-table">
                    <thead>
                        <tr>
                            <th>Contact Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Email Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="heads-table-body">
                        <!-- Added dynamically -->
                    </tbody>
                </table>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-add-head-row" style="margin-bottom:24px;">+ Add Team Member</button>

            <!-- Document Upload Simulator -->
            <h4 class="form-label" style="font-size:14px; margin-bottom:12px;">Vault Document Uploads</h4>
            <div class="upload-zone" id="doc-upload-zone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div class="upload-text">Select Document to Upload</div>
                <div class="upload-hint">Upload company profile, active SOP manuals, stock balance sheets, or structural logs.</div>
            </div>
            
            <div class="uploaded-files-list" id="uploaded-files-container">
                <!-- Logged files -->
            </div>

            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-docs">Save Registry</button>
            </div>
        </form>
    `;

    // Dynamic Row controls
    const addRowBtn = document.getElementById("btn-add-head-row");
    const tbody = document.getElementById("heads-table-body");
    
    if (addRowBtn && tbody) {
        addRowBtn.addEventListener("click", () => {
            addHeadRow("", "", "", "");
        });
    }

    // Mock Upload Controller
    const uploadZone = document.getElementById("doc-upload-zone");
    const filesContainer = document.getElementById("uploaded-files-container");
    let uploadedFiles = [];

    if (uploadZone) {
        uploadZone.addEventListener("click", () => {
            const files = ["gst_cert.pdf", "sop_manual_v2.docx", "org_chart_2026.pdf", "q1_inventory_report.xlsx", "profit_loss_summary.pdf"];
            const randomFile = files[Math.floor(Math.random() * files.length)];
            
            if (!uploadedFiles.includes(randomFile)) {
                uploadedFiles.push(randomFile);
                renderUploadedFiles();
            }
        });
    }

    // Save Action
    const saveBtn = document.getElementById("btn-save-docs");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            saveDocsData();
            markTaskComplete(2, 'client', 1);
            alert("Business Information & Registry Saved!");
            closeExecutionDrawer();
        });
    }

    // Initial Loading
    loadDocsData();

    function addHeadRow(name, dept, desg, email) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="text" class="form-control cell-name" value="${name}" placeholder="e.g. Sarah"></td>
            <td>
                <select class="form-control cell-dept">
                    <option value="Retail" ${dept==='Retail'?'selected':''}>Retail Retail</option>
                    <option value="Atelier" ${dept==='Atelier'?'selected':''}>Atelier Operations</option>
                    <option value="Finance" ${dept==='Finance'?'selected':''}>Finance</option>
                    <option value="HR" ${dept==='HR'?'selected':''}>HR & Training</option>
                </select>
            </td>
            <td><input type="text" class="form-control cell-desg" value="${desg}" placeholder="e.g. Manager"></td>
            <td><input type="email" class="form-control cell-email" value="${email}" placeholder="e.g. name@co.com"></td>
            <td>
                <button type="button" class="btn-delete-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px; height:16px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </td>
        `;

        tr.querySelector(".btn-delete-row").addEventListener("click", () => {
            tr.remove();
        });

        tbody.appendChild(tr);
    }

    function renderUploadedFiles() {
        if (!filesContainer) return;
        filesContainer.innerHTML = "";
        
        uploadedFiles.forEach(file => {
            const row = document.createElement("div");
            row.className = "uploaded-file-row";
            row.innerHTML = `
                <div class="file-name-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="file-doc-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span>${file}</span>
                </div>
                <button type="button" class="btn-remove-file" data-file="${file}">&times;</button>
            `;
            
            row.querySelector(".btn-remove-file").addEventListener("click", () => {
                uploadedFiles = uploadedFiles.filter(f => f !== file);
                renderUploadedFiles();
            });

            filesContainer.appendChild(row);
        });
    }

    function saveDocsData() {
        const rows = document.querySelectorAll("#heads-table-body tr");
        const contacts = Array.from(rows).map(row => ({
            name: row.querySelector(".cell-name").value,
            dept: row.querySelector(".cell-dept").value,
            desg: row.querySelector(".cell-desg").value,
            email: row.querySelector(".cell-email").value
        }));

        const data = {
            legalName: document.getElementById("doc-legal-name").value,
            gst: document.getElementById("doc-gst").value,
            cin: document.getElementById("doc-cin").value,
            contacts: contacts,
            files: uploadedFiles
        };

        localStorage.setItem("aura-data-docs", JSON.stringify(data));
    }

    function loadDocsData() {
        const raw = localStorage.getItem("aura-data-docs");
        if (!raw) {
            // Add a default head row for convenience
            addHeadRow("", "", "", "");
            return;
        }

        try {
            const data = JSON.parse(raw);
            document.getElementById("doc-legal-name").value = data.legalName || "";
            document.getElementById("doc-gst").value = data.gst || "";
            document.getElementById("doc-cin").value = data.cin || "";
            
            if (data.contacts && data.contacts.length > 0) {
                tbody.innerHTML = "";
                data.contacts.forEach(c => addHeadRow(c.name, c.dept, c.desg, c.email));
            } else {
                addHeadRow("", "", "", "");
            }

            if (data.files) {
                uploadedFiles = data.files;
                renderUploadedFiles();
            }
        } catch (e) {
            console.error("Failed to load documents data:", e);
        }
    }
}

// ==========================================================================
// bespoke TOOL 2.3: TECHNICAL SYSTEM ASSESSMENT
// ==========================================================================

function renderTechnicalAssessment(container) {
    const modules = ["POS", "ERP", "CRM", "RFID", "Atelier Ledger", "Accounting"];
    
    let html = `
        <form id="tool-tech-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Technical System Assessment Form</h4>
            <p class="form-helper" style="margin-top:-10px;">Select which software channels are currently implemented in your business and document integration states:</p>
    `;

    modules.forEach((mod, idx) => {
        const isChecked = localStorage.getItem(`aura-tech-has-${mod}`) === "true";
        const cloudVal = localStorage.getItem(`aura-tech-cloud-${mod}`) || "unknown";
        const apiVal = localStorage.getItem(`aura-tech-api-${mod}`) || "unknown";
        const vendorVal = localStorage.getItem(`aura-tech-vendor-${mod}`) || "";

        html += `
            <div class="audit-topic-card">
                <div class="audit-topic-header">
                    <label class="custom-checkbox" style="font-weight:600;">
                        <input type="checkbox" class="tech-module-chk" data-module="${mod}" ${isChecked ? 'checked' : ''}>
                        <span>${mod} Integration</span>
                    </label>
                </div>
                
                <div class="tech-details-container form-grid ${isChecked ? '' : 'hide'}" id="tech-details-${idx}">
                    <div class="form-group-full">
                        <label class="form-label">Software Vendor / System Name</label>
                        <input type="text" class="form-control tech-vendor" data-module="${mod}" value="${vendorVal}" placeholder="e.g. SAP Business One, TallyPrime...">
                    </div>
                    <div>
                        <label class="form-label">Hosting Strategy</label>
                        <select class="form-control tech-cloud" data-module="${mod}">
                            <option value="cloud" ${cloudVal==='cloud'?'selected':''}>Cloud Hosting</option>
                            <option value="onpremise" ${cloudVal==='onpremise'?'selected':''}>On-Premise Server</option>
                            <option value="unknown" ${cloudVal==='unknown'?'selected':''}>Not Sure</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label">API Connectivity</label>
                        <select class="form-control tech-api" data-module="${mod}">
                            <option value="yes" ${apiVal==='yes'?'selected':''}>Rest API Available</option>
                            <option value="no" ${apiVal==='no'?'selected':''}>No Integrations</option>
                            <option value="unknown" ${apiVal==='unknown'?'selected':''}>Not Sure</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-tech">Save Tech Audit</button>
            </div>
        </form>
    `;

    container.innerHTML = html;

    // Expand collapse toggles
    document.querySelectorAll(".tech-module-chk").forEach((chk, idx) => {
        chk.addEventListener("change", (e) => {
            const detailBox = document.getElementById(`tech-details-${idx}`);
            if (e.target.checked) {
                detailBox.classList.remove("hide");
            } else {
                detailBox.classList.add("hide");
            }
        });
    });

    const saveBtn = document.getElementById("btn-save-tech");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            document.querySelectorAll(".tech-module-chk").forEach(chk => {
                const mod = chk.getAttribute("data-module");
                localStorage.setItem(`aura-tech-has-${mod}`, chk.checked);
            });

            document.querySelectorAll(".tech-vendor").forEach(el => {
                const mod = el.getAttribute("data-module");
                localStorage.setItem(`aura-tech-vendor-${mod}`, el.value);
            });

            document.querySelectorAll(".tech-cloud").forEach(el => {
                const mod = el.getAttribute("data-module");
                localStorage.setItem(`aura-tech-cloud-${mod}`, el.value);
            });

            document.querySelectorAll(".tech-api").forEach(el => {
                const mod = el.getAttribute("data-module");
                localStorage.setItem(`aura-tech-api-${mod}`, el.value);
            });

            markTaskComplete(2, 'client', 2);
            alert("Technical System Assessment Parameters Stored!");
            closeExecutionDrawer();
        });
    }
}

// ==========================================================================
// bespoke TOOL 2.4: TRANSFORMATION GOALS
// ==========================================================================

function renderTransformationGoals(container) {
    const savedGoal = localStorage.getItem("aura-goal-primary") || "digital";
    const savedTimeline = localStorage.getItem("aura-goal-timeline") || "12";
    const savedBudget = localStorage.getItem("aura-goal-budget") || "medium";
    const savedSlider = localStorage.getItem("aura-goal-readiness") || "50";

    container.innerHTML = `
        <form id="tool-goals-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Business Objectives & Transformation Scope</h4>
            
            <div>
                <label class="form-label">Primary Transformation Goal</label>
                <select class="form-control" id="goal-primary">
                    <option value="digital" ${savedGoal==='digital'?'selected':''}>RFID & ERP Digitization</option>
                    <option value="retail" ${savedGoal==='retail'?'selected':''}>Boutique Retail Restructuring</option>
                    <option value="atelier" ${savedGoal==='atelier'?'selected':''}>Atelier Operations & Scrap control</option>
                    <option value="scale" ${savedGoal==='scale'?'selected':''}>Rapid Market Expansion</option>
                </select>
            </div>

            <div>
                <label class="form-label">Target Completion Timeline</label>
                <select class="form-control" id="goal-timeline">
                    <option value="3" ${savedTimeline==='3'?'selected':''}>Short Phase: 3 Months</option>
                    <option value="6" ${savedTimeline==='6'?'selected':''}>Quick Phase: 6 Months</option>
                    <option value="12" ${savedTimeline==='12'?'selected':''}>Mid Term: 12 Months</option>
                    <option value="18" ${savedTimeline==='18'?'selected':''}>Long Term Transformation: 18 Months</option>
                </select>
            </div>

            <div>
                <label class="form-label">Budget Range (INR)</label>
                <select class="form-control" id="goal-budget">
                    <option value="low" ${savedBudget==='low'?'selected':''}>Boutique / Atelier Level (< ₹10L)</option>
                    <option value="medium" ${savedBudget==='medium'?'selected':''}>Mid-Market Scale (₹10L - ₹25L)</option>
                    <option value="high" ${savedBudget==='high'?'selected':''}>Enterprise Expansion (₹25L - ₹50L+)</option>
                </select>
            </div>

            <div>
                <label class="form-label">Internal Implementation Readiness</label>
                <div class="range-slider-container">
                    <input type="range" class="range-slider" id="goal-readiness" min="0" max="100" value="${savedSlider}">
                    <span class="range-val-lbl" id="goal-readiness-lbl">${savedSlider}%</span>
                </div>
                <div class="form-helper">Indicate whether your internal departments are prepared for workflow updates & SOP training audits.</div>
            </div>

            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-goals">Save Objectives</button>
            </div>
        </form>
    `;

    // Sync Slider
    const slider = document.getElementById("goal-readiness");
    const sliderLbl = document.getElementById("goal-readiness-lbl");
    if (slider && sliderLbl) {
        slider.addEventListener("input", (e) => {
            sliderLbl.textContent = `${e.target.value}%`;
        });
    }

    const saveBtn = document.getElementById("btn-save-goals");
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            localStorage.setItem("aura-goal-primary", document.getElementById("goal-primary").value);
            localStorage.setItem("aura-goal-timeline", document.getElementById("goal-timeline").value);
            localStorage.setItem("aura-goal-budget", document.getElementById("goal-budget").value);
            localStorage.setItem("aura-goal-readiness", slider.value);

            markTaskComplete(2, 'client', 3);
            alert("Transformation Objectives Saved!");
            closeExecutionDrawer();
        });
    }
}

// ==========================================================================
// bespoke TOOL 2.5: REVIEW CLIENT RESPONSES
// ==========================================================================

function renderReviewResponses(container) {
    const rawQuest = localStorage.getItem("aura-data-questionnaire");
    const rawDocs = localStorage.getItem("aura-data-docs");

    let questHtml = `<p class="text-muted" style="font-size:13px;">No business questionnaire answers received from client yet.</p>`;
    let docsHtml = `<p class="text-muted" style="font-size:13px;">No documents uploaded by client yet.</p>`;

    if (rawQuest) {
        try {
            const data = JSON.parse(rawQuest);
            questHtml = `
                <div class="review-item"><span class="review-item-lbl">Company Name:</span><span class="review-item-val">${data.name || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Head Office Location:</span><span class="review-item-val">${data.hoLocation || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Showrooms / Ateliers:</span><span class="review-item-val">${data.branches || '0'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Branch Locations:</span><span class="review-item-val">${Array.isArray(data.branchLocations) ? data.branchLocations.join(', ') : (data.branchLocations || 'Not Provided')}</span></div>
                <div class="review-item"><span class="review-item-lbl">Business Model:</span><span class="review-item-val">${data.model || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Employees Count:</span><span class="review-item-val">${data.employees || '0'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Revenue Range:</span><span class="review-item-val">${data.revenue || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Select Pain Points:</span><span class="review-item-val">${data.painpoints ? data.painpoints.join(', ') : 'None selected'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Core Challenge Details:</span><span class="review-item-val">${data.challenge || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Priorities Order:</span><span class="review-item-val">${data.priorities ? data.priorities.join(' → ') : 'Not Provided'}</span></div>
            `;
        } catch (e) {}
    }

    if (rawDocs) {
        try {
            const data = JSON.parse(rawDocs);
            docsHtml = `
                <div class="review-item"><span class="review-item-lbl">Legal Name:</span><span class="review-item-val">${data.legalName || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">GSTIN Registered:</span><span class="review-item-val">${data.gst || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Corporate ID CIN:</span><span class="review-item-val">${data.cin || 'Not Provided'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Executive Board Contacts:</span><span class="review-item-val">${data.contacts ? data.contacts.map(c => `${c.name} (${c.dept})`).join(', ') : 'None logged'}</span></div>
                <div class="review-item"><span class="review-item-lbl">Attached Files:</span><span class="review-item-val">${data.files ? data.files.join(', ') : 'No uploads'}</span></div>
            `;
        } catch (e) {}
    }

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Audit Team Review Workspace</h4>
            
            <h5 class="form-label">Client Questionnaire Answers</h5>
            <div class="review-answers-box">${questHtml}</div>

            <h5 class="form-label">Legal Registration & Uploaded Files</h5>
            <div class="review-answers-box">${docsHtml}</div>

            <div>
                <label class="form-label">Review Action Comments</label>
                <textarea class="form-control" id="review-feedback" placeholder="Approved. Verified CIN registry. Highlighted inventory metal-loss observations."></textarea>
            </div>

            <div class="wizard-footer">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-review-reject" style="border-color:#ef4444; color:#ef4444;">Return for Revision</button>
                <button type="button" class="btn btn-primary btn-sm" id="btn-review-approve">Approve Responses</button>
            </div>
        </div>
    `;

    document.getElementById("btn-review-approve").addEventListener("click", () => {
        localStorage.setItem("aura-review-status", "approved");
        markTaskComplete(2, 'internal', 0);
        alert("Client Discovery submissions approved and locked!");
        closeExecutionDrawer();
    });

    document.getElementById("btn-review-reject").addEventListener("click", () => {
        localStorage.setItem("aura-review-status", "rejected");
        localStorage.setItem("aura-task-p2-internal-0", "false");
        if (typeof window.updateOverallProgress === "function") window.updateOverallProgress();
        if (typeof window.updatePhaseProgress === "function") window.updatePhaseProgress(2);
        if (typeof window.renderDashboardPhase === "function" && typeof window.dashboardActivePhaseIndex !== "undefined") {
            window.renderDashboardPhase(window.dashboardActivePhaseIndex);
        }
        alert("Discovery registry rejected and returned to client for revisions.");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// bespoke TOOL 2.6: SCHEDULE INDUCTION CALL
// ==========================================================================

function renderScheduleInduction(container) {
    const selectedDate = localStorage.getItem("aura-call-date") || "6";
    const selectedMeet = localStorage.getItem("aura-call-meet") || "meet";
    const selectedDuration = localStorage.getItem("aura-call-duration") || "45";
    const selectedAgenda = localStorage.getItem("aura-call-agenda") || "";
    const selectedEmail = localStorage.getItem("aura-call-email") || "";

    container.innerHTML = `
        <form id="tool-induction-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Induction Meeting Scheduler</h4>
            
            <div>
                <label class="form-label">Attendee / Client Email Address</label>
                <input type="email" class="form-control" id="call-email" placeholder="founder@jewellerybrand.com" value="${selectedEmail}" required>
            </div>

            <div>
                <label class="form-label">Select Induction Date (July 2026)</label>
                <div class="mini-calendar">
                    <div class="calendar-header">July 2026</div>
                    <div class="calendar-grid-header">
                        <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                    </div>
                    <div class="calendar-grid" id="induction-calendar-grid">
                        <!-- Dates loaded dynamically -->
                    </div>
                </div>
            </div>

            <div class="form-grid">
                <div>
                    <label class="form-label">Video Conference API</label>
                    <select class="form-control" id="call-meet">
                        <option value="meet" ${selectedMeet==='meet'?'selected':''}>Google Meet</option>
                        <option value="zoom" ${selectedMeet==='zoom'?'selected':''}>Zoom Video Link</option>
                        <option value="teams" ${selectedMeet==='teams'?'selected':''}>Microsoft Teams</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Meeting Duration</label>
                    <select class="form-control" id="call-duration">
                        <option value="30" ${selectedDuration==='30'?'selected':''}>30 Minutes</option>
                        <option value="45" ${selectedDuration==='45'?'selected':''}>45 Minutes</option>
                        <option value="60" ${selectedDuration==='60'?'selected':''}>60 Minutes</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="form-label">Meeting Agenda</label>
                <textarea class="form-control" id="call-agenda" placeholder="Detail the agenda for alignment call...">${selectedAgenda}</textarea>
            </div>

            <div class="wizard-footer">
                <button type="submit" class="btn btn-primary btn-sm" id="btn-schedule-call">Schedule & Invite</button>
            </div>
        </form>
    `;

    // Render Calendar
    const grid = document.getElementById("induction-calendar-grid");
    // July 2026 starts on Wednesday (2 empty blocks)
    let datesHtml = `<span class="calendar-day empty"></span><span class="calendar-day empty"></span>`;
    
    for (let d = 1; d <= 31; d++) {
        const isSel = d.toString() === selectedDate;
        datesHtml += `<span class="calendar-day ${isSel ? 'selected' : ''}" data-day="${d}">${d}</span>`;
    }
    grid.innerHTML = datesHtml;

    // Date clicks
    let activeDay = selectedDate;
    grid.querySelectorAll(".calendar-day:not(.empty)").forEach(cell => {
        cell.addEventListener("click", () => {
            grid.querySelectorAll(".calendar-day").forEach(c => c.classList.remove("selected"));
            cell.classList.add("selected");
            activeDay = cell.getAttribute("data-day");
        });
    });

    const form = document.getElementById("tool-induction-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const email = document.getElementById("call-email").value.trim();
        const meetType = document.getElementById("call-meet").value;
        const duration = document.getElementById("call-duration").value;
        const agenda = document.getElementById("call-agenda").value.trim();

        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }

        // Save selection
        localStorage.setItem("aura-call-date", activeDay);
        localStorage.setItem("aura-call-meet", meetType);
        localStorage.setItem("aura-call-duration", duration);
        localStorage.setItem("aura-call-agenda", agenda);
        localStorage.setItem("aura-call-email", email);

        // Mark task as complete
        markTaskComplete(2, 'internal', 1);

        // Generate dynamic mock meeting URL
        const randomSlug = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 6) + "-" + Math.random().toString(36).substring(2, 5);
        const meetLink = `https://meet.google.com/${randomSlug}`;

        // Create Google Calendar event template url
        const eventTitle = encodeURIComponent("Induction Call - AURA Consulting");
        const eventDetails = encodeURIComponent(`Meeting Agenda:\n${agenda}\n\nGoogle Meet Link: ${meetLink}`);
        const padDay = activeDay.toString().padStart(2, '0');
        const startHour = "110000";
        const endHour = duration === "30" ? "113000" : (duration === "60" ? "120000" : "114500");
        const dateStr = `202607${padDay}T${startHour}/202607${padDay}T${endHour}`;
        const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${dateStr}&details=${eventDetails}&sf=true&output=xml`;

        // Render confirmation screen
        container.innerHTML = `
            <div class="scheduled-confirmation-view" style="display:flex; flex-direction:column; gap:20px; text-align:center; padding: 24px 12px;">
                <div class="confirm-icon-box" style="margin: 0 auto; width: 60px; height: 60px; background-color: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
                    ✓
                </div>
                <h3 style="font-size: 18px; font-weight: 700; margin: 0; color: var(--text-primary);">Induction Call Scheduled!</h3>
                <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                    A Google Meet session has been created. A link has been shared to the attendee's email.
                </p>
                
                <div style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--border-radius-md); padding: 16px; text-align: left; display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
                    <div><span style="color: var(--text-muted);">Attendee Email:</span> <strong style="color: var(--text-primary); float: right;">${email}</strong></div>
                    <div><span style="color: var(--text-muted);">Scheduled Date:</span> <strong style="color: var(--text-primary); float: right;">July ${activeDay}, 2026</strong></div>
                    <div><span style="color: var(--text-muted);">Meeting URL:</span> <a href="${meetLink}" target="_blank" style="color: var(--color-gold); font-weight: 600; float: right;">meet.google.com/${randomSlug}</a></div>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; margin-top: 10px;">
                    <a href="${gCalUrl}" target="_blank" class="btn btn-primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; padding: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Add to Personal Google Calendar
                    </a>
                    <a href="mailto:${email}?subject=Scheduled%20Induction%20Call%20-%20AURA&body=Hi,%0A%0AWe%20have%20scheduled%20the%20Induction%20Call%20for%20July%20${activeDay},%202026.%0A%0AGoogle%20Meet%20Link:%20${meetLink}%0A%0ABest%20regards,%0AAURA%20Consulting%20Team" class="btn btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; padding: 10px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Send via Email Client (Outlook/Mail)
                    </a>
                </div>
                
                <button type="button" class="btn btn-secondary" onclick="closeExecutionDrawer();" style="margin-top: 15px;">Close Panel</button>
            </div>
        `;
    });
}

// ==========================================================================
// bespoke TOOL 2.7: GENERATE DISCOVERY REPORT
// ==========================================================================

function renderGenerateDiscoveryReport(container) {
    const rawQuest = localStorage.getItem("aura-data-questionnaire");
    const rawGoals = localStorage.getItem("aura-goal-primary") || "Digital Transformation";
    
    let clientName = "Unidentified Client Brand";
    let model = "Boutique Retailer";
    let painList = "Inventory Control, RFID stock matching";
    let hoLocation = "Not Specified";
    let branchLocations = "Not Specified";
    
    if (rawQuest) {
        try {
            const data = JSON.parse(rawQuest);
            clientName = data.name || clientName;
            model = data.model || model;
            painList = data.painpoints ? data.painpoints.join(', ') : painList;
            hoLocation = data.hoLocation || hoLocation;
            branchLocations = Array.isArray(data.branchLocations) ? data.branchLocations.join(', ') : (data.branchLocations || branchLocations);
        } catch (e) {}
    }

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:24px;">
            <h4 class="form-label" style="font-size:14px;">Discovery Phase Report Compiler</h4>
            <p class="form-helper" style="margin-top:-16px;">This workspace compiles Discovery Responses and builds the executive summary sheet automatically.</p>

            <div class="voucher-card" style="border-color: var(--border-color);">
                <div class="voucher-title" style="border-bottom: 1px solid var(--border-color); padding-bottom:8px;">Discovery Analysis Report Summary</div>
                <div class="voucher-grid" style="grid-template-columns:1fr; gap:16px;">
                    <div>
                        <div class="voucher-label">Brand Subject</div>
                        <div class="voucher-val">${clientName} (${model})</div>
                        <div class="voucher-val" style="font-size:11px; margin-top:2px; color:var(--text-secondary)">Head Office: ${hoLocation} | Branches: ${branchLocations}</div>
                    </div>
                    <div>
                        <div class="voucher-label">Identified Operational Gaps</div>
                        <div class="voucher-val">${painList}</div>
                    </div>
                    <div>
                        <div class="voucher-label">Strategic Focus</div>
                        <div class="voucher-val">${rawGoals}</div>
                    </div>
                    <div>
                        <div class="voucher-label">Transformation Hypothesis</div>
                        <p style="font-size:12px; color:var(--text-secondary); margin-top:4px;">Rolling out an integrated RFID stock scanning database will reduce metal loss variance in showrooms by up to 85% and shrink stocktaking time from 15 hours to 30 minutes.</p>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-primary" id="btn-download-pdf-report" style="width:100%;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-inline"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Download Compiled Discovery Report (PDF)</span>
            </button>
        </div>
    `;

    document.getElementById("btn-download-pdf-report").addEventListener("click", () => {
        markTaskComplete(2, 'internal', 2);
        alert("Discovery Report PDF Compilation initiated. Check downloads folder.");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// bespoke TOOL 2.8: AUDIT SCHEDULING & TRAVEL BOOKING
// ==========================================================================

function renderScheduleAudit(container) {
    const savedAuditor = localStorage.getItem("aura-audit-auditor") || "auditor";
    const savedBranch = localStorage.getItem("aura-audit-branch") || "delhi";
    const savedTickets = localStorage.getItem("aura-audit-has-tickets") === "true";

    container.innerHTML = `
        <form id="tool-audit-schedule-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Audit Scheduler & Administrative Travel Booking</h4>
            
            <div class="form-grid">
                <div>
                    <label class="form-label">Assign Auditor</label>
                    <select class="form-control" id="audit-auditor">
                        <option value="lead" ${savedAuditor==='lead'?'selected':''}>Lead Consultant</option>
                        <option value="auditor" ${savedAuditor==='auditor'?'selected':''}>Retail Audit Specialist</option>
                        <option value="analyst" ${savedAuditor==='analyst'?'selected':''}>Operations Analyst</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Target Showroom Branch</label>
                    <select class="form-control" id="audit-branch">
                        <option value="mumbai" ${savedBranch==='mumbai'?'selected':''}>Mumbai Branch</option>
                        <option value="pune" ${savedBranch==='pune'?'selected':''}>Pune Branch</option>
                        <option value="surat" ${savedBranch==='surat'?'selected':''}>Surat Branch</option>
                    </select>
                </div>
            </div>

            <!-- Travel Booking Panel -->
            <div class="audit-topic-card">
                <div class="audit-topic-header">
                    <span style="font-weight:600; font-size:13px;">Corporate Travel Booking Dashboard (Admin Only)</span>
                </div>
                <div class="form-grid" style="margin-top:12px;">
                    <div class="form-group-full">
                        <label class="custom-checkbox">
                            <input type="checkbox" id="audit-book-travel" ${savedTickets?'checked':''}>
                            <span>Travel Ticket & Vouchers Confirmed</span>
                        </label>
                    </div>
                    <div class="form-group-full ${savedTickets?'':'hide'}" id="travel-voucher-inputs">
                        <div class="form-grid">
                            <div>
                                <label class="form-label">Flight Details</label>
                                <input type="text" class="form-control" id="travel-flight" placeholder="e.g. Indigo 6E-241">
                            </div>
                            <div>
                                <label class="form-label">Hotel Reservation</label>
                                <input type="text" class="form-control" id="travel-hotel" placeholder="e.g. Taj Palace Palace">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Employee Travel Card -->
            <div class="voucher-card ${savedTickets?'':'hide'}" id="travel-employee-voucher">
                <div class="voucher-title">Employee Travel Voucher</div>
                <div class="voucher-grid">
                    <div>
                        <div class="voucher-label">Flight Details</div>
                        <div class="voucher-val" id="v-flight">Indigo 6E-241</div>
                    </div>
                    <div>
                        <div class="voucher-label">Hotel Room</div>
                        <div class="voucher-val" id="v-hotel">Taj Palace Palace</div>
                    </div>
                    <div>
                        <div class="voucher-label">Travel Date</div>
                        <div class="voucher-val">July 18, 2026</div>
                    </div>
                    <div>
                        <div class="voucher-label">Status</div>
                        <div class="voucher-val" style="color:#10b981;">Flight Booked</div>
                    </div>
                </div>
            </div>

            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-audit-schedule">Confirm & Save schedule</button>
            </div>
        </form>
    `;

    const bookChk = document.getElementById("audit-book-travel");
    const voucherInputs = document.getElementById("travel-voucher-inputs");
    const voucherCard = document.getElementById("travel-employee-voucher");

    if (bookChk) {
        bookChk.addEventListener("change", (e) => {
            if (e.target.checked) {
                voucherInputs.classList.remove("hide");
                voucherCard.classList.remove("hide");
            } else {
                voucherInputs.classList.add("hide");
                voucherCard.classList.add("hide");
            }
        });
    }

    // Sync voucher texts
    const flightInput = document.getElementById("travel-flight");
    const hotelInput = document.getElementById("travel-hotel");
    const vFlight = document.getElementById("v-flight");
    const vHotel = document.getElementById("v-hotel");

    if (flightInput && vFlight) flightInput.addEventListener("input", (e) => vFlight.textContent = e.target.value);
    if (hotelInput && vHotel) hotelInput.addEventListener("input", (e) => vHotel.textContent = e.target.value);

    // Save
    document.getElementById("btn-save-audit-schedule").addEventListener("click", () => {
        localStorage.setItem("aura-audit-auditor", document.getElementById("audit-auditor").value);
        localStorage.setItem("aura-audit-branch", document.getElementById("audit-branch").value);
        localStorage.setItem("aura-audit-has-tickets", bookChk.checked);

        markTaskComplete(2, 'internal', 3);
        alert("Audit and Travel Schedule Confirmed!");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// bespoke TOOL 3.1: PROVIDE ACCESS CHECKLIST
// ==========================================================================

function renderProvideAccess(container) {
    const keys = ["erp", "pos", "stock", "vault", "atelier", "showroom"];
    
    let html = `
        <form id="tool-access-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Technical & Site Access Credentials</h4>
            <p class="form-helper" style="margin-top:-16px;">Grant access logs to the audit team to execute observations:</p>
            <div class="form-multiselect-grid" style="grid-template-columns: 1fr;">
    `;

    keys.forEach(k => {
        const isChecked = localStorage.getItem(`aura-access-${k}`) === "true";
        let label = k.toUpperCase() + " Access credentials provided";
        if (k === 'stock') label = "Showroom inventory reports downloaded";
        if (k === 'vault') label = "Vault logs access granted";
        if (k === 'atelier') label = "Atelier floor site permission confirmed";

        html += `
            <label class="custom-checkbox">
                <input type="checkbox" class="access-chk" data-key="${k}" ${isChecked ? 'checked' : ''}>
                <span>${label}</span>
            </label>
        `;
    });

    html += `
            </div>
            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-access">Save Access Log</button>
            </div>
        </form>
    `;

    container.innerHTML = html;

    document.getElementById("btn-save-access").addEventListener("click", () => {
        document.querySelectorAll(".access-chk").forEach(chk => {
            const key = chk.getAttribute("data-key");
            localStorage.setItem(`aura-access-${key}`, chk.checked);
        });

        markTaskComplete(3, 'client', 0);
        alert("Access Credentials list updated successfully!");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// bespoke TOOL 3.2: ACKNOWLEDGE PRELIMINARY FINDINGS
// ==========================================================================

function renderAcknowledgeFindings(container) {
    const isChecked = localStorage.getItem("aura-ack-findings") === "true";

    container.innerHTML = `
        <div class="audit-db-container">
            <p class="audit-db-subtitle">Please review the preliminary audit findings across key areas. Click on each area to view details and evidence.</p>
            
            <!-- Stat Cards Row -->
            <div class="audit-db-stat-row">
                <!-- 1 -->
                <div class="audit-db-stat-card">
                    <div class="audit-db-stat-icon-wrapper blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div class="audit-db-stat-info">
                        <span class="audit-db-stat-label">Overall Audit Score</span>
                        <span class="audit-db-stat-val" style="color: #10b981;">72% <span style="font-size:10px; font-weight:600; color:#10b981;">Good</span></span>
                        <span class="audit-db-stat-sub">Previous Audit: 61%</span>
                    </div>
                </div>
                <!-- 2 -->
                <div class="audit-db-stat-card">
                    <div class="audit-db-stat-icon-wrapper blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div class="audit-db-stat-info">
                        <span class="audit-db-stat-label">Total Areas Audited</span>
                        <span class="audit-db-stat-val">11</span>
                        <span class="audit-db-stat-sub">100% Completed</span>
                    </div>
                </div>
                <!-- 3 -->
                <div class="audit-db-stat-card">
                    <div class="audit-db-stat-icon-wrapper red">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div class="audit-db-stat-info">
                        <span class="audit-db-stat-label">Critical Issues</span>
                        <span class="audit-db-stat-val" style="color: #ef4444;">5</span>
                        <span class="audit-db-stat-sub" style="color:#ef4444;">Action Required</span>
                    </div>
                </div>
                <!-- 4 -->
                <div class="audit-db-stat-card">
                    <div class="audit-db-stat-icon-wrapper yellow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div class="audit-db-stat-info">
                        <span class="audit-db-stat-label">High Priority Issues</span>
                        <span class="audit-db-stat-val" style="color: #f59e0b;">12</span>
                        <span class="audit-db-stat-sub">Needs Attention</span>
                    </div>
                </div>
                <!-- 5 -->
                <div class="audit-db-stat-card">
                    <div class="audit-db-stat-icon-wrapper green">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div class="audit-db-stat-info">
                        <span class="audit-db-stat-label">Strengths Identified</span>
                        <span class="audit-db-stat-val" style="color: #10b981;">18</span>
                        <span class="audit-db-stat-sub">Good Practices</span>
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="audit-db-main-grid">
                <!-- Left Table -->
                <div class="audit-db-table-card">
                    <h5 class="audit-db-card-title">Audit Findings by Area</h5>
                    <table class="audit-db-table">
                        <thead>
                            <tr>
                                <th>Audit Area</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Critical</th>
                                <th>High</th>
                                <th style="text-align:center;">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>📦 1. Inventory & Stock Control</td>
                                <td><strong>78%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>1</td>
                                <td>2</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(1); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>🏬 2. Showroom Operations</td>
                                <td><strong>74%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>2</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(2); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>👥 3. Sales & Client Experience</td>
                                <td><strong>82%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>1</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(3); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>🔒 4. Security & Compliance</td>
                                <td><strong>68%</strong></td>
                                <td><span class="audit-db-badge warn">Needs Improvement</span></td>
                                <td><span style="color:#ef4444; font-weight:700;">1</span></td>
                                <td>2</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(4); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>💳 5. Finance & Billing</td>
                                <td><strong>76%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>1</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(5); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>👥 6. HR & People</td>
                                <td><strong>70%</strong></td>
                                <td><span class="audit-db-badge warn">Needs Improvement</span></td>
                                <td><span style="color:#ef4444; font-weight:700;">1</span></td>
                                <td>1</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(6); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>💻 7. Technology & Systems</td>
                                <td><strong>80%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>0</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(7); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>🎨 8. Visual Merchandising</td>
                                <td><strong>75%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>0</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(8); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>📢 9. Marketing & CRM</td>
                                <td><strong>60%</strong></td>
                                <td><span class="audit-db-badge warn">Needs Improvement</span></td>
                                <td>0</td>
                                <td>2</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(9); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                            <tr>
                                <td>⚙️ 10. Governance & Processes</td>
                                <td><strong>72%</strong></td>
                                <td><span class="audit-db-badge pass">Good</span></td>
                                <td>0</td>
                                <td>0</td>
                                <td style="text-align:center; color:var(--color-gold); cursor:pointer;" onclick="if(typeof showAuditAreaModal === 'function') { showAuditAreaModal(10); }"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="display:flex; justify-content:center; margin-top:8px;">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="alert('Full report PDF generation queued.');" style="font-size:12px; padding:6px 12px;">View Detailed Report</button>
                    </div>
                </div>

                <!-- Right Charts -->
                <div class="audit-db-right-col">
                    <!-- Chart 1 -->
                    <div class="audit-db-priority-card">
                        <h5 class="audit-db-card-title">Issues by Priority</h5>
                        <div class="donut-chart-wrapper">
                            <!-- Dynamic SVG Donut Chart -->
                            <svg width="80" height="80" viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4"></circle>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="13 87" stroke-dashoffset="100"></circle>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" stroke-width="4" stroke-dasharray="32 68" stroke-dashoffset="87"></circle>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" stroke-width="4" stroke-dasharray="34 66" stroke-dashoffset="55"></circle>
                                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="21 79" stroke-dashoffset="21"></circle>
                            </svg>
                            
                            <div class="donut-legend">
                                <div class="donut-legend-item">
                                    <span class="donut-legend-color" style="background:#ef4444;"></span>
                                    <span>Critical: <strong>5 (13%)</strong></span>
                                </div>
                                <div class="donut-legend-item">
                                    <span class="donut-legend-color" style="background:#f59e0b;"></span>
                                    <span>High: <strong>12 (32%)</strong></span>
                                </div>
                                <div class="donut-legend-item">
                                    <span class="donut-legend-color" style="background:#eab308;"></span>
                                    <span>Medium: <strong>13 (34%)</strong></span>
                                </div>
                                <div class="donut-legend-item">
                                    <span class="donut-legend-color" style="background:#10b981;"></span>
                                    <span>Low: <strong>8 (21%)</strong></span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align:center; font-size:11px; font-weight:700; color:var(--text-secondary); margin-top:4px;">
                            Total: 38 Issues
                        </div>
                    </div>

                    <!-- Top Critical Issues -->
                    <div class="audit-db-priority-card">
                        <h5 class="audit-db-card-title">Top 5 Critical Issues</h5>
                        <div class="top-issues-list">
                            <div class="top-issue-item">
                                <span class="top-issue-text"><span style="color:#ef4444; font-size:14px; line-height:1;">●</span> Stock variance in high-value items</span>
                                <span class="top-issue-dept-badge inv">Inventory</span>
                            </div>
                            <div class="top-issue-item">
                                <span class="top-issue-text"><span style="color:#ef4444; font-size:14px; line-height:1;">●</span> Unrecorded metal wastage in karkhana</span>
                                <span class="top-issue-dept-badge atl">Atelier</span>
                            </div>
                            <div class="top-issue-item">
                                <span class="top-issue-text"><span style="color:#ef4444; font-size:14px; line-height:1;">●</span> CCTV blind spots in showroom floor</span>
                                <span class="top-issue-dept-badge sec">Security</span>
                            </div>
                            <div class="top-issue-item">
                                <span class="top-issue-text"><span style="color:#ef4444; font-size:14px; line-height:1;">●</span> Cash handling process not fully compliant</span>
                                <span class="top-issue-dept-badge fin">Finance</span>
                            </div>
                            <div class="top-issue-item">
                                <span class="top-issue-text"><span style="color:#ef4444; font-size:14px; line-height:1;">●</span> No documented SOP for returns</span>
                                <span class="top-issue-dept-badge ops">Operations</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Disclaimer & Acknowledgment Form -->
            <form id="tool-ack-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:16px; margin-top:10px;">
                <div class="voucher-card" style="border-color:#ef4444; background-color: rgba(239,68,68,0.02); padding: 16px; margin:0; border-radius: var(--border-radius-md); border-width: 1px; border-style: solid;">
                    <div class="voucher-title" style="color:#ef4444; font-size:13px; font-weight:700; margin-bottom: 6px;">Legal Disclaimer & Receipt Acknowledgment</div>
                    <p style="font-size:12px; color:var(--text-secondary); line-height:1.6; margin:0;">
                        By checking the box below, you acknowledge receipt of the preliminary operational audit observations logged by the transform team. These observations represent provisional highlights covering stock counts, karkhana wastage, and showroom security compliance.
                    </p>
                </div>

                <label class="custom-checkbox" style="font-weight:600; font-size:13px; display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" id="ack-chk" ${isChecked ? 'checked' : ''}>
                    <span>We acknowledge receipt of preliminary audit observations</span>
                </label>

                <button type="button" class="btn btn-primary" id="btn-submit-ack" style="width:100%;">
                    Submit Acknowledgment
                </button>
            </form>
        </div>
    `;

    document.getElementById("btn-submit-ack").addEventListener("click", () => {
        const checked = document.getElementById("ack-chk").checked;
        localStorage.setItem("aura-ack-findings", checked);
        
        if (checked) {
            markTaskComplete(3, 'client', 2);
            alert("Preliminary findings receipt acknowledged successfully.");
            closeExecutionDrawer();
        } else {
            alert("Please check the acknowledgment box before submitting.");
        }
    });
}

function renderDepartmentAuditChecklist(container) {
    // 36 Core Processes Database (Digital Adherence & Floor Practice Audit)
    const EXPLORER_PROCESSES = [
        // Category 1: CUSTOMER & SALES PROCESSES (1-8)
        {
            id: 1, cat: 1, name: "CRM & LEAD MANAGEMENT",
            flowSteps: ["Lead Capture", "Qualification", "Allocation", "Follow-up", "Quote Generation", "Conversion Analysis"],
            controls: "System-wide CRM onboarding rate, duplicate data logs checking.",
            risks: "Sales representatives bypassing CRM to write lead logs in personal diary.",
            kpis: "Lead record digitisation rate, sales rep logging compliance.",
            insights: "Moving from paper guest books to direct CRM entry reduces duplicate leads by 42%.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL CAPTURE VS. PAPER REGISTER", badge: "Lead capture medium", practice: "Observe if client info is typed directly into the CRM terminal in real-time, or if they write on paper guestbooks.", evidence: "Reconcile yesterday's physical security door registry against CRM lead timestamps. Check for date/time sync.", redflag: "Handwritten paper slips left on sales desks." },
                { id: 2, stage: "Stage 02", title: "AUTOMATED ROUTING ADOPTION", badge: "Lead routing tools", practice: "Check if the CRM system automatically distributes new digital leads based on active representative queues.", evidence: "Inspect the lead assignment audit logs to confirm no manual routing overrides by floor managers.", redflag: "Managers verbally assigning leads on the floor." }
            ]
        },
        {
            id: 2, cat: 1, name: "CUSTOMER LIFECYCLE MANAGEMENT",
            flowSteps: ["Onboarding", "Segmenting", "Clienteling", "Loyalty Rewards", "Reacting", "Feedback"],
            controls: "Standardized CRM clienteling logs, monthly tier sync audits.",
            risks: "Staff using personal WhatsApp/calendars for client outreach instead of corporate CRM.",
            kpis: "CRM client contact logs percentage, digital loyalty tier accuracy.",
            insights: "Keeping client outreach in corporate CRM prevents loss of customer assets on staff churn.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "SYSTEM CLIENTELING ADOPTION", badge: "Client outreach tracking", practice: "Monitor sales representatives outreach; check if they log client calls/WhatsApp conversations inside the CRM clienteling module.", evidence: "Inspect active client profiles in CRM to verify conversation notes and scheduled callbacks exist.", redflag: "Representatives using personal mobile phone contact books and private calendars." }
            ]
        },
        {
            id: 3, cat: 1, name: "SALES-TO-CASH",
            flowSteps: ["Invoice Generation", "Tax Verification", "Locker Check", "Bank Deposit", "Ledger Reconciled"],
            controls: "POS invoice lock rules, manager discount override logs.",
            risks: "Manual billing or handwritten calculations bypassing POS billing software.",
            kpis: "POS-billed invoice percentage (target: 100%), discount override frequency.",
            insights: "Enforcing system-locked billing stops tax audit risks and unauthorized discount leaks.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "SYSTEM BILLING COMPLIANCE", badge: "Billing automation", practice: "Observe checkouts to confirm billing is performed strictly inside the POS terminal with automated calculations.", evidence: "Reconcile daily cash counter logs and credit card settlements against system-generated receipts.", redflag: "Handwritten estimates, manual discount overrides, or offline billing sheets." }
            ]
        },
        {
            id: 4, cat: 1, name: "CUSTOMER RETURNS",
            flowSteps: ["Return Request", "Purity Verification", "Invoice Match", "Refund Processing", "Stock Re-entry"],
            controls: "Integrated ERP return logs, digital laboratory XRF scan sync.",
            risks: "Processing returns via paper credit notes, leading to system stock mismatches.",
            kpis: "Digital return voucher percentage, return processing speed.",
            insights: "System-generated credit vouchers prevent fraudulent double-payouts for returned goods.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL RETURN AUTHORISATIONS", badge: "Return voucher logs", practice: "Verify credit vouchers are generated inside the ERP and require manager key authorization for return processing.", evidence: "Audit all processed return transactions for matching original invoice numbers and authorization logs.", redflag: "Manual paper credit notes signed with a pen." }
            ]
        },
        {
            id: 5, cat: 1, name: "EXCHANGE & BUYBACK",
            flowSteps: ["Valuation Request", "Melt Testing", "Net Weight Calculation", "Buyback Voucher", "Settlement"],
            controls: "ERP bullion rate matrix sync, melt deduction automated formulas.",
            risks: "Sales team using manual calculators and arbitrary loss deductions.",
            kpis: "Formula-driven melt check rate, buyback variance logs.",
            insights: "Formula-locked valuations protect direct boutique gross margins on scrap exchanges.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "LOCKED RATE MATRIX COMPLIANCE", badge: "Buyback valuation tools", practice: "Confirm buying/exchange price calculation uses the live system rate matrix synced with market bullion rates.", evidence: "Verify exchange slips calculate scrap melt weight deductions using the system's locked formulas.", redflag: "Sales reps using manual desk calculators to figure out melt deductions." }
            ]
        },
        {
            id: 6, cat: 1, name: "LOYALTY & REWARDS",
            flowSteps: ["Point Accrual", "Redemption Request", "OTP Authorization", "Locker Update", "Ledger Sync"],
            controls: "Integrated loyalty module, OTP validation logs.",
            risks: "Staff manually adjusting loyalty points inside databases.",
            kpis: "OTP-authorised redemption rate (target: 100%), point ledger match.",
            insights: "SMS OTP authorization stops rogue point withdrawals by showroom staff.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "OTP-BASED POINT VALIDATION", badge: "Loyalty tools security", practice: "Confirm customer loyalty points can only be redeemed after inputting a system-generated SMS OTP.", evidence: "Audit a sample of point redemptions against SMS gateway dispatch logs and customer authorizations.", redflag: "Loyalty point adjustments done by floor managers without OTP records." }
            ]
        },
        {
            id: 7, cat: 1, name: "SCHEME MANAGEMENT",
            flowSteps: ["Enrollment", "Monthly Installments", "Passbook Entry", "Maturity Redeem", "Invoice Link"],
            controls: "ERP scheme module compliance, biometric scheme payouts.",
            risks: "Keeping member deposit ledgers on physical books or spreadsheets.",
            kpis: "Scheme deposit ledger sync rate, automated maturity calculations.",
            insights: "Digital scheme registries improve working capital predictability and compliance.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL DEPOSIT POSTING", badge: "Scheme account tools", practice: "Verify monthly installment payments are posted directly to the customer's scheme profile in the ERP.", evidence: "Match daily scheme cash receipts against ERP ledger postings for customer scheme accounts.", redflag: "Manual paper passbooks with hand-signed deposit records." }
            ]
        },
        {
            id: 8, cat: 1, name: "CUSTOMER HANDOVER & DELIVERY",
            flowSteps: ["Pack Verification", "Gate Scan", "Handover OTP", "Client Sign-off", "System Close"],
            controls: "Barcode tag checkout scans, OTP handover logs.",
            risks: "Sales staff handing over premium items using manual sight checks without scanning barcodes.",
            kpis: "Barcode handover scan compliance, delivery dispute logs.",
            insights: "Forced checkout scans ensure customers receive the exact SKU invoiced.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "BARCODE HANDOVER VERIFICATION", badge: "Handover check tools", practice: "Verify sales staff scan item barcode tags at the delivery counter to match with the invoice SKU.", evidence: "Inspect system handover logs showing barcode scan validations prior to packaging.", redflag: "Managers doing manual sight check validations for item handovers." }
            ]
        },

        // Category 2: Inventory & Operations Processes (9-16)
        {
            id: 9, cat: 2, name: "RAW MATERIAL MANAGEMENT",
            flowSteps: ["Purchase Receipt", "Vault Storage", "Melting Room Allocation", "Issue to Production", "Scrap Recovery", "Vault Update"],
            controls: "Weigh scale digital interface, biometric vault logs.",
            risks: "Weighing raw gold on standalone scales and logging weights on paper vault books.",
            kpis: "Automatic scale logging percentage, vault entry sign-off logs.",
            insights: "Direct-to-system weighing eliminates weight transcription errors and internal theft.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL SCALE INTEGRATION", badge: "Intake weight validation", practice: "Confirm weighing scale readings push directly to the ERP material ledger without manual typing.", evidence: "Check ERP database tables to verify scale weight telemetry logs match inventory records.", redflag: "Auditor finds paper notebooks on the scale desk for writing down raw gold weights." },
                { id: 2, stage: "Stage 02", title: "BIOMETRIC VAULT CUSTODY", badge: "Vault access security", practice: "Observe access to the raw material vault; confirm biometrics are scanned for dual-custody entry.", evidence: "Compare CCTV entry footage from the vault door against the biometric electronic access logs.", redflag: "Vault doors kept propped open or physical sign-in books used." }
            ]
        },
        {
            id: 10, cat: 2, name: "FINISHED GOODS MANAGEMENT",
            flowSteps: ["Showroom Receipt", "HUID Validation", "Tagging & RFID", "Display Placement", "Daily Counts"],
            controls: "RFID display scanning compliance, HUID registry verification.",
            risks: "Staff executing manual tag-by-tag stock counts of display showcases.",
            kpis: "Showcase RFID count duration, HUID sync accuracy.",
            insights: "RFID showcase scanning reduces daily count duration from 3 hours to 10 minutes.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "RFID DISPLAY SCANNING", badge: "Showroom stock check", practice: "Verify showroom staff perform daily stock counts using RFID wand scanners for display cabinets.", evidence: "Inspect daily RFID count logs and check for immediate reconciliation reports in the inventory system.", redflag: "Staff doing manual tag-by-tag tallies on printed sheets." }
            ]
        },
        {
            id: 11, cat: 2, name: "BRANCH INVENTORY TRANSFERS",
            flowSteps: ["Transfer Request", "Package Seal", "Transit Dispatch", "Branch Receipt", "Ledger Sync"],
            controls: "ERP transit dispatch module, GPS transit logs.",
            risks: "Shipping inventory between boutiques without logging ERP transfers first.",
            kpis: "ERP-matched transfer rate, branch intake reconciliation time.",
            insights: "Enforcing digital pre-shipment transfer logs eliminates transit leakages.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "SYSTEM DISPATCH AUTHORISATION", badge: "Transit routing tools", practice: "Confirm stock transfers between showrooms are approved in the ERP prior to courier packaging.", evidence: "Reconcile transit dispatch records in ERP with branch intake receipts and waybills.", redflag: "Couriers transporting jewelry without system transfer vouchers." }
            ]
        },
        {
            id: 12, cat: 2, name: "INVENTORY AUDITS & STOCK COUNTS",
            flowSteps: ["Audit Schedule", "Scanner Config", "Physical Counting", "Discrepancy Log", "Reconciliation"],
            controls: "Audit system sync logs, barcode exception registers.",
            risks: "Running boutique stock counts using manual printout check sheets.",
            kpis: "Audit scanning compliance percentage, discrepancy count.",
            insights: "Barcode scan audits prevent manual tally sheet errors and checklist collusion.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "BARCODE AUDIT SCANNING", badge: "Stock count methods", practice: "Verify surprise audits use barcode scanners to scan inventory rather than checking lists by hand.", evidence: "Audit a sample of past discrepancy reports generated directly from the scanning software.", redflag: "Auditors checking off items on paper spreadsheets." }
            ]
        },
        {
            id: 13, cat: 2, name: "MANUFACTURING & JOB WORK",
            flowSteps: ["Alloy Issue", "Job-Card Assign", "Crafting", "Purity Testing", "Finished Return"],
            controls: "Artisan ERP job card balance logs, assay lab result sync.",
            risks: "Artisan gold issues and returns recorded in manual workshop register books.",
            kpis: "Artisan digital ledger compliance, gold loss deduction accuracy.",
            insights: "Digital workshop registers save up to 12% in gold dust/scrap leakage.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL WORKSHOP LEDGER", badge: "Artisan metal control", practice: "Confirm gold issued to external artisans is tracked in real-time inside the ERP job card ledger.", evidence: "Weigh metal at artisan return and verify against job card allocations in ERP.", redflag: "Artisan transactions logged on paper index cards." }
            ]
        },
        {
            id: 14, cat: 2, name: "PACKING MATERIAL MANAGEMENT",
            flowSteps: ["Box Procurement", "Stock Entry", "Locker Issue", "Delivery Pack", "Inventory Reconcile"],
            controls: "ERP packaging stock logs, invoice consumption tracking.",
            risks: "Issuing luxury packing boxes without linking them to sales invoices.",
            kpis: "Packaging cost variance, box inventory accuracy.",
            insights: "Automatically deducting boxes at checkout prevents loss of expensive branding assets.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED CONSUMPTION LOGGING", badge: "Packing inventory tools", practice: "Confirm premium packaging boxes are tracked as stock items and auto-deducted upon sales billing.", evidence: "Compare physical box counts against system stock balances.", redflag: "Showroom floor staff grabbing boxes without scanning." }
            ]
        },
        {
            id: 15, cat: 2, name: "REPAIR INVENTORY TRACKING",
            flowSteps: ["Client Intake", "Weight Logging", "Repair Desk issue", "Polishing", "Customer Return"],
            controls: "ERP job tickets, photographic intake logs.",
            risks: "Describing customer repair items on paper tags without photographic evidence.",
            kpis: "Repair ticket digitisation rate, customer dispute frequency.",
            insights: "Attaching digital images to repair tickets stops customer claims on stone swaps.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "SYSTEM PHOTO ATTACHMENT", badge: "Repair validation check", practice: "Check if high-res pictures of customer jewelry are uploaded to the ERP ticket at intake.", evidence: "Inspect a sample of open repair tickets in ERP to confirm clear image attachments are present.", redflag: "Handwritten tags detailing stone count and defects." }
            ]
        },
        {
            id: 16, cat: 2, name: "SAFE DEPOSIT VAULT COMPLIANCE",
            flowSteps: ["Store Close", "Showcase Clear", "Vault Move", "Dual Locking", "Alarm Enable"],
            controls: "Electronic vault timer logs, CCTV network sync.",
            risks: "Bypassing timed locks or manual log overrides.",
            kpis: "Timed vault lock compliance, vault access logs sync.",
            insights: "Integrated locks ensure that boutique vaults cannot be opened outside store hours.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "INTEGRATED LOCK SYSTEM", badge: "Vault lock compliance", practice: "Verify vault lock/unlock activities sync automatically to central monitoring servers.", evidence: "Compare daily security system door open logs against manager shift schedules.", redflag: "Vault timed-lock bypass options used frequently." }
            ]
        },

        // Category 3: Procurement & Supply Chain Processes (17-21)
        {
            id: 17, cat: 3, name: "PROCURE-TO-PAY",
            flowSteps: ["Requisition", "PO Release", "GRN Creation", "Invoice Verification", "3-Way Match", "Payment Execution"],
            controls: "Automated ERP 3-way match rules, digital payment releases.",
            risks: "Manually checking paper invoices against POs and GRNs.",
            kpis: "System 3-way matching rate (target: 100%), double payments count.",
            insights: "Automating matching rules prevents invoice fraud and double billing errors.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED 3-WAY MATCHING", badge: "Invoice audit automation", practice: "Check if the ERP automatically matches PO, GRN, and vendor invoices prior to approval.", evidence: "Audit processed payments to verify system block triggers are active for unmatched invoices.", redflag: "Accounts team manually signing off on vendor bills without PO matching." }
            ]
        },
        {
            id: 18, cat: 3, name: "VENDOR MANAGEMENT",
            flowSteps: ["Vendor Request", "KYC Check", "Site Audit", "Onboarding Approval", "Performance Review"],
            controls: "Vendor onboarding portal, digital GST sync check.",
            risks: "Collecting vendor business certifications on paper folders.",
            kpis: "Digital vendor registry percentage, tax compliance rate.",
            insights: "Real-time portal GST checks prevent business transactions with defaulted suppliers.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL KYC PORTAL", badge: "Vendor registry tools", practice: "Verify suppliers enter their corporate tax details directly into the digital onboarding portal.", evidence: "Check onboarded vendor profiles for automated validation checks against tax portal API records.", redflag: "Vendors submitting onboarding details via paper forms." }
            ]
        },
        {
            id: 19, cat: 3, name: "SUPPLIER PERFORMANCE MANAGEMENT",
            flowSteps: ["Lead Time Log", "Purity Test Log", "Delivery Reconcile", "Defect Rating", "Review meeting"],
            controls: "ERP supplier scorecards, assay lab integration.",
            risks: "Tracking vendor quality and lead times on Excel spreadsheets.",
            kpis: "Supplier quality rating sync, average lead times.",
            insights: "Live assay portal sync ensures suppliers with poor metal purity are flagged instantly.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED PURITY SCORECARDS", badge: "Supplier QA tools", practice: "Confirm supplier gold purity test logs from external assay labs are uploaded directly to the ERP.", evidence: "Check the vendor scorecard dashboard to see purity variance data populated.", redflag: "Quality tracking logged on manual spreadsheets." }
            ]
        },
        {
            id: 20, cat: 3, name: "LOGISTICS & TRANSPORTATION",
            flowSteps: ["Transit Plan", "GPS Lock", "Armored Vehicle Load", "Transit monitoring", "Receipt confirm"],
            controls: "Integrated GPS vehicle tracking, automated route deviation alerts.",
            risks: "Boutique managers calling transit guards for security updates.",
            kpis: "Real-time GPS dashboard uptime, transit schedule compliance.",
            insights: "Live telemetry dashboards trigger alerts the second an armored vehicle deviates.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "GPS TELEMATICS LOGGING", badge: "Logistics monitoring", practice: "Verify armored transit vehicles are monitored via live GPS feeds on the logistics dashboard.", evidence: "Review GPS route log logs showing real-time location pings for transit vehicles.", redflag: "Security guards calling boutique managers to report progress." }
            ]
        },
        {
            id: 21, cat: 3, name: "GOODS RECEIPT & INSPECTION",
            flowSteps: ["Arrive Check", "Seal Check", "Weight Validation", "Purity Test", "ERP Entry"],
            controls: "ERP goods intake seal check, scale interface integration.",
            risks: "Logging package package weight and seal serials on printouts.",
            kpis: "Intake processing speed, goods discrepancy logs.",
            insights: "Recording seal numbers directly in the ERP protects metal chain of custody.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL SEAL AUDITS", badge: "Goods receipt control", practice: "Confirm security seal serial numbers are typed into the ERP goods receipt screen upon shipment intake.", evidence: "Reconcile physical seals from received packages against system receipt logs.", redflag: "Seal numbers written on paper receipt notes." }
            ]
        },

        // Category 4: Finance & Compliance Processes (22-27)
        {
            id: 22, cat: 4, name: "CASH MANAGEMENT",
            flowSteps: ["Cash Billing", "Till Storage", "Vault Drop", "Bank Deposit Dispatch", "Bank Receipt Match"],
            controls: "POS cashier balance logs, automated safe drops register.",
            risks: "Cash desk tills balanced on paper checkout sheets, leading to unverified logs.",
            kpis: "POS drawer match compliance (target: 100%), cash variance.",
            insights: "System-locked till balancing ensures cash desk collections match system sales instantly.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "POS SHIFT TILL BALANCE", badge: "Till balancing tools", practice: "Confirm cashier till balancing is verified in the POS system at each shift handover.", evidence: "Match daily POS cash drawer reports against bank deposit receipts.", redflag: "Manual paper till logs with handwritten cash counts." }
            ]
        },
        {
            id: 23, cat: 4, name: "ACCOUNTS RECEIVABLE",
            flowSteps: ["Customer Invoice", "Payment Due Log", "Reminder Dispatch", "Payment Receipt", "Reconciliation"],
            controls: "ERP collection rules, automated reminder email systems.",
            risks: "Boutique staff calling customers manually for payments using spreadsheet lists.",
            kpis: "Days Sales Outstanding (DSO), reminder open rates.",
            insights: "Automating collection alerts cuts outstanding receivable collection times in half.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED REMINDER TRIGGERS", badge: "Collection tools", practice: "Check if the billing system automatically sends payment due notifications to customers.", evidence: "Inspect automated email/SMS log histories for accounts with outstanding balances.", redflag: "Accounts team calling customers using printed spreadsheet lists." }
            ]
        },
        {
            id: 24, cat: 4, name: "ACCOUNTS PAYABLE",
            flowSteps: ["Vendor Invoice", "Three-way match", "Approval workflow", "Bank Transfer", "Voucher Log"],
            controls: "ERP payment approval matrices, bank portal API integration.",
            risks: "CFO manually signing vendor checks, bypassing ERP limits.",
            kpis: "Digital AP payment percentage, payment cycle time.",
            insights: "System-driven payment authorization stops budget overruns and ledger mismatch.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL PAYMENT WORKFLOWS", badge: "AP payment control", practice: "Verify vendor payment releases require electronic authorization approvals within the ERP.", evidence: "Check audit trails for recent bank transfers to confirm multi-step approval workflow logs.", redflag: "Manual checkbooks signed offline." }
            ]
        },
        {
            id: 25, cat: 4, name: "FINANCIAL CLOSING",
            flowSteps: ["Expense entry", "Valuation run", "P&L generation", "Balance Sheet", "CFO sign-off"],
            controls: "ERP financial closure rules, live bullion index sync.",
            risks: "Manually adjusting metal asset prices on end-of-month registers.",
            kpis: "Closing process speed, valuation discrepancy logs.",
            insights: "Live-rate asset valuation stops balance sheet mismatch and ledger manipulation.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED VALUATION ENGINE", badge: "Financial close tools", practice: "Confirm metal inventory valuation is calculated by system scripts based on market bullion rate syncs.", evidence: "Audit valuation reports to check for manual asset adjustments or override records.", redflag: "Asset valuation updated via Excel overrides." }
            ]
        },
        {
            id: 26, cat: 4, name: "GST & REGULATORY COMPLIANCE",
            flowSteps: ["Tax Log sync", "GST return prep", "Submit GSTR", "Tax payment", "Audit file log"],
            controls: "Tax sync checking routines, GSTIN validator portal.",
            risks: "Preparing boutique sales tax registers using manual Excel sheets.",
            kpis: "GST filing compliance rate (target: 100%), filing time variance.",
            insights: "Direct ERP GSTR exports eliminate manual classification errors and tax fines.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED GST REGISTER FILINGS", badge: "GST compliance tools", practice: "Verify tax transaction data is exported directly from the ERP tax ledger for filing.", evidence: "Compare tax return filing receipts against the ERP ledger transactions.", redflag: "Manual tax calculations performed on spreadsheets." }
            ]
        },
        {
            id: 27, cat: 4, name: "APPROVAL MATRIX GOVERNANCE",
            flowSteps: ["Request raise", "Limit evaluation", "Matrix routing", "Approver action", "ERP log entry"],
            controls: "ERP workflow limits configuration, system override alerts.",
            risks: "Signing physical approval vouchers for over-budget expenses.",
            kpis: "System override alerts count, approval routing time.",
            insights: "Enforcing system-locked limits prevents rogue spending and budget slippage.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "SYSTEM LIMIT CONTROL", badge: "Governance routing", practice: "Check if over-budget expense approvals are routed automatically within the ERP system.", evidence: "Inspect approval logs for override transactions to verify authorization levels matched policies.", redflag: "Approving transactions via paper forms or offline emails." }
            ]
        },

        // Category 5: Human Capital Processes (28-31)
        {
            id: 28, cat: 5, name: "RECRUITMENT & ONBOARDING",
            flowSteps: ["Profile Application", "BG Verify", "Security Check", "System Role creation", "Training", "Floor deployment"],
            controls: "HRMS profile verification, digital security log registry.",
            risks: "Onboarding new hires with handwritten reference logs and paper background forms.",
            kpis: "HRMS record completeness, onboarding duration.",
            insights: "Uploading credentials to central HRMS stops identity fraud and profile leaks.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL HR ONBOARDING", badge: "HR tools compliance", practice: "Verify new employee credentials and background checks are uploaded directly to the HRMS.", evidence: "Audit HR records to confirm all active profiles contain digital verification logs.", redflag: "Background checks stored in paper cabinet folders." }
            ]
        },
        {
            id: 29, cat: 5, name: "EMPLOYEE PERFORMANCE MANAGEMENT",
            flowSteps: ["KPI Setting", "Mid-term review", "Peer assessment", "Annual evaluation", "Rating sync"],
            controls: "HRMS performance dashboard, peer rating sync logs.",
            risks: "Managing employee reviews on paper forms stored in filing cabinets.",
            kpis: "HRMS evaluation completeness, scorecard accuracy.",
            insights: "Digitized KPIs eliminate manager bias and improve employee retention.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "HRMS KPI SCORECARDS", badge: "Employee review tools", practice: "Check if showroom staff appraisals are performed using HRMS scorecard dashboards.", evidence: "Verify that KPI ratings match database history records.", redflag: "Performance appraisals written on printed forms." }
            ]
        },
        {
            id: 30, cat: 5, name: "INCENTIVE & COMMISSION MANAGEMENT",
            flowSteps: ["Invoice sync", "Commission run", "Validation check", "Manager approve", "Payroll dispatch"],
            controls: "ERP sales incentive module, paid invoice validator.",
            risks: "Boutique managers calculating commission on manually compiled Excel sheets.",
            kpis: "Commission payout accuracy, reconciliation time.",
            insights: "ERP-locked commission calculation prevents overpayments on returned items.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED COMMISSION LOGS", badge: "Incentive tools", practice: "Confirm sales incentives are calculated automatically by the ERP sales commission module.", evidence: "Match paid commissions against ERP invoices for sales representatives.", redflag: "Managers manually computing commission on spreadsheets." }
            ]
        },
        {
            id: 31, cat: 5, name: "ATTENDANCE & PAYROLL CONTROLS",
            flowSteps: ["Biometric Sync", "Leave matching", "Salary calculation", "Tax deduction", "Disbursement"],
            controls: "Biometric attendance sync, automated payroll scripts.",
            risks: "Boutique staff editing attendance in manual register books.",
            kpis: "Biometric clock matching rate, payroll processing speed.",
            insights: "Direct biometric sync to payroll prevents 'buddy punching' and salary leaks.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "BIOMETRIC SYSTEM INTEGRATION", badge: "Payroll system control", practice: "Verify biometric clock-in logs sync directly to the ERP payroll module.", evidence: "Compare daily biometric clock logs against employee payslip records.", redflag: "Manual attendance records edited by managers in Excel." }
            ]
        },

        // Category 6: Executive Control Processes (32-36)
        {
            id: 32, cat: 6, name: "RETAIL KPI ENGINE",
            flowSteps: ["Data Collection", "Telemetry processing", "Metric calculation", "Scorecard generation", "Exec review"],
            controls: "Live data ingestion scripts, BI dashboard sync.",
            risks: "Managers compiling daily sales reports manually in Excel and emailing them.",
            kpis: "Dashboard sync latency, automated alert completeness.",
            insights: "Unified BI scorecards provide executive visibility into store margins instantly.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED BI TELEMETRY", badge: "KPI system checks", practice: "Verify showroom telemetry dashboards fetch live metrics, replacing manual daily sales reports.", evidence: "Inspect live data connection logs for BI dashboards.", redflag: "Managers manually compiling Excel reports." }
            ]
        },
        {
            id: 33, cat: 6, name: "RETAIL OPERATING SYSTEM",
            flowSteps: ["SOP Review", "Policy updates", "Staff induction", "Compliance audit", "Feedback loop"],
            controls: "Centralized policy portal, SOP read/receipt audits.",
            risks: "Keeping retail SOP manuals in printed ring binders at cash desks.",
            kpis: "Portal read compliance percentage, policy update latency.",
            insights: "Centralised portals ensure staff always access the latest control guidelines.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "CENTRALIZED POLICY PORTAL", badge: "Policy access tools", practice: "Confirm showroom staff access standard procedures via the digital policy portal.", evidence: "Audit user read receipts on the digital policy platform.", redflag: "Printed SOP binders at showroom cash desks." }
            ]
        },
        {
            id: 34, cat: 6, name: "EXECUTIVE DECISION INTELLIGENCE",
            flowSteps: ["Goal setting", "Telemetry audit", "Gap identification", "Action planning", "Review meeting"],
            controls: "BI data registry verification, dashboard sync logs.",
            risks: "Conducting executive board reviews using static PowerPoint slides.",
            kpis: "Decision lead time, data accuracy validation rate.",
            insights: "Interacting directly with BI tools during reviews makes business strategies agile.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "BI DASHBOARD ANALYTICS", badge: "Executive review tools", practice: "Verify executive meetings use live BI dashboards for operational reviews.", evidence: "Confirm strategic decisions are logged directly on the system's planning portal.", redflag: "Using static PowerPoint decks for performance reviews." }
            ]
        },
        {
            id: 35, cat: 6, name: "RISK & FRAUD MANAGEMENT",
            flowSteps: ["Alert capture", "Investigate raise", "Evidence collect", "Root cause audit", "Mitigate plan"],
            controls: "ERP fraud alert triggers, dual auditor action logs.",
            risks: "Investigating price exceptions and CCTV logs without system-generated alerts.",
            kpis: "Fraud resolution time, system exception rates.",
            insights: "Automated alert feeds catch outlier transactions before major margin loss occurs.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "AUTOMATED EXCEPTION ALERTS", badge: "Risk monitoring tools", practice: "Verify the system triggers alerts for high-value discount overrides in real-time.", evidence: "Audit discount override log history to check for prompt manager sign-offs.", redflag: "Overrides processed without alert logs." }
            ]
        },
        {
            id: 36, cat: 6, name: "INTERNAL AUDIT & COMPLIANCE",
            flowSteps: ["Plan Audit", "Floor check", "Findings register", "Corrective action", "Compliance close"],
            controls: "Cloud action register portal, auditor verification logs.",
            risks: "Tracking audit observations in Excel files, leading to ignored findings.",
            kpis: "Audit action closure rate, observation age.",
            insights: "Cloud-based trackers ensure boutique managers resolve active gaps in 30 days.",
            checklist: [
                { id: 1, stage: "Stage 01", title: "DIGITAL FINDINGS REGISTER", badge: "Internal audit review", practice: "Confirm audit findings are tracked in the cloud action registry.", evidence: "Check the action registry to verify resolved audit observations have documentation proof.", redflag: "Audit observations managed via separate offline files." }
            ]
        }
    ];

    let currentCategoryId = 1;
    let currentProcessId = 1;
    let currentLayerId = 2; // Default to Layer 2: Controls

    function buildHtml() {
        container.innerHTML = `
            <div class="explorer-header">
                <div class="explorer-header-info">
                    <h4 class="explorer-header-title">Retail Process Governance & Audit Explorer</h4>
                    <p class="explorer-header-subtitle">Standardized retail operating model spanning 36 core processes. Check off the elements that are currently active to compute your compliance score.</p>
                </div>
                <div class="explorer-stats">
                    <div class="explorer-stat-box">
                        <div class="explorer-stat-label">Health Score</div>
                        <div class="explorer-stat-val green" id="explorer-health-val">100%</div>
                    </div>
                    <div class="explorer-stat-box">
                        <div class="explorer-stat-label">Active Gaps</div>
                        <div class="explorer-stat-val" id="explorer-gaps-val">0</div>
                    </div>
                </div>
            </div>

            <!-- Category Tab Navigation -->
            <div class="explorer-cat-navigation-wrapper">
                <button type="button" class="explorer-nav-arrow left" id="explorer-nav-left">◀</button>
                <div class="explorer-cat-tabs" id="explorer-cat-tabs-scroll">
                    <button type="button" class="explorer-cat-tab-btn active" data-cat="1">Customer & Sales Processes</button>
                    <button type="button" class="explorer-cat-tab-btn" data-cat="2">Inventory & Operations Processes</button>
                    <button type="button" class="explorer-cat-tab-btn" data-cat="3">Procurement & Supply Chain Processes</button>
                    <button type="button" class="explorer-cat-tab-btn" data-cat="4">Finance & Compliance Processes</button>
                    <button type="button" class="explorer-cat-tab-btn" data-cat="5">Human Capital Processes</button>
                    <button type="button" class="explorer-cat-tab-btn" data-cat="6">Executive Control Processes</button>
                </div>
                <button type="button" class="explorer-nav-arrow right" id="explorer-nav-right">▶</button>
            </div>

            <div class="explorer-workspace">
                <!-- Sidebar Processes List -->
                <div class="explorer-sidebar" id="explorer-process-list"></div>

                <!-- Process Details Panel -->
                <div class="explorer-detail-panel" id="explorer-details"></div>
            </div>

            <!-- Save & Submit Action Area -->
            <div class="explorer-footer">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-explorer" style="font-size:12px; padding:6px 12px;">Reset All Checkpoints</button>
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-explorer" style="font-size:12px; padding:6px 12px; background-color:#3b82f6; border-color:#3b82f6;">Save Audit & Close</button>
            </div>
        `;

        // Bind Category Tab Clicks
        container.querySelectorAll(".explorer-cat-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                container.querySelectorAll(".explorer-cat-tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentCategoryId = parseInt(btn.getAttribute("data-cat"));
                
                // Set the active process to the first one in the new category
                const catProcs = EXPLORER_PROCESSES.filter(p => p.cat === currentCategoryId);
                if (catProcs.length > 0) {
                    currentProcessId = catProcs[0].id;
                }
                renderWorkspace();
            });
        });

        // Bind arrow navigation clicks
        const scrollContainer = container.querySelector("#explorer-cat-tabs-scroll");
        const navLeft = container.querySelector("#explorer-nav-left");
        const navRight = container.querySelector("#explorer-nav-right");
        if (scrollContainer && navLeft && navRight) {
            navLeft.addEventListener("click", () => {
                scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
            });
            navRight.addEventListener("click", () => {
                scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
            });
        }

        // Bind Reset Button
        container.querySelector("#btn-reset-explorer").addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all process checklist items? This will reset your compliance health score.")) {
                EXPLORER_PROCESSES.forEach(p => {
                    p.checklist.forEach(item => {
                        const key = `aura-audit-p-${p.id}-item-${item.id}`;
                        localStorage.removeItem(key);
                    });
                });
                updateStats();
                renderWorkspace();
            }
        });

        // Bind Save Button
        container.querySelector("#btn-save-explorer").addEventListener("click", () => {
            markTaskComplete(3, 'internal', 0);
            alert("Process Governance Audit successfully saved to logs!");
            closeExecutionDrawer();
        });

        renderWorkspace();
    }

    function renderWorkspace() {
        const listContainer = document.getElementById("explorer-process-list");
        const detailsContainer = document.getElementById("explorer-details");
        if (!listContainer || !detailsContainer) return;

        // 1. Render Left Sidebar Process List
        listContainer.innerHTML = "";
        const filteredProcs = EXPLORER_PROCESSES.filter(p => p.cat === currentCategoryId);

        filteredProcs.forEach(p => {
            // Check if all checklist items are checked
            let allChecked = true;
            p.checklist.forEach(item => {
                const key = `aura-audit-p-${p.id}-item-${item.id}`;
                if (localStorage.getItem(key) !== "true") {
                    allChecked = false;
                }
            });

            const item = document.createElement("div");
            item.className = `explorer-process-item ${p.id === currentProcessId ? 'active' : ''}`;
            item.innerHTML = `
                <div class="explorer-process-info">
                    <span class="explorer-process-num">Process ${String(p.id).padStart(2, '0')}</span>
                    <span class="explorer-process-name">${p.name}</span>
                </div>
                <span class="explorer-process-badge ${allChecked ? 'ok' : 'gap'}">${allChecked ? '100% OK' : 'GAP'}</span>
            `;

            item.addEventListener("click", () => {
                currentProcessId = p.id;
                renderWorkspace();
            });

            listContainer.appendChild(item);
        });

        // 2. Render Right Process Details
        const activeProc = EXPLORER_PROCESSES.find(p => p.id === currentProcessId);
        if (!activeProc) return;

        detailsContainer.innerHTML = `
            <div class="explorer-detail-header">
                <h5 class="explorer-detail-title">${String(activeProc.id).padStart(2, '0')}. ${activeProc.name} — Core Architecture</h5>
                <span class="explorer-matrix-badge">5-Layer Matrix</span>
            </div>

            <!-- Layer Tabs -->
            <div class="explorer-layer-tabs">
                <button type="button" class="explorer-layer-tab-btn ${currentLayerId === 1 ? 'active' : ''}" data-layer="1">Layer 1: Process Flow</button>
                <button type="button" class="explorer-layer-tab-btn ${currentLayerId === 2 ? 'active' : ''}" data-layer="2">Layer 2: Controls</button>
                <button type="button" class="explorer-layer-tab-btn ${currentLayerId === 3 ? 'active' : ''}" data-layer="3">Layer 3: Risks</button>
                <button type="button" class="explorer-layer-tab-btn ${currentLayerId === 4 ? 'active' : ''}" data-layer="4">Layer 4: KPIs</button>
                <button type="button" class="explorer-layer-tab-btn ${currentLayerId === 5 ? 'active' : ''}" data-layer="5">Layer 5: Executive Insights</button>
            </div>

            <!-- Layer Content -->
            <div class="explorer-layer-box">
                <div class="explorer-layer-title" id="explorer-layer-title-lbl">Standardized Controls (What should happen)</div>
                <div id="explorer-layer-content-area"></div>
            </div>

            <!-- Checklist Protocol Area -->
            <div class="explorer-checklist-box">
                <h6 class="explorer-checklist-title">Operational Adherence & Practice Audit</h6>
                <p class="explorer-checklist-subtitle">Evaluate actual floor practice against standard procedures. Verify evidence of execution and compliance.</p>
                
                <div style="display:flex; flex-direction:column; gap:12px;" id="explorer-checklists-list"></div>
            </div>
        `;

        // Bind Layer Tab Clicks
        detailsContainer.querySelectorAll(".explorer-layer-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                detailsContainer.querySelectorAll(".explorer-layer-tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentLayerId = parseInt(btn.getAttribute("data-layer"));
                updateLayerText(activeProc);
            });
        });

        // Set initial layer text
        updateLayerText(activeProc);

        // Render checklist items
        const checksList = detailsContainer.querySelector("#explorer-checklists-list");
        activeProc.checklist.forEach(item => {
            const key = `aura-audit-p-${activeProc.id}-item-${item.id}`;
            const isChecked = localStorage.getItem(key) === "true";

            const row = document.createElement("div");
            row.className = `explorer-check-row ${isChecked ? 'active' : ''}`;
            row.innerHTML = `
                <div class="explorer-check-left">
                    <div class="explorer-check-indicator-circle"></div>
                </div>
                <div class="explorer-check-content">
                    <div class="explorer-check-header">
                        <span class="explorer-check-stage-num">${item.stage}</span>
                        <span class="explorer-check-stage-badge">${item.badge}</span>
                    </div>
                    <div class="explorer-check-title">${item.title}</div>
                    
                    <div class="explorer-check-practice-section" style="margin-top: 6px;">
                        <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 2px;">Floor Practice (How it's followed)</span>
                        <span style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; display: block;">${item.practice}</span>
                    </div>
                    
                    <div class="explorer-check-evidence-section" style="margin-top: 6px; border-top: 1px dashed var(--border-color); padding-top: 6px;">
                        <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 2px;">Evidence of Execution (Are they doing it)</span>
                        <span style="font-size: 11px; color: var(--text-secondary); line-height: 1.4; display: block;">${item.evidence}</span>
                    </div>
                    
                    <div class="explorer-check-tip" style="margin-top: 8px; font-size: 10px; font-weight: 600; color: #f59e0b;">
                        ⚠️ Red Flag: ${item.redflag}
                    </div>
                </div>
                <div class="explorer-check-right-status" style="color: ${isChecked ? '#10b981' : '#ef4444'}">
                    ${isChecked ? 'Compliant' : 'Adherence Gap'}
                </div>
            `;

            row.addEventListener("click", () => {
                const newState = localStorage.getItem(key) !== "true";
                localStorage.setItem(key, newState ? "true" : "false");
                
                if (newState) {
                    row.classList.add("active");
                    row.querySelector(".explorer-check-right-status").style.color = '#10b981';
                    row.querySelector(".explorer-check-right-status").textContent = 'Compliant';
                } else {
                    row.classList.remove("active");
                    row.querySelector(".explorer-check-right-status").style.color = '#ef4444';
                    row.querySelector(".explorer-check-right-status").textContent = 'Adherence Gap';
                }
                
                // Update stats and sidebar badge instantly
                updateStats();
                
                // Re-render sidebar and active elements
                const listItems = listContainer.querySelectorAll(".explorer-process-item");
                const catProcs = EXPLORER_PROCESSES.filter(p => p.cat === currentCategoryId);
                const procIndex = catProcs.findIndex(p => p.id === activeProc.id);
                if (procIndex !== -1 && listItems[procIndex]) {
                    let allChecked = true;
                    activeProc.checklist.forEach(chk => {
                        if (localStorage.getItem(`aura-audit-p-${activeProc.id}-item-${chk.id}`) !== "true") {
                            allChecked = false;
                        }
                    });
                    const badge = listItems[procIndex].querySelector(".explorer-process-badge");
                    if (badge) {
                        badge.className = `explorer-process-badge ${allChecked ? 'ok' : 'gap'}`;
                        badge.textContent = allChecked ? '100% OK' : 'GAP';
                    }
                }
            });

            checksList.appendChild(row);
        });

        updateStats();
    }

    function updateLayerText(proc) {
        const titleLbl = document.getElementById("explorer-layer-title-lbl");
        const contentArea = document.getElementById("explorer-layer-content-area");
        if (!titleLbl || !contentArea) return;

        if (currentLayerId === 1) {
            titleLbl.textContent = "Visual Process Flow (What Happens)";
            
            // Build flowchart HTML
            let flowHtml = `
                <div class="visual-flow-container">
                    <div class="visual-flow-subtitle">Visual Process Flow (What Happens)</div>
                    <div class="visual-flow-steps">
            `;
            proc.flowSteps.forEach((step, idx) => {
                flowHtml += `<div class="visual-flow-step">${step}</div>`;
                if (idx < proc.flowSteps.length - 1) {
                    flowHtml += `<div class="visual-flow-arrow">➔</div>`;
                }
            });
            flowHtml += `
                    </div>
                </div>
            `;
            contentArea.innerHTML = flowHtml;
        } else {
            let label = "";
            let text = "";
            if (currentLayerId === 2) {
                label = "Standardized Controls (What should happen)";
                text = proc.controls;
            } else if (currentLayerId === 3) {
                label = "Potential Risks (Vulnerabilities)";
                text = proc.risks;
            } else if (currentLayerId === 4) {
                label = "Key Performance Indicators (KPIs)";
                text = proc.kpis;
            } else if (currentLayerId === 5) {
                label = "Executive Insights (Strategic Value)";
                text = proc.insights;
            }
            titleLbl.textContent = label;
            contentArea.innerHTML = `<p class="explorer-layer-text">${text}</p>`;
        }
    }

    function updateStats() {
        // Count total items and checked items across all 36 processes
        let totalItemsCount = 0;
        let checkedItemsCount = 0;

        EXPLORER_PROCESSES.forEach(p => {
            p.checklist.forEach(item => {
                totalItemsCount++;
                const key = `aura-audit-p-${p.id}-item-${item.id}`;
                if (localStorage.getItem(key) === "true") {
                    checkedItemsCount++;
                }
            });
        });

        const healthVal = document.getElementById("explorer-health-val");
        const gapsVal = document.getElementById("explorer-gaps-val");

        if (healthVal && gapsVal) {
            const pct = totalItemsCount > 0 ? Math.round((checkedItemsCount / totalItemsCount) * 100) : 100;
            const gaps = totalItemsCount - checkedItemsCount;
            
            healthVal.textContent = `${pct}%`;
            gapsVal.textContent = gaps;

            // Adjust health score styling based on compliance
            if (pct >= 90) {
                healthVal.className = "explorer-stat-val green";
            } else {
                healthVal.className = "explorer-stat-val yellow";
            }
            
            if (gaps > 0) {
                gapsVal.className = "explorer-stat-val yellow";
            } else {
                gapsVal.className = "explorer-stat-val green";
            }
        }
    }

    buildHtml();
}



// ==========================================================================
// bespoke TOOL 3.4: OBSERVATION REGISTER
// ==========================================================================

function renderObservationRegister(container) {
    const raw = localStorage.getItem("aura-data-observations");
    let logs = [];
    
    if (raw) {
        try { logs = JSON.parse(raw); } catch(e){}
    }

    if (logs.length === 0) {
        // Mock default values for initial preview
        logs = [
            { id: "OBS-01", dept: "Atelier Operations", severity: "High", desc: "Gold scrap weight discrepancies in filing desk", status: "Open" },
            { id: "OBS-02", dept: "Sales Floor", severity: "Medium", desc: "RFID tag detection gaps near doorway sensor", status: "In Progress" },
            { id: "OBS-03", dept: "Inventory Control", severity: "Low", desc: "Vault records written manually in logbook", status: "Resolved" }
        ];
    }

    let rowsHtml = "";
    logs.forEach(log => {
        let badgeColor = "#2563eb"; // blue
        if (log.severity === "High") badgeColor = "#ef4444"; // red
        if (log.severity === "Medium") badgeColor = "#d97706"; // amber

        rowsHtml += `
            <tr>
                <td><span style="font-weight:700;">${log.id}</span></td>
                <td>${log.dept}</td>
                <td><span class="badge" style="background-color:rgba(0,0,0,0.03); border-color:${badgeColor}; color:${badgeColor};">${log.severity}</span></td>
                <td>${log.desc}</td>
                <td>${log.status}</td>
            </tr>
        `;
    });

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:24px;">
            <h4 class="form-label" style="font-size:14px;">Observation Register Log</h4>
            <p class="form-helper" style="margin-top:-16px;">Centralized registry to log, track, and close operational observations:</p>

            <div class="dynamic-table-container">
                <table class="dynamic-table">
                    <thead>
                        <tr>
                            <th>Obs ID</th>
                            <th>Department</th>
                            <th>Severity</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>

            <button type="button" class="btn btn-secondary btn-sm" id="btn-export-obs-register">
                <span>Export Register (CSV)</span>
            </button>
        </div>
    `;

    document.getElementById("btn-export-obs-register").addEventListener("click", () => {
        markTaskComplete(3, 'internal', 1);
        alert("Observation Register data exported to CSV format.");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// bespoke TOOL 3.5: TRAVEL PLANNING & SCHEDULING (INTERNAL)
// ==========================================================================

function renderInternalTravelPlanning(container) {
    const raw = localStorage.getItem("aura-travel-plan");
    let plan = { auditor: "", driver: "", flight: "", hotel: "", status: "Pending" };
    if (raw) {
        try { plan = JSON.parse(raw); } catch(e){}
    }

    container.innerHTML = `
        <form id="tool-travel-plan-form" onsubmit="event.preventDefault();" style="display:flex; flex-direction:column; gap:20px;">
            <h4 class="form-label" style="font-size:14px;">Travel Logistics Desk</h4>
            
            <div class="form-grid">
                <div>
                    <label class="form-label">Assign Auditor</label>
                    <input type="text" class="form-control" id="tr-auditor" value="${plan.auditor}" placeholder="e.g. Robert Smith">
                </div>
                <div>
                    <label class="form-label">Assign Driver / Shuttle</label>
                    <input type="text" class="form-control" id="tr-driver" value="${plan.driver}" placeholder="e.g. Auto Cab Service">
                </div>
                <div>
                    <label class="form-label">Book Flight Code</label>
                    <input type="text" class="form-control" id="tr-flight" value="${plan.flight}" placeholder="e.g. Air India AI-801">
                </div>
                <div>
                    <label class="form-label">Hotel Reservation</label>
                    <input type="text" class="form-control" id="tr-hotel" value="${plan.hotel}" placeholder="e.g. Marriott Hotel">
                </div>
                <div class="form-group-full">
                    <label class="form-label">Audit Travel Status</label>
                    <select class="form-control" id="tr-status">
                        <option value="Pending" ${plan.status==='Pending'?'selected':''}>Pending Flight Approval</option>
                        <option value="Booked" ${plan.status==='Booked'?'selected':''}>Flight & Hotel Booked</option>
                        <option value="On-Site" ${plan.status==='On-Site'?'selected':''}>Auditor Active On-Site</option>
                        <option value="Completed" ${plan.status==='Completed'?'selected':''}>Audit Completed</option>
                    </select>
                </div>
            </div>

            <div class="wizard-footer">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-travel-plan">Confirm Logistics</button>
            </div>
        </form>
    `;

    document.getElementById("btn-save-travel-plan").addEventListener("click", () => {
        const newPlan = {
            auditor: document.getElementById("tr-auditor").value,
            driver: document.getElementById("tr-driver").value,
            flight: document.getElementById("tr-flight").value,
            hotel: document.getElementById("tr-hotel").value,
            status: document.getElementById("tr-status").value
        };

        localStorage.setItem("aura-travel-plan", JSON.stringify(newPlan));
        markTaskComplete(3, 'internal', 2);
        alert("Travel Logistics and status registers updated successfully!");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// REUSABLE FALLBACK WORKSPACE: GENERAL COLLABORATIVE WORKSPACE
// ==========================================================================

function renderFallbackWorkspace(phaseId, type, taskIdx, container) {
    const taskKey = `aura-gen-task-p${phaseId}-${type}-${taskIdx}`;
    
    // Load local storage details
    const savedStatus = localStorage.getItem(`${taskKey}-status`) || "notstarted";
    const rawComments = localStorage.getItem(`${taskKey}-comments`);
    
    let commentsList = [];
    if (rawComments) {
        try { commentsList = JSON.parse(rawComments); } catch(e){}
    }

    let commentsHtml = "";
    if (commentsList.length === 0) {
        commentsHtml = `<div class="text-muted" style="text-align:center; font-size:12.5px; padding:20px 0;">No team comments logged yet. Start the conversation below.</div>`;
    } else {
        commentsList.forEach(c => {
            commentsHtml += `
                <div class="comment-row">
                    <div class="comment-meta">
                        <span>${c.author}</span>
                        <span class="comment-time">${c.time}</span>
                    </div>
                    <div class="comment-txt">${c.text}</div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:24px;">
            <!-- Task status tracker -->
            <div>
                <label class="form-label">Responsibility Workflow Status</label>
                <select class="form-control" id="gen-task-status">
                    <option value="notstarted" ${savedStatus==='notstarted'?'selected':''}>Not Started</option>
                    <option value="inprogress" ${savedStatus==='inprogress'?'selected':''}>In Progress / Active</option>
                    <option value="blocked" ${savedStatus==='blocked'?'selected':''}>Blocked / Needs Review</option>
                    <option value="completed" ${savedStatus==='completed'?'selected':''}>Completed & Approved</option>
                </select>
            </div>

            <!-- Documents Slot -->
            <div class="audit-topic-card" style="margin-bottom: 0;">
                <div class="audit-topic-header">
                    <span style="font-weight:600; font-size:13px;">Phase Attachments & Deliverables</span>
                </div>
                <div class="upload-zone" id="gen-upload-zone" style="padding: 20px 10px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="upload-icon" style="width:28px; height:28px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <div class="upload-text" style="font-size:12px;">Click to upload document voucher</div>
                </div>
            </div>

            <!-- Comments Logs feed -->
            <div>
                <label class="form-label">Team Activity & Comments Log</label>
                <div class="feed-comments-container" id="comments-feed-box">
                    ${commentsHtml}
                </div>
                
                <div style="margin-top:12px; display:flex; gap:8px;">
                    <input type="text" class="form-control" id="gen-comment-input" placeholder="Type comments or ask team heads..." style="flex-grow:1;">
                    <button type="button" class="btn btn-primary btn-sm" id="btn-add-gen-comment" style="padding:0 16px;">Post</button>
                </div>
            </div>

            <div class="wizard-footer" style="margin-top:12px;">
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-gen-workspace" style="width:100%;">Save Work Logs</button>
            </div>
        </div>
    `;

    // Comment Post Handler
    const postBtn = document.getElementById("btn-add-gen-comment");
    const commentInput = document.getElementById("gen-comment-input");
    const feedBox = document.getElementById("comments-feed-box");

    if (postBtn && commentInput) {
        postBtn.addEventListener("click", () => {
            const text = commentInput.value.trim();
            if (!text) return;

            const newComment = {
                author: type === 'client' ? "Client Lead" : "Transformation Consultant",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: text
            };

            commentsList.push(newComment);
            localStorage.setItem(`${taskKey}-comments`, JSON.stringify(commentsList));
            commentInput.value = "";
            
            // Re-render feed
            let html = "";
            commentsList.forEach(c => {
                html += `
                    <div class="comment-row">
                        <div class="comment-meta">
                            <span>${c.author}</span>
                            <span class="comment-time">${c.time}</span>
                        </div>
                        <div class="comment-txt">${c.text}</div>
                    </div>
                `;
            });
            feedBox.innerHTML = html;
            feedBox.scrollTop = feedBox.scrollHeight;
        });
    }

    // Mock Upload trigger for general slot
    const genUpload = document.getElementById("gen-upload-zone");
    if (genUpload) {
        genUpload.addEventListener("click", () => {
            alert("File attached successfully to workspace.");
        });
    }

    // Save
    document.getElementById("btn-save-gen-workspace").addEventListener("click", () => {
        const newStatus = document.getElementById("gen-task-status").value;
        localStorage.setItem(`${taskKey}-status`, newStatus);

        // Sync completion state to master checkboxes
        const inputKey = `aura-task-p${phaseId}-${type}-${taskIdx}`;
        if (newStatus === "completed") {
            localStorage.setItem(inputKey, "true");
        } else {
            localStorage.setItem(inputKey, "false");
        }

        // Trigger updates in background dashboard
        if (typeof updateOverallProgress === "function") {
            updateOverallProgress();
            updatePhaseProgress(phaseId);
        }

        alert("Task logs and progress registers successfully updated!");
        closeExecutionDrawer();
    });
}

// ==========================================================================
// CONFIG-DRIVEN DYNAMIC AUDIT DETAIL MODAL RENDERER
// ==========================================================================

const AUDIT_DATA = {
    1: {
        title: "Inventory & Stock Control",
        tabs: [
            {
                id: "productivity",
                label: "Inventory Productivity",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "How much capital is trapped in inventory?", type: "progress", label: "Trapped Capital", val: "₹12.4 Crores", badgeClass: "red", fillClass: "red", fillWidth: 70, sub: "70% of trapped capital (₹8.6 Cr) lies in slow-moving Diamond/Studded inventory aged over 360 days." },
                            { q: "Which inventory generates poor returns?", type: "double-progress", label1: "Gold LOB Return (ROC)", val1: "22.0% ROC", badgeClass1: "green", fillClass1: "green", fillWidth1: 80, label2: "Diamond LOB Return (ROC)", val2: "4.8% ROC", badgeClass2: "red", fillClass2: "red", fillWidth2: 18 },
                            { q: "Which categories consume capital without producing profits?", type: "value", label: "Polki & Uncut Solitaires", val: "High Excess", badgeClass: "yellow", sub: "Polki line holds ₹4.2 Cr in active stock, but accounts for only 6% of quarterly sales volume." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Why is inventory ageing increasing?", type: "progress", label: "Average Stock Age", val: "165 Days", badgeClass: "red", fillClass: "red", fillWidth: 100, sub: "Stock tenure rose from 110 days to 165 days in Q1 due to delayed launch of wedding-themed promo events." },
                            { q: "Which stores are hoarding inventory?", type: "multi-progress", bars: [{ label: "Mumbai", val: "42%", width: 42, class: "blue" }, { label: "Pune", val: "28%", width: 28, class: "yellow" }, { label: "Surat", val: "30%", width: 30, class: "green" }], sub: "Mumbai showroom holds a disproportionate 42% share of slow-moving bridal inventory." },
                            { q: "Which products repeatedly fail to move?", type: "value", label: "Jadau & Heavy Temple Necklaces", val: "Dead Stock", badgeClass: "red", sub: "Traditional Jadau bridal collections over 240 days active showing zero customer trial logs." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Which SKUs are likely to become dead stock?", type: "progress", label: "Estimated Liquidation Risk", val: "₹1.8 Cr at risk", badgeClass: "red", fillClass: "red", fillWidth: 45, sub: "Heavy chokers have a 92% statistical model probability of remaining unsold for the next 180 days." },
                            { q: "Which categories will face stock-outs?", type: "progress", label: "Daily Wear Gold Chains", val: "3 Days Buffer", badgeClass: "red", fillClass: "red", fillWidth: 15, sub: "Current stock levels will deplete in 3 days due to high regional festival bookings. Reorder immediately." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Should inventory be redistributed?", type: "progress", label: "Pune to Mumbai Gold Rebalance", val: "Approved (2.5kg)", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "Redistribute 2.5kg gold chains from Pune (excess) to Mumbai (near stock-out) to capture immediate sales." },
                            { q: "Which collections should be liquidated?", type: "value", label: "Temple Gold Classic Collection", val: "15% Discount", badgeClass: "yellow", sub: "Recommend a 15% discount campaign to clear ₹1.2 Cr of aged temple jewelry before the new season stock arrives." }
                        ]
                    }
                ]
            },
            {
                id: "intelligence",
                label: "Merchandise Intelligence",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Which collections define brand success?", type: "progress", label: "Aura Minimalist Collection", val: "64% Sales Share", badgeClass: "green", fillClass: "green", fillWidth: 64, sub: "Lightweight gold, rose gold, and daily-wear solitaires contribute the majority of transaction volume." },
                            { q: "Which collections are losing relevance?", type: "progress", label: "Heavy Antique Bridal Neckpieces", val: "-24% YoY Demand", badgeClass: "red", fillClass: "red", fillWidth: 76 }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Why are certain collections underperforming?", type: "progress", label: "Pricing Gap vs Benchmark", val: "+14% vs Market", badgeClass: "red", fillClass: "red", fillWidth: 86, sub: "Our solitaire studs are priced 14% higher than local benchmark catalogs, resulting in a low 2.1% showroom conversion rate." },
                            { q: "Are designs outdated or overpriced?", type: "value", label: "Jadau Traditional Line", val: "Outdated (Gen-Z)", badgeClass: "red", sub: "Focus group logs note that Gen-Z bridal segments perceive traditional Jadau neckpieces as 'too heavy and rigid'." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Which trends will dominate next season?", type: "progress", label: "Minimalist Platinum Bands", val: "+35% Forecast", badgeClass: "green", fillClass: "green", fillWidth: 75, sub: "Solitaire engagement rings and bands expected to witness a 35% surge in wedding bookings next quarter." },
                            { q: "Which collections will lose demand?", type: "progress", label: "Antique Silver Temple Jewelry", val: "-15% Forecast", badgeClass: "red", fillClass: "red", fillWidth: 15 }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Which collections deserve larger investments?", type: "progress", label: "Floral Lightweight Collections", val: "+40% Allocation", badgeClass: "green", fillClass: "green", fillWidth: 80, sub: "Increase design and production budget by 40% to meet strong office-wear and work-wear gold preferences." },
                            { q: "Which collections should be retired?", type: "value", label: "Heirloom Jadau Bridal Line", val: "Retire", badgeClass: "red", sub: "Discontinue this heavy line from Pune and Surat branches to free up shelf space and trapped inventory capital." }
                        ]
                    }
                ]
            }
        ]
    },
    2: {
        title: "Showroom Operations",
        tabs: [
            {
                id: "performance",
                label: "Showroom Performance",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Average customer footfall conversion rate?", type: "double-progress", label1: "Gold Walk-ins Conversion", val1: "38.5% rate", badgeClass1: "green", fillClass1: "green", fillWidth1: 85, label2: "Diamond Walk-ins Conversion", val2: "18.2% rate", badgeClass2: "yellow", fillClass2: "yellow", fillWidth2: 45 },
                            { q: "Showroom sales efficiency index?", type: "progress", label: "Staff Efficiency Score", val: "8.4 / 10", badgeClass: "green", fillClass: "green", fillWidth: 84, sub: "High score achieved due to digital catalog training. Mumbai led with 9.1/10." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Boutique visual appeal index?", type: "progress", label: "Customer Experience Audit", val: "9.2 / 10 rating", badgeClass: "green", fillClass: "green", fillWidth: 92, sub: "Mumbai showroom scored highest on layout, ambient lighting, and counter compliance." },
                            { q: "Boutique staff utilization?", type: "multi-progress", bars: [{ label: "Showroom Floor", val: "68%", width: 68, class: "blue" }, { label: "Billing", val: "12%", width: 12, class: "yellow" }, { label: "Idle/Waiting", val: "20%", width: 20, class: "red" }], sub: "Idle rate peaks between 2:00 PM and 4:30 PM daily." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Expected weekend footfall spike?", type: "progress", label: "Akshaya Tritiya Footfall Boost", val: "+45% footfall", badgeClass: "green", fillClass: "green", fillWidth: 90, sub: "Historical CRM models indicate heavy walk-in spikes. Additional security and hosting staff recommended." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Showroom staff allocation?", type: "value", label: "Reallocate Floor Hosts", val: "2 Staff to Billing", badgeClass: "yellow", sub: "Shift 2 greeters to the billing desk during evening rush hours to reduce customer wait time." }
                        ]
                    }
                ]
            },
            {
                id: "satisfaction",
                label: "Customer Satisfaction",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Net Promoter Score (NPS)?", type: "progress", label: "Customer Loyalty Score", val: "NPS: 72", badgeClass: "green", fillClass: "green", fillWidth: 72, sub: "Luxury standards benchmark target is 75. Solitaire purchases scored highest at 84." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Average billing wait time?", type: "progress", label: "POS Transaction Delay", val: "18 Minutes avg", badgeClass: "red", fillClass: "red", fillWidth: 90, sub: "Average wait time rises to 28 minutes during peak festival weekends. POS server delay is the main bottleneck." }
                        ]
                    }
                ]
            }
        ]
    },
    3: {
        title: "Sales & Client Experience",
        tabs: [
            {
                id: "velocity",
                label: "Sales Velocity",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Average transaction value (ATV)?", type: "progress", label: "Ticket Size Trend", val: "₹1.85 Lakhs", badgeClass: "green", fillClass: "green", fillWidth: 74, sub: "Ticket sizes are up 12% YoY, primarily driven by diamond bridal customization bookings." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Bridal consultation success rate?", type: "progress", label: "Closed Bridal Enquiries", val: "42% Win Rate", badgeClass: "yellow", fillClass: "yellow", fillWidth: 42, sub: "58% of bridal leads drop off after the initial design layout presentation. Price negotiation is the primary drop factor." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Solitaire sales demand spike?", type: "progress", label: "Festive Solitaire Demand", val: "+25% Q3 projections", badgeClass: "green", fillClass: "green", fillWidth: 75, sub: "Early customized pre-bookings indicate massive demand for solitaire rings and light necklaces." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Target margin adjustment?", type: "value", label: "Increase Value Add Margin", val: "+5% margin", badgeClass: "green", sub: "Raise making charges/value-add margin on custom designs by 5% as demand elasticity remains low." }
                        ]
                    }
                ]
            },
            {
                id: "relationship",
                label: "Relationship Marketing",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Repeat buyer contribution?", type: "progress", label: "Loyalty Revenue Share", val: "38% of total revenue", badgeClass: "green", fillClass: "green", fillWidth: 76, sub: "Loyalty club members account for 38% of total sales, outperforming industry averages." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Active VIP clients retention?", type: "progress", label: "Ultra-High Net Worth Clients", val: "88% Retention", badgeClass: "green", fillClass: "green", fillWidth: 88, sub: "Retained 164 of 186 tier-1 VIP clients with dedicated relationship managers." }
                        ]
                    }
                ]
            }
        ]
    },
    4: {
        title: "Security & Compliance",
        tabs: [
            {
                id: "security",
                label: "Atelier Security",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Metal stock reconciliation accuracy?", type: "progress", label: "Daily Gold/Stone Weight Audit", val: "99.98% accurate", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "Variance holds within negligible limits of 0.02% (allowable threshold: 0.05%)." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "CCTV blind spots detected?", type: "progress", label: "Boutique Surveillance Gaps", val: "3 spots in Pune vault", badgeClass: "red", fillClass: "red", fillWidth: 100, sub: "Camera coverage in the Pune secondary vault room has three dead angles. Requires immediate mounting of wide-angle units." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Risk score during peak holiday shipping?", type: "progress", label: "Transit Loss Risk", val: "Low Risk Rating", badgeClass: "green", fillClass: "green", fillWidth: 95, sub: "Double-blind armed transit protocols have successfully mitigated outer region transfer risks." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Vault security protocol upgrade?", type: "value", label: "Dual-Control Biometrics", val: "Implement Q2", badgeClass: "green", sub: "Enforce dual-biometric access (Manager + Security Officer) to access main showrooms vault after hours." }
                        ]
                    }
                ]
            },
            {
                id: "compliance",
                label: "Compliance Checks",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "GST & customs regulatory filing status?", type: "progress", label: "Tax Compliance Auditing", val: "100% Compliant", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "All luxury tax filings and gold custom receipts verified and submitted without penalty." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Hallmarking compliance check?", type: "progress", label: "HUID Compliance Check", val: "0 issues logged", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "100% of gold items in stock have correct HUID numbers lazered and synced to Bureau of Indian Standards portal." }
                        ]
                    }
                ]
            }
        ]
    },
    5: {
        title: "Finance & Billing",
        tabs: [
            {
                id: "margins",
                label: "Cash Flow & Margins",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "EBITDA margin trend?", type: "progress", label: "Operational Profitability", val: "18.4% EBITDA", badgeClass: "green", fillClass: "green", fillWidth: 73, sub: "Margins improved by 80bps due to higher contribution of customized designer jewelry sales." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Receivables ageing >60 days?", type: "progress", label: "Client Credit Exposure", val: "₹45 Lakhs outstanding", badgeClass: "yellow", fillClass: "yellow", fillWidth: 60, sub: "Relates to three bespoke wedding orders. Post-dated checks received, pending clearance." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Interest expense projection?", type: "progress", label: "Inventory Working Capital Debt", val: "₹12 Lakhs/month", badgeClass: "yellow", fillClass: "yellow", fillWidth: 50, sub: "Interest costs rising slightly due to higher gold metal loan interest rates." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Supplier credit term renegotiation?", type: "value", label: "Extend Credit Terms", val: "90 Days Target", badgeClass: "green", sub: "Negotiate vendor terms from 60 days to 90 days for bullions to match current raw inventory holding cycle." }
                        ]
                    }
                ]
            },
            {
                id: "billing",
                label: "Billing Efficiency",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Billing error rate?", type: "progress", label: "Transaction Discrepancy", val: "0.12% errors", badgeClass: "green", fillClass: "green", fillWidth: 98, sub: "Extremely low error rate due to barcoded SKU scanners at showrooms." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Manual discounts auditing?", type: "progress", label: "Unauthorised Manual Discounts", val: "14 discrepancies", badgeClass: "red", fillClass: "red", fillWidth: 90, sub: "14 bills showed manual discount values exceeding the showroom manager's limit. Restrict system authorization." }
                        ]
                    }
                ]
            }
        ]
    },
    6: {
        title: "HR & People",
        tabs: [
            {
                id: "talent",
                label: "Talent Metrics",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Employee turnover rate?", type: "progress", label: "Annualized Attrition Rate", val: "14% Turnover", badgeClass: "green", fillClass: "green", fillWidth: 70, sub: "Well below industry retail benchmark of 28% for luxury boutiques." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Showroom staff training completion?", type: "progress", label: "Bridal Clienteling SOP Training", val: "85% Trained", badgeClass: "green", fillClass: "green", fillWidth: 85, sub: "Surat branch holds lowest completion rate (60%). Needs dedicated weekend workshop." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Expected peak season staffing gap?", type: "progress", label: "Staffing Deficit (Q3-Q4)", val: "-4 FTE staff", badgeClass: "yellow", fillClass: "yellow", fillWidth: 60, sub: "Temporary consultants must be hired by Q3 to prevent customer friction on Mumbai showroom floor." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Commission structure revision?", type: "value", label: "Introduce Bridal Incentive Tier", val: "+1.5% extra commission", badgeClass: "green", sub: "Add a 1.5% commission kicker on closed bridal sales exceeding ₹10 Lakhs to motivate top closers." }
                        ]
                    }
                ]
            },
            {
                id: "satisfaction",
                label: "Employee NPS",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Employee engagement score?", type: "progress", label: "Internal Satisfaction Survey", val: "8.2 / 10", badgeClass: "green", fillClass: "green", fillWidth: 82, sub: "Top feedback points positive about store working environment, but requested better scheduling systems." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Overtime hours during wedding season?", type: "progress", label: "Avg Overtime Hours", val: "+22 hrs/employee", badgeClass: "yellow", fillClass: "yellow", fillWidth: 55, sub: "Showroom staff averaged 22 hours of overtime during November-December peaks. Implement rotating shift patterns." }
                        ]
                    }
                ]
            }
        ]
    },
    7: {
        title: "Technology & Systems",
        tabs: [
            {
                id: "erp",
                label: "ERP & POS Infrastructure",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "ERP & POS system adoption level?", type: "progress", label: "Showroom-Wide ERP Utilization", val: "70% Full-Fledged", badgeClass: "yellow", fillClass: "yellow", fillWidth: 70, sub: "Billing is digital, but workshop job-work and vault storage still use manual logs and Excel sheets, creating reconciliation lags." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Any data sync and reconciliation gaps?", type: "progress", label: "Real-time Inventory Sync Gaps", val: "30% Manual Logs", badgeClass: "yellow", fillClass: "yellow", fillWidth: 60, sub: "Lack of automatic sync between POS sales and vault ledger forces manual end-of-day stock counts, leading to variance risks." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Operational efficiency loss due to manual tools?", type: "progress", label: "Checkout & Billing Process Lag", val: "15-Minute Bottleneck", badgeClass: "yellow", fillClass: "yellow", fillWidth: 80, sub: "Because sales executives must double-check inventory weights manually, customer wait times at checkout average 15 minutes during peak peaks." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Path to full-fledged ERP & POS integration?", type: "value", label: "Integrated ERP & RFID Deployment", val: "Schedule Q3", badgeClass: "green", sub: "Deploy a unified ERP system with RFID tracking across showroom, vault, and workshops to eliminate manual logging and improve checkout speed by 60%." }
                        ]
                    }
                ]
            },
            {
                id: "cyber",
                label: "Cybersecurity",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Cybersecurity control coverage (MFA & Roles)?", type: "progress", label: "MFA & Role-Based Access Coverage", val: "45% Implemented", badgeClass: "red", fillClass: "red", fillWidth: 45, sub: "Role-based access is not strictly enforced. Only 45% of system users have Multi-Factor Authentication active, creating vulnerability." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "System access audit gaps?", type: "progress", label: "Shared Account & Access Control Gaps", val: "High Risk Gaps", badgeClass: "red", fillClass: "red", fillWidth: 85, sub: "Multiple sales representatives share a single POS login, making it impossible to audit individual accountability for cashier variance." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Vulnerability to insider fraud and data leaks?", type: "progress", label: "Insider Fraud Risk Rating", val: "Critical Level", badgeClass: "red", fillClass: "red", fillWidth: 90, sub: "Without audit trails for manual price updates and discount overrides, the system is highly vulnerable to rogue transaction alterations." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Deploy enterprise IAM and biometric logins?", type: "value", label: "Enterprise IAM & SSO Deployment", val: "Under Review", badgeClass: "yellow", sub: "Implement strict Identity Access Management (IAM), Single Sign-On (SSO), and biometric checkout authorization to enforce accountability." }
                        ]
                    }
                ]
            }
        ]
    },
    8: {
        title: "Visual Merchandising",
        tabs: [
            {
                id: "display",
                label: "Display Compliance",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Boutique VM compliance score?", type: "progress", label: "Visual Guidelines Audit", val: "94% Compliant", badgeClass: "green", fillClass: "green", fillWidth: 94, sub: "Mumbai and Pune matched 100% compliance. Surat had 3 misaligned jewelry stands." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Window display refresh cycle?", type: "progress", label: "Main Facade Rotation", val: "18 days avg", badgeClass: "yellow", fillClass: "yellow", fillWidth: 80, sub: "Refresh cycle lagging behind target of 14 days. Staff shortage at visual design department cited." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "New wedding season launch VM readiness?", type: "progress", label: "Props & Material In-transit", val: "On Track (90%)", badgeClass: "green", fillClass: "green", fillWidth: 90, sub: "All new wedding themed display boards and custom velvet cases shipped to boutiques." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Implement digital video brochures?", type: "value", label: "In-counter Digital Tablets", val: "Deploy in Mumbai & Pune", badgeClass: "green", sub: "Equip 8 counters with digital lookbooks showing 3D interactive model angles to clients." }
                        ]
                    }
                ]
            },
            {
                id: "lighting",
                label: "Lighting & Ambience",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Showroom lux level compliance?", type: "progress", label: "Showcase Lumens Calibration", val: "100% compliant", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "All gemstone cabinets verified at correct color rendering indexes (CRI >95)." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Surat Boutique LED Issues?", type: "progress", label: "Faulty Driver Loops", val: "2 displays dimming", badgeClass: "yellow", fillClass: "yellow", fillWidth: 40, sub: "Surat bridal wing showcases 3 and 4 showing faulty driver loops. Replacement scheduled." }
                        ]
                    }
                ]
            }
        ]
    },
    9: {
        title: "Marketing & CRM",
        tabs: [
            {
                id: "campaigns",
                label: "Campaign Performance",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Return on Ad Spend (ROAS)?", type: "progress", label: "Bridal Campaign ROAS", val: "4.8x ROAS", badgeClass: "green", fillClass: "green", fillWidth: 80, sub: "Digital campaigns on high net-worth audiences performed best, yielding 5.4x ROAS." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Customer acquisition cost (CAC)?", type: "progress", label: "Cost Per New High Value Lead", val: "₹1,250 / client", badgeClass: "green", fillClass: "green", fillWidth: 90, sub: "CAC remains well within target limits (limit: ₹2,000) due to efficient social media targeting." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Expected conversions from VIP preview?", type: "progress", label: "Bespoke Collection Bookings", val: "+180 bookings", badgeClass: "green", fillClass: "green", fillWidth: 85, sub: "Predicted revenue volume of ₹6.2 Cr from exclusive tier-1 preview bookings." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Digital vs Print ad budget split?", type: "multi-progress", bars: [{ label: "Digital Ads", val: "70%", width: 70, class: "blue" }, { label: "Print/Premium Mag", val: "30%", width: 30, class: "yellow" }], sub: "Reallocate 10% more to digital channels due to stronger trackable conversions." }
                        ]
                    }
                ]
            },
            {
                id: "database",
                label: "CRM Database",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Total active loyalty members?", type: "progress", label: "Loyalty Club Active Base", val: "18,500 members", badgeClass: "green", fillClass: "green", fillWidth: 74, sub: "Database grew by 15% in Q1. High concentration in Mumbai region." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Email campaign open rate?", type: "progress", label: "Monthly Collection Lookbook Open Rate", val: "28.4% open rate", badgeClass: "green", fillClass: "green", fillWidth: 71, sub: "Benchmark for luxury retail is 22%. Personalized subject lines boosted engagement." }
                        ]
                    }
                ]
            }
        ]
    },
    10: {
        title: "Governance & Processes",
        tabs: [
            {
                id: "sops",
                label: "SOP Auditing",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Standard operating procedures adoption?", type: "progress", label: "Boutique SOP Audit Score", val: "92% Adoption", badgeClass: "green", fillClass: "green", fillWidth: 92, sub: "High compliance observed in gold intake weighing and tag logging SOPs." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Cash-handover logbook audits?", type: "progress", label: "Cashier Shift Log compliance", val: "100% logs signed", badgeClass: "green", fillClass: "green", fillWidth: 100, sub: "Perfect compliance across all boutiques. Zero cash discrepancies recorded." }
                        ]
                    },
                    {
                        title: "Predictive Questions",
                        icon: "📈",
                        items: [
                            { q: "Internal process audit readiness?", type: "progress", label: "Readiness Score", val: "High Readiness", badgeClass: "green", fillClass: "green", fillWidth: 95, sub: "Internal controls are well documented and aligned with corporate standards." }
                        ]
                    },
                    {
                        title: "Strategic Questions",
                        icon: "🎯",
                        items: [
                            { q: "Appoint dedicated compliance officer?", type: "value", label: "Regional Compliance Lead", val: "Appointed Q1", badgeClass: "green", sub: "Officer conducts bi-weekly audits across Surrat, Pune and Mumbai locations." }
                        ]
                    }
                ]
            },
            {
                id: "risk",
                label: "Risk Register",
                cards: [
                    {
                        title: "Executive Questions",
                        icon: "🧠",
                        items: [
                            { q: "Total logged enterprise risks?", type: "progress", label: "Active Operational Risks", val: "4 active risks", badgeClass: "green", fillClass: "green", fillWidth: 40, sub: "All 4 risks have mitigation plans signed off by executive sponsors." }
                        ]
                    },
                    {
                        title: "Diagnostic Questions",
                        icon: "❓",
                        items: [
                            { q: "Business continuity plan updates?", type: "value", label: "Disaster Recovery Testing", val: "Completed Q1", badgeClass: "green", sub: "Simulated downtime test executed successfully. POS local cache offline mode validated." }
                        ]
                    }
                ]
            }
        ]
    }
};

window.showAuditAreaModal = function(areaId) {
    const data = AUDIT_DATA[areaId];
    if (!data) return;

    let existingModal = document.getElementById("audit-area-detail-modal");
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement("div");
    modal.id = "audit-area-detail-modal";
    modal.className = "audit-modal-overlay active";

    // Build tabs HTML
    let tabsHtml = "";
    data.tabs.forEach((tab, index) => {
        tabsHtml += `
            <button type="button" class="audit-modal-tab-btn ${index === 0 ? 'active' : ''}" 
                id="audit-tab-btn-${tab.id}" 
                onclick="switchAuditAreaTab('${tab.id}', '${data.tabs.map(t => t.id).join(',')}')">
                ${tab.label}
            </button>
        `;
    });

    // Build tab contents HTML
    let contentsHtml = "";
    data.tabs.forEach((tab, index) => {
        let cardsHtml = "";
        tab.cards.forEach(card => {
            let itemsHtml = "";
            card.items.forEach(item => {
                let innerHtml = "";
                if (item.type === "progress") {
                    innerHtml = `
                        <div class="audit-modal-val-row">
                            <span class="audit-modal-val-label">${item.label}</span>
                            <span class="audit-modal-val-badge ${item.badgeClass || 'green'}">${item.val}</span>
                        </div>
                        <div class="audit-modal-bar-track">
                            <div class="audit-modal-bar-fill ${item.fillClass || 'green'}" style="width: ${item.fillWidth}%;"></div>
                        </div>
                    `;
                } else if (item.type === "multi-progress") {
                    innerHtml = `
                        <div class="audit-modal-val-row" style="font-size: 10px;">
                            ${item.bars.map(b => `<span>${b.label}: ${b.val}</span>`).join('')}
                        </div>
                        <div class="audit-modal-bar-track" style="display: flex;">
                            ${item.bars.map(b => `<div class="audit-modal-bar-fill ${b.class}" style="width: ${b.width}%; border-radius: 0;"></div>`).join('')}
                        </div>
                    `;
                } else if (item.type === "double-progress") {
                    innerHtml = `
                        <div class="audit-modal-val-row">
                            <span class="audit-modal-val-label">${item.label1}</span>
                            <span class="audit-modal-val-badge ${item.badgeClass1}">${item.val1}</span>
                        </div>
                        <div class="audit-modal-bar-track">
                            <div class="audit-modal-bar-fill ${item.fillClass1}" style="width: ${item.fillWidth1}%;"></div>
                        </div>
                        <div class="audit-modal-val-row" style="margin-top: 6px;">
                            <span class="audit-modal-val-label">${item.label2}</span>
                            <span class="audit-modal-val-badge ${item.badgeClass2}">${item.val2}</span>
                        </div>
                        <div class="audit-modal-bar-track">
                            <div class="audit-modal-bar-fill ${item.fillClass2}" style="width: ${item.fillWidth2}%;"></div>
                        </div>
                    `;
                } else {
                    innerHtml = `
                        <div class="audit-modal-val-row">
                            <span class="audit-modal-val-label">${item.label}</span>
                            <span class="audit-modal-val-badge ${item.badgeClass || 'green'}">${item.val}</span>
                        </div>
                    `;
                }

                itemsHtml += `
                    <div class="audit-modal-item">
                        <span class="audit-modal-q">${item.q}</span>
                        <div class="audit-modal-a">
                            ${innerHtml}
                            ${item.sub ? `<p class="audit-modal-subtext">${item.sub}</p>` : ''}
                        </div>
                    </div>
                `;
            });

            cardsHtml += `
                <div class="audit-modal-card">
                    <div class="audit-modal-card-header">
                        <div class="audit-modal-card-title-group">
                            <span class="audit-modal-card-icon">${card.icon}</span>
                            <h6 class="audit-modal-card-title">${card.title}</h6>
                        </div>
                        <span class="audit-modal-card-badge">${card.items.length} Items</span>
                    </div>
                    <div class="audit-modal-items">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        });

        contentsHtml += `
            <div class="audit-modal-tab-content ${index === 0 ? 'active' : ''}" id="audit-tab-content-${tab.id}">
                ${cardsHtml}
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="audit-modal-content" onclick="event.stopPropagation()">
            <div class="audit-modal-header">
                <h5 class="audit-modal-title">${data.title} Audit Detail</h5>
                <button type="button" class="audit-modal-close-btn" onclick="document.getElementById('audit-area-detail-modal').remove()">&times;</button>
            </div>
            
            <div class="audit-modal-tabs">
                ${tabsHtml}
            </div>

            ${contentsHtml}
        </div>
    `;

    modal.addEventListener("click", () => {
        modal.remove();
    });

    document.body.appendChild(modal);
};

window.switchAuditAreaTab = function(activeTabId, allTabIdsStr) {
    const allTabIds = allTabIdsStr.split(',');
    allTabIds.forEach(tabId => {
        const content = document.getElementById(`audit-tab-content-${tabId}`);
        const btn = document.getElementById(`audit-tab-btn-${tabId}`);
        if (content && btn) {
            if (tabId === activeTabId) {
                content.classList.add("active");
                btn.classList.add("active");
            } else {
                content.classList.remove("active");
                btn.classList.remove("active");
            }
        }
    });
};
