// src/app.js - Main Entry Point & Event Controller

// 1. सभी मॉड्युल्स की IMPORT लाइन्स (Home, Status, Recharge, New Connection, Sidebar)
import { initSidebar } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initHomeModule } from './modules/home.js';
import { initStatusModule } from './modules/status.js'; // Future Status module safe-guard

document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons इनिशियलाइज़ करें
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. सभी मॉड्युल्स को शुरू (Initialize) करें
  initSidebar();
  initRechargeModule();
  initNewConnectionModule();
  initHomeModule(); // <-- Home Module Call
  if (typeof initStatusModule === 'function') initStatusModule();

  // 3. TOP NAVIGATION (Home, Status, Recharge, Connection Buttons)
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

  // टैब स्विच करने का फंक्शन
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

  // बटन क्लिक इवेंट्स
  if (topBtnHome) {
    topBtnHome.addEventListener('click', () => {
      switchTab(viewHome);
      initHomeModule(); // Home button dabane par re-render karega
    });
  }
  if (topBtnStatus) topBtnStatus.addEventListener('click', () => switchTab(viewStatus));
  if (topBtnRecharge) topBtnRecharge.addEventListener('click', () => switchTab(viewRecharge));
  if (topBtnNewConn) topBtnNewConn.addEventListener('click', () => switchTab(viewNewConn));
});
