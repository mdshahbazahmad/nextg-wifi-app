// src/app.js

document.addEventListener('DOMContentLoaded', () => {
  console.log("App Initializing...");

  // 1. Lucide Icons Render
  renderIcons();

  // 2. Safe Module Imports Injection
  import('./modules/sidebar.js').then(m => m.initSidebar && m.initSidebar()).catch(e => console.warn("Sidebar Module Error:", e));
  import('./modules/home.js').then(m => m.initHomeModule && m.initHomeModule()).catch(e => console.warn("Home Module Error:", e));
  import('./modules/recharge.js').then(m => m.initRechargeModule && m.initRechargeModule()).catch(e => console.warn("Recharge Module Error:", e));
  import('./modules/newConnection.js').then(m => m.initNewConnectionModule && m.initNewConnectionModule()).catch(e => console.warn("NewConnection Module Error:", e));
  import('./modules/status.js').then(m => m.initStatusModule && m.initStatusModule()).catch(e => console.warn("Status Module Error:", e));

  // 3. Setup Navigation Tabs Switching Logic
  setupTabNavigation();

  // Re-render icons after DOM loads
  setTimeout(renderIcons, 200);
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
