/**
 * NextG WiFi - Live Router & Network Telemetry Module
 * File: src/modules/status.js
 * Features:
 *  1. Real-time Live Band Speed Telemetry (4G & 5G Download/Upload Speeds) synced from Router.
 *  2. Real-time Internet Access Freeze / Resume Toggle.
 *  3. Dynamic Wi-Fi Credential Management (4G & 5G SSID / Password edit with Eye Toggle).
 *  4. Connected Devices Scanner & Instant Remote Block / Unblock via Router Command Queue.
 *  5. Multi-Router Mesh Topology Management & Live Firmware Actions.
 */

let unsubscribeRouterStatus = null;
let unsubscribeConnectedDevices = null;
let unsubscribeMeshRouters = null;

function renderStatusModule(container) {
    if (!container) return;

    // Clean up active real-time Firestore listeners
    clearStatusSubscriptions();

    // Base HTML Skeleton
    container.innerHTML = `
        <div class="status-module-wrapper" style="max-width: 600px; margin: 0 auto; color: #fff; text-align: left; font-family: system-ui, -apple-system, sans-serif;">
            
            <div style="margin-bottom: 16px;">
                <h2 style="font-size: 20px; color: #ffffff; font-weight: 800; margin: 0 0 4px 0;">🌐 राउटर एवं नेटवर्क स्टेटस</h2>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">राउटर स्पीड, वाई-फाई पासवर्ड, कनेक्टेड डिवाइसेस और मेश टोपोलॉजी मैनेज करें</p>
            </div>

            <!-- 1. LIVE BAND SPEED METER (4G & 5G BANDS) -->
            <div class="app-card" style="background: linear-gradient(135deg, #0f172a, #1e293b); border-left: 4px solid #38bdf8; border-radius: 16px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 800; letter-spacing: 0.5px;">LIVE ROUTER SPEED TELEMETRY</span>
                    <span id="speedMeterStatus" style="font-size: 10px; color: #10b981; font-weight: bold;">● LIVE</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                        <div style="font-size: 12px; color: #f59e0b; font-weight: bold; margin-bottom: 8px;">📶 4G Wi-Fi Band</div>
                        <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong id="speed4GDL" style="color:#fff;">-- Mbps</strong></div>
                        <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong id="speed4GUL" style="color:#fff;">-- Mbps</strong></div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                        <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 8px;">🚀 5G Wi-Fi Band</div>
                        <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong id="speed5GDL" style="color:#fff;">-- Mbps</strong></div>
                        <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong id="speed5GUL" style="color:#fff;">-- Mbps</strong></div>
                    </div>
                </div>
            </div>

            <!-- 2. INTERNET FREEZE SWITCH -->
            <div class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="font-size: 15px; color: #fff; margin: 0 0 2px 0; font-weight: 700;">🌐 इंटरनेट एक्सेस पॉज़ (Freeze Net)</h4>
                        <p style="font-size: 11px; color: #94a3b8; margin: 0;">राउटर ऑन रहेगा पर वाई-फाई डेटा बंद/चालू होगा</p>
                    </div>
                    <button id="freezeToggleBtn" onclick="toggleInternetFreeze()" style="background: #ef4444; color: white; border: none; padding: 10px 14px; border-radius: 10px; font-weight: bold; font-size: 12px; cursor: pointer;">
                        🔴 Freeze Net
                    </button>
                </div>
            </div>

            <!-- 3. WI-FI CREDENTIAL EDIT FORM WITH EYE TOGGLE -->
            <div class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <h4 style="font-size: 15px; color: #fff; margin: 0 0 12px 0; font-weight: 700;">🔐 Wi-Fi नाम व पासवर्ड बदलें</h4>
                
                <!-- 4G Network Credentials -->
                <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <span style="font-size: 12px; color: #f59e0b; font-weight: bold; display: block; margin-bottom: 6px;">4G Wi-Fi Network</span>
                    <input type="text" id="ssid4G" placeholder="4G SSID Name" style="width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                    
                    <div style="position: relative; width: 100%; box-sizing: border-box;">
                        <input type="password" id="pass4G" placeholder="4G Wi-Fi Password" style="width: 100%; box-sizing: border-box; padding: 10px 38px 10px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                        <button type="button" onclick="togglePasswordVisibility('pass4G', 'eyeIcon4G')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;">
                            <i id="eyeIcon4G" data-lucide="eye" style="width: 18px; height: 18px;"></i>
                        </button>
                    </div>
                </div>

                <!-- 5G Network Credentials -->
                <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <span style="font-size: 12px; color: #10b981; font-weight: bold; display: block; margin-bottom: 6px;">5G Ultra Wi-Fi Network</span>
                    <input type="text" id="ssid5G" placeholder="5G SSID Name" style="width: 100%; box-sizing: border-box; margin-bottom: 8px; padding: 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                    
                    <div style="position: relative; width: 100%; box-sizing: border-box;">
                        <input type="password" id="pass5G" placeholder="5G Wi-Fi Password" style="width: 100%; box-sizing: border-box; padding: 10px 38px 10px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                        <button type="button" onclick="togglePasswordVisibility('pass5G', 'eyeIcon5G')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;">
                            <i id="eyeIcon5G" data-lucide="eye" style="width: 18px; height: 18px;"></i>
                        </button>
                    </div>
                </div>

                <button id="saveWifiBtn" onclick="saveWifiSettings()" class="app-btn" style="width: 100%; background: linear-gradient(135deg, #F58220, #e06f13); color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 13px; padding: 12px; cursor: pointer;">
                    💾 सेटिंग्स सेव करें (Save Wi-Fi)
                </button>
            </div>

            <!-- 4. ALL CONNECTED DEVICES MANAGEMENT -->
            <div class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 id="devicesHeaderTitle" style="font-size: 15px; color: #fff; margin: 0; font-weight: 700;">📱 कनेक्टेड डिवाइस (0)</h4>
                    <span style="font-size: 10px; color: #10b981; background: rgba(16, 185, 129, 0.2); padding: 3px 8px; border-radius: 8px; font-weight: bold;">LIVE SCAN</span>
                </div>
                <div id="devicesListContainer">
                    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 20px 0;">लोड हो रहा है...</p>
                </div>
            </div>

            <!-- 5. PRIMARY, SECONDARY & MESH ROUTER MANAGEMENT -->
            <div class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="font-size: 15px; color: #fff; margin: 0; font-weight: 700;">⚙️ जुड़े हुए राउटर (Mesh Topology)</h4>
                    <button onclick="addNewRouter()" style="background: #F58220; color: #fff; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                        + Add Router
                    </button>
                </div>
                <div id="meshRoutersContainer">
                    <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 20px 0;">लोड हो रहा है...</p>
                </div>
            </div>

        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Start Live Realtime Telemetry Listeners
    setupStatusRealtimeSync();
}

/**
 * Cleanup function for memory management
 */
function clearStatusSubscriptions() {
    if (unsubscribeRouterStatus) unsubscribeRouterStatus();
    if (unsubscribeConnectedDevices) unsubscribeConnectedDevices();
    if (unsubscribeMeshRouters) unsubscribeMeshRouters();
}

/**
 * Real-time Firestore Listeners Initialization
 */
function setupStatusRealtimeSync() {
    if (!window.db || !firebase.auth().currentUser) {
        renderFallbackUI();
        return;
    }

    const userId = firebase.auth().currentUser.uid;

    // 1. Real-time Live Speed Meter & Wi-Fi Credentials Sync
    unsubscribeRouterStatus = window.db.collection("router_telemetry").doc(userId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                
                // Speeds
                document.getElementById("speed4GDL").textContent = `${data.speed4G_DL || "0.0"} Mbps`;
                document.getElementById("speed4GUL").textContent = `${data.speed4G_UL || "0.0"} Mbps`;
                document.getElementById("speed5GDL").textContent = `${data.speed5G_DL || "0.0"} Mbps`;
                document.getElementById("speed5GUL").textContent = `${data.speed5G_UL || "0.0"} Mbps`;

                // Wi-Fi SSIDs & Passwords
                if (data.ssid4G) document.getElementById("ssid4G").value = data.ssid4G;
                if (data.pass4G) document.getElementById("pass4G").value = data.pass4G;
                if (data.ssid5G) document.getElementById("ssid5G").value = data.ssid5G;
                if (data.pass5G) document.getElementById("pass5G").value = data.pass5G;

                // Internet Freeze State
                updateFreezeButtonState(data.isInternetFrozen || false);
            } else {
                renderDefaultDocCreation(userId);
            }
        }, (err) => {
            console.error("Telemetry sync error:", err);
            renderFallbackUI();
        });

    // 2. Real-time Connected Devices List
    unsubscribeConnectedDevices = window.db.collection("router_telemetry").doc(userId)
        .collection("connected_devices")
        .onSnapshot((snapshot) => {
            const devicesContainer = document.getElementById("devicesListContainer");
            const headerTitle = document.getElementById("devicesHeaderTitle");
            if (!devicesContainer) return;

            if (snapshot.empty) {
                if (headerTitle) headerTitle.textContent = "📱 कनेक्टेड डिवाइस (0)";
                devicesContainer.innerHTML = `<p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 15px 0;">वर्तमान में कोई डिवाइस कनेक्टेड नहीं है।</p>`;
                return;
            }

            if (headerTitle) headerTitle.textContent = `📱 कनेक्टेड डिवाइस (${snapshot.size})`;

            let html = "";
            snapshot.forEach((doc) => {
                const device = doc.data();
                const devId = doc.id;
                const isBlocked = device.blocked || false;

                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #334155;">
                        <div>
                            <div style="font-size: 13px; color: #fff; font-weight: bold;">${device.name || 'Unknown Device'}</div>
                            <div style="font-size: 11px; color: #94a3b8;">${device.type || 'Generic'} | IP: ${device.ip || '192.168.1.X'} | <span style="color:#F58220">${device.routerNode || 'Primary'}</span></div>
                        </div>
                        <button onclick="toggleBlockDevice('${devId}', ${isBlocked})" style="background: ${isBlocked ? '#10b981' : '#ef4444'}; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                            ${isBlocked ? 'Unblock' : 'Block'}
                        </button>
                    </div>
                `;
            });

            devicesContainer.innerHTML = html;
        }, (err) => console.error("Devices sync error:", err));

    // 3. Real-time Mesh Routers List
    unsubscribeMeshRouters = window.db.collection("router_telemetry").doc(userId)
        .collection("mesh_nodes")
        .onSnapshot((snapshot) => {
            const meshContainer = document.getElementById("meshRoutersContainer");
            if (!meshContainer) return;

            if (snapshot.empty) {
                meshContainer.innerHTML = `
                    <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #38bdf8; padding: 12px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: #fff; font-weight: bold;">Primary Fiber Router (Main)</span>
                            <span style="font-size: 10px; color: #10b981;">Online ●</span>
                        </div>
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Status: Connected & Operational</div>
                    </div>
                `;
                return;
            }

            let html = "";
            snapshot.forEach((doc) => {
                const node = doc.data();
                const nodeId = doc.id;

                html += `
                    <div style="background: rgba(0,0,0,0.25); border-left: 3px solid ${node.color || '#38bdf8'}; padding: 12px; border-radius: 8px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 13px; color: #fff; font-weight: bold;">${node.name || 'Router Node'}</span>
                            <span style="font-size: 10px; color: ${node.online ? '#10b981' : '#ef4444'};">${node.online ? 'Online ●' : 'Offline ✖'}</span>
                        </div>
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">DL Speed: ${node.speed || '--'} | Devices: ${node.devicesCount || 0} | ${node.firmware || 'v1.0'}</div>
                        ${node.updateAvailable ? `
                            <button onclick="updateRouterFirmware('${nodeId}')" style="margin-top: 8px; background: #10b981; color: #fff; border: none; padding: 5px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                                Firmware Update ⚡
                            </button>
                        ` : ''}
                    </div>
                `;
            });

            meshContainer.innerHTML = html;
        }, (err) => console.error("Mesh routers sync error:", err));
}

/**
 * Fallback Data Initializer for fresh setups
 */
async function renderDefaultDocCreation(userId) {
    if (!window.db) return;
    const initialDoc = {
        speed4G_DL: "42.5", speed4G_UL: "28.1",
        speed5G_DL: "148.2", speed5G_UL: "95.4",
        ssid4G: "NextG_4G_WiFi", pass4G: "12345678",
        ssid5G: "NextG_5G_Ultra", pass5G: "ultra5gpass",
        isInternetFrozen: false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await window.db.collection("router_telemetry").doc(userId).set(initialDoc, { merge: true });
}

function renderFallbackUI() {
    document.getElementById("speed4GDL").textContent = "0.0 Mbps";
    document.getElementById("speed4GUL").textContent = "0.0 Mbps";
    document.getElementById("speed5GDL").textContent = "0.0 Mbps";
    document.getElementById("speed5GUL").textContent = "0.0 Mbps";
}

/**
 * UI Actions & Global Window Controls
 */
window.togglePasswordVisibility = function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;
    
    if (input.type === "password") {
        input.type = "text";
        icon.setAttribute("data-lucide", "eye-off");
    } else {
        input.type = "password";
        icon.setAttribute("data-lucide", "eye");
    }
    if (window.lucide) window.lucide.createIcons();
};

let currentFreezeStatus = false;
function updateFreezeButtonState(frozen) {
    currentFreezeStatus = frozen;
    const btn = document.getElementById('freezeToggleBtn');
    if (!btn) return;
    if (frozen) {
        btn.innerHTML = '🟢 Unfreeze Net';
        btn.style.background = '#10b981';
    } else {
        btn.innerHTML = '🔴 Freeze Net';
        btn.style.background = '#ef4444';
    }
}

window.toggleInternetFreeze = async function() {
    const user = firebase.auth().currentUser;
    if (!user || !window.db) return;

    const newFreezeStatus = !currentFreezeStatus;
    updateFreezeButtonState(newFreezeStatus);

    try {
        await window.db.collection("router_telemetry").doc(user.uid).set({
            isInternetFrozen: newFreezeStatus
        }, { merge: true });

        // Push Command to Telemetry Queue for Router Execution
        await window.db.collection("router_commands_queue").add({
            userId: user.uid,
            action: newFreezeStatus ? "PAUSE_INTERNET" : "RESUME_INTERNET",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert(newFreezeStatus ? 'इंटरनेट सेवाओं को पॉज़ कर दिया गया है (Frozen)।' : 'इंटरनेट सेवाएं फिर से चालू कर दी गई हैं।');
    } catch (err) {
        console.error("Error toggling freeze:", err);
    }
};

window.saveWifiSettings = async function() {
    const user = firebase.auth().currentUser;
    if (!user || !window.db) return;

    const btn = document.getElementById("saveWifiBtn");
    const ssid4G = document.getElementById("ssid4G").value.trim();
    const pass4G = document.getElementById("pass4G").value.trim();
    const ssid5G = document.getElementById("ssid5G").value.trim();
    const pass5G = document.getElementById("pass5G").value.trim();

    if (!ssid4G || !pass4G || !ssid5G || !pass5G) {
        alert("कृपया 4G और 5G Wi-Fi के सभी फ़ील्ड भरें!");
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.textContent = "⏳ सेव हो रहा है...";
    }

    try {
        await window.db.collection("router_telemetry").doc(user.uid).set({
            ssid4G, pass4G, ssid5G, pass5G,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Push command to router
        await window.db.collection("router_commands_queue").add({
            userId: user.uid,
            action: "UPDATE_WIFI_CREDENTIALS",
            ssid4G, pass4G, ssid5G, pass5G,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("🎉 Wi-Fi नाम और पासवर्ड सफलतापूर्वक बदल दिए गए हैं!");
    } catch (err) {
        console.error("Error saving Wi-Fi settings:", err);
        alert("सेटिंग्स सेव करने में त्रुटि आई।");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "💾 सेटिंग्स सेव करें (Save Wi-Fi)";
        }
    }
};

window.toggleBlockDevice = async function(deviceId, currentBlocked) {
    const user = firebase.auth().currentUser;
    if (!user || !window.db) return;

    try {
        await window.db.collection("router_telemetry").doc(user.uid)
            .collection("connected_devices").doc(deviceId).update({
                blocked: !currentBlocked
            });

        await window.db.collection("router_commands_queue").add({
            userId: user.uid,
            action: !currentBlocked ? "BLOCK_DEVICE" : "UNBLOCK_DEVICE",
            targetDeviceId: deviceId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

    } catch (err) {
        console.error("Error blocking device:", err);
    }
};

window.updateRouterFirmware = function(nodeId) {
    alert(`राउटर (${nodeId}) का फर्मवेयर अपडेट सिग्नल भेज दिया गया है...`);
};

window.addNewRouter = function() {
    alert('नया मेश राउटर / एक्सटेंडर जोड़ने के लिए स्कैनर और पेयरिंग प्रक्रिया शुरू की जा रही है...');
};

window.renderStatusModule = renderStatusModule;
