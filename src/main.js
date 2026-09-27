// Firebase Configuration & Initialization Import
import './firebase-config.js';

// Core Application & Modules Logic Import
import './app.js';
import './modules/app-config.js';
import './modules/connection.js';
import './modules/home.js';
import './modules/recharge.js';
import './modules/status.js';

// UI Components Import
import './components/sidebar.js';
import './components/appSettings.js';
import './components/billingHistory.js';
import './components/routerControl.js';
import './components/supportDesk.js';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pwabuilder-sw.js')
      .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
}

console.log('NextG WiFi App (Vite Engine) initialized successfully!');
