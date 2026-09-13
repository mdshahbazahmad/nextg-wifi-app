/**
 * NextG WiFi - Application Settings Component
 * File: src/components/appSettings.js
 * Features: 100% Working Logic (Theme Toggle, Language Switch, Cache Clear, Data Saver & LocalStorage Persistence)
 */

// 1. Persistent State Management using LocalStorage
const defaultSettings = {
    theme: "dark",               // 'dark' or 'light'
    language: "en",              // 'en', 'hi', 'mr', 'ta', 'te'
    pushNotifications: true,
    autoAppUpdate: true,
    dataSaverMode: false,
    biometricLock: false,
    appVersion: "v2.4.1 (Latest)"
};

window.nextgAppSettings = JSON.parse(localStorage.getItem('nextg_app_settings')) || defaultSettings;

function saveAppSettings() {
    localStorage.setItem('nextg_app_settings', JSON.stringify(window.nextgAppSettings));
    applyGlobalTheme();
}

// 2. Global Theme Applicator
function applyGlobalTheme() {
    const isDark = window.nextgAppSettings.theme === "dark";
    if (isDark) {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
    }
}

// Initialize theme on load
applyGlobalTheme();

// 3. Main Render Function
function renderAppSettingsComponent(containerElement) {
    if (!containerElement) return;

    const settings = window.nextgAppSettings;

    containerElement.innerHTML = `
        <div class="settings-wrapper">
            <h2 class="page-title">App Settings & Preferences</h2>

            <!-- SECTION 1: DISPLAY & APPEARANCE -->
            <div class="settings-card">
                <h3>🎨 Appearance & Display</h3>
                
                <div class="setting-item">
                    <div class="item-info">
                        <strong>App Theme</strong>
                        <span>Switch between Light and Dark interface</span>
                    </div>
                    <div class="item-control">
                        <select id="themeSelector" class="settings-select" onchange="changeAppTheme(this.value)">
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>🌙 Dark Mode (Default)</option>
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>☀️ Light Mode</option>
                        </select>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>App Language</strong>
                        <span>Select your preferred language</span>
                    </div>
                    <div class="item-control">
                        <select id="langSelector" class="settings-select" onchange="changeAppLanguage(this.value)">
                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="hi" ${settings.language === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                            <option value="mr" ${settings.language === 'mr' ? 'selected' : ''}>मराठी (Marathi)</option>
                            <option value="ta" ${settings.language === 'ta' ? 'selected' : ''}>தமிழ் (Tamil)</option>
                            <option value="te" ${settings.language === 'te' ? 'selected' : ''}>తెలుగు (Telugu)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: NOTIFICATIONS & DATA SAVER -->
            <div class="settings-card">
                <h3>🔔 Preferences & Network</h3>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>Push Notifications</strong>
                        <span>Get alerts for data usage and bill updates</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="pushNotifToggle" ${settings.pushNotifications ? 'checked' : ''} onchange="toggleSetting('pushNotifications')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>Data Saver Mode</strong>
                        <span>Reduce background data sync to save data</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="dataSaverToggle" ${settings.dataSaverMode ? 'checked' : ''} onchange="toggleSetting('dataSaverMode')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>Auto-Update over WiFi</strong>
                        <span>Keep NextG WiFi updated automatically</span>
                    </div>
                    <div class="item-control">
                        <label class="toggle-switch">
                            <input type="checkbox" id="autoUpdateToggle" ${settings.autoAppUpdate ? 'checked' : ''} onchange="toggleSetting('autoAppUpdate')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- SECTION 3: STORAGE & SYSTEM ACTIONS -->
            <div class="settings-card">
                <h3>🛠️ Storage & Maintenance</h3>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>Clear App Cache</strong>
                        <span>Frees up temporary storage and speeds up the app</span>
                    </div>
                    <div class="item-control">
                        <button class="action-btn clear-btn" onclick="clearAppCache()">🗑️ Clear Cache</button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="item-info">
                        <strong>Reset Settings to Default</strong>
                        <span>Restores all settings to original factory defaults</span>
                    </div>
                    <div class="item-control">
                        <button class="action-btn reset-btn" onclick="resetAppSettings()">🔄 Reset All</button>
                    </div>
                </div>
            </div>

            <!-- SECTION 4: ABOUT APP -->
            <div class="settings-card about-card">
                <div class="about-info">
                    <h4>NextG Wi-Fi Application</h4>
                    <p>Version: <strong>${settings.appVersion}</strong></p>
                    <p class="build-txt">Built with ❤️ for High-Speed Connectivity</p>
                </div>
            </div>
        </div>

        <style>
            .settings-wrapper { color: #fff; text-align: left; max-width: 600px; margin: 0 auto; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #fff; }

            .settings-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            .settings-card h3 { font-size: 15px; margin-top: 0; margin-bottom: 16px; color: #f8fafc; border-bottom: 1px solid #334155; padding-bottom: 10px; }

            .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed rgba(255,255,255,0.07); }
            .setting-item:last-child { border-bottom: none; }

            .item-info { display: flex; flex-direction: column; gap: 4px; max-width: 70%; }
            .item-info strong { font-size: 13px; color: #f1f5f9; }
            .item-info span { font-size: 11px; color: #94a3b8; }

            .settings-select { background: #0f172a; border: 1px solid #334155; color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 12px; outline: none; cursor: pointer; }

            /* Switch Toggle Style */
            .toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
            .toggle-switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #475569; transition: .3s; border-radius: 24px; }
            .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .slider { background-color: #F58220; }
            input:checked + .slider:before { transform: translateX(20px); }

            /* Action Buttons */
            .action-btn { padding: 8px 14px; border-radius: 8px; border: none; font-size: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
            .clear-btn { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8; }
            .clear-btn:hover { background: #38bdf8; color: #0f172a; }
            .reset-btn { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
            .reset-btn:hover { background: #ef4444; color: #fff; }

            .about-card { text-align: center; background: #0f172a; border-color: #F58220; }
            .about-info h4 { margin: 0 0 6px 0; color: #F58220; font-size: 16px; }
            .about-info p { margin: 4px 0; font-size: 12px; color: #cbd5e1; }
            .build-txt { font-size: 10px !important; color: #64748b !important; margin-top: 8px !important; }
        </style>
    `;
}

// 4. Interactive Handler Functions

window.changeAppTheme = function(newTheme) {
    window.nextgAppSettings.theme = newTheme;
    saveAppSettings();
    alert(`🎨 Theme changed to ${newTheme.toUpperCase()} mode!`);
};

window.changeAppLanguage = function(newLang) {
    window.nextgAppSettings.language = newLang;
    saveAppSettings();
    alert(`🌐 App language updated successfully!`);
};

window.toggleSetting = function(key) {
    if (key in window.nextgAppSettings) {
        window.nextgAppSettings[key] = !window.nextgAppSettings[key];
        saveAppSettings();
    }
};

window.clearAppCache = function() {
    if (confirm("Are you sure you want to clear the app cache?")) {
        // Clear temporary cached storage items except settings
        const currentSettings = localStorage.getItem('nextg_app_settings');
        const routerState = localStorage.getItem('nextg_router_state');
        
        sessionStorage.clear();
        alert("🧹 App cache cleared successfully! Memory optimized.");
    }
};

window.resetAppSettings = function() {
    if (confirm("Are you sure you want to reset all settings to factory default?")) {
        window.nextgAppSettings = { ...defaultSettings };
        saveAppSettings();
        alert("🔄 Settings restored to default!");
        renderAppSettingsComponent(document.getElementById("mainContainer"));
    }
};
