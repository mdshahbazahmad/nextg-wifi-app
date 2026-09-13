/**
 * NextG WiFi - Sidebar Component
 * File: src/components/sidebar.js
 */

// 1. Global Functions (Direct Window Attachment to Fix Freeze)
window.openSidebar = function() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.style.left = "0px";
        backdrop.style.display = "block";
    } else {
        console.error("Sidebar elements missing in DOM!");
    }
};

window.closeSidebar = function() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.style.left = "-300px";
        backdrop.style.display = "none";
    }
};

window.handleSidebarClick = function(moduleName) {
    window.closeSidebar();
    
    // Switch Page/Module safely
    if (typeof switchAppTab === 'function') {
        switchAppTab(moduleName);
    } else if (typeof window.switchAppTab === 'function') {
        window.switchAppTab(moduleName);
    }
};

// 2. Main Render Function
function renderSidebarComponent(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <!-- Dark Backdrop Overlay -->
        <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="window.closeSidebar()"></div>

        <!-- Sliding Menu Drawer -->
        <div class="sidebar-wrapper" id="sidebarDrawer">
            <!-- Header -->
            <div class="sidebar-header">
                <div class="user-profile-box">
                    <div class="avatar-circle">N</div>
                    <div class="user-info">
                        <h4>NextG Consumer</h4>
                        <p id="drawerUserEmail">user@nextgwifi.com</p>
                    </div>
                </div>
                <button type="button" class="close-sidebar-btn" onclick="window.closeSidebar()">✕</button>
            </div>

            <!-- Navigation Links -->
            <div class="nav-section-title">NAVIGATION</div>
            <div class="sidebar-menu">
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('home')">
                    🏠 Home Overview
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('routerControl')">
                    ⚙️ Router Remote Control
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('appSettings')">
                    📱 App Settings
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('billingHistory')">
                    📄 Invoices & Billing
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('supportDesk')">
                    🎟️ Raise Support Ticket
                </button>
            </div>

            <!-- Logout -->
            <div class="sidebar-footer">
                <button type="button" class="logout-btn" onclick="handleLogout()">
                    🚪 Log Out
                </button>
            </div>
        </div>

        <style>
            .sidebar-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(4px);
                z-index: 99998;
                display: none;
            }

            .sidebar-wrapper {
                position: fixed;
                top: 0;
                left: -300px; /* Hidden off-screen */
                width: 280px;
                height: 100vh;
                background: #0f172a;
                padding: 20px 16px;
                color: #fff;
                text-align: left;
                z-index: 99999;
                transition: left 0.25s ease-in-out;
                box-shadow: 4px 0 20px rgba(0,0,0,0.6);
                overflow-y: auto;
                box-sizing: border-box;
            }

            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #1e293b;
            }

            .close-sidebar-btn {
                background: #1e293b;
                border: 1px solid #334155;
                color: #94a3b8;
                font-size: 16px;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .user-profile-box { display: flex; align-items: center; gap: 10px; }
            .avatar-circle { width: 38px; height: 38px; background: #F58220; color: #fff; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
            .user-info h4 { font-size: 13px; margin: 0; color: #f8fafc; }
            .user-info p { font-size: 10px; color: #64748b; margin: 2px 0 0 0; }

            .nav-section-title { font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 10px; letter-spacing: 1px; }
            .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
            .sidebar-item { display: flex; align-items: center; gap: 10px; background: #1e293b; border: 1px solid #334155; padding: 12px 14px; border-radius: 10px; color: #f8fafc; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s; width: 100%; }
            .sidebar-item:active { border-color: #F58220; background: #26334d; }

            .sidebar-footer { margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; }
            .logout-btn { width: 100%; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-weight: bold; cursor: pointer; }
        </style>
    `;
}
