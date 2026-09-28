/**
 * NextG WiFi Mobile App - Real-Time Master Portal Connector
 * File: src/modules/app-config.js
 * Features: Live Bi-Directional Firestore Sync, Auto-UI Broadcast & Operator Key Validation
 */

const NEXTG_APP_MASTER_CONFIG = {
    APP_SECRET_KEY: "NEXTG-MASTER-PORTAL-KEY-9981-SECURE",
    isConnected: false,
    operatorId: null,
    operatorData: null,
    unsubscribeListener: null
};

/**
 * 1. Live Sync Listener with Operator Admin Portal
 * पोर्टल में जैसे ही कोई अपडेट (रिचार्ज प्लान, नोटिस, बैनर आदि) लिखा जाएगा, 
 * यह Real-time Listener तुरंत ऐप में रिफ्लेक्ट कर देगा।
 */
function initializeAppConnectionToPortal() {
    console.log("⏳ Connecting Live Sync with Universal Operator Portal...");

    if (!window.db) {
        console.error("🔴 Firebase Firestore Database initialized नहीं है!");
        showConnectionStatusUI(false, "Firebase DB Not Found");
        return;
    }

    const appKey = NEXTG_APP_MASTER_CONFIG.APP_SECRET_KEY;

    // पुराने लिस्नर को क्लीनअप करें यदि मौजूद हो
    if (NEXTG_APP_MASTER_CONFIG.unsubscribeListener) {
        NEXTG_APP_MASTER_CONFIG.unsubscribeListener();
    }

    // Real-time Firestore Listener
    NEXTG_APP_MASTER_CONFIG.unsubscribeListener = window.db.collection("operators")
        .where("appSecretKey", "==", appKey)
        .where("isAppBound", "==", true)
        .onSnapshot((querySnapshot) => {
            if (querySnapshot.empty) {
                NEXTG_APP_MASTER_CONFIG.isConnected = false;
                NEXTG_APP_MASTER_CONFIG.operatorId = null;
                NEXTG_APP_MASTER_CONFIG.operatorData = null;
                console.error("🔴 App Connection Failed: चाबी (Secret Key) मैच नहीं हुई या अकाउंट असक्रिय है!");
                showConnectionStatusUI(false, "Key Mismatch or Portal Unbound");
                return;
            }

            querySnapshot.forEach((doc) => {
                NEXTG_APP_MASTER_CONFIG.isConnected = true;
                NEXTG_APP_MASTER_CONFIG.operatorId = doc.id;
                NEXTG_APP_MASTER_CONFIG.operatorData = doc.data();
            });

            console.log("🟢 100% REAL-TIME PORTAL CONNECTED!", NEXTG_APP_MASTER_CONFIG.operatorData);
            
            // ग्लोबल एक्सेस के लिए विंडो ऑब्जेक्ट में सेट करें
            window.activeOperatorConfig = NEXTG_APP_MASTER_CONFIG;

            const operatorName = NEXTG_APP_MASTER_CONFIG.operatorData.operatorName || 
                                 NEXTG_APP_MASTER_CONFIG.operatorData.operatorEmail || "Operator Admin";

            // लाइव कनेक्शन स्टेटस UI अपडेट करें
            showConnectionStatusUI(true, operatorName);
            
            // ऐप में लाइव डाटा (जैसे नए रिचार्ज प्लान, बैनर और अपडेट्स) ब्रॉडकास्ट करें
            broadcastOperatorUpdatesToApp(NEXTG_APP_MASTER_CONFIG.operatorData);

        }, (error) => {
            console.error("🔴 Real-time Sync Error:", error);
            showConnectionStatusUI(false, "Network Connection Error");
        });
}

/**
 * 2. Broadcast Portal Data to Dynamic App Components
 * ऑपरेटर पोर्टल में टाइप की गई कोई भी जानकारी (जैसे रिचार्ज या नोटिस) ऐप में लाइव दिखाएगा।
 */
function broadcastOperatorUpdatesToApp(operatorData) {
    if (!operatorData) return;

    // अगर होम स्क्रीन या रिचार्ज मॉड्यूल लोड है, तो dynamic UI फ़ंक्शन को ट्रिगर करें
    if (typeof window.updateAppUIWithOperatorData === "function") {
        window.updateAppUIWithOperatorData(operatorData);
    }

    // कस्टम इवेंट ट्रिगर करें ताकि अन्य मॉड्यूल्स भी लाइव डेटा प्राप्त कर सकें
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
        statusBanner.style.background = "#10b981";
        statusBanner.style.color = "#ffffff";
        statusBanner.innerHTML = `🟢 App Live Connected with Portal: <strong>${message}</strong>`;
        
        // 4 सेकंड बाद बैनर को हल्का छोटा करें ताकि स्क्रीन बाधा न बने
        setTimeout(() => {
            if (statusBanner) {
                statusBanner.style.padding = "3px 8px";
                statusBanner.style.opacity = "0.85";
            }
        }, 4000);
    } else {
        statusBanner.style.background = "#ef4444";
        statusBanner.style.color = "#ffffff";
        statusBanner.style.opacity = "1";
        statusBanner.innerHTML = `🔴 Portal Sync Disconnected: ${message}`;
    }
}

// ऑटो-इनिशियलाइजेशन जब DOM पूरी तरह लोड हो जाए
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
