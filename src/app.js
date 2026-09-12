// src/app.js

// 1. दोनों मॉड्युल्स को इंपोर्ट करें (ध्यान दें: अगर आपके फोल्डर का नाम modular है तो ./modules/ की जगह ./modular/ करें)
import { initSidebar } from './modules/sidebar.js';
import { initRechargeModule } from './modules/recharge.js';

document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons इनिशियलाइज करें
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. साइडबार और रिचार्ज मॉड्युल्स को चालू/कॉल करें
  initSidebar();
  initRechargeModule();

  // 3. टॉप नेविगेशन टैब्स (Home, Status, Recharge, Connection) स्विचिंग
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
