/**
 * NextG WiFi - Home Module (src/modules/home.js)
 * Clean Mobile App UI Layout
 */

let rechargeInterval = null;

function renderHomeModule(container) {
    // 1. Clear previous interval if switching tabs to prevent memory leak
    if (rechargeInterval) clearInterval(rechargeInterval);

    // Mock Data (Later connected to Firebase Operator Dashboard)
    const activePlan = {
        name: "Super Fast Unlimited",
        speed: "50 Mbps",
        daysRemaining: 18,
        validTill: "30 Sep 2026",
        status: "Active"
    };

    // Notification from Operator Dashboard (Set to null or empty string if no alert)
    const operatorAlert = "⚠️ क्षेत्र में पावर कट के कारण सेवा दोपहर 2 बजे तक बाधित रह सकती है।";

    // Auto-sliding Recharge Offers (Set by Operator)
    const rechargeOffers = [
        { title: "🚀 Unlimited 50 Mbps", price: "₹499 / महीना", desc: "ओटीटी ऐप्स मुफ्त और अनलिमिटेड डेटा" },
        { title: "⚡ Super 100 Mbps", price: "₹699 / महीना", desc: "अल्ट्रा फास्ट स्पीड + 4K स्ट्रीमिंग" },
        { title: "💎 Family Turbo 150 Mbps", price: "₹999 / महीना", desc: "पूरे परिवार के लिए हाई-स्पीड इंटरनेट" }
    ];

    // HTML Structure Construction
    container.innerHTML = `
        <!-- 1. ACTIVE PLAN STATUS CARD -->
        <div class="app-card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border-left: 4px solid #F58220; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 12px; color: #94a3b8; font-weight: 700;">ACTIVE PLAN</span>
                <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: 800;">● ${activePlan.status}</span>
            </div>
            <h3 style="font-size: 20px; color: #ffffff; margin-bottom: 4px;">${activePlan.name}</h3>
            <p style="color: #38bdf8; font-weight: 700; font-size: 14px; margin-bottom: 15px;">⚡ Speed: ${activePlan.speed}</p>
            
            <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; text-align: center;">
                <div>
                    <p style="font-size: 11px; color: #94a3b8;">वैधता (Valid Till)</p>
                    <p style="font-size: 13px; font-weight: bold; color: #fff; margin-top: 2px;">${activePlan.validTill}</p>
                </div>
                <div style="border-left: 1px solid #334155; padding-left: 15px;">
                    <p style="font-size: 11px; color: #94a3b8;">बाकी दिन (Remaining)</p>
                    <p style="font-size: 13px; font-weight: bold; color: #F58220; margin-top: 2px;">${activePlan.daysRemaining} दिन</p>
                </div>
            </div>
        </div>

        <!-- 2. OPERATOR DYNAMIC NOTIFICATION CARD (Appears only if alert exists) -->
        ${operatorAlert ? `
            <div class="app-card" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-left: 4px solid #ef4444; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #f87171; font-weight: 700; font-size: 13px; margin-bottom: 4px;">
                    <i data-lucide="alert-triangle" style="width:16px; height:16px;"></i> नेटवर्क सूचना (Notice)
                </div>
                <p style="font-size: 13px; color: #fca5a5; line-height: 1.4;">${operatorAlert}</p>
            </div>
        ` : ''}

        <!-- 3. AUTO-SLIDING RECHARGE OFFERS CARD (3-Second Auto Switch) -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-bottom: 16px; min-height: 110px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 11px; color: #F58220; font-weight: 800;">🔥 HOT RECHARGE OFFER</span>
                <span style="font-size: 10px; color: #94a3b8;">ऑटो अपडेट 🔄</span>
            </div>
            <div id="rechargeOfferContent" style="transition: all 0.5s ease;">
                <h4 style="font-size: 16px; color: #fff;">${rechargeOffers[0].title}</h4>
                <p style="font-size: 13px; color: #38bdf8; font-weight: bold; margin: 2px 0;">${rechargeOffers[0].price}</p>
                <p style="font-size: 11px; color: #94a3b8;">${rechargeOffers[0].desc}</p>
            </div>
        </div>

        <!-- 4. COLOR-CHANGING NEW CONNECTION OFFER BANNER -->
        <div id="connectionBanner" class="app-card" style="background: linear-gradient(135deg, #0284c7, #0d9488); text-align: center; transition: background 1s ease; border: none;">
            <h3 style="font-size: 17px; color: #fff; margin-bottom: 4px;">🎉 नया वाई-फाई कनेक्शन ऑफर!</h3>
            <p style="font-size: 12px; color: #e0f2fe; margin-bottom: 12px;">अपने पड़ोसी या दोस्त को जोड़ें और पाएं ₹100 का डिस्काउंट</p>
            <button onclick="switchAppTab('connection', document.querySelectorAll('.nav-item')[3])" class="app-btn" style="background: #ffffff; color: #0f172a; font-weight: 800; padding: 10px; font-size: 13px;">
                अभी अप्लाई करें (Apply Now)
            </button>
        </div>
    `;

    // Initialize Icons
    if (window.lucide) window.lucide.createIcons();

    // 3-SECOND AUTO-SLIDE RECHARGE OFFERS LOGIC
    let currentOfferIndex = 0;
    rechargeInterval = setInterval(() => {
        currentOfferIndex = (currentOfferIndex + 1) % rechargeOffers.length;
        const offerBox = document.getElementById('rechargeOfferContent');
        if (offerBox) {
            offerBox.style.opacity = 0;
            setTimeout(() => {
                offerBox.innerHTML = `
                    <h4 style="font-size: 16px; color: #fff;">${rechargeOffers[currentOfferIndex].title}</h4>
                    <p style="font-size: 13px; color: #38bdf8; font-weight: bold; margin: 2px 0;">${rechargeOffers[currentOfferIndex].price}</p>
                    <p style="font-size: 11px; color: #94a3b8;">${rechargeOffers[currentOfferIndex].desc}</p>
                `;
                offerBox.style.opacity = 1;
            }, 250);
        }
    }, 3000);

    // COLORFUL GRADIENT CHANGING BANNER ANIMATION
    const bannerColors = [
        'linear-gradient(135deg, #0284c7, #0d9488)',
        'linear-gradient(135deg, #7c3aed, #db2777)',
        'linear-gradient(135deg, #ea580c, #d97706)'
    ];
    let colorIndex = 0;
    setInterval(() => {
        colorIndex = (colorIndex + 1) % bannerColors.length;
        const banner = document.getElementById('connectionBanner');
        if (banner) banner.style.background = bannerColors[colorIndex];
    }, 4000);
}
