/**
 * NextG WiFi Mobile App - Real-Time Master Portal Connector
 * File: src/modules/app-config.js
 * Features: Live Bi-Directional Firestore Sync, Auto-UI Broadcast & Safe Resilience Fallback
 */

const NEXTG_APP_MASTER_CONFIG = {
    PORTAL_URL: "https://universal-operator-portal.vercel.app/",
    APP_SECRET_KEY: "NEXTG-MASTER-PORTAL-KEY-9981-SECURE",
    isConnected: false,
    operatorId: null,
    operatorData: null,
    unsubscribeListener: null
};

/**
 * 1. Live Sync Listener with Universal Operator Portal
 */
function initializeAppConnectionToPortal() {
    console.log("⏳ Connecting Live Sync with Universal Operator Portal...");

    if (!window.db) {
        console.warn("⚠️ Firebase Firestore Database initialized नहीं है! App Fallback Mode Active.");
        hideConnectionStatusUI();
        return;
    }

    const appKey = NEXTG_APP_MASTER_CONFIG.APP_SECRET_KEY;

    // पुराने लिस्नर को सफ़ाई करें यदि मौजूद हो
    if (NEXTG_APP_MASTER_CONFIG.unsubscribeListener) {
        try {
            NEXTG_APP_MASTER_CONFIG.unsubscribeListener();
        } catch(e) { console.log(e); }
    }

    try {
        // Real-time Firestore Listener with Safe Fallback
        NEXTG_APP_MASTER_CONFIG.unsubscribeListener = window.db.collection("operators")
            .where("appSecretKey", "==", appKey)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot || querySnapshot.empty) {
                    NEXTG_APP_MASTER_CONFIG.isConnected = false;
                    NEXTG_APP_MASTER_CONFIG.operatorId = null;
                    NEXTG_APP_MASTER_CONFIG.operatorData = null;
                    console.log("ℹ️ Default Master Mode Active: Awaiting Operator Binding Key in Universal Portal.");
                    
                    // लाल पट्टी दिखाने के बजाय इसे चुपचाप छुपाएं ताकि यूजर लॉगिन/डैशबोर्ड ब्लॉक न हो
                    hideConnectionStatusUI();
                    return;
                }

                let boundDoc = null;
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.isAppBound !== false) {
                        boundDoc = { id: doc.id, data: data };
                    }
                });

                if (boundDoc) {
                    NEXTG_APP_MASTER_CONFIG.isConnected = true;
                    NEXTG_APP_MASTER_CONFIG.operatorId = boundDoc.id;
                    NEXTG_APP_MASTER_CONFIG.operatorData = boundDoc.data;

                    console.log("🟢 100% REAL-TIME PORTAL CONNECTED!", NEXTG_APP_MASTER_CONFIG.operatorData);
                    window.activeOperatorConfig = NEXTG_APP_MASTER_CONFIG;

                    const operatorName = NEXTG_APP_MASTER_CONFIG.operatorData.operatorName || 
                                         NEXTG_APP_MASTER_CONFIG.operatorData.operatorEmail || "Universal Operator Admin";

                    showConnectionStatusUI(true, operatorName);
                    broadcastOperatorUpdatesToApp(NEXTG_APP_MASTER_CONFIG.operatorData);
                } else {
                    hideConnectionStatusUI();
                }

            }, (error) => {
                console.warn("⚠️ Firestore Portal Sync Offline Fallback Active:", error.message);
                hideConnectionStatusUI();
            });
    } catch (err) {
        console.warn("⚠️ App Portal Sync Exception Handled:", err);
        hideConnectionStatusUI();
    }
}

/**
 * 2. Broadcast Portal Data to Dynamic App Components
 */
function broadcastOperatorUpdatesToApp(operatorData) {
    if (!operatorData) return;

    if (typeof window.updateAppUIWithOperatorData === "function") {
        window.updateAppUIWithOperatorData(operatorData);
    }

    const event = new CustomEvent("operatorDataUpdated", { detail: operatorData });
    window.dispatchEvent(event);
}

/**
 * 3. Connection Status Visual Indicator Floating Banner
 */
function showConnectionStatusUI(isSuccess, message = "") {
    let statusBanner = document.getElementById("appPortalStatusBanner");
    
    if (!statusBanner) {
        statusBanner = document.createElement("div");
        statusBanner.id = "appPortalStatusBanner";
        statusBanner.style.cssText = "position:fixed; bottom:0; left:0; width:100%; padding:6px 12px; font-size:11px; text-align:center; z-index:99999; font-weight:bold; font-family:system-ui, -apple-system, sans-serif; transition: all 0.3s ease;";
        document.body.appendChild(statusBanner);
    }

    if (isSuccess) {
        statusBanner.style.display = "block";
        statusBanner.style.background = "#10b981";
        statusBanner.style.color = "#ffffff";
        statusBanner.innerHTML = `🟢 Live Connected with Portal: <strong>${message}</strong>`;
        
        setTimeout(() => {
            if (statusBanner) {
                statusBanner.style.padding = "3px 8px";
                statusBanner.style.opacity = "0.85";
            }
        }, 4000);
    } else {
        hideConnectionStatusUI();
    }
}

function hideConnectionStatusUI() {
    const statusBanner = document.getElementById("appPortalStatusBanner");
    if (statusBanner) {
        statusBanner.style.display = "none";
    }
}

// ऑटो-इनिशियलाइजेशन
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(initializeAppConnectionToPortal, 500);
    });
} else {
    setTimeout(initializeAppConnectionToPortal, 500);
}

// ग्लोबल विंडो एक्सपोर्ट
window.initializeAppConnectionToPortal = initializeAppConnectionToPortal;
window.NEXTG_APP_MASTER_CONFIG = NEXTG_APP_MASTER_CONFIG;
