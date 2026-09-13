/**
 * Router Control Component - Live Firebase & Router API Integration with Scanner
 * Eagle Network SBZ / NextG WiFi
 */

function renderRouterControlComponent(container) {
    if (!container) return;

    // Default Loading State UI
    container.innerHTML = `
        <div class="app-card">
            <h2 style="font-size:18px; margin-bottom:12px; color:#F58220; display:flex; align-items:center; gap:8px;">
                <i data-lucide="router"></i> Router Control Panel
            </h2>
            <div id="routerLoading" style="text-align:center; padding:20px; color:#94a3b8;">
                <p>Connecting to Router API & Fetching Live Status...</p>
            </div>
            <div id="routerContent" style="display:none;"></div>
        </div>
        <!-- Scanner Modal Container -->
        <div id="scannerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; flex-direction:column; align-items:center; justify-content:center; padding:20px;">
            <div style="width:100%; max-width:400px; background:#1e293b; padding:15px; border-radius:12px; text-align:center;">
                <h3 style="color:#fff; margin-bottom:10px;">Scan Router MAC / Serial</h3>
                <div id="qr-reader" style="width:100%;"></div>
                <button class="app-btn" style="background:#dc2626; margin-top:15px;" onclick="closeScanner()">Close Camera</button>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Fetch Live Router Info from Firebase Auth & Database
    fetchLiveRouterData();
}

// 1. Live Data Fetching from Firebase
function fetchLiveRouterData() {
    const user = firebase.auth().currentUser;
    const loadingEl = document.getElementById("routerLoading");

    if (!user) {
        if (loadingEl) {
            loadingEl.innerHTML = `
                <p style="color:#ef4444;">User Authentication Missing!</p>
                <p style="font-size:12px; margin-top:5px;">Please sign in again to manage your router.</p>
            `;
        }
        return;
    }

    // Fetch real router data associated with the logged-in User ID from Firestore
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

// 2. Render Live UI (Includes Scanner Option if No Router Found)
function renderRouterInterface(routerData) {
    const loadingEl = document.getElementById("routerLoading");
    const contentEl = document.getElementById("routerContent");

    if (loadingEl) loadingEl.style.display = "none";
    if (!contentEl) return;
    contentEl.style.display = "block";

    // IF NO ROUTER LINKED YET - SHOW SCANNER & INPUT OPTION
    if (!routerData) {
        contentEl.innerHTML = `
            <div style="background:#0b1329; padding:15px; border-radius:12px; border:1px solid #334155; text-align:center;">
                <p style="color:#f59e0b; font-weight:bold; margin-bottom:8px;">⚠️ No Active Router Assigned</p>
                <p style="font-size:12px; color:#94a3b8; margin-bottom:15px;">
                    राउटर कनेक्ट करने के लिए उसके पीछे का MAC / Serial Number टाइप करें या स्कैन करें।
                </p>
                
                <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <input type="text" id="bindMacInput" class="input-field" placeholder="Router MAC / Serial No" style="flex:1; padding:10px; background:#1e293b; border:1px solid #334155; border-radius:8px; color:#fff;">
                    <button type="button" onclick="startScanner()" style="background:#3b82f6; border:none; color:white; padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:4px;">
                        📷 Scan
                    </button>
                </div>
                
                <button class="app-btn" onclick="bindRouterToAccount()">Link Router to Account</button>
            </div>
        `;
        return;
    }

    // IF ROUTER IS LINKED - DISPLAY CONTROL DASHBOARD
    contentEl.innerHTML = `
        <div style="background:#0b1329; padding:12px; border-radius:12px; border:1px solid #334155; margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px;">
                <span style="color:#94a3b8;">Status:</span>
                <span style="font-weight:bold; color:${routerData.isOnline ? '#10b981' : '#ef4444'};">
                    ${routerData.isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:13px;">
                <span style="color:#94a3b8;">Router IP:</span>
                <span style="font-weight:bold; color:#fff;">${routerData.ipAddress || 'Not Assigned'}</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px;">
                <span style="color:#94a3b8;">MAC Address:</span>
                <span style="font-weight:bold; color:#fff;">${routerData.macAddress || 'N/A'}</span>
            </div>
        </div>

        <!-- Wi-Fi Name (SSID) Update -->
        <div style="margin-bottom:15px;">
            <label style="font-size:12px; color:#94a3b8; display:block; margin-bottom:4px;">WiFi Name (SSID)</label>
            <input type="text" id="ssidInput" class="input-field" value="${routerData.ssid || ''}" placeholder="New WiFi Name" style="width:100%; padding:10px; background:#0b1329; border:1px solid #334155; border-radius:8px; color:#fff; margin-bottom:8px;">
            
            <label style="font-size:12px; color:#94a3b8; display:block; margin-bottom:4px;">WiFi Password</label>
            <input type="password" id="ssidPassInput" class="input-field" placeholder="New Password (min 8 chars)" style="width:100%; padding:10px; background:#0b1329; border:1px solid #334155; border-radius:8px; color:#fff; margin-bottom:10px;">
            
            <button class="app-btn" onclick="sendRouterCommand('UPDATE_WIFI')">Update WiFi Settings</button>
        </div>

        <hr style="border:0; border-top:1px solid #334155; margin:15px 0;">

        <!-- Router Actions -->
        <div style="display:flex; gap:10px;">
            <button class="app-btn" style="background:#dc2626; flex:1;" onclick="sendRouterCommand('REBOOT')">Reboot Router</button>
            <button class="app-btn" style="background:#475569; flex:1;" onclick="fetchLiveRouterData()">Refresh Status</button>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();
}

// 3. Scanner Logic (Camera integration)
let html5QrCode = null;

function startScanner() {
    const modal = document.getElementById("scannerModal");
    if (modal) modal.style.display = "flex";

    // Dynamic Scanner Script Loader if not present
    if (typeof Html5Qrcode === "undefined") {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js";
        script.onload = () => initCameraScanner();
        document.body.appendChild(script);
    } else {
        initCameraScanner();
    }
}

function initCameraScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
            // Success scan
            document.getElementById("bindMacInput").value = decodedText;
            closeScanner();
            alert("MAC/Serial Scanned: " + decodedText);
        },
        (errorMessage) => {
            // Scanning in progress...
        }
    ).catch(err => {
        alert("Camera permission error or camera not found.");
        closeScanner();
    });
}

function closeScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            const modal = document.getElementById("scannerModal");
            if (modal) modal.style.display = "none";
        }).catch(() => {
            const modal = document.getElementById("scannerModal");
            if (modal) modal.style.display = "none";
        });
    } else {
        const modal = document.getElementById("scannerModal");
        if (modal) modal.style.display = "none";
    }
}

// 4. Send Command & Bind Functions
function sendRouterCommand(actionType) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Session expired. Please sign in again.");
        return;
    }

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

        if (!newSsid) {
            alert("कृपया WiFi का नाम (SSID) दर्ज करें!");
            return;
        }
        if (newPass && newPass.length < 8) {
            alert("पासवर्ड कम से कम 8 अक्षरों का होना चाहिए!");
            return;
        }

        payload.ssid = newSsid;
        if (newPass) payload.password = newPass;
    }

    window.db.collection("router_commands").add(payload)
    .then(() => {
        alert(`कमांड (${actionType}) सफलतापूर्वक भेजी गई! Universal Portal/Router प्रक्रिया कर रहा है...`);
    })
    .catch((error) => {
        alert("कमांड भेजने में त्रुटि: " + error.message);
    });
}

function bindRouterToAccount() {
    const user = firebase.auth().currentUser;
    const macVal = document.getElementById("bindMacInput").value.trim();

    if (!macVal) {
        alert("कृपया राउटर का MAC Address या सीरियल नंबर दर्ज़ करें या स्कैन करें!");
        return;
    }

    window.db.collection("users").doc(user.uid).set({
        routerInfo: {
            macAddress: macVal,
            isOnline: true,
            ipAddress: "Connecting...",
            ssid: "NextG_WiFi"
        }
    }, { merge: true })
    .then(() => {
        alert("राउटर सफलतापूर्वक आपके अकाउंट से लिंक हो गया!");
        fetchLiveRouterData();
    })
    .catch((error) => {
        alert("लिंक करने में त्रुटि: " + error.message);
    });
}

window.renderRouterControlComponent = renderRouterControlComponent;
