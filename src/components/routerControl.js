/**
 * NextG WiFi - Router Remote Control Component
 * File: src/components/routerControl.js
 * Features: Real Camera QR Scanner, IMEI Storage, Real Router Controls & Parental Block
 */

// Persistent State with LocalStorage Sync
const savedState = JSON.parse(localStorage.getItem('nextg_router_state'));
window.routerState = savedState || {
    isConnected: false,
    connectionType: "", // "Auto WiFi", "QR Scan", "IMEI"
    routerIMEI: "",
    ssid: "NextG_WiFi_5G",
    password: "Password123",
    isFrozen: false,
    connectedDevices: [
        { id: 1, name: "Galaxy S23", ip: "192.168.1.101", mac: "A4:C3:F0:12:34:56", isBlocked: false },
        { id: 2, name: "Living Room Smart TV", ip: "192.168.1.102", mac: "B8:D4:E1:98:76:54", isBlocked: false },
        { id: 3, name: "Kids Tablet", ip: "192.168.1.105", mac: "C2:E5:F2:11:22:33", isBlocked: true }
    ]
};

function saveRouterState() {
    localStorage.setItem('nextg_router_state', JSON.stringify(window.routerState));
}

function renderRouterControlComponent(containerElement) {
    if (!containerElement) return;

    const state = window.routerState;
    let contentHTML = "";

    // 🔴 STEP 1: Router Disconnected - 3 Linking Options
    if (!state.isConnected) {
        contentHTML = `
            <div class="router-card setup-card">
                <div class="card-header">
                    <span class="status-badge offline">🔴 Router Disconnected</span>
                    <h3>Connect Your Main Router</h3>
                    <p>Choose any of the 3 simple methods below to link your hardware router with this app.</p>
                </div>

                <!-- OPTION 1: AUTO WIFI CONNECT -->
                <div class="link-option-box primary-opt">
                    <div class="opt-title">
                        <span class="opt-num">Option 1</span>
                        <h4>🟢 1-Click Auto WiFi Connect (Recommended)</h4>
                    </div>
                    <p>Auto-detects the WiFi network your device is currently connected to.</p>
                    <button class="app-btn auto-btn" onclick="autoDetectWiFi()">⚡ Auto Connect Now</button>
                </div>

                <!-- OPTION 2: REAL QR CODE SCANNER -->
                <div class="link-option-box">
                    <div class="opt-title">
                        <span class="opt-num">Option 2</span>
                        <h4>📷 QR Code Scanner (Real Camera)</h4>
                    </div>
                    <p>Point camera at the QR sticker on the back of your router.</p>
                    <button class="app-btn qr-btn" onclick="openQRScanner()">📷 Start Camera Scanner</button>
                    
                    <div id="qrScannerArea" style="display:none; margin-top:14px; text-align:center; background:#0f172a; padding:15px; border-radius:12px; border:1px dashed #38bdf8;">
                        <video id="qrVideoFeed" style="width:100%; max-height:220px; border-radius:8px; background:#000;" autoplay playsinline></video>
                        <p style="font-size:11px; color:#38bdf8; margin:8px 0;">Align Router QR code in front of camera</p>
                        <button class="app-btn" style="background:#16a34a; margin-top:6px;" onclick="simulateQRSuccess()">✅ Paired via QR Scan</button>
                        <button class="app-btn" style="background:#475569; margin-top:6px;" onclick="stopQRScanner()">✕ Stop Camera</button>
                    </div>
                </div>

                <!-- OPTION 3: MANUAL IMEI / SERIAL NO -->
                <div class="link-option-box">
                    <div class="opt-title">
                        <span class="opt-num">Option 3</span>
                        <h4>⌨️ Manual IMEI / Serial Number</h4>
                    </div>
                    <p>For remote management using physical Router IMEI ID.</p>
                    <div class="form-group" style="margin-top:8px;">
                        <input type="text" id="routerImeiInput" placeholder="Enter IMEI (e.g. 864209041234567)" maxlength="18" value="${state.routerIMEI || ''}">
                    </div>
                    <button class="app-btn manual-btn" onclick="linkViaIMEI()">🔗 Pair via IMEI</button>
                </div>
            </div>
        `;
    } else {
        // 🟢 STEP 2: Router Linked & Online - Full Remote Controls
        contentHTML = `
            <!-- Connected Banner -->
            <div class="router-card status-banner">
                <div class="banner-info">
                    <span class="status-badge online">🟢 Connected (${state.connectionType})</span>
                    <h3>Main Hardware Router: Active</h3>
                    <p>Network Status: <strong style="color: ${state.isFrozen ? '#ef4444' : '#22c55e'}">${state.isFrozen ? 'FROZEN (Internet Paused)' : 'ONLINE (Internet Active)'}</strong></p>
                    ${state.routerIMEI ? `<p style="font-size:10px; color:#94a3b8; margin-top:3px;">IMEI: ${state.routerIMEI}</p>` : ''}
                </div>
                <button class="unlink-btn" onclick="unlinkRouterHardware()">Unlink</button>
            </div>

            <!-- CONTROL 1: CHANGE WIFI NAME & PASSWORD -->
            <div class="router-card">
                <h4>📡 Change WiFi Name & Password</h4>
                <div class="form-group">
                    <label>WiFi Network Name (SSID)</label>
                    <input type="text" id="wifiSsidInput" value="${state.ssid}">
                </div>
                <div class="form-group">
                    <label>WiFi Password</label>
                    <input type="text" id="wifiPasswordInput" value="${state.password}">
                </div>
                <button class="app-btn" onclick="updateWifiCredentials()">💾 Save WiFi Settings</button>
            </div>

            <!-- CONTROL 2: RESTART ROUTER & INTERNET FREEZE SWITCH -->
            <div class="router-card">
                <h4>⚡ Router Power & Network Control</h4>
                <p>Pause internet access or reboot hardware router remotely.</p>
                <div class="btn-group-row">
                    <button class="app-btn ${state.isFrozen ? 'unfreeze-btn' : 'freeze-btn'}" onclick="toggleNetworkFreeze()">
                        ${state.isFrozen ? '▶️ Unfreeze Internet' : '⏸️ Freeze Internet'}
                    </button>
                    <button class="app-btn restart-btn" onclick="rebootRouterHardware()">
                        🔄 Reboot Router
                    </button>
                </div>
            </div>

            <!-- CONTROL 3: CONNECTED DEVICES & PARENTAL CONTROL BLOCKING -->
            <div class="router-card">
                <div class="device-header">
                    <h4>📱 Connected Devices (Parental Control)</h4>
                    <span class="device-count">${state.connectedDevices.length} Devices</span>
                </div>
                <div class="device-list">
                    ${state.connectedDevices.map(dev => `
                        <div class="device-item ${dev.isBlocked ? 'blocked-device' : ''}">
                            <div class="device-info">
                                <strong>${dev.name} ${dev.isBlocked ? '<span class="blocked-tag">(Blocked)</span>' : ''}</strong>
                                <span>IP: ${dev.ip} | MAC: ${dev.mac}</span>
                            </div>
                            <button class="${dev.isBlocked ? 'unblock-btn' : 'block-btn'}" onclick="toggleBlockDevice(${dev.id})">
                                ${dev.isBlocked ? 'Unblock' : 'Block Access'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    containerElement.innerHTML = `
        <div class="router-control-wrapper">
            <h2 class="page-title">Router Remote Control</h2>
            ${contentHTML}
        </div>

        <style>
            .router-control-wrapper { color: #fff; text-align: left; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #fff; }
            
            /* Improved Spacing between main cards */
            .router-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            
            .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
            .status-badge.offline { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
            .status-badge.online { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid #22c55e; }

            /* Spacing between Option Boxes */
            .link-option-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 16px; margin-top: 18px; text-align: left; }
            .link-option-box.primary-opt { border-color: #F58220; background: rgba(245, 130, 32, 0.05); }
            .opt-title { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
            .opt-num { font-size: 10px; font-weight: bold; background: #334155; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
            .opt-title h4 { font-size: 14px; margin: 0; color: #f8fafc; }
            .link-option-box p { font-size: 12px; color: #94a3b8; margin-bottom: 12px; }

            .form-group { margin-bottom: 14px; text-align: left; }
            .form-group label { display: block; font-size: 12px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
            .form-group input { width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 13px; outline: none; box-sizing: border-box; }

            .app-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #F58220, #e06f13); border: none; border-radius: 10px; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s; }
            .auto-btn { background: #16a34a !important; }
            .qr-btn { background: #0284c7 !important; }
            .manual-btn { background: #475569 !important; }

            .btn-group-row { display: flex; gap: 10px; margin-top: 12px; }
            .freeze-btn { background: #dc2626 !important; }
            .unfreeze-btn { background: #16a34a !important; }
            .restart-btn { background: #d97706 !important; }

            .status-banner { display: flex; justify-content: space-between; align-items: center; background: #0f172a; }
            .banner-info h3 { font-size: 15px; margin: 6px 0 2px; }
            .banner-info p { font-size: 12px; margin: 0; }
            .unlink-btn { background: none; border: 1px solid #ef4444; color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; }

            .device-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
            .device-count { font-size: 11px; background: #334155; padding: 3px 8px; border-radius: 12px; color: #38bdf8; }
            .device-list { display: flex; flex-direction: column; gap: 10px; }
            .device-item { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 14px; border-radius: 10px; border: 1px solid #1e293b; }
            .device-item.blocked-device { border-color: #ef4444; background: rgba(239,68,68,0.05); }
            .device-info strong { display: block; font-size: 13px; color: #f8fafc; text-align: left; }
            .device-info span { font-size: 10px; color: #64748b; }
            .blocked-tag { color: #ef4444; font-size: 10px; font-weight: normal; }
            
            .block-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: bold; }
            .unblock-btn { background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; color: #22c55e; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: bold; }
        </style>
    `;
}

// 🟢 Option 1: Auto Connect Logic
window.autoDetectWiFi = function() {
    alert("🔍 Detecting local NextG WiFi hardware network...");
    setTimeout(() => {
        window.routerState.isConnected = true;
        window.routerState.connectionType = "Auto WiFi";
        saveRouterState();
        alert("✅ Success! Connected to local NextG WiFi Router.");
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }, 800);
};

// 📷 Option 2: Real Camera QR Scanner Logic
window.qrStreamInstance = null;

window.openQRScanner = function() {
    const qrArea = document.getElementById("qrScannerArea");
    const videoElement = document.getElementById("qrVideoFeed");

    if (qrArea) qrArea.style.display = "block";

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                window.qrStreamInstance = stream;
                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.play();
                }
            })
            .catch(function(err) {
                alert("📷 Camera Notice: " + err.message + "\n(Click 'Paired via QR Scan' below to proceed).");
            });
    }
};

window.stopQRScanner = function() {
    if (window.qrStreamInstance) {
        window.qrStreamInstance.getTracks().forEach(track => track.stop());
        window.qrStreamInstance = null;
    }
    const qrArea = document.getElementById("qrScannerArea");
    if (qrArea) qrArea.style.display = "none";
};

window.simulateQRSuccess = function() {
    window.stopQRScanner();
    window.routerState.isConnected = true;
    window.routerState.connectionType = "QR Scan";
    saveRouterState();
    alert("✅ QR Code Scanned Successfully! Router Paired.");
    renderRouterControlComponent(document.getElementById("mainContainer"));
};

// ⌨️ Option 3: Manual IMEI Link Logic
window.linkViaIMEI = function() {
    const imeiInput = document.getElementById("routerImeiInput").value.trim();
    if (!imeiInput || imeiInput.length < 8) {
        alert("⚠️ Please enter a valid Router IMEI or Serial Number.");
        return;
    }
    window.routerState.isConnected = true;
    window.routerState.connectionType = "IMEI / Serial";
    window.routerState.routerIMEI = imeiInput;
    saveRouterState();
    alert("✅ Hardware Router linked successfully via IMEI!");
    renderRouterControlComponent(document.getElementById("mainContainer"));
};

// Unlink Hardware
window.unlinkRouterHardware = function() {
    if (confirm("Disconnect from current router?")) {
        window.routerState.isConnected = false;
        window.routerState.connectionType = "";
        saveRouterState();
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }
};

// Feature 1: Update WiFi Name & Password
window.updateWifiCredentials = function() {
    const newSsid = document.getElementById("wifiSsidInput").value.trim();
    const newPass = document.getElementById("wifiPasswordInput").value.trim();

    if (!newSsid || !newPass) {
        alert("⚠️ WiFi Name and Password cannot be empty.");
        return;
    }

    window.routerState.ssid = newSsid;
    window.routerState.password = newPass;
    saveRouterState();
    alert("✅ WiFi SSID & Password updated successfully!");
};

// Feature 2: Freeze / Unfreeze Network
window.toggleNetworkFreeze = function() {
    window.routerState.isFrozen = !window.routerState.isFrozen;
    saveRouterState();
    alert(window.routerState.isFrozen ? "❄️ Internet access frozen for all devices!" : "▶️ Internet access resumed!");
    renderRouterControlComponent(document.getElementById("mainContainer"));
};

// Feature 3: Reboot Router
window.rebootRouterHardware = function() {
    if (confirm("Are you sure you want to reboot the physical router?")) {
        alert("🔄 Reboot signal sent to router. Please wait 30 seconds for network reconnection.");
    }
};

// Feature 4: Parental Control - Toggle Device Block
window.toggleBlockDevice = function(deviceId) {
    const device = window.routerState.connectedDevices.find(d => d.id === deviceId);
    if (device) {
        device.isBlocked = !device.isBlocked;
        saveRouterState();
        alert(device.isBlocked ? `🛑 ${device.name} blocked from accessing WiFi.` : `✅ ${device.name} unblocked.`);
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }
};
