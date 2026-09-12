// src/app.js - Main Entry Point & Event Controller

// 1. Module Imports
import { initSidebar } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initHomeModule } from './modules/home.js';

document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons Initialization
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. All Modules Initializations
  try {
    initSidebar();
    initRechargeModule();
    initNewConnectionModule();
    initHomeModule();
  } catch (err) {
    console.error("Module Initialization Error:", err);
  }

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

  // Tab Switcher Function
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

    // Re-render Lucide Icons after tab change
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Button Click Listeners
  if (topBtnHome) {
    topBtnHome.addEventListener('click', () => {
      switchTab(viewHome);
      initHomeModule();
    });
  }
  
  if (topBtnStatus) {
    topBtnStatus.addEventListener('click', () => switchTab(viewStatus));
  }
  
  if (topBtnRecharge) {
    topBtnRecharge.addEventListener('click', () => switchTab(viewRecharge));
  }
  
  if (topBtnNewConn) {
    topBtnNewConn.addEventListener('click', () => switchTab(viewNewConn));
  }
});
