/**
 * NextG WiFi - Application Settings Component
 * File: src/components/appSettings.js
 * Features: REAL Working Theme Change, REAL Language Switching & Persistent Settings
 */

// 1. भाषा के शब्द (Translation Dictionary)
const TRANSLATIONS = {
    en: {
        pageTitle: "App Settings & Preferences",
        appearanceSection: "🎨 Appearance & Display",
        themeLabel: "App Theme",
        themeSub: "Switch between Light and Dark interface",
        darkOpt: "🌙 Dark Mode",
        lightOpt: "☀️ Light Mode",
        langLabel: "App Language",
        langSub: "Select your preferred language",
        prefSection: "🔔 Preferences & Network",
        pushNotif: "Push Notifications",
        pushSub: "Get alerts for data usage and bill updates",
        dataSaver: "Data Saver Mode",
        dataSaverSub: "Reduce background data sync to save data",
        autoUpdate: "Auto-Update over WiFi",
        autoUpdateSub: "Keep NextG WiFi updated automatically",
        storageSection: "🛠️ Storage & Maintenance",
        clearCache: "Clear App Cache",
        clearCacheSub: "Frees up temporary storage and speeds up the app",
        clearBtn: "🗑️ Clear Cache",
        resetSettings: "Reset Settings to Default",
        resetSub: "Restores all settings to original factory defaults",
        resetBtn: "🔄 Reset All",
        aboutTitle: "NextG Wi-Fi Application",
        version: "Version:",
        footerText: "Built with ❤️ for High-Speed Connectivity"
    },
    hi: {
        pageTitle: "ऐप सेटिंग्स और प्राथमिकताएं",
        appearanceSection: "🎨 उपस्थिति और डिस्प्ले",
        themeLabel: "ऐप थीम",
        themeSub: "लाइट और डार्क मोड के बीच स्विच करें",
        darkOpt: "🌙 डार्क मोड",
        lightOpt: "☀️ लाइट मोड",
        langLabel: "ऐप की भाषा",
        langSub: "अपनी पसंदीदा भाषा चुनें",
        prefSection: "🔔 प्राथमिकताएं और नेटवर्क",
        pushNotif: "पुश सूचनाएं (Notifications)",
        pushSub: "डेटा उपयोग और बिल अपडेट के अलर्ट प्राप्त करें",
        dataSaver: "डेटा सेवर मोड",
        dataSaverSub: "डेटा बचाने के लिए बैकग्राउंड डेटा कम करें",
        autoUpdate: "वाई-फाई पर ऑटो-अपडेट",
        autoUpdateSub: "NextG वाई-फ़ाई को स्वचालित रूप से अपडेट रखें",
        storageSection: "🛠️ स्टोरेज और रखरखाव",
        clearCache: "ऐप कैश (Cache) साफ़ करें",
        clearCacheSub: "अस्थायी स्थान साफ़ करता है और ऐप को तेज़ करता है",
        clearBtn: "🗑️ कैश साफ़ करें",
        resetSettings: "सेटिंग्स को डिफ़ॉल्ट पर रीसेट करें",
        resetSub: "सभी सेटिंग्स को मूल फ़ैक्टरी डिफ़ॉल्ट पर पुनर्स्थापित करता है",
        resetBtn: "🔄 सभी रीसेट करें",
        aboutTitle: "NextG वाई-फ़ाई एप्लिकेशन",
        version: "संस्करण:",
        footerText: "हाई-स्पीड कनेक्टिविटी के लिए ❤️ के साथ निर्मित"
    },
    mr: {
        pageTitle: "ॲप सेटिंग्ज आणि प्राधान्ये",
        appearanceSection: "🎨 स्वरूप आणि डिस्प्ले",
        themeLabel: "ॲप थीम",
        themeSub: "लाइट आणि डार्क मोडमध्ये स्विच करा",
        darkOpt: "🌙 डार्क मोड",
        lightOpt: "☀️ लाइट मोड",
        langLabel: "ॲपची भाषा",
        langSub: "तुमची आवडती भाषा निवडा",
        prefSection: "🔔 प्राधान्ये आणि नेटवर्क",
        pushNotif: "पुश सूचना",
        pushSub: "डेटा वापर आणि बिल अपडेटचे अलर्ट मिळवा",
        dataSaver: "डेटा सेव्हर मोड",
        dataSaverSub: "डेटा वाचवण्यासाठी बॅकग्राउंड डेटा कमी करा",
        autoUpdate: "वाय-फायवर ऑटो-अपडेट",
        autoUpdateSub: "NextG वाय-फाय स्वयंचलितपणे अपडेट ठेवा",
        storageSection: "🛠️ स्टोरेज आणि देखभाल",
        clearCache: "ॲप कॅशे साफ करा",
        clearCacheSub: "अस्थायी जागा मोकळी करते आणि ॲप वेगवान करते",
        clearBtn: "🗑️ कॅशे साफ करा",
        resetSettings: "सेटिंग्ज रीसेट करा",
        resetSub: "सर्व सेटिंग्ज मूळ स्थितीवर परत आणा",
        resetBtn: "🔄 सर्व रीसेट करा",
        aboutTitle: "NextG वाय-फाय ॲप्लिकेशन",
        version: "आवृत्ती:",
        footerText: "हाय-स्पीड कनेक्टिव्हिटीसाठी ❤️ सह तयार केले"
    }
};

// 2. Default Settings & LocalStorage Sync
const defaultSettings = {
    theme: "dark",
    language: "hi", // Default Language set to Hindi
    pushNotifications: true,
    autoAppUpdate: true,
    dataSaverMode: false,
    appVersion: "v2.4.1 (Latest)"
};

window.nextgAppSettings = JSON.parse(localStorage.getItem('nextg_app_settings')) || defaultSettings;

function saveAppSettings() {
    localStorage.setItem('nextg_app_settings', JSON.stringify(window.nextgAppSettings));
    applyGlobalTheme();
}

// 3. Real Theme Engine (पूरे स्क्रीन का कलर बदलता है)
function applyGlobalTheme() {
    const isDark = window.nextgAppSettings.theme === "dark";
    if (isDark) {
        document.body.style.backgroundColor = "#0f172a";
        document.body.style.color = "#ffffff";
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        document.body.style.backgroundColor = "#f8fafc";
        document.body.style.color = "#0f172a";
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    }
}

// Initial Theme Trigger
applyGlobalTheme();

// 4. Main UI Render Component
function renderAppSettingsComponent(containerElement) {
    if (!containerElement) return;

    window.currentSettingsContainer = containerElement; // DOM संदर्भ सहेजें
    const settings = window.nextgAppSettings;
    const lang = TRANSLATIONS[settings.language] || TRANSLATIONS.en; // चुनी हुई भाषा के शब्द

    const isLight = settings.theme === 'light';

    containerElement.innerHTML = `
        <div class="settings-wrapper ${isLight ? 'light-mode-card' : ''}">
            <h2 class="page-title">${lang.pageTitle}</h2>

            <!-- SECTION 1: APPEARANCE -->
            <div class="settings-card">
                <h3>${lang.appearanceSection}</h3>
                
                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.themeLabel}</strong>
                        <span>${lang.themeSub}</span>
                    </div>
                    <div class="item-control">
                        <select id="themeSelector" class="settings-select" onchange="changeAppTheme(this.value)">
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>${lang.darkOpt}</option>
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>${lang.lightOpt}</option>
                        </select>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.langLabel}</strong>
                        <span>${lang.langSub}</span>
                    </div>
                    <div class="item-control">
                        <select id="langSelector" class="settings-select" onchange="changeAppLanguage(this.value)">
                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="hi" ${settings.language === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                            <option value="mr" ${settings.language === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: PREFERENCES -->
            <div class="settings-card">
                <h3>${lang.prefSection}</h3>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.pushNotif}</strong>
                        <span>${lang.pushSub}</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" ${settings.pushNotifications ? 'checked' : ''} onchange="toggleSetting('pushNotifications')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.dataSaver}</strong>
                        <span>${lang.dataSaverSub}</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" ${settings.dataSaverMode ? 'checked' : ''} onchange="toggleSetting('dataSaverMode')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.autoUpdate}</strong>
                        <span>${lang.autoUpdateSub}</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" ${settings.autoAppUpdate ? 'checked' : ''} onchange="toggleSetting('autoAppUpdate')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: MAINTENANCE -->
            <div class="settings-card">
                <h3>${lang.storageSection}</h3>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.clearCache}</strong>
                        <span>${lang.clearCacheSub}</span>
                    </div>
                    <div class="item-control">
                        <button class="action-btn clear-btn" onclick="clearAppCache()">${lang.clearBtn}</button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.resetSettings}</strong>
                        <span>${lang.resetSub}</span>
                    </div>
                    <div class="item-control">
                        <button class="action-btn reset-btn" onclick="resetAppSettings()">${lang.resetBtn}</button>
                    </div>
                </div>
            </div>

            <!-- SECTION 4: ABOUT -->
            <div class="settings-card about-card">
                <div class="about-info">
                    <h4>${lang.aboutTitle}</h4>
                    <p>${lang.version} <strong>${settings.appVersion}</strong></p>
                    <p class="build-txt">${lang.footerText}</p>
                </div>
            </div>
        </div>

        <style>
            .settings-wrapper { text-align: left; max-width: 600px; margin: 0 auto; transition: all 0.3s ease; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; }

            /* Dynamic Theme Styles */
            .dark-theme .settings-card { background: #1e293b; border: 1px solid #334155; color: #fff; }
            .dark-theme .settings-card h3 { color: #f8fafc; border-bottom: 1px solid #334155; }
            .dark-theme .item-info strong { color: #f1f5f9; }
            .dark-theme .item-info span { color: #94a3b8; }
            .dark-theme .settings-select { background: #0f172a; border: 1px solid #334155; color: #fff; }
            .dark-theme .about-card { background: #0f172a; }

            /* Light Theme Specific Classes */
            .light-theme .page-title { color: #0f172a !important; }
            .light-theme .settings-card { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
            .light-theme .settings-card h3 { color: #0f172a !important; border-bottom: 1px solid #e2e8f0 !important; }
            .light-theme .item-info strong { color: #1e293b !important; }
            .light-theme .item-info span { color: #64748b !important; }
            .light-theme .settings-select { background: #f1f5f9 !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; }
            .light-theme .about-card { background: #f1f5f9 !important; }

            .settings-card { border-radius: 16px; padding: 20px; margin-bottom: 20px; }
            .settings-card h3 { font-size: 15px; margin-top: 0; margin-bottom: 16px; padding-bottom: 10px; }

            .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed rgba(150,150,150,0.2); }
            .setting-item:last-child { border-bottom: none; }

            .item-info { display: flex; flex-direction: column; gap: 4px; max-width: 70%; }
            .settings-select { padding: 8px 12px; border-radius: 8px; font-size: 12px; outline: none; cursor: pointer; }

            .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #94a3b8; transition: .3s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .slider { background-color: #F58220; }
            input:checked + .slider:before { transform: translateX(20px); }

            .action-btn { padding: 8px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
            .clear-btn { background: rgba(56, 189, 248, 0.15); color: #0284c7; border: 1px solid #0284c7; }
            .reset-btn { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }

            .about-card { text-align: center; border-color: #F58220 !important; }
            .about-info h4 { margin: 0 0 6px 0; color: #F58220; font-size: 16px; }
            .about-info p { margin: 4px 0; font-size: 12px; }
            .build-txt { font-size: 10px !important; color: #64748b !important; margin-top: 8px !important; }
        </style>
    `;
}

// 5. 100% Working Real Actions Logic

// REAL Theme Changer
window.changeAppTheme = function(newTheme) {
    window.nextgAppSettings.theme = newTheme;
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};

// REAL Language Changer (री-रेंडर करके पूरी ऐप की भाषा बदल देता है)
window.changeAppLanguage = function(newLang) {
    window.nextgAppSettings.language = newLang;
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};

window.toggleSetting = function(key) {
    if (key in window.nextgAppSettings) {
        window.nextgAppSettings[key] = !window.nextgAppSettings[key];
        saveAppSettings();
    }
};

window.clearAppCache = function() {
    sessionStorage.clear();
    alert(window.nextgAppSettings.language === 'hi' ? "🧹 ऐप कैश साफ़ कर दिया गया है!" : "🧹 App Cache Cleared!");
};

window.resetAppSettings = function() {
    window.nextgAppSettings = { ...defaultSettings };
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};
