/**
 * NextG WiFi - Recharge Module (src/modules/recharge.js)
 * Clean App-Style Colorful Recharge & Payment Modal
 */

function renderRechargeModule(container) {
    // Mock Data from Operator Dashboard (Dynamic Firebase Data)
    const rechargePlans = [
        {
            id: "plan_1",
            title: "Super Saver",
            speed: "30 Mbps",
            price: "399",
            validity: "30 Days",
            data: "Truly Unlimited",
            badge: "STARTER",
            bgGradient: "linear-gradient(135deg, #1e293b, #0f172a)",
            accentColor: "#38bdf8"
        },
        {
            id: "plan_2",
            title: "Turbo High-Speed",
            speed: "50 Mbps",
            price: "599",
            validity: "30 Days",
            data: "Unlimited + Free OTT",
            badge: "POPULAR 🔥",
            bgGradient: "linear-gradient(135deg, #2e1065, #0f172a)",
            accentColor: "#F58220"
        },
        {
            id: "plan_3",
            title: "Ultra Gaming & 4K",
            speed: "100 Mbps",
            price: "799",
            validity: "30 Days",
            data: "Low Latency Unlimited",
            badge: "BEST VALUE 💎",
            bgGradient: "linear-gradient(135deg, #064e3b, #0f172a)",
            accentColor: "#10b981"
        },
        {
            id: "plan_4",
            title: "Quarterly Mega Saver",
            speed: "50 Mbps",
            price: "1699",
            validity: "90 Days",
            data: "Truly Unlimited",
            badge: "3 MONTHS ⚡",
            bgGradient: "linear-gradient(135deg, #831843, #0f172a)",
            accentColor: "#ec4899"
        }
    ];

    // Build Colorful Recharge UI Cards
    let plansHTML = rechargePlans.map(plan => `
        <div class="app-card" style="background: ${plan.bgGradient}; border: 1px solid rgba(255, 255, 255, 0.1); border-left: 5px solid ${plan.accentColor}; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="font-size: 18px; color: #ffffff;">${plan.title}</h3>
                <span style="background: ${plan.accentColor}; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 10px;">${plan.badge}</span>
            </div>
            
            <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px;">
                <span style="font-size: 26px; font-weight: 900; color: #ffffff;">₹${plan.price}</span>
                <span style="font-size: 12px; color: #94a3b8;">/ ${plan.validity}</span>
            </div>

            <div style="background: rgba(0,0,0,0.25); padding: 10px 12px; border-radius: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; font-size: 12px;">
                <span style="color: #cbd5e1;">⚡ Speed: <strong style="color:${plan.accentColor}">${plan.speed}</strong></span>
                <span style="color: #cbd5e1;">🌐 Data: <strong>${plan.data}</strong></span>
            </div>

            <!-- PAYMENT BUTTONS -->
            <div style="display: flex; gap: 10px;">
                <!-- 1. Direct App Payment Link (GPay / PhonePe / Paytm / BHIM) -->
                <button onclick="triggerUPIPayment('${plan.price}', '${plan.title}')" class="app-btn" style="flex: 2; background: ${plan.accentColor}; font-size: 13px; padding: 12px;">
                    <i data-lucide="smartphone" style="width:16px; height:16px;"></i> Pay via UPI App
                </button>
                
                <!-- 2. QR Code Scanner Modal Button -->
                <button onclick="openQRModal('${plan.price}', '${plan.title}')" style="flex: 1; background: #334155; color: #ffffff; border: none; border-radius: 14px; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                    <i data-lucide="qr-code" style="width:16px; height:16px; color:#F58220;"></i> Scan QR
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 20px; color: #ffffff; font-weight: 800;">ब्रॉडबैंड रिचार्ज पैक्स</h2>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 2px;">अपनी पसंद का प्लान चुनें और तुरंत रिचार्ज करें</p>
        </div>

        ${plansHTML}

        <!-- QR CODE PAYMENT MODAL OVERLAY -->
        <div id="qrModalOverlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); display: none; justify-content: center; align-items: center; z-index: 300; padding: 16px;">
            <div style="background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 24px; max-width: 360px; width: 100%; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8); position: relative;">
                <h3 style="font-size: 18px; color: #ffffff; margin-bottom: 4px;">पेमेंट क्यूआर कोड (QR Code)</h3>
                <p id="qrModalPlanInfo" style="font-size: 13px; color: #F58220; font-weight: 700; margin-bottom: 16px;">Recharge Plan Details</p>
                
                <!-- QR CODE IMAGE CONTAINER -->
                <div style="background: #ffffff; padding: 15px; border-radius: 16px; display: inline-block; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <img id="dynamicQRImage" src="" alt="UPI QR Code" style="width: 180px; height: 180px; display: block;">
                </div>

                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 15px;">किसी भी UPI ऐप (PhonePe, Paytm, Google Pay) से क्यूआर कोड स्कैन करके भुगतान करें</p>
                
                <button onclick="closeQRModal()" style="background: #ef4444; color: white; border: none; width: 100%; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px;">
                    बंद करें (Close)
                </button>
            </div>
        </div>
    `;

    // Refresh Lucide Icons
    if (window.lucide) window.lucide.createIcons();
}

/**
 * 1. Direct Mobile UPI Deep Linking Logic
 * Automatically opens installed UPI App (PhonePe / GPay / Paytm)
 */
function triggerUPIPayment(amount, planTitle) {
    const operatorUPI = "nextgwifi@upi"; // Replace with Operator UPI ID
    const operatorName = "NextG WiFi BroadBand";
    const note = encodeURIComponent(`Recharge ${planTitle}`);
    
    // Standard UPI Link Protocol
    const upiIntentURL = `upi://pay?pa=${operatorUPI}&pn=${encodeURIComponent(operatorName)}&am=${amount}&cu=INR&tn=${note}`;
    
    // Redirects browser to native UPI app selector in phone
    window.location.href = upiIntentURL;
}

/**
 * 2. Dynamic QR Code Modal Generator Logic
 */
function openQRModal(amount, planTitle) {
    const operatorUPI = "nextgwifi@upi"; // Replace with Operator UPI ID
    const operatorName = "NextG WiFi BroadBand";
    const note = encodeURIComponent(`Recharge ${planTitle}`);
    
    // Dynamic QR Generator API using UPI Link
    const upiData = `upi://pay?pa=${operatorUPI}&pn=${encodeURIComponent(operatorName)}&am=${amount}&cu=INR&tn=${note}`;
    const qrApiURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiData)}`;

    document.getElementById('dynamicQRImage').src = qrApiURL;
    document.getElementById('qrModalPlanInfo').innerText = `${planTitle} - ₹${amount}`;
    document.getElementById('qrModalOverlay').style.display = 'flex';
}

function closeQRModal() {
    document.getElementById('qrModalOverlay').style.display = 'none';
}
