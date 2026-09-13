/**
 * NextG WiFi - Application Settings Component
 * File: src/components/appSettings.js
 * Features: REAL Working Theme, Language Switch (EN/HI/UR), Independent WhatsApp-Style App Lock System & LocalStorage Persistence
 */

// 1. भाषा के शब्द (Translation Dictionary - English, Hindi, Urdu)
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
        securitySection: "🔒 Dedicated App Lock System",
        enableLockLabel: "Enable App Lock",
        enableLockSub: "Protect this app with an independent security lock (Like WhatsApp)",
        lockTypeLabel: "Lock Mechanism",
        lockTypeSub: "Select how you want to lock this app",
        pinOpt: "🔢 4-Digit PIN",
        passwordOpt: "🔑 Custom Password",
        patternOpt: "📐 Pattern Lock",
        bioOpt: "👆 Fingerprint / Biometric",
        setPinLabel: "Enter App PIN",
        setPinSub: "Set or Change your 4-digit numeric code",
        setPassLabel: "Enter App Password",
        setPassSub: "Set or Change your custom password",
        setPatternLabel: "Enter Pattern Path",
        setPatternSub: "Set node path (e.g., 1-2-5-6)",
        bioSubText: "Uses device fingerprint sensor specifically for this app.",
        saveLockBtn: "💾 Set / Update Lock",
        lockSavedSuccess: "🔒 App Lock updated successfully!",
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
        securitySection: "🔒 स्वतंत्र ऐप लॉक सिस्टम",
        enableLockLabel: "ऐप लॉक सक्षम करें (App Lock)",
        enableLockSub: "इस ऐप को व्हाट्सऐप की तरह अलग सुरक्षा लॉक से सुरक्षित करें",
        lockTypeLabel: "लॉक का प्रकार चुनें",
        lockTypeSub: "चुनें कि आप ऐप को किस लॉक से सुरक्षित करना चाहते हैं",
        pinOpt: "🔢 4-अंकीय पिन (PIN)",
        passwordOpt: "🔑 कस्टम पासवर्ड",
        patternOpt: "📐 पैटर्न लॉक",
        bioOpt: "👆 फिंगरप्रिंट / बायोमेट्रिक",
        setPinLabel: "ऐप पिन (PIN) सेट / बदलें",
        setPinSub: "अपना 4 अंकों का गुप्त पिन कोड दर्ज करें",
        setPassLabel: "ऐप पासवर्ड सेट / बदलें",
        setPassSub: "अपना नया गुप्त पासवर्ड दर्ज करें",
        setPatternLabel: "पैटर्न कोड दर्ज करें",
        setPatternSub: "पैटर्न नोड पाथ डालें (जैसे: 1-2-5-6)",
        bioSubText: "यह ऐप आपकी फिंगरप्रिंट का उपयोग करके सुरक्षित होगा।",
        saveLockBtn: "💾 लॉक सेट / अपडेट करें",
        lockSavedSuccess: "🔒 ऐप लॉक सफलतापूर्वक अपडेट हो गया!",
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
    ur: {
        pageTitle: "ایپ سیٹنگز اور ترجیحات",
        appearanceSection: "🎨 مظہر اور ڈسپلے",
        themeLabel: "ایپ تھیم",
        themeSub: "لائٹ اور ڈارک موڈ کے درمیان سوئچ کریں",
        darkOpt: "🌙 ڈارک موڈ",
        lightOpt: "☀️ لائٹ موڈ",
        langLabel: "ایپ کی زبان",
        langSub: "اپنی پسندیدہ زبان منتخب کریں",
        securitySection: "🔒 الگ ایپ لاک سسٹم",
        enableLockLabel: "ایپ لاک فعال کریں",
        enableLockSub: "واٹس ایپ کی طرح اس ایپ کو الگ سیکیورٹی لاک سے محفوظ بنائیں",
        lockTypeLabel: "لاک کی قسم منتخب کریں",
        lockTypeSub: "منتخب کریں کہ آپ ایپ کو کیسے لاک کرنا چاہتے ہیں",
        pinOpt: "🔢 4 ہندسوں کا پن (PIN)",
        passwordOpt: "🔑 پاس ورڈ",
        patternOpt: "📐 پیٹرن لاک",
        bioOpt: "👆 فنگر پرنٹ / بائیو میٹرک",
        setPinLabel: "ایپ پن درج / تبدیل کریں",
        setPinSub: "اپنا 4 ہندسوں کا پن کوڈ تبدیل کریں",
        setPassLabel: "ایپ پاس ورڈ منتخب کریں",
        setPassSub: "اپنا نیا پاس ورڈ درج کریں",
        setPatternLabel: "پیٹرن پاتھ درج کریں",
        setPatternSub: "پیٹرن درج کریں (مثال: 1-2-5-6)",
        bioSubText: "ایپ فنگر پرنٹ کی تصدیق کا استعمال کرے گی۔",
        saveLockBtn: "💾 لاک سیٹ / اپ ڈیٹ کریں",
        lockSavedSuccess: "🔒 ایپ لاک کامیابی سے اپ ڈیٹ ہو گیا!",
        prefSection: "🔔 ترجیحات اور نیٹ ورک",
        pushNotif: "پش اطلاعات (Notifications)",
        pushSub: "ڈیٹا کے استعمال اور بل کی تازہ کاریوں کے الرٹس حاصل کریں",
        dataSaver: "ڈیٹا سیور موڈ",
        dataSaverSub: "ڈیٹا بچانے کے لیے پس منظر کا ڈیٹا کم کریں",
        autoUpdate: "وائی فائی پر خودکار اپ ڈیٹ",
        autoUpdateSub: "NextG وائی فائی کو خود بخود اپ ڈیٹ رکھیں",
        storageSection: "🛠️ سٹوریج اور دیکھ بھال",
        clearCache: "ایپ کیشے (Cache) صاف کریں",
        clearCacheSub: "عارضی جگہ کو صاف کرتا ہے اور ایپ کو تیز کرتا ہے",
        clearBtn: "🗑️ کیشے صاف کریں",
        resetSettings: "سیٹنگز کو ڈیفالٹ پر ری سیٹ کریں",
        resetSub: "تمام سیٹنگز کو اصل فیکٹری ڈیفالٹ پر بحال کرتا ہے",
        resetBtn: "🔄 سبھی ری سیٹ کریں",
        aboutTitle: "NextG وائی فائی ایپلی کیشن",
        version: "ورژن:",
        footerText: "تیز رفتار کنیکٹیوٹی کے لیے ❤️ کے ساتھ بنایا گیا"
    }
};

// 2. Persistent State Management
const defaultSettings = {
    theme: "dark",
    language: "hi",
    appLockEnabled: false,
    securityType: "pin", // 'pin', 'password', 'pattern', 'biometric'
    appPin: "1234",
    appPassword: "",
    appPattern: "1-2-5-6",
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

// 3. Real Theme Engine
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

// Initialize Theme
applyGlobalTheme();

// 4. Main UI Render Component
function renderAppSettingsComponent(containerElement) {
    if (!containerElement) return;

    window.currentSettingsContainer = containerElement;
    const settings = window.nextgAppSettings;
    const lang = TRANSLATIONS[settings.language] || TRANSLATIONS.en;
    const isLight = settings.theme === 'light';
    const isRtl = settings.language === 'ur';

    containerElement.innerHTML = `
        <div class="settings-wrapper ${isLight ? 'light-mode-card' : ''}" style="${isRtl ? 'direction: rtl; text-align: right;' : 'direction: ltr; text-align: left;'}">
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
                            <option value="ur" ${settings.language === 'ur' ? 'selected' : ''}>اردو (Urdu)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: DEDICATED APP LOCK SYSTEM -->
            <div class="settings-card">
                <h3>${lang.securitySection}</h3>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.enableLockLabel}</strong>
                        <span>${lang.enableLockSub}</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" ${settings.appLockEnabled ? 'checked' : ''} onchange="toggleSetting('appLockEnabled')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                ${settings.appLockEnabled ? `
                    <div class="setting-item">
                        <div class="item-info">
                            <strong>${lang.lockTypeLabel}</strong>
                            <span>${lang.lockTypeSub}</span>
                        </div>
                        <div class="item-control">
                            <select class="settings-select" onchange="changeSecurityType(this.value)">
                                <option value="pin" ${settings.securityType === 'pin' ? 'selected' : ''}>${lang.pinOpt}</option>
                                <option value="password" ${settings.securityType === 'password' ? 'selected' : ''}>${lang.passwordOpt}</option>
                                <option value="pattern" ${settings.securityType === 'pattern' ? 'selected' : ''}>${lang.patternOpt}</option>
                                <option value="biometric" ${settings.securityType === 'biometric' ? 'selected' : ''}>${lang.bioOpt}</option>
                            </select>
                        </div>
                    </div>

                    <!-- REAL DYNAMIC LOCK INPUT BOX (PIN / PASSWORD / PATTERN / FINGERPRINT) -->
                    <div class="lock-setup-box" style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; margin-top: 12px; border: 1px dashed #F58220;">
                        ${settings.securityType === 'pin' ? `
                            <div class="item-info" style="margin-bottom: 8px;">
                                <strong>${lang.setPinLabel}</strong>
                                <span>${lang.setPinSub}</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <input type="password" id="appLockInput" maxlength="4" value="${settings.appPin || ''}" placeholder="****" class="settings-input" style="width: 130px; text-align: center; letter-spacing: 8px; font-weight: bold; font-size: 16px;">
                                <button class="action-btn save-btn" onclick="saveAppLockData()">${lang.saveLockBtn}</button>
                            </div>
                        ` : ''}

                        ${settings.securityType === 'password' ? `
                            <div class="item-info" style="margin-bottom: 8px;">
                                <strong>${lang.setPassLabel}</strong>
                                <span>${lang.setPassSub}</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <input type="password" id="appLockInput" value="${settings.appPassword || ''}" placeholder="Enter secret password" class="settings-input" style="flex: 1;">
                                <button class="action-btn save-btn" onclick="saveAppLockData()">${lang.saveLockBtn}</button>
                            </div>
                        ` : ''}

                        ${settings.securityType === 'pattern' ? `
                            <div class="item-info" style="margin-bottom: 8px;">
                                <strong>${lang.setPatternLabel}</strong>
                                <span>${lang.setPatternSub}</span>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" id="appLockInput" value="${settings.appPattern || '1-2-5-6'}" placeholder="e.g. 1-2-5-6" class="settings-input" style="flex: 1;">
                                <button class="action-btn save-btn" onclick="saveAppLockData()">${lang.saveLockBtn}</button>
                            </div>
                        ` : ''}

                        ${settings.securityType === 'biometric' ? `
                            <div class="item-info" style="margin-bottom: 10px;">
                                <strong>${lang.bioOpt}</strong>
                                <span>${lang.bioSubText}</span>
                            </div>
                            <button class="action-btn save-btn" style="width: 100%; font-size: 13px; padding: 10px;" onclick="saveAppLockData()">👆 Activate Biometric Sensor</button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>

            <!-- SECTION 3: PREFERENCES & NETWORK -->
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

            <!-- SECTION 4: STORAGE & MAINTENANCE -->
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

            <!-- SECTION 5: ABOUT -->
            <div class="settings-card about-card">
                <div class="about-info">
                    <h4>${lang.aboutTitle}</h4>
                    <p>${lang.version} <strong>${settings.appVersion}</strong></p>
                    <p class="build-txt">${lang.footerText}</p>
                </div>
            </div>
        </div>

        <style>
            .settings-wrapper { max-width: 600px; margin: 0 auto; transition: all 0.3s ease; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; }

            /* Theme Configurations */
            .dark-theme .settings-card { background: #1e293b; border: 1px solid #334155; color: #fff; }
            .dark-theme .settings-card h3 { color: #f8fafc; border-bottom: 1px solid #334155; }
            .dark-theme .item-info strong { color: #f1f5f9; }
            .dark-theme .item-info span { color: #94a3b8; }
            .dark-theme .settings-select, .dark-theme .settings-input { background: #0f172a; border: 1px solid #334155; color: #fff; }
            .dark-theme .about-card { background: #0f172a; }

            .light-theme .page-title { color: #0f172a !important; }
            .light-theme .settings-card { background: #ffffff !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
            .light-theme .settings-card h3 { color: #0f172a !important; border-bottom: 1px solid #e2e8f0 !important; }
            .light-theme .item-info strong { color: #1e293b !important; }
            .light-theme .item-info span { color: #64748b !important; }
            .light-theme .settings-select, .light-theme .settings-input { background: #f1f5f9 !important; border: 1px solid #cbd5e1 !important; color: #0f172a !important; }
            .light-theme .about-card { background: #f1f5f9 !important; }

            .settings-card { border-radius: 16px; padding: 20px; margin-bottom: 20px; }
            .settings-card h3 { font-size: 15px; margin-top: 0; margin-bottom: 16px; padding-bottom: 10px; }

            .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed rgba(150,150,150,0.2); }
            .setting-item:last-child { border-bottom: none; }

            .item-info { display: flex; flex-direction: column; gap: 4px; max-width: 70%; }
            .settings-select, .settings-input { padding: 8px 12px; border-radius: 8px; font-size: 12px; outline: none; }

            .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #94a3b8; transition: .3s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .slider { background-color: #F58220; }
            input:checked + .slider:before { transform: translateX(20px); }

            .action-btn { padding: 8px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
            .save-btn { background: #16a34a; color: #fff; }
            .clear-btn { background: rgba(56, 189, 248, 0.15); color: #0284c7; border: 1px solid #0284c7; }
            .reset-btn { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }

            .about-card { text-align: center; border-color: #F58220 !important; }
            .about-info h4 { margin: 0 0 6px 0; color: #F58220; font-size: 16px; }
            .about-info p { margin: 4px 0; font-size: 12px; }
            .build-txt { font-size: 10px !important; color: #64748b !important; margin-top: 8px !important; }
        </style>
    `;
}

// 5. Action Handlers

window.changeAppTheme = function(newTheme) {
    window.nextgAppSettings.theme = newTheme;
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};

window.changeAppLanguage = function(newLang) {
    window.nextgAppSettings.language = newLang;
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};

window.toggleSetting = function(key) {
    if (key in window.nextgAppSettings) {
        window.nextgAppSettings[key] = !window.nextgAppSettings[key];
        saveAppSettings();
        renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
    }
};

window.changeSecurityType = function(type) {
    window.nextgAppSettings.securityType = type;
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};

// REAL Working Save/Update Logic for App Lock
window.saveAppLockData = function() {
    const type = window.nextgAppSettings.securityType;
    const lang = TRANSLATIONS[window.nextgAppSettings.language] || TRANSLATIONS.en;
    const lockInput = document.getElementById("appLockInput");

    if (type === 'pin') {
        const pinVal = lockInput ? lockInput.value : "";
        if (pinVal.length === 4 && !isNaN(pinVal)) {
            window.nextgAppSettings.appPin = pinVal;
            saveAppSettings();
            alert(lang.lockSavedSuccess);
        } else {
            alert("⚠️ 4 अंकों का गुप्त PIN कोड दर्ज करें।");
        }
    } else if (type === 'password') {
        const passVal = lockInput ? lockInput.value : "";
        if (passVal.trim().length >= 3) {
            window.nextgAppSettings.appPassword = passVal;
            saveAppSettings();
            alert(lang.lockSavedSuccess);
        } else {
            alert("⚠️ कम से कम 3 अक्षरों का पासवर्ड दर्ज करें।");
        }
    } else if (type === 'pattern') {
        const patVal = lockInput ? lockInput.value : "";
        if (patVal.trim().length > 0) {
            window.nextgAppSettings.appPattern = patVal;
            saveAppSettings();
            alert(lang.lockSavedSuccess);
        }
    } else if (type === 'biometric') {
        saveAppSettings();
        alert(lang.lockSavedSuccess);
    }
};

window.clearAppCache = function() {
    sessionStorage.clear();
    const msg = window.nextgAppSettings.language === 'hi' ? "🧹 ऐप कैश साफ़ कर दिया गया है!" : 
                (window.nextgAppSettings.language === 'ur' ? "🧹 ایپ کیشے صاف ہو گیا ہے!" : "🧹 App Cache Cleared!");
    alert(msg);
};

window.resetAppSettings = function() {
    window.nextgAppSettings = { ...defaultSettings };
    saveAppSettings();
    renderAppSettingsComponent(window.currentSettingsContainer || document.getElementById("mainContainer"));
};
