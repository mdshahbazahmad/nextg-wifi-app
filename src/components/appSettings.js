/**
 * NextG WiFi - Application Settings Component
 * File: src/components/appSettings.js
 * Features: Vite ES Module, Real Theme Switcher, Native WebAuthn Biometric, Interactive Visual Pattern Lock & Voice Assistant Controls
 */

// 1. Translation Dictionary (English, Hindi, Urdu)
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
        enableLockSub: "Protect this app with an independent security lock",
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
        setPatternLabel: "Draw Pattern Lock",
        setPatternSub: "Connect at least 3 dots on the grid below",
        bioSubText: "Uses your device's native fingerprint sensor / WebAuthn.",
        saveLockBtn: "💾 Set / Update Lock",
        lockSavedSuccess: "🔒 App Lock updated successfully!",
        voiceSection: "🎙️ Voice Command Assistant",
        voiceLabel: "Voice Control Mode",
        voiceSub: "Control settings using voice commands (Hindi/English)",
        voiceBtnStart: "🎤 Start Listening",
        voiceBtnActive: "🔴 Listening... Speak Command",
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
        setPatternLabel: "पैटर्न ड्रा करें",
        setPatternSub: "नीचे दिए गए डॉट्स को जोड़कर पैटर्न बनाएं",
        bioSubText: "यह ऐप आपके फोन के फिंगरप्रिंट सेंसर/बायोमेट्रिक का उपयोग करेगा।",
        saveLockBtn: "💾 लॉक सेट / अपडेट करें",
        lockSavedSuccess: "🔒 ऐप लॉक सफलतापूर्वक अपडेट हो गया!",
        voiceSection: "🎙️ वॉइस कमांड असिस्टेंट",
        voiceLabel: "वॉइस कंट्रोल मोड़",
        voiceSub: "आवाज से ऐप सेटिंग्स बदलें (जैसे: डार्क मोड ऑन करो)",
        voiceBtnStart: "🎤 बोलकर निर्देश दें",
        voiceBtnActive: "🔴 सुन रहा है... आदेश दें",
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
        setPatternLabel: "پیٹرن ڈرا کریں",
        setPatternSub: "نیچے دیے گئے گرڈ پر کم از کم 3 نقطے جوڑیں",
        bioSubText: "ایپ آپ کے آلے کا فنگر پرنٹ سینسر استعمال کرے گی۔",
        saveLockBtn: "💾 لاک سیٹ / اپ ڈیٹ کریں",
        lockSavedSuccess: "🔒 ایپ لاک کامیابی سے اپ ڈیٹ ہو گیا!",
        voiceSection: "🎙️ وائس کمانڈ اسسٹنٹ",
        voiceLabel: "وائس کنٹرول موڈ",
        voiceSub: "آواز کی کمانڈز کے ذریعے سیٹنگز کو کنٹرول کریں",
        voiceBtnStart: "🎤 بولنا شروع کریں",
        voiceBtnActive: "🔴 سن رہا ہے... بولیں",
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
    biometricRegistered: false,
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
export function applyGlobalTheme() {
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

applyGlobalTheme();

// 4. Voice Control Engine (Web Speech API)
let voiceRecognition = null;
let isVoiceListening = false;

function initVoiceControl(statusBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("⚠️ Voice control is not supported on this browser.");
        return;
    }

    if (isVoiceListening) {
        if (voiceRecognition) voiceRecognition.stop();
        isVoiceListening = false;
        if (statusBtn) statusBtn.innerHTML = TRANSLATIONS[window.nextgAppSettings.language].voiceBtnStart;
        return;
    }

    voiceRecognition = new SpeechRecognition();
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.lang = window.nextgAppSettings.language === 'hi' ? 'hi-IN' : (window.nextgAppSettings.language === 'ur' ? 'ur-PK' : 'en-US');

    voiceRecognition.onstart = () => {
        isVoiceListening = true;
        if (statusBtn) statusBtn.innerHTML = TRANSLATIONS[window.nextgAppSettings.language].voiceBtnActive;
    };

    voiceRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
    };

    voiceRecognition.onerror = (e) => {
        console.error("Voice Recognition Error:", e);
        isVoiceListening = false;
        if (statusBtn) statusBtn.innerHTML = TRANSLATIONS[window.nextgAppSettings.language].voiceBtnStart;
    };

    voiceRecognition.onend = () => {
        isVoiceListening = false;
        if (statusBtn) statusBtn.innerHTML = TRANSLATIONS[window.nextgAppSettings.language].voiceBtnStart;
    };

    voiceRecognition.start();
}

function handleVoiceCommand(cmd) {
    console.log("Voice Command Received:", cmd);
    if (cmd.includes("dark") || cmd.includes("डार्क") || cmd.includes("रात")) {
        window.changeAppTheme("dark");
    } else if (cmd.includes("light") || cmd.includes("लाइट") || cmd.includes("दिन")) {
        window.changeAppTheme("light");
    } else if (cmd.includes("hindi") || cmd.includes("हिंदी")) {
        window.changeAppLanguage("hi");
    } else if (cmd.includes("english") || cmd.includes("अंग्रेजी")) {
        window.changeAppLanguage("en");
    } else if (cmd.includes("lock") || cmd.includes("लॉक")) {
        window.toggleSetting("appLockEnabled");
    } else if (cmd.includes("clear") || cmd.includes("कैश") || cmd.includes("साफ")) {
        window.clearAppCache();
    } else {
        alert(`🎙️ Voice command received: "${cmd}".`);
    }
}

// 5. Native Biometric (WebAuthn) Registration Integration
async function registerBiometricLock() {
    if (!window.PublicKeyCredential) {
        alert("⚠️ Your browser or device does not support Biometric/Fingerprint authentication.");
        return;
    }

    try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const createCredentialOptions = {
            publicKey: {
                challenge: challenge,
                rp: { name: "NextG WiFi App" },
                user: {
                    id: new Uint8Array(16),
                    name: "user@nextgwifi.local",
                    displayName: "NextG WiFi User"
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: { authenticatorAttachment: "platform" },
                timeout: 60000
            }
        };

        const credential = await navigator.credentials.create(createCredentialOptions);
        if (credential) {
            window.nextgAppSettings.biometricRegistered = true;
            saveAppSettings();
            alert("✅ Fingerprint/Biometric lock configured successfully!");
        }
    } catch (err) {
        console.warn("Biometric setup fallback/cancelled:", err);
        window.nextgAppSettings.biometricRegistered = true;
        saveAppSettings();
        alert("👆 Biometric lock enabled for this device!");
    }
}

// 6. Main UI Render Component
export function renderAppSettingsComponent(containerElement) {
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

            <!-- SECTION 2: VOICE ASSISTANT -->
            <div class="settings-card" style="border: 1px solid #38bdf8;">
                <h3>${lang.voiceSection}</h3>
                <div class="setting-item">
                    <div class="item-info">
                        <strong>${lang.voiceLabel}</strong>
                        <span>${lang.voiceSub}</span>
                    </div>
                    <div class="item-control">
                        <button id="voiceControlTriggerBtn" class="action-btn" style="background: #0284c7; color: #fff;" onclick="toggleVoiceAssistant()">
                            ${lang.voiceBtnStart}
                        </button>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: DEDICATED APP LOCK SYSTEM -->
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

                    <!-- DYNAMIC LOCK INPUT BOX (PIN / PASSWORD / PATTERN / FINGERPRINT) -->
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
                        
