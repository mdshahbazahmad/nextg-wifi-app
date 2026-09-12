/**
 * NextG WiFi - App Settings Component
 * File: src/components/appSettings.js
 * Default Language: English
 * Features: Language Switcher, Theme (Dark/Light), App Lock, System Control
 */

// Persistent App Settings State
window.appSettingsState = window.appSettingsState || {
    language: 'English',
    theme: 'Dark Mode', // 'Dark Mode', 'Light Mode', 'System Default'
    lockType: 'None',   // 'None', 'PIN', 'Password', 'Pattern', 'Fingerprint'
    isBiometricEnabled: false,
    notificationsEnabled: true,
    dataSaverEnabled: false,
    autoUpdateEnabled: true
};

function renderAppSettingsComponent(containerElement) {
    if (!containerElement) return;

    const state = window.appSettingsState;

    containerElement.innerHTML = `
        <div class="settings-wrapper">
            <h2 class="page-title">App Settings</h2>

            <!-- 1. LANGUAGE SELECTION -->
            <div class="settings-card">
                <div class="card-header-icon">
                    <span class="icon-box">🌐</span>
                    <div>
                        <h4>App Language</h4>
                        <p>Select your preferred regional language</p>
                    </div>
                </div>
                <div class="form-group" style="margin-top: 12px;">
                    <select id="languageSelect" onchange="updateAppLanguage(this.value)">
                        <option value="English" ${state.language === 'English' ? 'selected' : ''}>English (Default)</option>
                        <option value="Hindi" ${state.language === 'Hindi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
                        <option value="Urdu" ${state.language === 'Urdu' ? 'selected' : ''}>اردو (Urdu)</option>
                        <option value="Bengali" ${state.language === 'Bengali' ? 'selected' : ''}>বাংলা (Bengali)</option>
                        <option value="Marathi" ${state.language === 'Marathi' ? 'selected' : ''}>मराठी (Marathi)</option>
                        <option value="Punjabi" ${state.language === 'Punjabi' ? 'selected' : ''}>ਪੰਜਾਬੀ (Punjabi)</option>
                        <option value="Tamil" ${state.language === 'Tamil' ? 'selected' : ''}>தமிழ் (Tamil)</option>
                        <option value="Telugu" ${state.language === 'Telugu' ? 'selected' : ''}>తెలుగు (Telugu)</option>
                    </select>
                </div>
            </div>

            <!-- 2. THEME & DISPLAY MODE -->
            <div class="settings-card">
                <div class="card-header-icon">
                    <span class="icon-box">🎨</span>
                    <div>
                        <h4>Theme & Appearance</h4>
                        <p>Customize app visual appearance</p>
                    </div>
                </div>
                <div class="theme-options-grid">
                    <button class="theme-btn ${state.theme === 'Dark Mode' ? 'active' : ''}" onclick="changeAppTheme('Dark Mode')">
                        🌙 Dark Mode
                    </button>
                    <button class="theme-btn ${state.theme === 'Light Mode' ? 'active' : ''}" onclick="changeAppTheme('Light Mode')">
                        ☀️ Light Mode
                    </button>
                    <button class="theme-btn ${state.theme === 'System Default' ? 'active' : ''}" onclick="changeAppTheme('System Default')">
                        📱 System Auto
                    </button>
                </div>
            </div>

            <!-- 3. APP SECURITY & LOCK -->
            <div class="settings-card">
                <div class="card-header-icon">
                    <span class="icon-box">🔐</span>
                    <div>
                        <h4>App Lock & Security</h4>
                        <p>Protect your NextG App from unauthorized access</p>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 12px;">
                    <label>Select Primary Lock Method</label>
                    <select id="lockTypeSelect" onchange="updateLockMethod(this.value)">
                        <option value="None" ${state.lockType === 'None' ? 'selected' : ''}>Disabled (No Lock)</option>
                        <option value="PIN" ${state.lockType === 'PIN' ? 'selected' : ''}>Numeric PIN Code</option>
                        <option value="Password" ${state.lockType === 'Password' ? 'selected' : ''}>Text Password</option>
                        <option value="Pattern" ${state.lockType === 'Pattern' ? 'selected' : ''}>Pattern Lock</option>
                    </select>
                </div>

                <div class="toggle-row">
                    <div>
                        <strong>Biometric / Fingerprint Unlock</strong>
                        <p>Use Fingerprint or Face ID for fast login</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="biometricToggle" ${state.isBiometricEnabled ? 'checked' : ''} onchange="toggleBiometrics(this.checked)">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- 4. SYSTEM CONTROLS & UTILITIES -->
            <div class="settings-card">
                <div class="card-header-icon">
                    <span class="icon-box">⚙️</span>
                    <div>
                        <h4>System Preferences</h4>
                        <p>Notifications, cache, and data performance</p>
                    </div>
                </div>

                <div class="toggle-row">
                    <div>
                        <strong>Push Notifications</strong>
                        <p>Alerts for bill renewal & router status</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${state.notificationsEnabled ? 'checked' : ''} onchange="state.notificationsEnabled = this.checked">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="toggle-row">
                    <div>
                        <strong>Data Saver Mode</strong>
                        <p>Reduce background data usage in app</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${state.dataSaverEnabled ? 'checked' : ''} onchange="state.dataSaverEnabled = this.checked">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="system-actions">
                    <button class="action-btn" onclick="clearAppCache()">🧹 Clear Temporary Cache</button>
                    <button class="action-btn" onclick="checkForAppUpdates()">🔄 Check for App Updates</button>
                </div>

                <div class="app-version-info">
                    NextG WiFi Consumer App v2.4.0 (Build 2026)
                </div>
            </div>
        </div>

        <style>
            .settings-wrapper { color: #fff; text-align: left; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
            .settings-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 16px; }

            .card-header-icon { display: flex; align-items: center; gap: 12px; }
            .icon-box { font-size: 20px; background: #0f172a; padding: 8px 12px; border-radius: 10px; border: 1px solid #334155; }
            .card-header-icon h4 { font-size: 14px; margin: 0; color: #f8fafc; }
            .card-header-icon p { font-size: 11px; color: #94a3b8; margin: 2px 0 0 0; }

            .form-group label { display: block; font-size: 11px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
            .form-group select { width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 13px; outline: none; cursor: pointer; }

            .theme-options-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
            .theme-btn { padding: 10px 6px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #cbd5e1; font-size: 11px; font-weight: bold; cursor: pointer; transition: 0.2s; }
            .theme-btn.active { background: #F58220; color: #fff; border-color: #F58220; }

            .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #334155; margin-top: 10px; }
            .toggle-row strong { font-size: 13px; color: #f8fafc; display: block; }
            .toggle-row p { font-size: 10px; color: #94a3b8; margin: 2px 0 0 0; }

            /* Toggle Switch Style */
            .switch { position: relative; display: inline-block; width: 44px; height: 22px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .3s; border-radius: 22px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .slider { background-color: #16a34a; }
            input:checked + .slider:before { transform: translateX(22px); }

            .system-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; border-top: 1px solid #334155; padding-top: 12px; }
            .action-btn { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #38bdf8; font-size: 12px; font-weight: 600; cursor: pointer; text-align: center; }
            .action-btn:hover { border-color: #38bdf8; }

            .app-version-info { font-size: 10px; color: #64748b; text-align: center; margin-top: 15px; }
        </style>
    `;
}

// Logic 1: Change App Language
function updateAppLanguage(newLang) {
    window.appSettingsState.language = newLang;
    alert(`App language set to: ${newLang}`);
}

// Logic 2: Change App Theme
function changeAppTheme(themeName) {
    window.appSettingsState.theme = themeName;
    alert(`Theme changed to: ${themeName}`);
    renderAppSettingsComponent(document.getElementById("mainContainer"));
}

// Logic 3: Update Lock Security Method
function updateLockMethod(method) {
    window.appSettingsState.lockType = method;
    if (method !== 'None') {
        alert(`Security lock set to: ${method}. You will be prompted on app open.`);
    } else {
        alert("App Lock Disabled.");
    }
}

// Logic 4: Toggle Biometric Lock
function toggleBiometrics(isEnabled) {
    window.appSettingsState.isBiometricEnabled = isEnabled;
    alert(isEnabled ? "Fingerprint/Biometric Unlock Enabled!" : "Biometric Unlock Disabled.");
}

// Logic 5: Clear App Cache
function clearAppCache() {
    alert("Clearing temporary app cache...");
    setTimeout(() => {
        alert("Cache cleared successfully! App freed 12.4 MB.");
    }, 600);
}

// Logic 6: Check for Updates
function checkForAppUpdates() {
    alert("Checking for NextG App updates...");
    setTimeout(() => {
        alert("You are using the latest version of NextG WiFi (v2.4.0).");
    }, 800);
}
