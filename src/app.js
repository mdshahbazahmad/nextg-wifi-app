// src/app.js - Main Entry Point & Event Controller

import { initSidebar } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initHomeModule } from './modules/home.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // Safe Initialization of Modules
  try { initSidebar(); } catch (e) { console.error("Sidebar Error:", e); }
  try { initRechargeModule(); } catch (e) { console.error("Recharge Error:", e); }
  try { initNewConnectionModule(); } catch (e) { console.error("NewConn Error:", e); }
  try { initHomeModule(); } catch (e) { console.error("Home Error:", e); }

  // Lucide Icons Render
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // TOP NAVIGATION TABS
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

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (topBtnHome) {
    topBtnHome.onclick = () => {
      switchTab(viewHome);
      try { initHomeModule(); } catch (e) {}
    };
  }
  if (topBtnStatus) topBtnStatus.onclick = () => switchTab(viewStatus);
  if (topBtnRecharge) topBtnRecharge.onclick = () => switchTab(viewRecharge);
  if (topBtnNewConn) topBtnNewConn.onclick = () => switchTab(viewNewConn);
});
