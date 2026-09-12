// src/app.js - All-in-One Safe Application Engine

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render Icons Initially
  renderIcons();

  // 2. Setup Modules & Views
  setupSidebarControls();
  setupTabNavigation();

  // 3. Render All Content Containers Directly
  renderActivePlan();
  renderDataAddons();
  renderRechargePlans();
  renderNewConnectionOffers();
  renderStatusDetails();

  // Re-render icons for injected HTML
  setTimeout(renderIcons, 200);
});

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.textContent = msg;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
  }
}

// Icon Renderer
function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try { window.lucide.createIcons(); } catch (e) {}
  }
}

// Sidebar & Profile Logic
function setupSidebarControls() {
  const btnOpen = document.getElementById('btnOpenSidebar');
  const btnClose = document.getElementById('btnCloseSidebar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar?.classList.remove('-translate-x-full');
    overlay?.classList.remove('hidden');
  }

  function closeSidebar() {
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  }

  if (btnOpen) btnOpen.onclick = openSidebar;
  if (btnClose) btnClose.onclick = closeSidebar;
  if (overlay) overlay.onclick = closeSidebar;

  // Profile Modal Controls
  const navAvatar = document.getElementById('navAvatar');
  const btnSidebarProfile = document.getElementById('btnSidebarProfile');
  const profileModal = document.getElementById('profileModal');
  const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');
  const btnSaveProfile = document.getElementById('btnSaveProfile');

  function openProfileModal() {
    closeSidebar();
    profileModal?.classList.remove('hidden');
  }

  function closeProfileModal() {
    profileModal?.classList.add('hidden');
  }

  if (navAvatar) navAvatar.onclick = openProfileModal;
  if (btnSidebarProfile) btnSidebarProfile.onclick = openProfileModal;
  if (btnCloseProfileModal) btnCloseProfileModal.onclick = closeProfileModal;

  if (btnSaveProfile) {
    btnSaveProfile.onclick = () => {
      const nameInput = document.getElementById('profNameInput');
      const phoneInput = document.getElementById('profPhoneInput');
      if (nameInput && nameInput.value.trim()) {
        const el = document.getElementById('sbUserName');
        if (el) el.textContent = nameInput.value.trim();
      }
      if (phoneInput && phoneInput.value.trim()) {
        const el = document.getElementById('sbUserPhone');
        if (el) el.textContent = phoneInput.value.trim();
      }
      closeProfileModal();
      showToast('Profile updated successfully!');
    };
  }

  // Dark Mode Toggle
  const btnSidebarTheme = document.getElementById('btnSidebarTheme');
  if (btnSidebarTheme) {
    btnSidebarTheme.onclick = () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      showToast(isDark ? 'Dark mode enabled' : 'Light mode enabled');
    };
  }

  // Sidebar Buttons Toast Triggers
  document.getElementById('btnSidebarRouter')?.addEventListener('click', () => { closeSidebar(); showToast('Router settings feature ready'); });
  document.getElementById('btnSidebarAppLock')?.addEventListener('click', () => { closeSidebar(); showToast('App lock is active'); });
  document.getElementById('btnSidebarLanguage')?.addEventListener('click', () => { closeSidebar(); showToast('Language set to Hindi / English'); });
  document.getElementById('btnSidebarComplaint')?.addEventListener('click', () => { closeSidebar(); showToast('Complaint registered! Ticket #4920'); });
  document.getElementById('btnSidebarLogout')?.addEventListener('click', () => { closeSidebar(); showToast('Logged out successfully'); });
}

// Top Tabs Navigation Switcher
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

// Render Active Plan
function renderActivePlan() {
  const container = document.getElementById('activePlanCardContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
      <div class="flex justify-between items-start mb-4">
        <div>
          <span class="bg-blue-500/30 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-400/30">Active Plan</span>
          <h2 class="text-2xl font-black mt-2">100 Mbps Unlimited</h2>
          <p class="text-xs text-blue-100">Fiber Ultra Speed Plan</p>
        </div>
        <div class="text-right">
          <span class="text-xs text-blue-200">Validity</span>
          <p class="text-sm font-bold">24 Days Left</p>
        </div>
      </div>
      <div class="space-y-1.5 mt-4">
        <div class="flex justify-between text-xs font-semibold">
          <span>Data Used: 420 GB</span>
          <span>Unlimited (3300 GB)</span>
        </div>
        <div class="w-full bg-blue-900/40 rounded-full h-2 overflow-hidden border border-blue-400/20">
          <div class="bg-white h-full rounded-full" style="width: 15%"></div>
        </div>
      </div>
    </div>
  `;
}

// Render Data Addons
function renderDataAddons() {
  const container = document.getElementById('dataAddonContainer');
  if (!container) return;

  container.innerHTML = `
    <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">High Speed Data Top-ups</h3>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border dark:border-gray-700 shadow-sm flex justify-between items-center">
        <div>
          <p class="font-bold text-sm">50 GB Data</p>
          <p class="text-xs text-blue-600 font-black">₹99</p>
        </div>
        <button class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow hover:bg-blue-700">Add</button>
      </div>
      <div class="bg-white dark:bg-gray-800 p-3.5 rounded-xl border dark:border-gray-700 shadow-sm flex justify-between items-center">
        <div>
          <p class="font-bold text-sm">100 GB Data</p>
          <p class="text-xs text-blue-600 font-black">₹149</p>
        </div>
        <button class="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow hover:bg-blue-700">Add</button>
      </div>
    </div>
  `;
}

// Render Recharge Plans
function renderRechargePlans() {
  const container = document.getElementById('rechargePlansContainer');
  if (!container) return;

  const plans = [
    { speed: '40 Mbps', price: '₹499', val: '30 Days', ott: 'Basic Fiber Speed' },
    { speed: '100 Mbps', price: '₹699', val: '30 Days', ott: 'Hotstar + SonyLIV' },
    { speed: '200 Mbps', price: '₹999', val: '30 Days', ott: 'Netflix + Prime + Hotstar' },
    { speed: '300 Mbps', price: '₹1499', val: '30 Days', ott: 'All OTT Apps Included' }
  ];

  container.innerHTML = plans.map(plan => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm flex justify-between items-center">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="font-black text-base text-gray-900 dark:text-white">${plan.speed}</span>
          <span class="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md">${plan.val}</span>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400">${plan.ott}</p>
      </div>
      <div class="text-right">
        <p class="text-lg font-black text-blue-600">${plan.price}</p>
        <button class="mt-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow transition-all">Recharge</button>
      </div>
    </div>
  `).join('');
}

// Render New Connection Offers
function renderNewConnectionOffers() {
  const container = document.getElementById('newConnectionOffersContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm space-y-3">
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-bold text-sm">Free Dual-Band Wi-Fi 6 Router</h4>
          <p class="text-xs text-gray-500">On 6 Months Booking</p>
        </div>
        <span class="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-lg">FREE ONT</span>
      </div>
      <button class="w-full bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl shadow">Book New Connection</button>
    </div>
  `;
}

// Render Status Details
function renderStatusDetails() {
  const speedContainer = document.getElementById('statusSpeedContainer');
  const devContainer = document.getElementById('statusDevicesContainer');

  if (speedContainer) {
    speedContainer.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm text-center">
        <p class="text-xs text-gray-500 font-bold uppercase">Live Connection Status</p>
        <h3 class="text-3xl font-black text-emerald-500 mt-1">ONLINE</h3>
        <p class="text-xs text-gray-400 mt-1">Ping: 12ms | Loss: 0%</p>
      </div>
    `;
  }

  if (devContainer) {
    devContainer.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm space-y-2">
        <p class="text-xs font-bold text-gray-500 uppercase">Connected Devices (3)</p>
        <div class="text-xs space-y-1 text-gray-700 dark:text-gray-300">
          <div class="flex justify-between py-1 border-b dark:border-gray-700"><span>📱 Smart Phone</span><span class="font-bold">5 GHz</span></div>
          <div class="flex justify-between py-1 border-b dark:border-gray-700"><span>💻 Windows Laptop</span><span class="font-bold">5 GHz</span></div>
          <div class="flex justify-between py-1"><span>📺 Android TV</span><span class="font-bold">2.4 GHz</span></div>
        </div>
      </div>
    `;
  }
}
