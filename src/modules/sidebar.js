// src/modules/sidebar.js

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btnOpen = document.getElementById('btnOpenSidebar');
  const btnClose = document.getElementById('btnCloseSidebar');

  // Sidebar Open Logic
  if (btnOpen) {
    btnOpen.onclick = (e) => {
      e.preventDefault();
      sidebar?.classList.remove('-translate-x-full');
      overlay?.classList.remove('hidden');
    };
  }

  // Sidebar Close Logic
  const closeSidebar = () => {
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  };

  if (btnClose) btnClose.onclick = closeSidebar;
  if (overlay) overlay.onclick = closeSidebar;

  // Modals Open Event Delegation
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    // 1. App Lock Click
    if (target.id === 'btnSidebarAppLock') {
      closeSidebar();
      const modal = document.getElementById('appLockModal');
      if (modal) modal.classList.remove('hidden');
      else alert("App Lock Modal HTML में नहीं मिला!");
    }

    // 2. Profile Click
    if (target.id === 'btnSidebarProfile') {
      closeSidebar();
      const modal = document.getElementById('profileModal');
      if (modal) modal.classList.remove('hidden');
    }

    // 3. Router Click
    if (target.id === 'btnSidebarRouter') {
      closeSidebar();
      const modal = document.getElementById('routerSettingsModal');
      if (modal) modal.classList.remove('hidden');
    }

    // 4. Language Click
    if (target.id === 'btnSidebarLanguage') {
      closeSidebar();
      alert("Language Settings Modal अभी तैयार हो रहा है!");
    }

    // 5. Complaint Click
    if (target.id === 'btnSidebarComplaint') {
      closeSidebar();
      alert("Complaint Module जल्द आ रहा है!");
    }
  });

  // Inject App Lock Modal dynamic HTML if missing
  createAppLockModalHTML();
}

function createAppLockModalHTML() {
  if (document.getElementById('appLockModal')) return;

  const modalHtml = `
    <div id="appLockModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-white dark:bg-gray-900 w-full max-w-xs rounded-2xl shadow-2xl p-5 space-y-4 border dark:border-gray-800">
        <div class="flex justify-between items-center border-b dark:border-gray-800 pb-3">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            🛡️ App Lock Security
          </h3>
          <button id="btnCloseAppLockModal" class="text-gray-400 font-bold text-lg">&times;</button>
        </div>
        <div class="space-y-3 text-xs">
          <input type="password" id="inputAppPin" maxlength="4" placeholder="Enter 4-Digit PIN" class="w-full p-2.5 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center text-lg font-bold text-gray-900 dark:text-white" />
        </div>
        <button onclick="document.getElementById('appLockModal').classList.add('hidden')" class="w-full bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl">
          Save Settings
        </button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  document.getElementById('btnCloseAppLockModal').onclick = () => {
    document.getElementById('appLockModal').classList.add('hidden');
  };
}
