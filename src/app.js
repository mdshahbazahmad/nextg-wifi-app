// src/app.js - Main Entry Point (Fully Safe & Tested)

import { initSidebar } from './modules/sidebar.js';
import { initHomeModule } from './modules/home.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initStatusModule } from './modules/status.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Icon Rendering
  renderIcons();

  // 2. Initialize All Modules Safely
  safeInit('Sidebar', initSidebar);
  safeInit('Home', initHomeModule);
  safeInit('Recharge', initRechargeModule);
  safeInit('NewConnection', initNewConnectionModule);
  safeInit('Status', initStatusModule);

  // 3. Setup Navigation Switcher
  setupTabNavigation();
  
  // Final icon render after modules inject HTML
  setTimeout(renderIcons, 100);
});

// Helper function to render Lucide Icons without crashing
function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (err) {
      console.warn("Lucide icon rendering warning:", err);
    }
  }
}

// Helper function to safely run modules
function safeInit(moduleName, initFunc) {
  try {
    if (typeof initFunc === 'function') {
      initFunc();
    }
  } catch (error) {
    console.error(`[Error in ${moduleName} Module]:`, error);
  }
}

// Handle Top Navigation Tabs
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
        // Hide all views & deactivate all buttons
        tabs.forEach(t => {
          const b = document.getElementById(t.btnId);
          const v = document.getElementById(t.viewId);
          if (v) v.classList.add('hidden');
          if (b) {
            b.classList.remove(...activeClasses);
            b.classList.add(...inactiveClasses);
          }
        });

        // Show selected view & activate button
        view.classList.remove('hidden');
        btn.classList.remove(...inactiveClasses);
        btn.classList.add(...activeClasses);

        // Re-render icons for newly visible view
        renderIcons();
      });
    }
  });
}
