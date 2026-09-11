// src/modules/sidebar.js

export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const btnOpenSidebar = document.getElementById('btnOpenSidebar');
  const btnCloseSidebar = document.getElementById('btnCloseSidebar');

  // SideBar Open Function
  const openSidebar = () => {
    sidebar.classList.remove('-translate-x-full');
    sidebarOverlay.classList.remove('hidden');
  };

  // SideBar Close Function
  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarOverlay.classList.add('hidden');
  };

  // Event Listeners for Opening/Closing
  if (btnOpenSidebar) btnOpenSidebar.addEventListener('click', openSidebar);
  if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Profile Settings Modal Toggle
  const btnSidebarProfile = document.getElementById('btnSidebarProfile');
  const profileModal = document.getElementById('profileModal');
  const btnCloseProfileModal = document.getElementById('btnCloseProfileModal');

  if (btnSidebarProfile) {
    btnSidebarProfile.addEventListener('click', () => {
      closeSidebar();
      profileModal.classList.remove('hidden');
    });
  }

  if (btnCloseProfileModal) {
    btnCloseProfileModal.addEventListener('click', () => {
      profileModal.classList.add('hidden');
    });
  }

  // Profile Photo Change/Upload Logic
  const profilePhotoInput = document.getElementById('profilePhotoInput');
  const modalProfileImg = document.getElementById('modalProfileImg');
  const sbUserAvatar = document.getElementById('sbUserAvatar');
  const navAvatar = document.getElementById('navAvatar');

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const newImgUrl = e.target.result;
          if (modalProfileImg) modalProfileImg.src = newImgUrl;
          if (sbUserAvatar) sbUserAvatar.src = newImgUrl;
          if (navAvatar) navAvatar.src = newImgUrl;
          showToast('Profile photo updated!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Router Settings Modal Toggle
  const btnSidebarRouter = document.getElementById('btnSidebarRouter');
  const routerSettingsModal = document.getElementById('routerSettingsModal');
  const btnCloseRouterModal = document.getElementById('btnCloseRouterModal');

  if (btnSidebarRouter) {
    btnSidebarRouter.addEventListener('click', () => {
      closeSidebar();
      routerSettingsModal.classList.remove('hidden');
    });
  }

  if (btnCloseRouterModal) {
    btnCloseRouterModal.addEventListener('click', () => {
      routerSettingsModal.classList.add('hidden');
    });
  }

  // Dark Mode Toggle
  const btnSidebarTheme = document.getElementById('btnSidebarTheme');
  if (btnSidebarTheme) {
    btnSidebarTheme.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      showToast('Theme changed!');
    });
  }
}

// Utility Toast Function
export function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 2500);
  }
}
