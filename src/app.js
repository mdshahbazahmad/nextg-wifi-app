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

    // Attach form event listeners
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

// 3. Dynamic Dashboard View Renderer
function showDashboardUI(user) {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');

    if (authContainer) authContainer.style.display = 'none';
    if (welcomeHero) welcomeHero.style.display = 'none';

    let dashboardRoot = document.getElementById('dashboard-main-view');
    if (!dashboardRoot) {
        dashboardRoot = document.createElement('div');
        dashboardRoot.id = 'dashboard-main-view';
        dashboardRoot.style.cssText = "padding: 20px; max-width: 600px; margin: 0 auto; color: #ffffff;";
        document.body.appendChild(dashboardRoot);
    }

    dashboardRoot.style.display = 'block';

    // UI Content Render
    dashboardRoot.innerHTML = `
        <div style="background: #1E293B; border-radius: 16px; padding: 25px; border: 1px solid #334155; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <h2 style="color: #F58220; margin-bottom: 8px; font-size: 22px;">Welcome to NextG WiFi</h2>
            <p style="color: #94A3B8; font-size: 13px;">Logged in as: <strong>${user.displayName || user.email}</strong></p>
            <hr style="border-color: #334155; margin: 20px 0;">
            <div id="home-dashboard-content" style="text-align: left; background: #0B1329; padding: 15px; border-radius: 12px; border: 1px solid #1E293B;">
                <p style="color: #38BDF8; font-weight: bold; font-size: 14px;">⚡ Active Plan Status</p>
                <p style="color: #ffffff; font-size: 18px; margin-top: 5px; font-weight: 800;">Unlimited High-Speed WiFi</p>
                <p style="color: #10B981; font-size: 12px; margin-top: 4px;">● Network Status: Connected & Live</p>
            </div>
            <button id="btn-logout" style="background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 20px; width: 100%;">Sign Out</button>
        </div>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });
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
