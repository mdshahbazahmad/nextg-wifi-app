// NextG WiFi - Core Application Controller
// File: src/app.js

window.addEventListener('DOMContentLoaded', () => {
    console.log("App initializing...");

    // 1. Firebase Auth State Listener
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User logged in successfully:", user.email || user.phoneNumber);
                showDashboardUI(user);
            } else {
                console.log("No active user session.");
                showAuthUI();
            }
        });
    }

    // Attach Auth Form Listeners
    attachAuthFormListeners();
});

// 2. Auth Form Listeners
function attachAuthFormListeners() {
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
                console.error("Login Error:", error);
                alert("लॉगिन विफल रहा: " + (error.message || "पासवर्ड या ईमेल गलत है!"));
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
                console.error("Signup Error:", error);
                alert("साइन अप विफल रहा: " + error.message);
            }
        });
    }
}

// 3. Complete Main Dashboard Renderer (सारे बटन और सेक्शन्स शामिल)
function showDashboardUI(user) {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');

    if (authContainer) authContainer.style.display = 'none';
    if (welcomeHero) welcomeHero.style.display = 'none';

    let dashboardRoot = document.getElementById('dashboard-main-view');
    if (!dashboardRoot) {
        dashboardRoot = document.createElement('div');
        dashboardRoot.id = 'dashboard-main-view';
        dashboardRoot.style.cssText = "padding: 15px; max-width: 600px; margin: 0 auto; color: #ffffff; font-family: system-ui, sans-serif;";
        document.body.appendChild(dashboardRoot);
    }

    dashboardRoot.style.display = 'block';

    // Dashboard HTML Layout (Header, Status Card, Quick Actions, and Support Desk)
    dashboardRoot.innerHTML = `
        <div style="background: #1E293B; border-radius: 16px; padding: 20px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); margin-bottom: 20px;">
            
            <!-- User Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h2 style="color: #F58220; margin: 0; font-size: 20px; font-weight: 700;">NextG WiFi Portal</h2>
                    <p style="color: #94A3B8; font-size: 12px; margin: 2px 0 0 0;">Welcome, <strong>${user.displayName || user.email || 'Customer'}</strong></p>
                </div>
                <button id="btn-logout" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">Sign Out</button>
            </div>

            <!-- Connection Status Card -->
            <div style="background: #0B1329; border-radius: 12px; padding: 15px; border: 1px solid #334155; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #38BDF8; font-size: 13px; font-weight: bold;">📶 Connection Status</span>
                    <span style="background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid #10B981; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: bold;">● Active</span>
                </div>
                <h3 style="color: #ffffff; font-size: 18px; margin: 10px 0 4px 0;">Unlimited High-Speed Fiber</h3>
                <p style="color: #94A3B8; font-size: 11px; margin: 0;">Plan Speed: Up to 100 Mbps</p>
            </div>

            <!-- Quick Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="btn-recharge" style="background: #0f172a; border: 1px solid #334155; color: #fff; padding: 12px; border-radius: 10px; cursor: pointer; text-align: center; transition: 0.2s;">
                    <div style="font-size: 18px;">💳</div>
                    <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Recharge / Pay</div>
                </button>
                <button id="btn-speedtest" style="background: #0f172a; border: 1px solid #334155; color: #fff; padding: 12px; border-radius: 10px; cursor: pointer; text-align: center; transition: 0.2s;">
                    <div style="font-size: 18px;">🚀</div>
                    <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Speed Test</div>
                </button>
            </div>

        </div>

        <!-- Support Desk / Complaint Section Container -->
        <div id="support-desk-root"></div>
    `;

    // Event Listeners for Dashboard Buttons
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });

    document.getElementById('btn-recharge')?.addEventListener('click', () => {
        alert("रिचार्ज सेक्शन लोड हो रहा है...");
    });

    document.getElementById('btn-speedtest')?.addEventListener('click', () => {
        window.open('https://fast.com', '_blank');
    });

    // Render Support Desk Component
    const supportContainer = document.getElementById('support-desk-root');
    if (supportContainer && typeof window.renderSupportDeskComponent === 'function') {
        window.renderSupportDeskComponent(supportContainer);
    }
}

// 4. Show Auth UI on Logout
function showAuthUI() {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');
    const dashboardRoot = document.getElementById('dashboard-main-view');

    if (authContainer) authContainer.style.display = 'block';
    if (welcomeHero) welcomeHero.style.display = 'flex';
    if (dashboardRoot) dashboardRoot.style.display = 'none';
}

export function navigateTo(viewName) {
    console.log("Navigating to view:", viewName);
}
