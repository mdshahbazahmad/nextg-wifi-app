// src/app.js
import { initSidebar } from './modules/sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Initialize Sidebar Module
  initSidebar();

  // Top Tab Navigation Switcher
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
      if (el === targetView) {
        el.classList.remove('hidden');
        btn.className = "flex-1 py-2 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all bg-white dark:bg-gray-900 text-blue-600 shadow";
      } else {
        el.classList.add('hidden');
        btn.className = "flex-1 py-2 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all text-gray-500 dark:text-gray-400";
      }
    });
  }

  if (topBtnHome) topBtnHome.addEventListener('click', () => switchTab(viewHome));
  if (topBtnStatus) topBtnStatus.addEventListener('click', () => switchTab(viewStatus));
  if (topBtnRecharge) topBtnRecharge.addEventListener('click', () => switchTab(viewRecharge));
  if (topBtnNewConn) topBtnNewConn.addEventListener('click', () => switchTab(viewNewConn));
});
