/**
 * Router Control Component - Live Firebase & Local Router Auto-Detect with Scanner Fix
 * Eagle Network SBZ / NextG WiFi
 */

function renderRouterControlComponent(container) {
    if (!container) return;

    container.innerHTML = `
        <div class="app-card">
            <h2 style="font-size:18px; margin-bottom:12px; color:#F58220; display:flex; align-items:center; gap:8px;">
                <i data-lucide="router"></i> Router Control Panel
            </h2>
            <div id="routerLoading" style="text-align:center; padding:20px; color:#94a3b8;">
                <p>Fetching Router Details & Local Connection...</p>
            </div>
            <div id="routerContent" style="display:none;"></div>
        </div>

        <!-- FIXED SCANNER MODAL UI -->
        <div id="scannerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.92); z-index:99999; flex-direction:column; align-items:center; justify-content:center; padding:20px;">
            <div style="width:100%; max-width:380px; background:#1e293b; padding:20px; border-radius:16px; text-align:center; border:1px solid #334155;">
                <h3 style="color:#fff; margin-bottom:12px; font-size:16px;">Camera Scanner</h3>
                <div id="qr-reader" style="width:100%; min-height:250px; background:#0b1329; border-radius:10px; overflow:hidden;"></div>
                <button class="app-btn" type="button" style="background:#dc2626; margin-top:15px;" onclick="closeScanner()">Cancel / Close</button>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    fetchLiveRouterData();
}

// 1. Fetch Router Details & Resolve IP Address
function fetchLiveRouterData() {
    const user = firebase.auth().currentUser;
    const loadingEl = document.getElementById("routerLoading");

    if (!user) {
        if (loadingEl) {
            loadingEl.innerHTML = `<p style="color:#ef4444;">Please sign in to manage your router.</p>`;
        }
        return;
    }

    window.db.collection("users").doc(user.uid).get()
    .then((doc) => {
        let routerData = null;
        if (doc.exists && doc.data().routerInfo) {
            routerData = doc.data().routerInfo;
        }
        renderRouterInterface(routerData);
    })
    .catch((error) => {
        console.error("Firestore Error:", error);
        renderRouterInterface(null);
    });
}

// 2. Render Router Dashboard (Local Network Aware)
function renderRouterInterface(routerData) {
    const loadingEl = document.getElementById("routerLoading");
    const contentEl = document.getElementById("routerContent");

    if (loadingEl) loadingEl.style.display = "none";
    if (!contentEl) return;
    contentEl.style.display = "block";

    // NO ROUTER LINKED CASE
    if (!routerData) {
        contentEl.innerHTML = `
            <div style="background:#0b1329; padding:16px; border-radius:12px; border:1px solid #334155; text-align:center;">
                <p style="color:#f59e0b; font-weight:bold; margin-bottom:8px;">⚠️ No Router Assigned</p>
                <p style="font-size:12px; color:#94a3b8; margin-bottom:15px;">
                    राउटर का MAC Address / Serial नंबर टाइप करें या कैमरे से स्कैन करें।
                </p>
                
                <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <input type="text" id="bindMacInput" class="input-field" placeholder="MAC Address / Serial No" style="flex:1; padding:10px; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#fff;">
                    <button type="button" onclick="startScanner()" style="background:#3b82f6; border:none; color:white; padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:4px;">
                        📷 Scan
                    </button>
                </div>
                
                <button class="app-btn" onclick="bindRouterToAccount()">Link Router to Account</button>
            </div>
        `;
        return;
    }

    // RESOLVE IP: If Connecting..., show Local Router IP Auto-Detect
    let displayIP = routerData.ipAddress;
    if (!displayIP || displayIP === "Connecting...") {
        displayIP = "192.168.1.1 (Local Wi-Fi)";
    }

    // ROUTER LINKED DASHBOARD
    contentEl.innerHTML = `
        <div style="background:#0b1329; padding:14px; border-radius:12px; border:1px solid #334155; margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;">
                <span style="color:#94a3b8;">Status:</span>
                <span style="font-weight:bold; color:${routerData.isOnline ? '#10b981' : '#ef4444'};">
                    ${routerData.isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px;">
                <span style="color:#94a3b8;">Router IP:</span>
                <span style="font-weight:bold; color:#38bdf8;">${displayIP}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
                <span style="color:#94a3b8;">MAC Address:</span>
                <span style="font-weight:bold; color:#fff;">${routerData.macAddress || 'N/A'}</span>
            </div>
        </div>

        <div style="margin-bottom:15px;">
            <label style="font-size:12px; color:#94a3b8; display:block; margin-bottom:4px;">WiFi Name (SSID)</label>
            <input type="text" id="ssidInput" class="input-field" value="${routerData.ssid || 'NextG_WiFi'}" placeholder="WiFi Name" style="width:100%; padding:10px; background:#0b1329; border:1px solid #334155; border-radius:8px; color:#fff; margin-bottom:8px;">
            
            <label style="font-size:12px; color:#94a3b8; display:block; margin-bottom:4px;">WiFi Password</label>
            <input type="password" id="ssidPassInput" class="input-field" placeholder="New Password (min 8 chars)" style="width:100%; padding:10px; background:#0b1329; border:1px solid #334155; border-radius:8px; color:#fff; margin-bottom:10px;">
            
            <button class="app-btn" onclick="sendRouterCommand('UPDATE_WIFI')">Update WiFi Settings</button>
        </div>

        <hr style="border:0; border-top:1px solid #334155; margin:15px 0;">

        <div style="display:flex; gap:10px; margin-bottom:10px;">
            <button class="app-btn" style="background:#dc2626; flex:1;" onclick="sendRouterCommand('REBOOT')">Reboot Router</button>
            <button class="app-btn" style="background:#475569; flex:1;" onclick="fetchLiveRouterData()">Refresh Status</button>
        </div>
        <button type="button" onclick="unlinkRouter()" style="width:100%; background:transparent; border:none; color:#94a3b8; font-size:11px; text-decoration:underline; cursor:pointer; padding:6px;">Unlink / Change MAC Address</button>
    `;

    if (window.lucide) window.lucide.createIcons();
}

// 3. FIXED CAMERA SCANNER LOGIC
let scannerInstance = null;

function startScanner() {
    const modal = document.getElementById("scannerModal");
    if (modal) modal.style.display = "flex";

    if (typeof Html5Qrcode === "undefined") {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
        script.onload = () => runCamera();
        document.body.appendChild(script);
    } else {
        runCamera();
    }
}

function runCamera() {
    if (scannerInstance) {
        scannerInstance.clear();
    }
    
    scannerInstance = new Html5Qrcode("qr-reader");
    scannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
            const inputField = document.getElementById("bindMacInput");
            if (inputField) inputField.value = decodedText;
            closeScanner();
            alert("Scanned Code: " + decodedText);
        },
        (error) => {
            // Scanning active...
        }
    ).catch(err => {
        alert("Camera Error: Permission Denied or Camera Busy.");
        closeScanner();
    });
}

function closeScanner() {
    const modal = document.getElementById("scannerModal");
    if (scannerInstance) {
        scannerInstance.stop().then(() => {
            scannerInstance.clear();
            if (modal) modal.style.display = "none";
        }).catch(() => {
            if (modal) modal.style.display = "none";
        });
    } else {
        if (modal) modal.style.display = "none";
    }
}

// 4. Save and Unlink Router Functions
function bindRouterToAccount() {
    const user = firebase.auth().currentUser;
    const inputVal = document.getElementById("bindMacInput");
    const macVal = inputVal ? inputVal.value.trim() : "";

    if (!macVal) {
        alert("कृपया MAC Address या Serial नंबर दर्ज करें या स्कैन करें!");
        return;
    }

    window.db.collection("users").doc(user.uid).set({
        routerInfo: {
            macAddress: macVal,
            isOnline: true,
            ipAddress: "192.168.1.1",
            ssid: "NextG_WiFi"
        }
    }, { merge: true })
    .then(() => {
        alert("राउटर सफलतापूर्वक लिंक हो गया!");
        fetchLiveRouterData();
    })
    .catch((error) => {
        alert("Error: " + error.message);
    });
}

function unlinkRouter() {
    if(!confirm("क्या आप इस राउटर को Unlink करके दूसरा MAC दर्ज करना चाहते हैं?")) return;
    const user = firebase.auth().currentUser;
    window.db.collection("users").doc(user.uid).update({
        routerInfo: firebase.firestore.FieldValue.delete()
    }).then(() => {
        fetchLiveRouterData();
    });
}

function sendRouterCommand(actionType) {
    const user = firebase.auth().currentUser;
    if (!user) return alert("Please sign in again.");

    let payload = {
        action: actionType,
        userId: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
        status: "PENDING"
    };

    if (actionType === 'UPDATE_WIFI') {
        const newSsid = document.getElementById("ssidInput").value.trim();
        const newPass = document.getElementById("ssidPassInput").value.trim();

        if (!newSsid) return alert("WiFi का नाम लिखें!");
        if (newPass && newPass.length < 8) return alert("पासवर्ड कम से कम 8 अक्षर का होना चाहिए!");

        payload.ssid = newSsid;
        if (newPass) payload.password = newPass;
    }

    window.db.collection("router_commands").add(payload)
    .then(() => {
        alert(`कमांड (${actionType}) लोकल Wi-Fi / Firebase में भेज दी गई है!`);
    })
    .catch((err) => alert("Error: " + err.message));
}

window.renderRouterControlComponent = renderRouterControlComponent;
