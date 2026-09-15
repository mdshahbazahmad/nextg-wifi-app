/**
 * NextG WiFi Mobile App - Master App Secret Key Connector
 * 100% Automatic Handshake Engine with Universal Portal
 */

const NEXTG_APP_MASTER_CONFIG = {
    // 🔑 यह ऐप की असली सीक्रेट चाबी है (जो ऑपरेटर अपने पोर्टल में डालेगा)
    APP_SECRET_KEY: "SEC_KEY_NEXTG_GLOBAL_9981",
    
    // लाइव स्टेटस वेरिएबल्स
    isConnected: false,
    operatorId: null,
    operatorData: null
};

/**
 * 1. ऐप और पोर्टल के बीच 100% कनेक्शन (Handshake) जाँचने का फ़ंक्शन
 */
function initializeAppConnectionToPortal() {
    console.log("⏳ Connecting NextG WiFi App to Universal Portal...");

    // Firebase DB चेक
    if (!window.db) {
        console.error("🔴 Firebase Database initialized नहीं है!");
        return;
    }

    const appKey = NEXTG_APP_MASTER_CONFIG.APP_SECRET_KEY;

    // Firebase के 'operators' टेबल में इस App Secret Key को खोजना
    window.db.collection("operators")
    .where("appSecretKey", "==", appKey)
    .where("isAppBound", "==", true)
    .get()
    .then((querySnapshot) => {
        if (querySnapshot.empty) {
            NEXTG_APP_MASTER_CONFIG.isConnected = false;
            console.error("🔴 App Connection Failed: यह App Secret Key पोर्टल में किसी ऑपरेटर से लिंक नहीं है!");
            showConnectionStatusUI(false);
            return;
        }

        // ऑपरेटर की जानकारी प्राप्त हुई
        querySnapshot.forEach((doc) => {
            NEXTG_APP_MASTER_CONFIG.isConnected = true;
            NEXTG_APP_MASTER_CONFIG.operatorId = doc.id; // Operator UID
            NEXTG_APP_MASTER_CONFIG.operatorData = doc.data();
        });

        console.log("🟢 100% CONNECTED! App & Universal Portal are now unified.");
        console.log("Bound Operator ID:", NEXTG_APP_MASTER_CONFIG.operatorId);
        
        // ग्लोबल विंडो ऑब्जेक्ट में सेट करें ताकि पूरे ऐप को पता रहे
        window.activeOperatorConfig = NEXTG_APP_MASTER_CONFIG;

        showConnectionStatusUI(true, NEXTG_APP_MASTER_CONFIG.operatorData.operatorEmail);
    })
    .catch((error) => {
        console.error("🔴 Error verifying App Key with Portal:", error);
        showConnectionStatusUI(false);
    });
}

/**
 * 2. ऐप में स्टेटस बार दिखाना (ताकि पता चले कि ऐप 100% कनेक्टेड है)
 */
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
        statusBanner.innerHTML = `🟢 App Connected to Portal (${operatorEmail || 'Active Operator'})`;
    } else {
        statusBanner.style.background = "#ef4444";
        statusBanner.style.color = "#ffffff";
        statusBanner.innerHTML = `🔴 App Not Connected: Key mismatch or Operator Portal inactive`;
    }
}

// 3. ऐप चालू होते ही कनेक्शन ऑटो-स्टार्ट करें
document.addEventListener("DOMContentLoaded", () => {
    // 1 सेकंड का डिले ताकि Firebase SDK लोड हो सके
    setTimeout(initializeAppConnectionToPortal, 1000);
});

// इसे ग्लोबल एक्सेस के लिए एक्सपोर्ट करें
window.initializeAppConnectionToPortal = initializeAppConnectionToPortal;
