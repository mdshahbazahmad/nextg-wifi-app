// NextG WiFi - Core Application Controller
// File: src/app.js

window.addEventListener('DOMContentLoaded', () => {
    console.log("App initializing...");

    // 1. Firebase Auth State Listener (लॉगिन स्थिति की जाँच)
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User logged in successfully:", user.email || user.phoneNumber);
                // यूजर लॉगिन है तो सीधे डैशबोर्ड दिखाएं
                showDashboardUI(user);
            } else {
                console.log("No active user session.");
                // यूजर लॉगआउट है तो ऑथ फ़ॉर्म दिखाएं
                showAuthUI();
            }
        });
    }

    // 2. लॉगिन और साइन-अप फ़ॉर्म सबमिट हैंडलर
    attachAuthFormListeners();
});

// ऑथेंटिकेशन फ़ॉर्म्स के इवेंट लिसनर अटैच करें
function attachAuthFormListeners() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // लॉगिन फ़ॉर्म सबमिट
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // पेज रीफ्रेश होने से रोकें

            const userInput = document.getElementById('login-user')?.value.trim();
            const password = document.getElementById('pass-login')?.value;

            if (!userInput || !password) {
                alert("कृपया ईमेल/फ़ोन नंबर और पासवर्ड दर्ज करें।");
                return;
            }

            try {
                let emailToAuth = userInput;
                // यदि यूज़र ने 10 अंकों का मोबाइल नंबर डाला है
                if (/^\d{10}$/.test(userInput)) {
                    emailToAuth = `${userInput}@nextgwifi.com`;
                }

                console.log("Logging in with:", emailToAuth);
                await firebase.auth().signInWithEmailAndPassword(emailToAuth, password);
                console.log("Login Successful!");

            } catch (error) {
                console.error("Login Error:", error);
                alert("लॉगिन असफल रहा: " + (error.message || "गलत पासवर्ड या ईमेल!"));
            }
        });
    }

    // साइन-अप फ़ॉर्म सबमिट
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // पेज रीफ्रेश होने से रोकें

            const name = document.getElementById('reg-name')?.value.trim();
            const phone = document.getElementById('reg-phone')?.value.trim();
            const email = document.getElementById('reg-email')?.value.trim();
            const password = document.getElementById('pass-signup')?.value;

            try {
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // प्रोफाइल अपडेट करें
                await user.updateProfile({ displayName: name });

                // Firestore/Database में यूजर डेटा सेव करें
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
                alert("साइन-अप विफल रहा: " + error.message);
            }
        });
    }
}

// लॉगिन होने पर डैशबोर्ड दिखाने वाला फ़ंक्शन
function showDashboardUI(user) {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');
    
    if (authContainer) authContainer.style.display = 'none';
    if (welcomeHero) welcomeHero.style.display = 'none';

    let dashboardRoot = document.getElementById('dashboard-main-view');
    if (!dashboardRoot) {
        dashboardRoot = document.createElement('div');
        dashboardRoot.id = 'dashboard-main-view';
        dashboardRoot.style.cssText = "padding: 20px; max-width: 600px; margin: 0 auto; text-align: center; color: #ffffff;";
        document.body.appendChild(dashboardRoot);
    }

    dashboardRoot.style.display = 'block';
    dashboardRoot.innerHTML = `
        <div style="background: #1E293B; border-radius: 16px; padding: 25px; border: 1px solid #334155; margin-top: 20px;">
            <h2 style="color: #F58220; margin-bottom: 10px;">Welcome to NextG WiFi</h2>
            <p style="color: #94A3B8; font-size: 14px;">Logged in as: <strong>${user.displayName || user.email || user.phoneNumber}</strong></p>
            <hr style="border-color: #334155; margin: 20px 0;">
            <div id="dashboard-content">
                <p>🚀 आपका डैशबोर्ड और वाईफ़ाई प्लान्स यहाँ लोड हो रहे हैं...</p>
            </div>
            <button id="btn-logout" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 25px; font-weight: bold; cursor: pointer;">Sign Out</button>
        </div>
    `;

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}

// लॉगआउट स्थिति में ऑथ UI दिखाने वाला फ़ंक्शन
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
