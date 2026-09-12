// src/app.js - Main Entry Point & Event Controller

// 1. सभी 3 मुख्य मॉड्युल्स को इंपोर्ट करें
import { initSidebar, showToast } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';

document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons इनिशियलाइज़ करें
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. सभी मॉड्युल्स को चालू (Initialize) करें
  initSidebar();
  initRechargeModule();
  initNewConnectionModule();

  // 3. 🔝 TOP NAVIGATION (LABEL) BUTTONS CONNECTIVITY (Home, Status, Recharge, Connection)
  const topBtnHome = document.getElementById('topBtnHome');
  const topBtnStatus = document.getElementById('topBtnStatus');
  const topBtnRecharge = document.getElementById('topBtnRecharge');
  const topBtnNewConn = document.getElementById('topBtnNewConn');

  const viewHome = document.getElementById('view-home');
  const viewStatus = document.getElementById('view-status');
  const viewRecharge = document.getElementById('view-recharge');
  const viewNewConn = document.getElementById('view-newconn');

  const views = [
    { btn: topBtnHome, el: viewHome },
    { btn: topBtnStatus, el: viewStatus },
    { btn: topBtnRecharge, el: viewRecharge },
    { btn: topBtnNewConn, el: viewNewConn }
  ];

  // टॉप टैब बदलने वाला फंक्शन
  function switchTab(targetView) {
    views.forEach(({ btn, el }) => {
      if (btn && el) {
        if (el === targetView) {
          el.classList.remove('hidden');
          btn.className = "flex-1 py-2 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-white dark:bg-gray-900 text-blue-600 shadow";
        } else {
          el.classList.add('hidden');
          btn.className = "flex-1 py-2 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all text-gray-500 dark:text-gray-400";
        }
      }
    });
  }

  // टॉप बटनों पर क्लिक इवेंट्स
  if (topBtnHome) topBtnHome.addEventListener('click', () => switchTab(viewHome));
  if (topBtnStatus) topBtnStatus.addEventListener('click', () => switchTab(viewStatus));
  if (topBtnRecharge) topBtnRecharge.addEventListener('click', () => switchTab(viewRecharge));
  if (topBtnNewConn) topBtnNewConn.addEventListener('click', () => switchTab(viewNewConn));

  // 4. ☰ SIDEBAR EXTRA & NEW BUTTONS CONNECTIVITY (भविष्य में जुड़ने वाले नए बटनों के लिए)
  const sidebarNav = document.querySelector('#sidebar nav');
  if (sidebarNav) {
    sidebarNav.addEventListener('click', (event) => {
      const targetBtn = event.target.closest('button');
      if (!targetBtn) return;

      const btnId = targetBtn.id;

      // अगर भविष्य में कोई नया बटन जोड़ा जाता है जिसका लॉजिक अलग से नहीं लिखा है
      if (btnId && !['btnSidebarProfile', 'btnSidebarRouter', 'btnSidebarLanguage', 'btnSidebarComplaint', 'btnSidebarLogout'].includes(btnId)) {
        const btnText = targetBtn.innerText.trim();
        showToast(`${btnText} button clicked!`);
      }
    });
  }
});
