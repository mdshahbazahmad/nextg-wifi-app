/**
 * NextG WiFi - Updated Sidebar Component (src/components/sidebar.js)
 * Fully connected with Router Control, App Settings & Modules
 */

function renderSidebarComponent(sidebarContainer) {
    const userProfile = {
        name: "NextG Consumer",
        phone: "+91 98765 43210",
        connectionId: "NG-WIFI-8842",
        accountStatus: "Active Member"
    };

    sidebarContainer.innerHTML = `
        <!-- SIDEBAR CONTAINER OVERLAY / DRAWER -->
        <div id="sidebarDrawer" style="position: fixed; top: 0; left: -300px; width: 280px; height: 100vh; background: #0f172a; border-right: 1px solid #334155; z-index: 500; transition: left 0.3s ease; display: flex; flex-direction: column; box-shadow: 10px 0 25px rgba(0,0,0,0.5);">
            
            <!-- 1. USER PROFILE HEADER -->
            <div style="padding: 20px 16px; background: linear-gradient(135deg, #1e293b, #0f172a); border-bottom: 1px solid #334155; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #F58220; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px;">
                        ${userProfile.name.charAt(0)}
                    </div>
                    <div>
                        <h4 style="color: #fff; font-size: 15px; margin: 0; font-weight: 700;">${userProfile.name}</h4>
                        <span style="font-size: 11px; color: #10b981; font-weight: bold;">● ${userProfile.accountStatus}</span>
                    </div>
                </div>
                <button onclick="toggleSidebarDrawer(false)" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px;">
                    ✖
                </button>
            </div>

            <!-- 2. NAVIGATION MENU ITEMS -->
            <div style="flex: 1; overflow-y: auto; padding: 12px;">
                
                <!-- MAIN MODULES -->
                <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 8px 8px;">नेविगेशन (Navigation)</div>

                <div onclick="navigateToView('home')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    🏠 <span>Home Overview</span>
                </div>

                <div onclick="navigateToView('recharge')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    💳 <span>Quick Recharge</span>
                </div>

                <div onclick="navigateToView('status')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    📊 <span>Network Status</span>
                </div>

                <div onclick="navigateToView('connection')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    🔌 <span>New Connection</span>
                </div>

                <div style="height: 1px; background: #334155; margin: 12px 0;"></div>

                <!-- NEW ROUTER & SYSTEM CONTROLS -->
                <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 8px 8px;">राउटर एवं सिस्टम सेटिंग्स</div>

                <!-- ROUTER CONTROL BUTTON -->
                <div onclick="navigateToView('router_control')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #38bdf8; background: rgba(56, 189, 248, 0.1); cursor: pointer; font-size: 13px; margin-bottom: 4px; font-weight: bold;">
                    ⚙️ <span>राउटर रिमोट कंट्रोल (Router Control)</span>
                </div>

                <!-- APP SETTINGS (APP LOCK, THEME, LANGUAGE) -->
                <div onclick="navigateToView('app_settings')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    🎨 <span>ऐप सेटिंग्स (Lock, Theme, Language)</span>
                </div>

                <!-- BILLING HISTORY -->
                <div onclick="navigateToView('billing')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    📄 <span>बिलिंग हिस्ट्री व रसीद (Invoices)</span>
                </div>

                <div style="height: 1px; background: #334155; margin: 12px 0;"></div>

                <!-- SUPPORT DESK -->
                <div style="font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 8px 8px;">सपोर्ट (Help Desk)</div>

                <div onclick="navigateToView('support')" class="sidebar-item" style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; cursor: pointer; font-size: 13px; margin-bottom: 4px;">
                    🚨 <span>शिकायत दर्ज करें (Raise Ticket)</span>
                </div>
            </div>

            <!-- 3. FOOTER LOGOUT -->
            <div style="padding: 14px; border-top: 1px solid #334155; background: #0b1120;">
                <button onclick="handleAppLogout()" style="width: 100%; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #ef4444; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer;">
                    🚪 लॉग आउट (Log Out)
                </button>
            </div>

        </div>

        <!-- BACKDROP OVERLAY -->
        <div id="sidebarBackdrop" onclick="toggleSidebarDrawer(false)" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(2px); z-index: 490; display: none;"></div>
    `;

    // SENSOR TOGGLE CONTROLLER
    window.toggleSidebarDrawer = function(open = true) {
        const drawer = document.getElementById('sidebarDrawer');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (drawer && backdrop) {
            drawer.style.left = open ? '0px' : '-300px';
            backdrop.style.display = open ? 'block' : 'none';
        }
    };

    // CENTRAL NAVIGATION SWITCHER
    window.navigateToView = function(viewName) {
        window.toggleSidebarDrawer(false); // Close sidebar
        const mainContainer = document.getElementById('appContent');
        if (!mainContainer) return;

        switch(viewName) {
            case 'home':
                if (typeof renderHomeModule === 'function') renderHomeModule(mainContainer);
                break;
            case 'recharge':
                if (typeof renderRechargeModule === 'function') renderRechargeModule(mainContainer);
                break;
            case 'status':
                if (typeof renderStatusModule === 'function') renderStatusModule(mainContainer);
                break;
            case 'connection':
                if (typeof renderConnectionModule === 'function') renderConnectionModule(mainContainer);
                break;
            case 'router_control':
                if (typeof renderRouterControlComponent === 'function') renderRouterControlComponent(mainContainer);
                break;
            case 'app_settings':
                if (typeof renderAppSettingsComponent === 'function') renderAppSettingsComponent(mainContainer);
                break;
            case 'billing':
                if (typeof renderBillingHistoryComponent === 'function') renderBillingHistoryComponent(mainContainer);
                break;
            case 'support':
                if (typeof renderSupportDeskComponent === 'function') renderSupportDeskComponent(mainContainer);
                break;
        }
    };

    window.handleAppLogout = function() {
        if (confirm('क्या आप लॉग आउट करना चाहते हैं?')) {
            window.location.href = 'index.html';
        }
    };
}
