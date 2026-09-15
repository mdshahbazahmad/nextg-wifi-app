/**
 * NextG WiFi Mobile App - Real-Time Master Connector
 * Location: src/modules/appConfig.js
 */

const NEXTG_APP_MASTER_CONFIG = {
    APP_SECRET_KEY: "SEC_KEY_NEXTG_GLOBAL_9981",
    isConnected: false,
    operatorId: null,
    operatorData: null
};

// 1. Live Sync Listener (जैसे ही पोर्टल में डेटा बदलेगा, ऐप तुरंत अपडेट होगा)
function initializeAppConnectionToPortal() {
    console.log("⏳ Connecting Live Sync with Universal Portal...");

    if (!window.db) {
        console.error("🔴 Firebase Database initialized नहीं है!");
        return;
    }

    const appKey = NEXTG_APP_MASTER_CONFIG.APP_SECRET_KEY;

    // Real-time Listener using onSnapshot
    window.db.collection("operators")
    .where("appSecretKey", "==", appKey)
    .where("isAppBound", "==", true)
    .onSnapshot((querySnapshot) => {
        if (querySnapshot.empty) {
            NEXTG_APP_MASTER_CONFIG.isConnected = false;
            console.error("🔴 App Connection Failed: चाबी मैच नहीं हुई!");
            showConnectionStatusUI(false);
            return;
        }

        querySnapshot.forEach((doc) => {
            NEXTG_APP_MASTER_CONFIG.isConnected = true;
            NEXTG_APP_MASTER_CONFIG.operatorId = doc.id;
            NEXTG_APP_MASTER_CONFIG.operatorData = doc.data();
        });

        console.log("🟢 100% REAL-TIME CONNECTED!", NEXTG_APP_MASTER_CONFIG.operatorData);
        window.activeOperatorConfig = NEXTG_APP_MASTER_CONFIG;

        // लाइव डाटा UI में दिखाएं
        showConnectionStatusUI(true, NEXTG_APP_MASTER_CONFIG.operatorData.operatorEmail);
        
        // अगर ऐप में कोई डायनामिक फ़ील्ड्स हैं तो उन्हें तुरंत अपडेट करें
        if (typeof updateAppUIWithOperatorData === "function") {
            updateAppUIWithOperatorData(NEXTG_APP_MASTER_CONFIG.operatorData);
        }
    }, (error) => {
        console.error("🔴 Real-time Sync Error:", error);
        showConnectionStatusUI(false);
    });
}

function showConnectionStatusUI(isSuccess, operatorEmail = "") {
    let statusBanner = document.getElementById("appPortalStatusBanner");
    
    if (!statusBanner) {
        statusBanner = document.createElement("div");
        statusBanner.id = "appPortalStatusBanner";
        statusBanner.style.cssText = "position:fixed; bottom:0; left:0; width:100%; padding:6px 12px; font-size:11px; text-align:center; z-index:99999; font-weight:bold;";
        document.body.appendChild(statusBanner);
    }

    if (isSuccess) {
        statusBanner.style.background = "#10b981";
        statusBanner.style.color = "#ffffff";
        statusBanner.innerHTML = `🟢 App Live Connected: ${operatorEmail}`;
    } else {
        statusBanner.style.background = "#ef4444";
        statusBanner.style.color = "#ffffff";
        statusBanner.innerHTML = `🔴 App Not Connected: Key mismatch or Inactive`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initializeAppConnectionToPortal, 1000);
});

window.initializeAppConnectionToPortal = initializeAppConnectionToPortal;
