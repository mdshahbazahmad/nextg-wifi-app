// NextG WiFi - Core Mobile App Controller & View Switcher
// File: src/app.js

window.addEventListener('DOMContentLoaded', () => {
    console.log("NextG App Initializing...");

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("Logged in user:", user.email || user.phoneNumber);
                buildAppShellUI(user);
            } else {
                showAuthUI();
            }
        });
    }

    attachAuthListeners();
});

// 1. Auth Form Listeners
function attachAuthListeners() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userInput = document.getElementById('login-user')?.value.trim();
            const password = document.getElementById('pass-login')?.value;

            if (!userInput || !password) {
                alert("कृपया ईमेल/फ़ोन नंबर और पासवर्ड दर्ज करें।");
                return;
            }

            try {
                let emailToAuth = userInput;
                if (/^\d{10}$/.test(userInput)) {
                    emailToAuth = `${userInput}@nextgwifi.com`;
                }
                await firebase.auth().signInWithEmailAndPassword(emailToAuth, password);
            } catch (error) {
                alert("लॉगिन विफल रहा: " + (error.message || "गलत विवरण!"));
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name')?.value.trim();
            const phone = document.getElementById('reg-phone')?.value.trim();
            const email = document.getElementById('reg-email')?.value.trim();
            const password = document.getElementById('pass-signup')?.value;

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                await user.updateProfile({ displayName: name });

                if (window.db) {
                    await window.db.collection('users').doc(user.uid).set({
                        fullName: name,
                        phone: phone,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
                alert("अकाउंट सफलतापूर्वक बन गया है!");
            } catch (error) {
                alert("साइन अप विफल रहा: " + error.message);
            }
        });
    }
}

// 2. Full Native App Shell Generator
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

    // Build Native App Frame Layout
    appContainer.innerHTML = `
        <div class="app-viewport">
            <!-- TOP APP BAR -->
            <header class="app-header">
                <div class="header-brand">
                    <span class="brand-logo">⚡</span>
                    <span class="brand-name">NextG WiFi</span>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" id="btn-three-dots" title="Menu">⋮</button>
                </div>
            </header>

            <!-- THREE DOTS DROPDOWN MENU -->
            <div class="dropdown-menu" id="threeDotsMenu">
                <div class="menu-item" data-view="router">📶 Router Settings</div>
                <div class="menu-item" data-view="billing">📄 Billing History</div>
                <div class="menu-item" data-view="support">🛠️ Support & Complaint</div>
                <div class="menu-item" data-view="settings">⚙️ App Settings</div>
                <div class="menu-divider"></div>
                <div class="menu-item danger" id="menu-logout">🚪 Sign Out</div>
            </div>

            <!-- MAIN DYNAMIC VIEW CONTAINER -->
            <main class="app-content" id="main-view-container">
                <!-- Views loaded dynamically here -->
            </main>

            <!-- BOTTOM NAVIGATION BAR -->
            <nav class="app-bottom-nav">
                <button class="nav-item active" data-tab="home">
                    <span class="nav-icon">🏠</span>
                    <span class="nav-label">Home</span>
                </button>
                <button class="nav-item" data-tab="status">
                    <span class="nav-icon">📊</span>
                    <span class="nav-label">Status</span>
                </button>
                <button class="nav-item" data-tab="recharge">
                    <span class="nav-icon">💳</span>
                    <span class="nav-label">Recharge</span>
                </button>
                <button class="nav-item" data-tab="connection">
                    <span class="nav-icon">➕</span>
                    <span class="nav-label">New Conn</span>
                </button>
            </nav>
        </div>

        <style>
            body { margin: 0; background-color: #0b1329; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: none; }
            .app-viewport { display: flex; flex-direction: column; height: 100vh; max-width: 500px; margin: 0 auto; position: relative; background: #0b1329; overflow: hidden; }
            
            /* Top Header */
            .app-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #1e293b; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 100; }
            .header-brand { display: flex; align-items: center; gap: 8px; font-weight: bold; font-size: 18px; color: #f58220; }
            .icon-btn { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; padding: 0 4px; }
            
            /* Three-Dots Menu */
            .dropdown-menu { display: none; position: absolute; top: 55px; right: 15px; background: #1e293b; border: 1px solid #334155; border-radius: 12px; width: 190px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 200; overflow: hidden; }
            .dropdown-menu.show { display: block; }
            .menu-item { padding: 12px 16px; font-size: 13px; color: #cbd5e1; cursor: pointer; border-bottom: 1px solid #283548; }
            .menu-item:hover { background: #334155; color: #fff; }
            .menu-item.danger { color: #ef4444; }
            .menu-divider { height: 1px; background: #334155; }

            /* Content View Area */
            .app-content { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px; }

            /* Bottom Nav Bar */
            .app-bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 62px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: space-around; align-items: center; z-index: 100; }
            .nav-item { background: none; border: none; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; flex: 1; padding: 6px 0; }
            .nav-item.active { color: #f58220; font-weight: bold; }
            .nav-icon { font-size: 18px; }
            .nav-label { font-size: 10px; }
        </style>
    `;

    // Event Listeners for Nav & Menus
    bindAppNavigation(user);

    // Default Load Home Module
    loadView('home', user);
}

// 3. Navigation & Tab Switcher Logic
function bindAppNavigation(user) {
    const dotsBtn = document.getElementById('btn-three-dots');
    const dotsMenu = document.getElementById('threeDotsMenu');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle Three Dots Dropdown
    dotsBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        dotsMenu?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        dotsMenu?.classList.remove('show');
    });

    // Bottom Navigation Clicks
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tabName = item.getAttribute('data-tab');
            loadView(tabName, user);
        });
    });

    // Three Dots Menu Item Clicks
    dotsMenu?.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');
            if (viewName) loadView(viewName, user);
        });
    });

    // Logout Action
    document.getElementById('menu-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

// 4. Dynamic Module View Loader
function loadView(viewName, user) {
    const mainContainer = document.getElementById('main-view-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = ''; // Clear current screen view

    switch (viewName) {
        case 'home':
            if (typeof window.renderHomeModule === 'function') {
                window.renderHomeModule(mainContainer, user);
            } else {
                renderFallbackHome(mainContainer, user);
            }
            break;

        case 'status':
            if (typeof window.renderStatusModule === 'function') {
                window.renderStatusModule(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">📊 Status Module Loading...</div>`;
            }
            break;

        case 'recharge':
            if (typeof window.renderRechargeModule === 'function') {
                window.renderRechargeModule(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">💳 Recharge & Plans Module Loading...</div>`;
            }
            break;

        case 'connection':
            if (typeof window.renderConnectionModule === 'function') {
                window.renderConnectionModule(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">➕ New Connection Module Loading...</div>`;
            }
            break;

        case 'support':
            if (typeof window.renderSupportDeskComponent === 'function') {
                window.renderSupportDeskComponent(mainContainer);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">🛠️ Support Desk Loading...</div>`;
            }
            break;

        case 'router':
            if (typeof window.renderRouterControl === 'function') {
                window.renderRouterControl(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">📶 Router Control Settings Loading...</div>`;
            }
            break;

        case 'billing':
            if (typeof window.renderBillingHistory === 'function') {
                window.renderBillingHistory(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">📄 Billing History Loading...</div>`;
            }
            break;

        case 'settings':
            if (typeof window.renderAppSettings === 'function') {
                window.renderAppSettings(mainContainer, user);
            } else {
                mainContainer.innerHTML = `<div style="padding:20px; text-align:center;">⚙️ App Settings Loading...</div>`;
            }
            break;

        default:
            renderFallbackHome(mainContainer, user);
    }
}

// Fallback Home Screen Renderer
function renderFallbackHome(container, user) {
    container.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 20px; border: 1px solid #334155;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">Connected Account</p>
            <h3 style="color: #f58220; margin: 4px 0 15px 0;">${user.displayName || user.email}</h3>
            
            <div style="background: #0b1329; padding: 15px; border-radius: 12px; border: 1px solid #334155;">
                <span style="color: #10b981; font-weight: bold; font-size: 12px;">● Connection Live</span>
                <h4 style="margin: 8px 0 2px 0; color: #fff;">Unlimited Fiber Broadband</h4>
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">Speed up to 100 Mbps</p>
            </div>
        </div>
    `;
}

// 5. Auth UI Toggle
function showAuthUI() {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');
    const appNativeRoot = document.getElementById('app-native-root');

    if (authContainer) authContainer.style.display = 'block';
    if (welcomeHero) welcomeHero.style.display = 'flex';
    if (appNativeRoot) appNativeRoot.style.display = 'none';
}

export function navigateTo(viewName) {
    console.log("Navigating to view:", viewName);
}
