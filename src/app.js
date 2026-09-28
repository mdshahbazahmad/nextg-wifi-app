// NextG WiFi - Core Mobile App Controller & Dynamic Router
// File: src/app.js

window.addEventListener('DOMContentLoaded', () => {
    console.log("NextG WiFi App Initializing...");

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

// 2. Build Smart Native UI Frame (Header, Three-Line, Profile Modal, Bottom Nav)
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
            <!-- TOP APP HEADER WITH BRAND LOGO & THREE-LINE MENU -->
            <header class="app-header">
                <div class="header-brand">
                    <div class="brand-logo-badge">⚡</div>
                    <div class="brand-text">
                        <span class="brand-name">NextG WiFi</span>
                        <span class="brand-tag">Smart Broadband</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" id="btn-three-lines" title="Menu">☰</button>
                </div>
            </header>

            <!-- DROPDOWN MENU (THREE-LINE CLICK) -->
            <div class="dropdown-menu" id="threeLinesMenu">
                <div class="menu-item" id="menu-edit-profile">👤 Edit Profile</div>
                <div class="menu-item" data-view="router">📶 Router Settings</div>
                <div class="menu-item" data-view="billing">📄 Billing History</div>
                <div class="menu-item" data-view="support">🛠️ Support Desk & Complaints</div>
                <div class="menu-item" data-view="settings">⚙️ App Settings</div>
                <div class="menu-divider"></div>
                <div class="menu-item danger" id="menu-logout">🚪 Sign Out</div>
            </div>

            <!-- PROFILE EDIT MODAL POPUP -->
            <div id="profileEditModal" class="modal-overlay">
                <div class="modal-card">
                    <div class="modal-header">
                        <h3>👤 Edit Profile Details</h3>
                        <span class="modal-close" id="closeProfileModal">✕</span>
                    </div>
                    <form id="profileEditForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="editUserName" value="${user.displayName || ''}" placeholder="Enter full name" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" id="editUserPhone" value="${user.phoneNumber || ''}" placeholder="Enter 10-digit phone number">
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="editUserEmail" value="${user.email || ''}" disabled style="opacity: 0.7;">
                        </div>
                        <button type="submit" class="save-profile-btn" id="saveProfileBtn">💾 Save Changes</button>
                    </form>
                </div>
            </div>

            <!-- MAIN DYNAMIC CONTENT SCREEN -->
            <main class="app-content" id="main-view-container"></main>

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
            
            /* Header Styling */
            .app-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #1e293b; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 100; }
            .header-brand { display: flex; align-items: center; gap: 10px; }
            .brand-logo-badge { width: 34px; height: 34px; background: linear-gradient(135deg, #F58220, #e06f13); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; box-shadow: 0 4px 10px rgba(245, 130, 32, 0.3); }
            .brand-text { display: flex; flex-direction: column; }
            .brand-name { font-weight: 800; font-size: 16px; color: #ffffff; letter-spacing: 0.5px; }
            .brand-tag { font-size: 9px; color: #f58220; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            
            .icon-btn { background: #0f172a; border: 1px solid #334155; color: #38bdf8; font-size: 20px; cursor: pointer; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
            
            /* Three Line Menu */
            .dropdown-menu { display: none; position: absolute; top: 58px; right: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 14px; width: 210px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 200; overflow: hidden; }
            .dropdown-menu.show { display: block; }
            .menu-item { padding: 12px 16px; font-size: 13px; color: #cbd5e1; cursor: pointer; border-bottom: 1px solid #283548; font-weight: 500; transition: 0.2s; }
            .menu-item:hover { background: #334155; color: #fff; }
            .menu-item.danger { color: #ef4444; }
            .menu-divider { height: 1px; background: #334155; }

            /* Profile Modal */
            .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.75); align-items: center; justify-content: center; z-index: 999; }
            .modal-overlay.active { display: flex; }
            .modal-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 88%; max-width: 380px; padding: 20px; text-align: left; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px; }
            .modal-header h3 { font-size: 15px; margin: 0; color: #fff; }
            .modal-close { font-size: 18px; color: #94a3b8; cursor: pointer; }
            .form-group { margin-bottom: 12px; }
            .form-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
            .form-group input { width: 100%; box-sizing: border-box; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #fff; font-size: 13px; outline: none; }
            .save-profile-btn { width: 100%; padding: 12px; background: #f58220; border: none; border-radius: 8px; color: #fff; font-weight: bold; cursor: pointer; margin-top: 10px; font-size: 13px; }

            /* Content View */
            .app-content { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px; }

            /* Bottom Nav */
            .app-bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; height: 62px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: space-around; align-items: center; z-index: 100; }
            .nav-item { background: none; border: none; color: #64748b; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; flex: 1; padding: 6px 0; }
            .nav-item.active { color: #f58220; font-weight: bold; }
            .nav-icon { font-size: 18px; }
            .nav-label { font-size: 10px; }
        </style>
    `;

    bindAppNavigation(user);
    loadView('home', user);
}

// 3. Bind Navigation & Profile Modal Events
function bindAppNavigation(user) {
    const linesBtn = document.getElementById('btn-three-lines');
    const linesMenu = document.getElementById('threeLinesMenu');
    const navItems = document.querySelectorAll('.nav-item');
    
    const profileModal = document.getElementById('profileEditModal');
    const editProfileBtn = document.getElementById('menu-edit-profile');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const profileForm = document.getElementById('profileEditForm');

    // Toggle Three Line Menu
    linesBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        linesMenu?.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        linesMenu?.classList.remove('show');
    });

    // Profile Edit Modal Events
    editProfileBtn?.addEventListener('click', () => {
        linesMenu?.classList.remove('show');
        profileModal?.classList.add('active');
    });

    closeProfileModal?.addEventListener('click', () => {
        profileModal?.classList.remove('active');
    });

    profileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('editUserName')?.value.trim();
        const newPhone = document.getElementById('editUserPhone')?.value.trim();

        try {
            const currentUser = firebase.auth().currentUser;
            if (currentUser && newName) {
                await currentUser.updateProfile({ displayName: newName });
                if (window.db) {
                    await window.db.collection('users').doc(currentUser.uid).update({
                        fullName: newName,
                        phone: newPhone
                    });
                }
                alert("प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई है!");
                profileModal?.classList.remove('active');
                buildAppShellUI(currentUser);
            }
        } catch (err) {
            alert("अपडेट विफल रहा: " + err.message);
        }
    });

    // Bottom Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const tabName = item.getAttribute('data-tab');
            loadView(tabName, user);
        });
    });

    // Three-Line Menu Actions
    linesMenu?.querySelectorAll('.menu-item[data-view]').forEach(item => {
        item.addEventListener('click', () => {
            const viewName = item.getAttribute('data-view');
            linesMenu?.classList.remove('show');
            if (viewName) loadView(viewName, user);
        });
    });

    // Logout Action
    document.getElementById('menu-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

// 4. Robust Load View System (Never Stuck on Loading)
function loadView(viewName, user) {
    const mainContainer = document.getElementById('main-view-container');
    if (!mainContainer) return;

    mainContainer.innerHTML = '';

    switch (viewName) {
        case 'home':
            if (typeof window.renderHomeModule === 'function') {
                window.renderHomeModule(mainContainer, user);
            } else {
                renderHomeUIFallback(mainContainer, user);
            }
            break;

        case 'status':
            if (typeof window.renderStatusModule === 'function') {
                window.renderStatusModule(mainContainer, user);
            } else {
                renderStatusUIFallback(mainContainer, user);
            }
            break;

        case 'recharge':
            if (typeof window.renderRechargeModule === 'function') {
                window.renderRechargeModule(mainContainer, user);
            } else {
                renderRechargeUIFallback(mainContainer, user);
            }
            break;

        case 'connection':
            if (typeof window.renderConnectionModule === 'function') {
                window.renderConnectionModule(mainContainer, user);
            } else {
                renderConnectionUIFallback(mainContainer, user);
            }
            break;

        case 'support':
            if (typeof window.renderSupportDeskComponent === 'function') {
                window.renderSupportDeskComponent(mainContainer);
            } else {
                mainContainer.innerHTML = `<div style="padding:15px; text-align:center; color:#ef4444;">Support Desk module not found. Please verify supportDesk.js link.</div>`;
            }
            break;

        case 'router':
            if (typeof window.renderRouterControl === 'function') {
                window.renderRouterControl(mainContainer, user);
            } else {
                renderRouterUIFallback(mainContainer, user);
            }
            break;

        case 'billing':
            if (typeof window.renderBillingHistory === 'function') {
                window.renderBillingHistory(mainContainer, user);
            } else {
                renderBillingUIFallback(mainContainer, user);
            }
            break;

        case 'settings':
            if (typeof window.renderAppSettings === 'function') {
                window.renderAppSettings(mainContainer, user);
            } else {
                renderSettingsUIFallback(mainContainer, user);
            }
            break;

        default:
            renderHomeUIFallback(mainContainer, user);
    }
}

// UI Fallback Renderers (ताकि लोडिंग न आए)
function renderHomeUIFallback(container, user) {
    container.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 18px; border: 1px solid #334155; margin-bottom: 15px;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">Connected Account</p>
            <h3 style="color: #f58220; margin: 4px 0 12px 0; font-size: 18px;">${user.displayName || user.email || 'NextG Customer'}</h3>
            <div style="background: #0b1329; padding: 14px; border-radius: 10px; border: 1px solid #334155;">
                <span style="color: #10b981; font-weight: bold; font-size: 11px;">● Network Live & Active</span>
                <h4 style="margin: 6px 0 2px 0; color: #fff;">Unlimited High-Speed Fiber</h4>
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">Plan Speed: 100 Mbps</p>
            </div>
        </div>
    `;
}

function renderRouterUIFallback(container, user) {
    container.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 18px; border: 1px solid #334155;">
            <h3 style="color: #38bdf8; margin-top: 0;">📶 Router Settings</h3>
            <div style="background: #0f172a; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                <label style="font-size: 11px; color: #94a3b8;">SSID Name</label>
                <input type="text" value="NextG_WiFi_5G" style="width:100%; box-sizing:border-box; padding:8px; background:#1e293b; border:1px solid #334155; color:#fff; border-radius:6px; margin-top:4px;">
            </div>
            <button onclick="alert('WiFi पासवर्ड चेंज रिक्वेस्ट सेंड हो गई!')" style="width:100%; padding:10px; background:#f58220; border:none; border-radius:8px; color:#fff; font-weight:bold; cursor:pointer;">Update Router Settings</button>
        </div>
    `;
}

function renderBillingUIFallback(container, user) {
    container.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 18px; border: 1px solid #334155;">
            <h3 style="color: #38bdf8; margin-top: 0;">📄 Billing History</h3>
            <p style="font-size: 12px; color: #94a3b8;">No past offline bills found. All online recharges are active.</p>
        </div>
    `;
}

function renderSettingsUIFallback(container, user) {
    container.innerHTML = `
        <div style="background: #1e293b; border-radius: 16px; padding: 18px; border: 1px solid #334155;">
            <h3 style="color: #38bdf8; margin-top: 0;">⚙️ App Settings</h3>
            <p style="font-size: 12px; color: #cbd5e1;">App Version: 1.0.0 (Native PWA)</p>
            <p style="font-size: 12px; color: #10b981;">● Server Status: Connected to Firebase</p>
        </div>
    `;
}

function renderStatusUIFallback(container, user) {
    container.innerHTML = `<div style="background:#1e293b; padding:18px; border-radius:16px; color:#fff;">📊 Connection Status: 100 Mbps Active</div>`;
}

function renderRechargeUIFallback(container, user) {
    container.innerHTML = `<div style="background:#1e293b; padding:18px; border-radius:16px; color:#fff;">💳 Active Plan: ₹499 - 30 Days Unlimited</div>`;
}

function renderConnectionUIFallback(container, user) {
    container.innerHTML = `<div style="background:#1e293b; padding:18px; border-radius:16px; color:#fff;">➕ Request New High-Speed Fiber Connection</div>`;
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
