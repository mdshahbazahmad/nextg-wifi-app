/**
 * NextG WiFi - English Default Dynamic Sidebar Component
 * File: src/components/sidebar.js
 */

function renderSidebarComponent(containerElement) {
    if (!containerElement) return;

    // Default English Sidebar UI Layout
    const sidebarHTML = `
        <!-- Overlay -->
        <div id="sidebarOverlay" class="sidebar-overlay" onclick="toggleSidebarDrawer(false)"></div>

        <!-- Sidebar Drawer Body -->
        <aside id="sidebarDrawer" class="sidebar-drawer">
            <!-- Header section with User Info & Profile Edit Trigger -->
            <div class="sidebar-header">
                <div class="user-profile-box" onclick="openProfileModal()">
                    <div class="user-avatar" id="sidebarAvatar">N</div>
                    <div class="user-details">
                        <h4 id="sidebarUserName">NextG Consumer</h4>
                        <p id="sidebarUserPhone">+91 XXXXX XXXXX</p>
                    </div>
                    <button class="edit-profile-btn" title="Edit Profile">✏️</button>
                </div>
                <button class="close-sidebar-btn" onclick="toggleSidebarDrawer(false)">✕</button>
            </div>

            <!-- Navigation Sections -->
            <div class="sidebar-content">
                <div class="menu-section">
                    <span class="section-title">NAVIGATION</span>
                    <button class="menu-item" onclick="handleSidebarNavigation('home', this)">
                        <span class="icon">🏠</span> Home Overview
                    </button>
                    <button class="menu-item" onclick="handleSidebarNavigation('recharge', this)">
                        <span class="icon">💳</span> Quick Recharge
                    </button>
                    <button class="menu-item" onclick="handleSidebarNavigation('status', this)">
                        <span class="icon">📊</span> Network Status
                    </button>
                    <button class="menu-item" onclick="handleSidebarNavigation('connection', this)">
                        <span class="icon">🔌</span> New Connection
                    </button>
                </div>

                <div class="menu-divider"></div>

                <div class="menu-section">
                    <span class="section-title">ROUTER & SYSTEM SETTINGS</span>
                    <button class="menu-item" onclick="handleSidebarNavigation('routerControl', this)">
                        <span class="icon">⚙️</span> Router Control
                    </button>
                    <button class="menu-item" onclick="handleSidebarNavigation('appSettings', this)">
                        <span class="icon">🎨</span> App Settings (Theme, Language)
                    </button>
                    <button class="menu-item" onclick="handleSidebarNavigation('billingHistory', this)">
                        <span class="icon">📄</span> Invoices & Billing
                    </button>
                </div>

                <div class="menu-divider"></div>

                <div class="menu-section">
                    <span class="section-title">HELP DESK</span>
                    <button class="menu-item" onclick="handleSidebarNavigation('supportDesk', this)">
                        <span class="icon">🚨</span> Raise Support Ticket
                    </button>
                </div>

                <div class="logout-box">
                    <button class="logout-btn" onclick="handleSidebarLogout()">
                        <span class="icon">🚪</span> Log Out
                    </button>
                </div>
            </div>
        </aside>

        <!-- Profile Edit Modal -->
        <div id="profileEditModal" class="profile-modal-overlay" style="display:none;">
            <div class="profile-modal-content">
                <div class="modal-header">
                    <h3>Edit Personal Details</h3>
                    <button onclick="closeProfileModal()">✕</button>
                </div>
                <div class="modal-body">
                    <label>Full Name</label>
                    <input type="text" id="editUserName" value="NextG Consumer" placeholder="Enter Full Name">

                    <label>Mobile Number</label>
                    <input type="tel" id="editUserPhone" value="+91 9876543210" placeholder="Enter Mobile Number">

                    <label>Complete Address</label>
                    <textarea id="editUserAddress" rows="2" placeholder="Enter your full installation address"></textarea>

                    <label>Identity Verification (e.g. Govt ID / [Aadhaar Redacted])</label>
                    <input type="text" id="editUserGovtId" value="XXXX-XXXX-1234" placeholder="Enter ID Number">

                    <button class="save-profile-btn" onclick="saveUserProfile()">Save Changes</button>
                </div>
            </div>
        </div>

        <style>
            /* Sidebar Modern Styling */
            .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; display: none; }
            .sidebar-drawer { position: fixed; top: 0; left: -300px; width: 290px; height: 100%; background: #0f172a; z-index: 201; display: flex; flex-direction: column; transition: 0.3s ease-in-out; border-right: 1px solid #1e293b; color: #fff; }
            .sidebar-drawer.open { left: 0; }
            
            .sidebar-header { padding: 20px 15px; background: #1e293b; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
            .user-profile-box { display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1; }
            .user-avatar { width: 42px; height: 42px; background: #F58220; color: #fff; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
            .user-details h4 { font-size: 14px; margin: 0; color: #fff; }
            .user-details p { font-size: 11px; color: #94a3b8; margin-top: 2px; }
            .edit-profile-btn { background: none; border: none; font-size: 14px; cursor: pointer; }
            .close-sidebar-btn { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; }

            .sidebar-content { padding: 15px; flex: 1; overflow-y: auto; }
            .section-title { font-size: 10px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
            .menu-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 12px; background: none; border: none; color: #cbd5e1; font-size: 13px; border-radius: 8px; cursor: pointer; text-align: left; transition: 0.2s; margin-bottom: 4px; }
            .menu-item:hover, .menu-item.active { background: #1e293b; color: #F58220; }
            .menu-divider { height: 1px; background: #334155; margin: 12px 0; }

            .logout-box { margin-top: 15px; }
            .logout-btn { width: 100%; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

            /* Modal Styling */
            .profile-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
            .profile-modal-content { background: #1e293b; width: 100%; max-width: 400px; border-radius: 12px; padding: 20px; color: #fff; border: 1px solid #334155; }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
            .modal-header button { background: none; border: none; color: #fff; font-size: 16px; cursor: pointer; }
            .modal-body label { display: block; font-size: 12px; color: #94a3b8; margin: 10px 0 4px; }
            .modal-body input, .modal-body textarea { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #fff; font-size: 13px; }
            .save-profile-btn { width: 100%; margin-top: 20px; padding: 12px; background: #F58220; border: none; border-radius: 8px; color: #fff; font-weight: bold; cursor: pointer; }
        </style>
    `;

    containerElement.innerHTML = sidebarHTML;
}

// Global Actions for Sidebar
function toggleSidebarDrawer(show) {
    const drawer = document.getElementById("sidebarDrawer");
    const overlay = document.getElementById("sidebarOverlay");
    if (!drawer || !overlay) return;

    if (show) {
        drawer.classList.add("open");
        overlay.style.display = "block";
    } else {
        drawer.classList.remove("open");
        overlay.style.display = "none";
    }
}

// Navigation Helper connecting with Main Tabs / Dynamic Components
function handleSidebarNavigation(targetModule, buttonElement) {
    toggleSidebarDrawer(false);

    // Update active UI state
    document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
    if (buttonElement) buttonElement.classList.add("active");

    const mainContainer = document.getElementById("mainContainer");

    // Call corresponding module rendering logic
    if (targetModule === 'home' && typeof renderHomeModule === 'function') {
        renderHomeModule(mainContainer);
    } else if (targetModule === 'recharge' && typeof renderRechargeModule === 'function') {
        renderRechargeModule(mainContainer);
    } else if (targetModule === 'status' && typeof renderStatusModule === 'function') {
        renderStatusModule(mainContainer);
    } else if (targetModule === 'connection' && typeof renderConnectionModule === 'function') {
        renderConnectionModule(mainContainer);
    } else if (targetModule === 'routerControl' && typeof renderRouterControlComponent === 'function') {
        renderRouterControlComponent(mainContainer);
    } else if (targetModule === 'appSettings' && typeof renderAppSettingsComponent === 'function') {
        renderAppSettingsComponent(mainContainer);
    } else if (targetModule === 'billingHistory' && typeof renderBillingHistoryComponent === 'function') {
        renderBillingHistoryComponent(mainContainer);
    } else if (targetModule === 'supportDesk' && typeof renderSupportDeskComponent === 'function') {
        renderSupportDeskComponent(mainContainer);
    } else {
        alert("Selected module code is coming up next!");
    }
}

// Profile Modal Actions
function openProfileModal() {
    document.getElementById("profileEditModal").style.display = "flex";
}

function closeProfileModal() {
    document.getElementById("profileEditModal").style.display = "none";
}

function saveUserProfile() {
    const newName = document.getElementById("editUserName").value;
    const newPhone = document.getElementById("editUserPhone").value;

    if (newName) {
        document.getElementById("sidebarUserName").innerText = newName;
        document.getElementById("sidebarAvatar").innerText = newName.charAt(0).toUpperCase();
    }
    if (newPhone) {
        document.getElementById("sidebarUserPhone").innerText = newPhone;
    }

    alert("Profile Details Updated Successfully!");
    closeProfileModal();
}

function handleSidebarLogout() {
    if (typeof handleLogout === "function") {
        handleLogout();
    } else {
        alert("Logging out...");
        window.location.href = "./index.html";
    }
}
