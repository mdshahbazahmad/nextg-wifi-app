/**
 * NextG WiFi - Status Module (src/modules/status.js)
 * Router Status, Password Eye-Toggle, Multi-Router & Connected Devices
 */

function renderStatusModule(container) {
    let isInternetFrozen = false;

    // Devices connected across routers
    let devices = [
        { id: 1, name: "Samsung Galaxy S23", type: "Mobile (5G)", ip: "192.168.1.5", router: "Primary", blocked: false },
        { id: 2, name: "Android Smart TV 55\"", type: "TV (4G)", ip: "192.168.1.12", router: "Primary", blocked: false },
        { id: 3, name: "iPhone 14 Pro", type: "Mobile (5G)", ip: "192.168.1.8", router: "Secondary Mesh", blocked: true },
        { id: 4, name: "MacBook Air M2", type: "Laptop (5G)", ip: "192.168.1.15", router: "Secondary Mesh", blocked: false },
        { id: 5, name: "Living Room Echo Dot", type: "IoT (4G)", ip: "192.168.1.20", router: "Third Extender", blocked: false }
    ];

    container.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 20px; color: #ffffff; font-weight: 800;">राउटर एवं नेटवर्क स्टेटस</h2>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 2px;">राउटर कंट्रोल, स्पीड, पासवर्ड और कनेक्टेड डिवाइसेस मैनेज करें</p>
        </div>

        <!-- 1. LIVE SPEED METER (4G & 5G BANDS) -->
        <div class="app-card" style="background: linear-gradient(135deg, #0f172a, #1e293b); border-left: 4px solid #38bdf8; margin-bottom: 16px;">
            <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">LIVE BAND SPEED METER</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <div style="font-size: 12px; color: #f59e0b; font-weight: bold; margin-bottom: 8px;">📶 4G Wi-Fi Band</div>
                    <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong style="color:#fff;">42.5 Mbps</strong></div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong style="color:#fff;">28.1 Mbps</strong></div>
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid #334155;">
                    <div style="font-size: 12px; color: #10b981; font-weight: bold; margin-bottom: 8px;">🚀 5G Wi-Fi Band</div>
                    <div style="font-size: 12px; color: #cbd5e1;">⬇️ DL: <strong style="color:#fff;">148.2 Mbps</strong></div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">⬆️ UL: <strong style="color:#fff;">95.4 Mbps</strong></div>
                </div>
            </div>
        </div>

        <!-- 2. INTERNET FREEZE SWITCH -->
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

        <!-- 3. WI-FI CREDENTIAL EDIT WITH EYE TOGGLE ICON -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <h4 style="font-size: 15px; color: #fff; margin-bottom: 12px;">🔐 Wi-Fi नाम व पासवर्ड बदलें</h4>
            
            <!-- 4G Form -->
            <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px;">
                <span style="font-size: 12px; color: #f59e0b; font-weight: bold;">4G Network</span>
                <input type="text" id="ssid4G" value="NextG_4G_Home" placeholder="4G SSID" style="width: 100%; margin-top: 6px; margin-bottom: 8px; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                
                <!-- Password with Eye Icon -->
                <div style="position: relative; width: 100%;">
                    <input type="password" id="pass4G" value="12345678" placeholder="4G Password" style="width: 100%; padding: 8px 36px 8px 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                    <button type="button" onclick="togglePasswordVisibility('pass4G', 'eyeIcon4G')" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;">
                        <i id="eyeIcon4G" data-lucide="eye" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>

            <!-- 5G Form -->
            <div style="margin-bottom: 14px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 10px;">
                <span style="font-size: 12px; color: #10b981; font-weight: bold;">5G Network</span>
                <input type="text" id="ssid5G" value="NextG_5G_Ultra" placeholder="5G SSID" style="width: 100%; margin-top: 6px; margin-bottom: 8px; padding: 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                
                <!-- Password with Eye Icon -->
                <div style="position: relative; width: 100%;">
                    <input type="password" id="pass5G" value="ultra5gpass" placeholder="5G Password" style="width: 100%; padding: 8px 36px 8px 8px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                    <button type="button" onclick="togglePasswordVisibility('pass5G', 'eyeIcon5G')" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;">
                        <i id="eyeIcon5G" data-lucide="eye" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>

            <button onclick="saveWifiSettings()" class="app-btn" style="background: #F58220; font-size: 13px; padding: 10px;">
                सेटिंग्स सेव करें (Save Wi-Fi)
            </button>
        </div>

        <!-- 4. ALL CONNECTED DEVICES (Mobile, TV, Laptop, IoT) -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 15px; color: #fff;">📱 कुल कनेक्टेड डिवाइस (${devices.length})</h4>
                <span style="font-size: 10px; color: #10b981; background: rgba(16, 185, 129, 0.2); padding: 3px 8px; border-radius: 8px; font-weight: bold;">LIVE SCAN</span>
            </div>
            <div id="devicesListContainer">
                ${renderDevicesList(devices)}
            </div>
        </div>

        <!-- 5. PRIMARY, SECONDARY & THIRD ROUTER MANAGEMENT -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 15px; color: #fff;">⚙️ जुड़े हुए राउटर (Multi-Router Status)</h4>
                <button onclick="addNewRouter()" style="background: #F58220; color: #fff; border: none; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                    + Add Router
                </button>
            </div>
            
            <!-- Primary Router -->
            <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #38bdf8; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #fff; font-weight: bold;">1. Primary Fiber Router (Main)</span>
                    <span style="font-size: 10px; color: #10b981;">Online ●</span>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">DL: 150 Mbps | Devices: 2 | v2.1.0</div>
            </div>

            <!-- Secondary Router -->
            <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #f59e0b; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #fff; font-weight: bold;">2. Secondary Mesh Router</span>
                    <span style="font-size: 10px; color: #10b981;">Online ●</span>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">DL: 90 Mbps | Devices: 2 | Update Available</div>
                <button onclick="updateRouter('Secondary')" style="margin-top: 6px; background: #10b981; color: #fff; border: none; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">
                    Firmware Update ⚡
                </button>
            </div>

            <!-- Third Router -->
            <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #ec4899; padding: 10px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 13px; color: #fff; font-weight: bold;">3. Third Range Extender</span>
                    <span style="font-size: 10px; color: #10b981;">Online ●</span>
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">DL: 40 Mbps | Devices: 1 | v1.0.0</div>
            </div>
        </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // EYE TOGGLE FUNCTION FOR PASSWORDS
    window.togglePasswordVisibility = function(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        
        if (input.type === "password") {
            input.type = "text";
            icon.setAttribute("data-lucide", "eye-off");
        } else {
            input.type = "password";
            icon.setAttribute("data-lucide", "eye");
        }
        if (window.lucide) window.lucide.createIcons();
    };

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

    window.addNewRouter = function() {
        alert('नया राउटर जोड़ने के लिए स्कैनिंग शुरू की जा रही है...');
    };
}

function renderDevicesList(devices) {
    return devices.map(d => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #334155;">
            <div>
                <div style="font-size: 13px; color: #fff; font-weight: bold;">${d.name}</div>
                <div style="font-size: 11px; color: #94a3b8;">${d.type} | IP: ${d.ip} | <span style="color:#F58220">${d.router}</span></div>
            </div>
            <button onclick="toggleBlockDevice(${d.id})" style="background: ${d.blocked ? '#10b981' : '#ef4444'}; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">
                ${d.blocked ? 'Unblock' : 'Block'}
            </button>
        </div>
    `).join('');
}
