// src/modules/sidebar.js

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btnOpen = document.getElementById('btnOpenSidebar');
  const btnClose = document.getElementById('btnCloseSidebar');

  // SideBar Open (☰ Click)
  if (btnOpen) {
    btnOpen.onclick = (e) => {
      e.preventDefault();
      sidebar?.classList.remove('-translate-x-full');
      overlay?.classList.remove('hidden');
    };
  }

  // SideBar Close (X या Overlay Click)
  const closeSidebar = () => {
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  };

  if (btnClose) btnClose.onclick = closeSidebar;
  if (overlay) overlay.onclick = closeSidebar;

  // Buttons Event Listener (इवेंट डेलिगेशन)
  sidebar?.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('button');
    if (!targetBtn) return;

    const id = targetBtn.id;

    // Profile Settings
    if (id === 'btnSidebarProfile') {
      closeSidebar();
      document.getElementById('profileModal')?.classList.remove('hidden');
    }

    // Router Settings
    if (id === 'btnSidebarRouter') {
      closeSidebar();
      document.getElementById('routerSettingsModal')?.classList.remove('hidden');
    }

    // App Lock (Dynamic Popup)
    if (id === 'btnSidebarAppLock') {
      closeSidebar();
      document.getElementById('appLockModal')?.classList.remove('hidden');
    }
  });
}
