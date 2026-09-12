/**
 * NextG WiFi - Router Remote Control Component
 * File: src/components/routerControl.js
 * Default Language: English
 * Features: 3-Way Link (Auto WiFi, QR Scan, Manual IMEI) + Full Router Controls
 */

// Persistent State for Router Connection & Controls
window.routerState = window.routerState || {
    isConnected: false,
    connectionType: "", // "Auto WiFi", "QR Scan", "IMEI"
    routerIMEI: "",
    ssid: "NextG_WiFi_5G",
    password: "Password123",
    isFrozen: false,
    connectedDevices: [
        { id: 1, name: "Galaxy S23", ip: "192.168.1.101", mac: "A4:C3:F0:12:34:56" },
        { id: 2, name: "Living Room Smart TV", ip: "192.168.1.102", mac: "B8:D4:E1:98:76:54" },
        { id: 3, name: "MacBook Air", ip: "192.168.1.105", mac: "C2:E5:F2:11:22:33" }
    ]
};

function renderRouterControlComponent(containerElement) {
    if (!containerElement) return;

    const state = window.routerState;
    let contentHTML = "";

    // 🔴 STEP 1: Router Disconnected - Show 3 Easy Linking Options
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
                    <p>Auto-detects the WiFi network your phone is currently connected to.</p>
                    <button class="app-btn auto-btn" onclick="autoDetectWiFi()">⚡ Auto Connect Now</button>
                </div>

                <!-- OPTION 2: QR CODE SCANNER -->
                <div class="link-option-box">
                    <div class="opt-title">
                        <span class="opt-num">Option 2</span>
                        <h4>📷 QR Code Scanner (Fast & Easy)</h4>
                    </div>
                    <p>Point camera at the QR sticker on the back of your router.</p>
                    <button class="app-btn qr-btn" onclick="openQRScanner()">📷 Scan Router QR Code</button>
                    <div id="qrScannerArea" style="display:none; margin-top:10px; text-align:center; background:#0f172a; padding:15px; border-radius:10px; border:1px dashed #38bdf8;">
                        <p style="font-size:12px; color:#38bdf8;">📷 Camera Active... Align QR Code in frame</p>
                        <button class="app-btn" style="margin-top:10px; background:#16a34a;" onclick="simulateQRSuccess()">[Demo] QR Code Detected!</button>
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
                        <input type="text" id="routerImeiInput" placeholder="Enter IMEI (e.g. 864209041234567)" maxlength="18">
                    </div>
                    <button class="app-btn manual-btn" onclick="linkViaIMEI()">🔗 Pair via IMEI</button>
                </div>
            </div>
        `;
    } else {
        // 🟢 STEP 2: Router Linked & Online - Full Controls Unlocked
        contentHTML = `
            <!-- Connected Banner -->
            <div class="router-card status-banner">
                <div class="banner-info">
                    <span class="status-badge online">🟢 Connected (${state.connectionType})</span>
                    <h3>Main Hardware Router: Active</h3>
                    <p>Network Status: <strong style="color: ${state.isFrozen ? '#ef4444' : '#22c55e'}">${state.isFrozen ? 'FROZEN (Internet Paused)' : 'ONLINE (Internet Active)'}</strong></p>
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

            <!-- CONTROL 2: FREEZE / UNFREEZE INTERNET -->
            <div class="router-card">
                <h4>🛑 Internet Freeze / Unfreeze Power Switch</h4>
                <p>Instantly pause internet access across all devices connected to this router.</p>
                <button class="app-btn ${state.isFrozen ? 'unfreeze-btn' : 'freeze-btn'}" onclick="toggleNetworkFreeze()">
                    ${state.isFrozen ? '▶️ Unfreeze Internet Access' : '⏸️ Freeze Internet Access'}
                </button>
            </div>

            <!-- CONTROL 3: CONNECTED DEVICES LIST & BLOCKING -->
            <div class="router-card">
                <div class="device-header">
                    <h4>📱 Connected Devices List</h4>
                    <span class="device-count">${state.connectedDevices.length} Connected</span>
                </div>
                <div class="device-list">
                    ${state.connectedDevices.map(dev => `
                        <div class="device-item">
                            <div class="device-info">
                                <strong>${dev.name}</strong>
                                <span>IP: ${dev.ip} | MAC: ${dev.mac}</span>
                            </div>
                            <button class="block-btn" onclick="blockDevice('${dev.name}')">Block</button>
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
            .router-control-wrapper { color: #fff; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
            .router-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 16px; }
            
            .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
            .status-badge.offline { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
            .status-badge.online { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid #22c55e; }

            .link-option-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 14px; margin-top: 12px; text-align: left; }
            .link-option-box.primary-opt { border-color: #F58220; background: rgba(245, 130, 32, 0.05); }
            .opt-title { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
            .opt-num { font-size: 10px; font-weight: bold; background: #334155; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
            .opt-title h4 { font-size: 13px; margin: 0; color: #f8fafc; }
            .link-option-box p { font-size: 11px; color: #94a3b8; margin-bottom: 10px; }

            .form-group { margin-bottom: 12px; text-align: left; }
            .form-group label { display: block; font-size: 12px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
            .form-group input { width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 13px; outline: none; }

            .app-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #F58220, #e06f13); border: none; border-radius: 10px; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s; }
            .auto-btn { background: #16a34a !important; }
            .qr-btn { background: #0284c7 !important; }
            .manual-btn { background: #475569 !important; }

            .freeze-btn { background: #dc2626 !important; }
            .unfreeze-btn { background: #16a34a !important; }

            .status-banner { display: flex; justify-content: space-between; align-items: center; background: #0f172a; }
            .banner-info h3 { font-size: 14px; margin: 6px 0 2px; }
            .banner-info p { font-size: 12px; margin:0; }
            .unlink-btn { background: none; border: 1px solid #ef4444; color: #ef4444; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer; }

            .device-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .device-count { font-size: 11px; background: #334155; padding: 3px 8px; border-radius: 12px; color: #38bdf8; }
            .device-list { display: flex; flex-direction: column; gap: 8px; }
            .device-item { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 10px 12px; border-radius: 8px; border: 1px solid #1e293b; }
            .device-info strong { display: block; font-size: 13px; color: #f8fafc; text-align: left; }
            .device-info span { font-size: 10px; color: #64748b; }
            .block-btn { background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; }
        </style>
    `;
}

// 🟢 Option 1: Auto Connect Logic
function autoDetectWiFi() {
    alert("Detecting local NextG WiFi connection...");
    setTimeout(() => {
        window.routerState.isConnected = true;
        window.routerState.connectionType = "Auto WiFi";
        alert("Success! Connected to local NextG WiFi Router.");
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }, 800);
}

// 📷 Option 2: QR Code Scan Logic
function openQRScanner() {
    const qrArea = document.getElementById("qrScannerArea");
    if (qrArea) qrArea.style.display = "block";
}

function simulateQRSuccess() {
    window.routerState.isConnected = true;
    window.routerState.connectionType = "QR Scan";
    alert("QR Code Scanned Successfully! Router Paired.");
    renderRouterControlComponent(document.getElementById("mainContainer"));
}

// ⌨️ Option 3: Manual IMEI Link Logic
function linkViaIMEI() {
    const imeiInput = document.getElementById("routerImeiInput").value.trim();
    if (!imeiInput || imeiInput.length < 8) {
        alert("Please enter a valid Router IMEI or Serial Number.");
        return;
    }
    window.routerState.isConnected = true;
    window.routerState.connectionType = "IMEI / Serial";
    window.routerState.routerIMEI = imeiInput;
    alert("Router linked successfully via IMEI!");
    renderRouterControlComponent(document.getElementById("mainContainer"));
}

// Unlink Logic
function unlinkRouterHardware() {
    if (confirm("Disconnect from current router?")) {
        window.routerState.isConnected = false;
        window.routerState.connectionType = "";
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }
}

// Feature 1: Update WiFi Name & Password
function updateWifiCredentials() {
    const newSsid = document.getElementById("wifiSsidInput").value.trim();
    const newPass = document.getElementById("wifiPasswordInput").value.trim();

    if (!newSsid || !newPass) {
        alert("WiFi Name and Password cannot be empty.");
        return;
    }

    window.routerState.ssid = newSsid;
    window.routerState.password = newPass;
    alert("WiFi Password & SSID updated successfully!");
}

// Feature 2: Freeze / Unfreeze Network
function toggleNetworkFreeze() {
    window.routerState.isFrozen = !window.routerState.isFrozen;
    alert(window.routerState.isFrozen ? "Internet Frozen across all devices!" : "Internet Resumed!");
    renderRouterControlComponent(document.getElementById("mainContainer"));
}

// Feature 3: Block Connected Device
function blockDevice(deviceName) {
    if (confirm(`Block internet for ${deviceName}?`)) {
        window.routerState.connectedDevices = window.routerState.connectedDevices.filter(dev => dev.name !== deviceName);
        alert(`${deviceName} blocked.`);
        renderRouterControlComponent(document.getElementById("mainContainer"));
    }
}
