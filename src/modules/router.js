// src/modules/router.js - Router Settings Module

export function initRouterModule() {
  const routerModal = document.getElementById('routerSettingsModal');
  const btnCloseRouter = document.getElementById('btnCloseRouterModal');
  const btnSaveRouter = document.getElementById('btnSaveRouter');

  // Router Modal Close
  if (btnCloseRouter && routerModal) {
    btnCloseRouter.onclick = () => {
      routerModal.classList.add('hidden');
    };
  }

  // Router Settings Save Action
  if (btnSaveRouter) {
    btnSaveRouter.onclick = () => {
      const ssid2g = document.getElementById('ssid2g')?.value;
      const pass2g = document.getElementById('pass2g')?.value;
      const ssid5g = document.getElementById('ssid5g')?.value;
      const pass5g = document.getElementById('pass5g')?.value;

      if (!ssid2g || !pass2g) {
        alert("कृपया 2.4GHz Wi-Fi का नाम और पासवर्ड भरें!");
        return;
      }

      // 📡 Simulated Router API Request
      alert(`✅ राउटर सेटिंग्स अपडेट हो गई हैं!\n\n2.4GHz Wi-Fi: ${ssid2g}\n5GHz Wi-Fi: ${ssid5g || 'N/A'}`);
      
      if (routerModal) routerModal.classList.add('hidden');
    };
  }
}
