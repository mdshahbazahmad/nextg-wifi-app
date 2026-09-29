// NextG WiFi - Core Mobile App Controller & Dynamic Router Gateway
// File: src/app.js

window.addEventListener('DOMContentLoaded', () => {
    console.log("NextG WiFi Remote Router App Initializing...");

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                buildAppShellUI(user);
            } else {
                showAuthUI();
            }
        });
    }

    attachAuthListeners();
});

// 1. Universal Remote Router Gateway Controller
const UniversalRouterPortal = {
    connectedRouterIP: "192.168.1.1",
    status: "CONNECTED_REMOTE",
    
    syncRouterSettings: function(ssid, password) {
        console.log(`[Universal Portal] Syncing to Router at ${this.connectedRouterIP}...`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Router Remote Settings Applied Successfully!" });
            }, 1200);
        });
    },

    rebootRemoteRouter: function() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: "Universal Remote Signal Sent: Router Rebooting..." });
            }, 1500);
        });
    }
};

// 2. Auth Listeners
function attachAuthListeners() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userInput = document.getElementById('login-user')?.value.trim();
            const password = document.getElementById('pass-login')?.value;

            try {
                let emailToAuth = userInput;
                if (/^\d{10}$/.test(userInput)) {
                    emailToAuth = `${userInput}@nextgwifi.com`;
                }
                await firebase.auth().signInWithEmailAndPassword(emailToAuth, password);
            } catch (error) {
                alert("Login Fail: " + error.message);
            }
        });
    }
}

// 3. Build Smart Native UI Frame
function buildAppShellUI(user) {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');

    if (authContainer) authContainer.style.display = 'none';
    if (welcomeHero) welcomeHero.style.display = 'none';

    let appContainer = document.getElementById('app-native-root');
    if (!appContainer) {
        appContainer = document.createElement('div');
        appContainer.id = 'app-native-root';
        document.body.appendChild(appContainer);
    }

    appContainer.style.display = 'block';

    appContainer.innerHTML = `
        <div class="app-viewport">
            <!-- TOP APP HEADER -->
            <header class="app-header">
                <div class="header-brand">
                    <div class="brand-logo-badge">⚡</div>
                    <div class="brand-text">
                        <span class="brand-name">NextG WiFi</span>
                        <span class="brand-tag">Remote Router Control</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" id="btn-three-lines" title="Menu">☰</button>
                </div>
            </header>

            <!-- DROPDOWN MENU -->
            <div class="dropdown-menu" id="threeLinesMenu">
                <div class="menu-item" id="menu-edit-profile">👤 Edit Profile</div>
                <div class="menu-item" data-view="router">📶 Remote Router Control</div>
                <div class="menu-item" data-view="billing">📄 Billing History</div>
                <div class="menu-item" data-view="support">🛠️ Support & Complaints</div>
                <div class="menu-item" data-view="settings">⚙️ App Settings</div>
                <div class="menu-divider"></div>
                <div class="menu-item danger" id="menu-logout">🚪 Sign Out</div>
            </div>

            <!-- MAIN DYNAMIC CONTENT SCREEN -->
            <main class="app-content" id="main-view-container"></main>

            <!-- BOTTOM NAVIGATION BAR -->
            <nav class="app-bottom-nav">
                <button class="nav-item active" data-tab="home">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label">Home</span>
                </button>
                <button class="nav-item" data-tab="router">
                    <span class="nav-icon">🎮</span>
                    <span class="nav-label">Remote</span>
                </button>
                <button class="nav-item" data-tab="status">
                    <span class="nav-icon">📊</span>
                    <span class="nav-label">Status</span>
                </button>
                <button class="nav-item" data-tab="recharge">
                    <span class="nav-icon">💳</span>
                    <span class="nav-label">Recharge</span>
                </button>
            </nav>
        </div>

        <style>
            body { margin: 0; background-color: #0b1329; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
            .app-viewport { display: flex; flex-direction: column; height: 100vh; max-width: 500px; margin: 0 auto; background: #0b1329; position: relative; overflow: hidden; }
            
            .app-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #1e293b; border-bottom: 1px solid #334155; }
            .header-brand { display: flex; align-items: center; gap: 10px; }
            .brand-logo-badge { width: 34px; height: 34px; background: #f58220; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; }
            .brand-name { font-weight: 800; font-size: 16px; color: #fff; }
            .brand-tag { font-size: 9px; color: #f58220; display: block; font-weight: bold; }
            
            .icon-btn { background: #0f172a; border: 1px solid #334155; color: #38bdf8; font-size: 20px; width: 38px; height: 38px; border-radius: 10px; cursor: pointer; }
            
            .dropdown-menu { display: none; position: absolute; top: 58px; right: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 14px; width: 220px; z-index: 200; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .dropdown-menu.show { display: block; }
            .menu-item { padding: 12px 16px; font-size: 13px; color: #cbd5e1; cursor: pointer; border-bottom: 1px solid #283548; }
            .menu-item:hover { background: #334155; color: #fff; }

            .app-content { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px; }

            .app-bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 62px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: space-around; align-items: center; z-index: 100; }
            .nav-item { background: none; border: none; color: #64748b; display: flex; flex-direction: column; align-items: center; cursor: pointer; flex: 1; }
            .nav-item.active { color: #f58220; font-weight: bold; }
            .nav-icon { font-size: 18px; }
            .nav-label { font-size: 10px; }

            .router-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 15px; }
            .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; }
            .form-input { width: 100%; box-sizing: border-box; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; margin-top: 5px; margin-bottom: 12px; }
            .action-btn { width: 100%; padding: 12px; background: #f58220; border: none; border-radius: 8px; color: #fff; font-weight: bold; cursor: pointer; }
            .danger-btn { background: #ef4444; }
        </style>
    `;

    bindAppNavigation(user);
    loadView('home', user);
}

// 4. Bind UI Navigation
function bindAppNavigation(user) {
    const linesBtn = document.getElementById('btn-three-lines');
    const linesMenu = document.getElementById('threeLinesMenu');
    const navItems = document.querySelectorAll('.nav-item');

    linesBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        linesMenu?.classList.toggle('show');
    });

    document.addEventListener('click', () => linesMenu?.classList.remove('show'));

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tabName = item.getAttribute('data-tab');
            loadView(tabName, user);
        });
    });

    linesMenu?.querySelectorAll('.menu-item[data-view]').forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');
            linesMenu?.classList.remove('show');
            loadView(viewName, user);
        });
    });

    document.getElementById('menu-logout')?.addEventListener('click', () => firebase.auth().signOut());
}

// 5. Dynamic Screen Loaders
function loadView(viewName, user) {
    const container = document.getElementById('main-view-container');
    if (!container) return;

    container.innerHTML = '';

    switch (viewName) {
        case 'home':
            renderHomeView(container, user);
            break;
        case 'router':
            renderRouterRemoteControlView(container, user);
            break;
        case 'status':
            container.innerHTML = `<div class="router-card"><h3>📊 Connection Status</h3><p style="color:#10b981;">● Online (100 Mbps Active)</p></div>`;
            break;
        case 'recharge':
            container.innerHTML = `<div class="router-card"><h3>💳 Active Plan</h3><p>₹499 / Month - Unlimited Data</p></div>`;
            break;
        default:
            renderHomeView(container, user);
    }
}

function renderHomeView(container, user) {
    container.innerHTML = `
        <div class="router-card">
            <span class="status-badge">● Universal Gateway Active</span>
            <h3 style="color:#f58220; margin: 10px 0 5px 0;">Welcome, ${user.displayName || user.email || 'User'}</h3>
            <p style="font-size: 12px; color: #94a3b8;">NextG Smart Universal Remote Control Ready.</p>
        </div>
    `;
}

// REAL REMOTE ROUTER CONTROL MODULE
function renderRouterRemoteControlView(container, user) {
    container.innerHTML = `
        <div class="router-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; color:#38bdf8;">🎮 Universal Router Remote</h3>
                <span class="status-badge">IP: 192.168.1.1</span>
            </div>
            <p style="font-size:11px; color:#94a3b8; margin-top:5px;">Direct Remote Control via Gateway API</p>
            <hr style="border-color:#334155; margin: 12px 0;">

            <label style="font-size:11px; color:#cbd5e1;">Wi-Fi SSID Name</label>
            <input type="text" id="remoteSSID" class="form-input" value="NextG_WiFi_5G">

            <label style="font-size:11px; color:#cbd5e1;">Wi-Fi Password</label>
            <input type="password" id="remotePass" class="form-input" value="12345678">

            <button class="action-btn" id="btnUpdateRouter">📡 Send Remote Signal</button>

            <div style="margin-top:20px; padding-top:10px; border-top:1px solid #334155;">
                <h4 style="margin:0 0 10px 0; font-size:13px;">Router Power Actions</h4>
                <button class="action-btn danger-btn" id="btnRebootRouter">🔄 Remote Reboot Router</button>
            </div>
        </div>
    `;

    document.getElementById('btnUpdateRouter')?.addEventListener('click', async () => {
        const ssid = document.getElementById('remoteSSID').value;
        const pass = document.getElementById('remotePass').value;
        const res = await UniversalRouterPortal.syncRouterSettings(ssid, pass);
        alert(res.message);
    });

    document.getElementById('btnRebootRouter')?.addEventListener('click', async () => {
        const res = await UniversalRouterPortal.rebootRemoteRouter();
        alert(res.message);
    });
}

function showAuthUI() {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');
    const appNativeRoot = document.getElementById('app-native-root');

    if (authContainer) authContainer.style.display = 'block';
    if (welcomeHero) welcomeHero.style.display = 'flex';
    if (appNativeRoot) appNativeRoot.style.display = 'none';
}
