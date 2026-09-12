// src/app.js - Direct Safe Loader

import { initSidebar } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';
import { initNewConnectionModule } from './modules/newConnection.js';
import { initHomeModule } from './modules/home.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("App Started Loading...");

  // Icons initialize
  if (window.lucide) {
    try { window.lucide.createIcons(); } catch(e) { console.error("Lucide Error:", e); }
  }

  // Safe Calls
  try { initSidebar(); console.log("Sidebar Loaded Success"); } catch (e) { console.error("Sidebar Crash:", e); }
  try { initHomeModule(); console.log("Home Loaded Success"); } catch (e) { console.error("Home Crash:", e); }
  try { initRechargeModule(); console.log("Recharge Loaded Success"); } catch (e) { console.error("Recharge Crash:", e); }
  try { initNewConnectionModule(); console.log("NewConn Loaded Success"); } catch (e) { console.error("NewConn Crash:", e); }

  // Top Tabs Logic
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
    if (window.lucide) window.lucide.createIcons();
  }

  if (topBtnHome) topBtnHome.onclick = () => switchTab(viewHome);
  if (topBtnStatus) topBtnStatus.onclick = () => switchTab(viewStatus);
  if (topBtnRecharge) topBtnRecharge.onclick = () => switchTab(viewRecharge);
  if (topBtnNewConn) topBtnNewConn.onclick = () => switchTab(viewNewConn);
});
