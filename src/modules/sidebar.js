// src/modules/sidebar.js

// 1. App Lock State (Browser Cache / LocalStorage me save rahega)
let appLockState = {
  isEnabled: localStorage.getItem('appLockEnabled') === 'true',
  pin: localStorage.getItem('appLockPin') || '1234'
};

// 2. Global Toast Alert System
export function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed bottom-5 right-5 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl transition-all duration-300 z-50 transform translate-y-10 opacity-0';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.classList.remove('translate-y-10', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 2500);
}

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const btnCloseSidebar = document.getElementById('btnCloseSidebar');

  // Sidebar Toggle Logic
  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
      sidebar?.classList.remove('-translate-x-full');
    });
  }

  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', () => {
      sidebar?.classList.add('-translate-x-full');
    });
  }

  // Inject App Lock Security Modal
  createAppLockModal();

  // Attach All Sidebar Events
  attachSidebarEvents();
}

function attachSidebarEvents() {
  const btnAppLock = document.getElementById('btnSidebarAppLock');
  if (btnAppLock) {
    btnAppLock.addEventListener('click', () => {
      const modal = document.getElementById('appLockModal');
      if (modal) modal.classList.remove('hidden');
    });
  }
}

// App Lock Modal Generator & Logic
function createAppLockModal() {
  if (document.getElementById('appLockModal')) return;

  const modalHtml = `
    <div id="appLockModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-white dark:bg-gray-800 w-full max-w-xs rounded-2xl shadow-2xl p-5 space-y-4 border dark:border-gray-700">
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i> App Lock Security
          </h3>
          <button id="btnCloseAppLockModal" class="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Enable Switch -->
          <div class="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <span class="font-semibold text-gray-700 dark:text-gray-300">Enable Security PIN</span>
            <input type="checkbox" id="chkEnableAppLock" class="w-4 h-4 text-blue-600 rounded" ${appLockState.isEnabled ? 'checked' : ''} />
          </div>

          <!-- PIN Set -->
          <div class="space-y-2">
            <label class="block font-bold text-gray-600 dark:text-gray-400">Set 4-Digit Security PIN</label>
            <input type="password" id="inputAppPin" maxlength="4" value="${appLockState.pin}" placeholder="Ex: 1234" class="w-full p-2.5 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-center text-lg font-black tracking-widest text-gray-900 dark:text-white" />
          </div>
        </div>

        <button id="btnSaveAppLock" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition-all active:scale-95">
          Save Lock Settings
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Close Event
  document.getElementById('btnCloseAppLockModal')?.addEventListener('click', () => {
    document.getElementById('appLockModal')?.classList.add('hidden');
  });

  // Save Event
  document.getElementById('btnSaveAppLock')?.addEventListener('click', () => {
    const isChecked = document.getElementById('chkEnableAppLock')?.checked;
    const pinVal = document.getElementById('inputAppPin')?.value;

    if (isChecked && (!pinVal || pinVal.length < 4)) {
      showToast('Please enter a valid 4-digit PIN!');
      return;
    }

    localStorage.setItem('appLockEnabled', isChecked);
    localStorage.setItem('appLockPin', pinVal);
    appLockState.isEnabled = isChecked;
    appLockState.pin = pinVal;

    document.getElementById('appLockModal')?.classList.add('hidden');
    showToast(isChecked ? 'App Lock Activated!' : 'App Lock Deactivated!');
  });
}
