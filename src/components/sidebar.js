/**
 * NextG WiFi - Sidebar Component (Fixed Overlay Drawer)
 * File: src/components/sidebar.js
 */

function renderSidebarComponent(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <!-- Dark Backdrop -->
        <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="closeSidebar()"></div>

        <!-- Sliding Menu Drawer -->
        <div class="sidebar-wrapper" id="sidebarDrawer">
            <!-- Header with Close (X) Button -->
            <div class="sidebar-header">
                <div class="user-profile-box">
                    <div class="avatar-circle">N</div>
                    <div class="user-info">
                        <h4>NextG Consumer</h4>
                        <p>+91 XXXXX XXXXX</p>
                    </div>
                </div>
                <button class="close-sidebar-btn" onclick="closeSidebar()">✕</button>
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
            /* Backdrop Blur/Overlay */
            .sidebar-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(4px);
                z-index: 9998;
                display: none;
            }

            /* Fixed Slide-in Menu Drawer */
            .sidebar-wrapper {
                position: fixed;
                top: 0;
                left: -300px; /* Hidden off-screen by default */
                width: 280px;
                height: 100vh;
                background: #0f172a;
                padding: 20px 16px;
                color: #fff;
                text-align: left;
                z-index: 9999;
                transition: left 0.3s ease-in-out;
                box-shadow: 4px 0 16px rgba(0,0,0,0.5);
                overflow-y: auto;
            }

            /* Active class to slide in */
            .sidebar-wrapper.open {
                left: 0 !important;
            }

            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
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
            }

            .user-profile-box { display: flex; align-items: center; gap: 12px; }
            .avatar-circle { width: 40px; height: 40px; background: #F58220; color: #fff; font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
            .user-info h4 { font-size: 14px; margin: 0; color: #f8fafc; }
            .user-info p { font-size: 11px; color: #64748b; margin: 2px 0 0 0; }

            .nav-section-title { font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 10px; letter-spacing: 1px; }
            .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
            .sidebar-item { display: flex; align-items: center; gap: 10px; background: #1e293b; border: 1px solid #334155; padding: 12px 14px; border-radius: 10px; color: #f8fafc; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s; }
            .sidebar-item:hover { border-color: #F58220; background: #26334d; }

            .sidebar-footer { margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; }
            .logout-btn { width: 100%; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-weight: bold; cursor: pointer; }
        </style>
    `;
}

// Toggle Sidebar Open/Close Functions
function openSidebar() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.classList.add("open");
        backdrop.style.display = "block";
    }
}

function closeSidebar() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.classList.remove("open");
        backdrop.style.display = "none";
    }
}

// Handler to switch module and close sidebar automatically
function handleSidebarClick(moduleName) {
    closeSidebar();
    if (typeof switchAppTab === 'function') {
        switchAppTab(moduleName);
    } else if (typeof window.switchTab === 'function') {
        window.switchTab(moduleName);
    }
}
