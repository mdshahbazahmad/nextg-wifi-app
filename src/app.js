// src/app.js - Full Original Application Logic (Fixed Imports)

import { initSidebar } from './modules/sidebar.js';
import { initHomeModule } from './modules/home.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initStatusModule } from './modules/status.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide Icons Initialize
  renderIcons();

  // 2. Safe Initialization of Original Modules
  safeInit('Sidebar', initSidebar);
  safeInit('Home', initHomeModule);
  safeInit('Recharge', initRechargeModule);
  safeInit('NewConnection', initNewConnectionModule);
  safeInit('Status', initStatusModule);

  // 3. Tab Switching Logic for Top Navigation
  setupTabNavigation();

  // Re-render icons after DOM elements load
  setTimeout(renderIcons, 150);
});

function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (e) {
      console.warn("Lucide Error:", e);
    }
  }
}

function safeInit(moduleName, initFunc) {
  try {
    if (typeof initFunc === 'function') {
      initFunc();
    }
  } catch (error) {
    console.error(`[Error in ${moduleName} Module]:`, error);
  }
}

function setupTabNavigation() {
  const tabs = [
    { btnId: 'topBtnHome', viewId: 'view-home' },
    { btnId: 'topBtnStatus', viewId: 'view-status' },
    { btnId: 'topBtnRecharge', viewId: 'view-recharge' },
    { btnId: 'topBtnNewConn', viewId: 'view-newconn' }
  ];

  const activeClasses = ['bg-white', 'dark:bg-gray-900', 'text-blue-600', 'shadow'];
  const inactiveClasses = ['text-gray-500', 'dark:text-gray-400'];

  tabs.forEach(tab => {
    const btn = document.getElementById(tab.btnId);
    const view = document.getElementById(tab.viewId);

    if (btn && view) {
      btn.addEventListener('click', () => {
        tabs.forEach(t => {
          const b = document.getElementById(t.btnId);
          const v = document.getElementById(t.viewId);
          if (v) v.classList.add('hidden');
          if (b) {
            b.classList.remove(...activeClasses);
            b.classList.add(...inactiveClasses);
          }
        });

        view.classList.remove('hidden');
        btn.classList.remove(...inactiveClasses);
        btn.classList.add(...activeClasses);

        renderIcons();
      });
    }
  });
}
