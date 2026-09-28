// src/app.js - Dashboard Render Update

import { renderHomeDashboard } from './modules/home.js';
import { renderSidebar } from './components/sidebar.js';

function showDashboardUI(user) {
    const authContainer = document.querySelector('.auth-container');
    const welcomeHero = document.querySelector('.welcome-hero');
    
    if (authContainer) authContainer.style.display = 'none';
    if (welcomeHero) welcomeHero.style.display = 'none';

    let dashboardRoot = document.getElementById('dashboard-main-view');
    if (!dashboardRoot) {
        dashboardRoot = document.createElement('div');
        dashboardRoot.id = 'dashboard-main-view';
        dashboardRoot.style.cssText = "padding: 15px; max-width: 600px; margin: 0 auto; color: #ffffff;";
        document.body.appendChild(dashboardRoot);
    }
    
    dashboardRoot.style.display = 'block';

    // 1. यदि home.js मॉड्यूल में render फ़ंक्शन उपलब्ध है:
    if (typeof renderHomeDashboard === 'function') {
        renderHomeDashboard(dashboardRoot, user);
    } else {
        // फॉलबैक कार्ड यदि होम मॉड्यूल डायरेक्ट इम्पोर्ट न हो
        dashboardRoot.innerHTML = `
            <div style="background: #1E293B; border-radius: 16px; padding: 20px; border: 1px solid #334155; text-align: center;">
                <h2 style="color: #F58220; margin-bottom: 8px;">NextG WiFi Dashboard</h2>
                <p style="color: #94A3B8; font-size: 13px;">लॉगिन यूज़र: <strong>${user.displayName || user.email}</strong></p>
                <hr style="border-color: #334155; margin: 15px 0;">
                <div id="home-module-container"></div>
                <button id="btn-logout" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 15px;">Sign Out</button>
            </div>
        `;
    }

    // 2. साइडबार लोड करें (यदि उपलब्ध हो)
    if (typeof renderSidebar === 'function') {
        renderSidebar(user);
    }

    // 3. साइन आउट इवेंट
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        firebase.auth().signOut();
    });
          }
