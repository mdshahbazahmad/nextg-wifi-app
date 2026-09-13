/**
 * NextG WiFi - Sidebar Component
 * File: src/components/sidebar.js
 */

function renderSidebarComponent(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <div class="sidebar-wrapper">
            <!-- User Profile Header -->
            <div class="user-profile-box">
                <div class="avatar-circle">N</div>
                <div class="user-info">
                    <h4>NextG Consumer</h4>
                    <p>+91 XXXXX XXXXX</p>
                </div>
            </div>

            <!-- Navigation Links -->
            <div class="nav-section-title">NAVIGATION</div>
            <div class="sidebar-menu">
                <button class="sidebar-item" onclick="handleSidebarClick('home')">
                    🏠 Home Overview
                </button>
                <button class="sidebar-item" onclick="handleSidebarClick('routerControl')">
                    ⚙️ Router Remote Control
                </button>
                <button class="sidebar-item" onclick="handleSidebarClick('appSettings')">
                    📱 App Settings
                </button>
                <button class="sidebar-item" onclick="handleSidebarClick('billingHistory')">
                    📄 Invoices & Billing
                </button>
                <button class="sidebar-item" onclick="handleSidebarClick('supportDesk')">
                    🎟️ Raise Support Ticket
                </button>
            </div>

            <!-- Logout -->
            <div class="sidebar-footer">
                <button class="logout-btn" onclick="alert('Logging out...')">
                    🚪 Log Out
                </button>
            </div>
        </div>

        <style>
            .sidebar-wrapper { background: #0f172a; padding: 20px 15px; color: #fff; text-align: left; height: 100%; }
            .user-profile-box { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #1e293b; }
            .avatar-circle { width: 42px; height: 42px; background: #F58220; color: #fff; font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
            .user-info h4 { font-size: 14px; margin: 0; color: #f8fafc; }
            .user-info p { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }

            .nav-section-title { font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 10px; tracking: 1px; }
            .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
            .sidebar-item { display: flex; align-items: center; gap: 10px; background: #1e293b; border: 1px solid #334155; padding: 12px 14px; border-radius: 10px; color: #f8fafc; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s; }
            .sidebar-item:hover { border-color: #F58220; background: #26334d; }

            .sidebar-footer { margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; }
            .logout-btn { width: 100%; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-weight: bold; cursor: pointer; }
        </style>
    `;
}

// Direct Handler to switch views correctly without 'coming up next' Alert
function handleSidebarClick(moduleName) {
    if (typeof switchAppTab === 'function') {
        switchAppTab(moduleName);
    } else if (typeof window.switchTab === 'function') {
        window.switchTab(moduleName);
    } else {
        console.log("Switching to module:", moduleName);
    }
}
