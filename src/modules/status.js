/**
 * NextG WiFi - Status Module (src/modules/status.js)
 * Router Status & Network Management Controls
 */

function renderStatusModule(container) {
    // Mock Router State Data
    let isInternetFrozen = false;
    let routerFirmwareStatus = "v2.1.0 (Latest)";
    let secondaryRouterStatus = "v1.0.4 (Update Available)";

    // Mock Connected Devices
    let devices = [
        { id: 1, name: "Samsung Galaxy S23", type: "Mobile (5G)", ip: "192.168.1.5", blocked: false },
        { id: 2, name: "Android Smart TV 55\"", type: "TV (4G)", ip: "192.168.1.12", blocked: false },
        { id: 3, name: "iPhone 14", type: "Mobile (5G)", ip: "192.168.1.8", blocked: true }
    ];

    container.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 20px; color: #ffffff; font-weight: 800;">राउटर एवं नेटवर्क स्टेटस</h2>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 2px;">राउटर कंट्रोल, स्पीड और वाई-फाई सेटिंग्स प्रबंधित करें</p>
        </div>

        <!-- 1. LIVE SPEED METER (4G & 5G SEPARATE BANDS) -->
        <div class="app-card" style="background: linear-gradient(135deg, #0f172a, #1e293b); border-left: 4px solid #38bdf8; margin-bottom: 16px;">
            <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">LIVE BAND SPEED METER</span>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                <!-- 4G Band -->
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <div style="font-size: 12px; color: #f59e0b; font-weight: bold; margin-bottom: 8px;">📶 4G Wi-Fi Band</div>
                    <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong style="color:#fff;">42.5 Mbps</strong></div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong style="color:#fff;">28.1 Mbps</strong></div>
                </div>
                
                <!-- 5G Band -->
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 8px;">🚀 5G Wi-Fi Band</div>
                    <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong style="color:#fff;">148.2 Mbps</strong></div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong style="color:#fff;">95.4 Mbps</strong></div>
                </div>
            </div>
        </div>

        <!-- 2. ROUTER INTERNET FREEZE SWITCH (Pause/Unpause Net) -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="font-size: 15px; color: #fff;">🌐 इंटरनेट एक्सेस पॉज़ (Freeze)</h4>
                    <p style="font-size: 11px; color: #94a3b8;">राउटर ऑन रहेगा पर वाई-फाई डेटा बंद/चालू होगा</p>
                </div>
                <button id="freezeToggleBtn" onclick="toggleInternetFreeze()" style="background: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 10px; font-weight: bold; font-size: 12px; cursor: pointer;">
                    🔴 Freeze Net
                </button>
            </div>
        </div>

        <!-- 3. 4G & 5G WI-FI CREDENTIAL EDIT (SSID & PASSWORD) -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <h4 style="font-size: 15px; color: #fff; margin-bottom: 12px;">🔐 Wi-Fi नाम व पासवर्ड बदलें</h4>
            
            <!-- 4G Form -->
            <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px;">
                <span style="font-size: 12px; color: #f59e0b; font-weight: bold;">4G Network</span>
                <input type="text" id="ssid4G" value="NextG_4G_Home" placeholder="4G SSID" style="width: 100%; margin-top: 6px; margin-bottom: 6px; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                <input type="password" id="pass4G" value="12345678" placeholder="4G Password" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
            </div>

            <!-- 5G Form -->
            <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px;">
                <span style="font-size: 12px; color: #10b981; font-weight: bold;">5G Network</span>
                <input type="text" id="ssid5G" value="NextG_5G_Ultra" placeholder="5G SSID" style="width: 100%; margin-top: 6px; margin-bottom: 6px; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                <input type="password" id="pass5G" value="ultra5gpass" placeholder="5G Password" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
            </div>

            <button onclick="saveWifiSettings()" class="app-btn" style="background: #F58220; font-size: 13px; padding: 10px;">
                सेटिंग्स सेव करें (Save Wi-Fi)
            </button>
        </div>

        <!-- 4. CONNECTED DEVICES LIST (Block / Unblock Mobile & TV) -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <h4 style="font-size: 15px; color: #fff; margin-bottom: 12px;">📱 कनेक्टेड डिवाइस प्रबंधन</h4>
            <div id="devicesListContainer">
                ${renderDevicesList(devices)}
            </div>
        </div>

        <!-- 5. PRIMARY & SECONDARY ROUTER FIRMWARE UPDATES -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <h4 style="font-size: 15px; color: #fff; margin-bottom: 12px;">⚙️ राउटर अपडेट प्रबंधन</h4>
            
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px; margin-bottom: 8px;">
                <div>
                    <div style="font-size: 13px; color: #fff; font-weight: bold;">Primary Router</div>
                    <div style="font-size: 11px; color: #94a3b8;">${routerFirmwareStatus}</div>
                </div>
                <button onclick="updateRouter('Primary')" style="background: #334155; color: #cbd5e1; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                    Check Update
                </button>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px;">
                <div>
                    <div style="font-size: 13px; color: #fff; font-weight: bold;">Secondary / Mesh Router</div>
                    <div style="font-size: 11px; color: #F58220;">${secondaryRouterStatus}</div>
                </div>
                <button onclick="updateRouter('Secondary')" style="background: #10b981; color: #fff; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                    Update Now ⚡
                </button>
            </div>
        </div>
    `;

    // Global Functions for Actions
    window.toggleInternetFreeze = function() {
        isInternetFrozen = !isInternetFrozen;
        const btn = document.getElementById('freezeToggleBtn');
        if (isInternetFrozen) {
            btn.innerHTML = '🟢 Unfreeze Net';
            btn.style.background = '#10b981';
            alert('इंटरनेट सेवाओं को रोक दिया गया है (Frozen)।');
        } else {
            btn.innerHTML = '🔴 Freeze Net';
            btn.style.background = '#ef4444';
            alert('इंटरनेट सेवाएं फिर से चालू कर दी गई हैं।');
        }
    };

    window.saveWifiSettings = function() {
        alert('4G और 5G Wi-Fi नाम और पासवर्ड सफलतापूर्वक अपडेट हो गए हैं!');
    };

    window.toggleBlockDevice = function(id) {
        devices = devices.map(d => d.id === id ? { ...d, blocked: !d.blocked } : d);
        document.getElementById('devicesListContainer').innerHTML = renderDevicesList(devices);
    };

    window.updateRouter = function(type) {
        alert(`${type} राउटर का फर्मवेयर सफलतापूर्वक अपडेट हो रहा है...`);
    };
}

function renderDevicesList(devices) {
    return devices.map(d => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #334155;">
            <div>
                <div style="font-size: 13px; color: #fff; font-weight: bold;">${d.name}</div>
                <div style="font-size: 11px; color: #94a3b8;">${d.type} | IP: ${d.ip}</div>
            </div>
            <button onclick="toggleBlockDevice(${d.id})" style="background: ${d.blocked ? '#10b981' : '#ef4444'}; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                ${d.blocked ? 'Unblock' : 'Block'}
            </button>
        </div>
    `).join('');
}
