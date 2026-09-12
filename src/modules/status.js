// src/modules/status.js
import { showToast } from './sidebar.js';

// Router & Network Data State
let networkState = {
  isMainRouterFrozen: false,
  downloadSpeed: '84.2 Mbps',
  uploadSpeed: '42.6 Mbps',
  ping: '12 ms',
  cpuLoad: '28%',
  uptime: '4 days, 12 hrs',
  wifi5g: { ssid: 'NextG_5G_Home', pass: 'Speed@2026' },
  wifi24g: { ssid: 'NextG_2.4G_Home', pass: 'Speed@2026' }
};

// Connected Devices List
let connectedDevices = [
  { id: 'dev_1', name: 'Galaxy S24 Ultra', type: 'Mobile', ip: '192.168.1.10', band: '5GHz', isBlocked: false },
  { id: 'dev_2', name: 'MacBook Air M2', type: 'Laptop', ip: '192.168.1.14', band: '5GHz', isBlocked: false },
  { id: 'dev_3', name: 'Living Room Smart TV', type: 'TV', ip: '192.168.1.22', band: '2.4GHz', isBlocked: false },
  { id: 'dev_4', name: 'Unknown Guest Device', type: 'Unknown', ip: '192.168.1.45', band: '2.4GHz', isBlocked: true }
];

// Multi-Router / Mesh Mesh Extenders Data
let secondaryRouters = [
  { id: 'mesh_1', name: 'Bedroom Extender (Node 1)', location: 'First Floor', status: 'Online', signal: '92%' },
  { id: 'mesh_2', name: 'Study Room Mesh (Node 2)', location: 'Second Floor', status: 'Online', signal: '78%' }
];

export function initStatusModule() {
  const container = document.getElementById('view-status');
  if (!container) return;

  renderStatusView(container);
}

function renderStatusView(container) {
  const activeDeviceCount = connectedDevices.filter(d => !d.isBlocked).length;

  container.innerHTML = `
    <!-- 1. MAIN ROUTER POWER & FREEZE CONTROLLER -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 flex justify-between items-center">
      <div>
        <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
          <i data-lucide="router" class="w-4 h-4 text-blue-600"></i> Main Router Status
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Mode: <span class="${networkState.isMainRouterFrozen ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}">
            ${networkState.isMainRouterFrozen ? 'Frozen / Suspended' : 'Active & Broadcasting'}
          </span>
        </p>
      </div>
      <button id="btnFreezeRouter" class="${networkState.isMainRouterFrozen ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all active:scale-95">
        ${networkState.isMainRouterFrozen ? 'Unfreeze Router' : 'Freeze Router'}
      </button>
    </div>

    <!-- 2. LIVE NETWORK SPEED & 4G/5G DIAGNOSTICS -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Download Speed -->
      <div class="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 rounded-2xl shadow-md space-y-1">
        <div class="flex justify-between items-center text-blue-200">
          <span class="text-[10px] font-black uppercase tracking-wider">Download (5G Band)</span>
          <i data-lucide="arrow-down-circle" class="w-4 h-4"></i>
        </div>
        <h4 class="text-xl font-black">${networkState.isMainRouterFrozen ? '0.0 Mbps' : networkState.downloadSpeed}</h4>
        <p class="text-[10px] text-blue-200">Ping: ${networkState.ping} • Stable</p>
      </div>

      <!-- Upload Speed -->
      <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-4 rounded-2xl shadow-md space-y-1">
        <div class="flex justify-between items-center text-indigo-200">
          <span class="text-[10px] font-black uppercase tracking-wider">Upload (4G/5G)</span>
          <i data-lucide="arrow-up-circle" class="w-4 h-4"></i>
        </div>
        <h4 class="text-xl font-black">${networkState.isMainRouterFrozen ? '0.0 Mbps' : networkState.uploadSpeed}</h4>
        <p class="text-[10px] text-indigo-200">CPU Load: ${networkState.cpuLoad}</p>
      </div>
    </div>

    <!-- 3. WI-FI SSID & PASSWORD EDIT SECTION -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 space-y-3">
      <h4 class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
        <i data-lucide="wifi" class="w-4 h-4 text-emerald-500"></i> Wi-Fi Name & Password Edit
      </h4>
      
      <!-- 5G Network Edit -->
      <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2 border border-gray-100 dark:border-gray-700">
        <span class="text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-600 px-2 py-0.5 rounded-full">5GHz High Speed</span>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" id="inputSsid5g" value="${networkState.wifi5g.ssid}" class="bg-white dark:bg-gray-800 text-xs p-2 rounded-lg border dark:border-gray-700 text-gray-900 dark:text-white font-medium" placeholder="5G SSID" />
          <input type="password" id="inputPass5g" value="${networkState.wifi5g.pass}" class="bg-white dark:bg-gray-800 text-xs p-2 rounded-lg border dark:border-gray-700 text-gray-900 dark:text-white font-medium" placeholder="5G Password" />
        </div>
      </div>

      <!-- 2.4G Network Edit -->
      <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2 border border-gray-100 dark:border-gray-700">
        <span class="text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-600 px-2 py-0.5 rounded-full">2.4GHz Wide Range</span>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" id="inputSsid24g" value="${networkState.wifi24g.ssid}" class="bg-white dark:bg-gray-800 text-xs p-2 rounded-lg border dark:border-gray-700 text-gray-900 dark:text-white font-medium" placeholder="2.4G SSID" />
          <input type="password" id="inputPass24g" value="${networkState.wifi24g.pass}" class="bg-white dark:bg-gray-800 text-xs p-2 rounded-lg border dark:border-gray-700 text-gray-900 dark:text-white font-medium" placeholder="2.4G Password" />
        </div>
      </div>

      <button id="btnSaveWifiSettings" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition-all active:scale-95">
        Update Wi-Fi Credentials
      </button>
    </div>

    <!-- 4. CONNECTED DEVICES MANAGER (BLOCK/UNBLOCK) -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 space-y-3">
      <div class="flex justify-between items-center">
        <h4 class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
          <i data-lucide="smartphone" class="w-4 h-4 text-blue-500"></i> Connected Devices (${activeDeviceCount})
        </h4>
        <span class="text-[10px] font-bold text-gray-400">Manage Access</span>
      </div>

      <div class="space-y-2">
        ${connectedDevices.map(dev => `
          <div class="flex justify-between items-center p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 ${dev.isBlocked ? 'bg-rose-50/50 dark:bg-rose-950/20' : 'bg-gray-50 dark:bg-gray-900'}">
            <div>
              <h5 class="text-xs font-bold text-gray-900 dark:text-white ${dev.isBlocked ? 'line-through text-gray-400' : ''}">${dev.name}</h5>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">${dev.ip} • ${dev.band}</p>
            </div>
            <button data-id="${dev.id}" class="btnToggleBlock text-[11px] font-extrabold px-3 py-1 rounded-lg transition-all ${dev.isBlocked ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
              ${dev.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 5. MULTI-ROUTER / SECONDARY EXTENDERS STATUS -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 space-y-3">
      <h4 class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
        <i data-lucide="network" class="w-4 h-4 text-purple-500"></i> Secondary Routers & Mesh
      </h4>

      <div class="space-y-2">
        ${secondaryRouters.map(router => `
          <div class="flex justify-between items-center p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
            <div>
              <h5 class="text-xs font-bold text-gray-900 dark:text-white">${router.name}</h5>
              <p class="text-[10px] text-gray-500 dark:text-gray-400">${router.location}</p>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-600 px-2 py-0.5 rounded-full">● ${router.status}</span>
              <p class="text-[10px] text-gray-400 font-bold mt-1">Signal: ${router.signal}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Icons refresh
  if (window.lucide) window.lucide.createIcons();

  // Attach Event Handlers
  attachStatusEvents(container);
}

function attachStatusEvents(container) {
  // Freeze / Unfreeze Router Button
  const btnFreeze = document.getElementById('btnFreezeRouter');
  if (btnFreeze) {
    btnFreeze.addEventListener('click', () => {
      networkState.isMainRouterFrozen = !networkState.isMainRouterFrozen;
      showToast(networkState.isMainRouterFrozen ? 'Main Router Frozen!' : 'Main Router Activated!');
      renderStatusView(container);
    });
  }

  // Save Wi-Fi Credentials
  const btnSaveWifi = document.getElementById('btnSaveWifiSettings');
  if (btnSaveWifi) {
    btnSaveWifi.addEventListener('click', () => {
      const s5 = document.getElementById('inputSsid5g')?.value;
      const p5 = document.getElementById('inputPass5g')?.value;
      const s24 = document.getElementById('inputSsid24g')?.value;
      const p24 = document.getElementById('inputPass24g')?.value;

      if (!s5 || !p5 || !s24 || !p24) {
        showToast('Please fill all Wi-Fi details!');
        return;
      }

      networkState.wifi5g = { ssid: s5, pass: p5 };
      networkState.wifi24g = { ssid: s24, pass: p24 };
      showToast('Wi-Fi Name & Password updated successfully!');
    });
  }

  // Block / Unblock Connected Devices
  document.querySelectorAll('.btnToggleBlock').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const devId = e.currentTarget.getAttribute('data-id');
      const targetDevice = connectedDevices.find(d => d.id === devId);
      if (targetDevice) {
        targetDevice.isBlocked = !targetDevice.isBlocked;
        showToast(`${targetDevice.name} ${targetDevice.isBlocked ? 'Blocked' : 'Unblocked'}!`);
        renderStatusView(container);
      }
    });
  });
}
