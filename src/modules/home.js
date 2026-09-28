/**
 * NextG WiFi - Main Home Dashboard Module
 * File: src/modules/home.js
 * Features: 100% Real-time Firestore Sync with Operator Admin Portal.
 * Zero hardcoded dummy/demo data - pure production dynamic rendering.
 */

let rechargeInterval = null;
let bannerInterval = null;
let unsubscribeUserPlan = null;
let unsubscribeOperatorAlerts = null;
let unsubscribeRechargeOffers = null;

function renderHomeModule(container) {
    if (!container) return;

    // 1. Clear previous intervals and listeners on view change to prevent memory leaks
    clearHomeSubscriptions();

    // Initial HTML Layout
    container.innerHTML = `
        <div class="home-wrapper" style="max-width: 600px; margin: 0 auto; color: #fff; text-align: left; font-family: system-ui, -apple-system, sans-serif;">
            
            <!-- 1. LIVE ACTIVE PLAN STATUS CARD -->
            <div id="homeActivePlanCard" class="app-card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border-left: 4px solid #F58220; border-radius: 16px; padding: 18px; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 11px; color: #94a3b8; font-weight: 800; letter-spacing: 0.5px;">ACTIVE CONNECTION</span>
                    <span id="planStatusBadge" style="background: rgba(148, 163, 184, 0.2); color: #94a3b8; font-size: 10px; padding: 3px 8px; border-radius: 12px; font-weight: 800;">● FETCHING...</span>
                </div>
                <h3 id="planNameText" style="font-size: 18px; color: #ffffff; margin: 0 0 4px 0; font-weight: 700;">प्लांट डेटा लोड हो रहा है...</h3>
                <p id="planSpeedText" style="color: #38bdf8; font-weight: 700; font-size: 13px; margin: 0 0 14px 0;">⚡ Speed: --</p>
                
                <div style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 12px; text-align: center;">
                    <div style="flex: 1;">
                        <p style="font-size: 10px; color: #94a3b8; margin: 0 0 2px 0;">वैधता (Valid Till)</p>
                        <p id="planValidTillText" style="font-size: 13px; font-weight: bold; color: #fff; margin: 0;">--</p>
                    </div>
                    <div style="border-left: 1px solid #334155; padding-left: 12px; flex: 1;">
                        <p style="font-size: 10px; color: #94a3b8; margin: 0 0 2px 0;">बाकी दिन (Days Left)</p>
                        <p id="planDaysLeftText" style="font-size: 13px; font-weight: bold; color: #F58220; margin: 0;">--</p>
                    </div>
                </div>
            </div>

            <!-- 2. OPERATOR DYNAMIC NOTIFICATION / ALERT CONTAINER -->
            <div id="homeOperatorNoticeContainer"></div>

            <!-- 3. OPERATOR AUTO-SLIDING RECHARGE OFFERS CARD -->
            <div id="homeRechargeOffersCard" class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; margin-bottom: 16px; min-height: 100px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 11px; color: #F58220; font-weight: 800; letter-spacing: 0.5px;">🔥 LIVE RECHARGE OFFER</span>
                    <span style="font-size: 10px; color: #94a3b8;">ऑटो सिंक 🔄</span>
                </div>
                <div id="rechargeOfferContent" style="transition: opacity 0.4s ease;">
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">पोर्टल से नए ऑफर्स लोड हो रहे हैं...</p>
                </div>
            </div>

            <!-- 4. COLOR-CHANGING NEW CONNECTION PROMO BANNER -->
            <div id="connectionBanner" class="app-card" style="background: linear-gradient(135deg, #0284c7, #0d9488); border-radius: 16px; padding: 18px; text-align: center; transition: background 1s ease; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h3 id="promoBannerTitle" style="font-size: 16px; color: #fff; margin: 0 0 4px 0; font-weight: 800;">🎉 नया वाई-फाई कनेक्शन लें!</h3>
                <p id="promoBannerDesc" style="font-size: 12px; color: #e0f2fe; margin: 0 0 14px 0;">हाई-स्पीड ब्रॉडबैंड कनेक्शन के लिए आज ही ऑनलाइन आवेदन करें</p>
                <button onclick="if(typeof switchAppTab === 'function') switchAppTab('connection', document.querySelectorAll('.nav-item')[3]); else if(typeof window.switchAppTab === 'function') window.switchAppTab('connection');" style="background: #ffffff; color: #0f172a; font-weight: 800; padding: 10px 16px; font-size: 12px; border: none; border-radius: 8px; cursor: pointer;">
                    अभी ऑनलाइन बुक करें (Apply Now)
                </button>
            </div>
        </div>
    `;

    // Initialize Lucide Icons if available
    if (window.lucide) window.lucide.createIcons();

    // Start Dynamic Color Transition Animation for Banner
    startBannerColorAnimation();

    // Attach Real-time Firestore Sync Listeners
    setupHomeRealtimeSync();
}

/**
 * Cleanup helper for intervals and subscriptions
 */
function clearHomeSubscriptions() {
    if (rechargeInterval) clearInterval(rechargeInterval);
    if (bannerInterval) clearInterval(bannerInterval);
    if (unsubscribeUserPlan) unsubscribeUserPlan();
    if (unsubscribeOperatorAlerts) unsubscribeOperatorAlerts();
    if (unsubscribeRechargeOffers) unsubscribeRechargeOffers();
}

/**
 * Real-time Firestore Data Fetchers
 */
function setupHomeRealtimeSync() {
    if (!window.db || !firebase.auth().currentUser) {
        // Fallback for non-logged in or guest user state
        updateActivePlanUI(null);
        listenToPortalNoticeAlerts();
        listenToPortalRechargeOffers();
        return;
    }

    const user = firebase.auth().currentUser;

    // 1. Real-time User Active Subscription Plan
    unsubscribeUserPlan = window.db.collection("user_subscriptions")
        .doc(user.uid)
        .onSnapshot((doc) => {
            if (doc.exists) {
                updateActivePlanUI(doc.data());
            } else {
                updateActivePlanUI(null);
            }
        }, (err) => {
            console.error("Error loading user plan:", err);
            updateActivePlanUI(null);
        });

    // 2. Real-time Portal Notices / Alerts
    listenToPortalNoticeAlerts();

    // 3. Real-time Operator Recharge Offers
    listenToPortalRechargeOffers();
}

/**
 * 1. Update Active Plan UI
 */
function updateActivePlanUI(planData) {
    const statusBadge = document.getElementById("planStatusBadge");
    const planName = document.getElementById("planNameText");
    const planSpeed = document.getElementById("planSpeedText");
    const planValidTill = document.getElementById("planValidTillText");
    const planDaysLeft = document.getElementById("planDaysLeftText");

    if (!planName) return;

    if (planData) {
        const isActive = planData.status === "ACTIVE" || planData.status === "Active";
        
        if (statusBadge) {
            statusBadge.style.background = isActive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)";
            statusBadge.style.color = isActive ? "#10b981" : "#ef4444";
            statusBadge.textContent = isActive ? "● ACTIVE" : "● EXPIRED";
        }

        planName.textContent = planData.planName || "सक्रिय प्लान उपलब्ध है";
        planSpeed.textContent = `⚡ Speed: ${planData.speed || 'Standard Speed'}`;
        planValidTill.textContent = planData.validTill || "N/A";
        planDaysLeft.textContent = `${planData.daysRemaining !== undefined ? planData.daysRemaining : 0} दिन`;
    } else {
        if (statusBadge) {
            statusBadge.style.background = "rgba(245, 130, 32, 0.2)";
            statusBadge.style.color = "#F58220";
            statusBadge.textContent = "● NO PLAN";
        }

        planName.textContent = "कोई सक्रिय रिचार्ज प्लान नहीं है";
        planSpeed.textContent = "⚡ Speed: --";
        planValidTill.textContent = "--";
        planDaysLeft.textContent = "0 दिन";
    }
}

/**
 * 2. Listen to Portal Broadcast Notices & Alerts
 */
function listenToPortalNoticeAlerts() {
    const noticeContainer = document.getElementById("homeOperatorNoticeContainer");
    if (!noticeContainer || !window.db) return;

    unsubscribeOperatorAlerts = window.db.collection("portal_notices")
        .where("status", "==", "ACTIVE")
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                noticeContainer.innerHTML = "";
                return;
            }

            let noticeHTML = "";
            snapshot.forEach((doc) => {
                const notice = doc.data();
                noticeHTML += `
                    <div class="app-card" style="background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-left: 4px solid #ef4444; border-radius: 12px; padding: 12px 14px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; gap: 6px; color: #f87171; font-weight: 700; font-size: 12px; margin-bottom: 4px;">
                            <span>⚠️ ${notice.title || "नेटवर्क सूचना (Operator Notice)"}</span>
                        </div>
                        <p style="font-size: 12px; color: #fca5a5; line-height: 1.4; margin: 0;">${notice.message}</p>
                    </div>
                `;
            });

            noticeContainer.innerHTML = noticeHTML;
        }, (err) => {
            console.error("Notice sync error:", err);
        });
}

/**
 * 3. Listen to Operator Portal Live Recharge Offers and Auto-Slide
 */
function listenToPortalRechargeOffers() {
    const offerContent = document.getElementById("rechargeOfferContent");
    if (!offerContent || !window.db) return;

    unsubscribeRechargeOffers = window.db.collection("operator_recharge_offers")
        .where("status", "==", "ACTIVE")
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                offerContent.innerHTML = `
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">वर्तमान में कोई नया ऑफर उपलब्ध नहीं है।</p>
                `;
                if (rechargeInterval) clearInterval(rechargeInterval);
                return;
            }

            const offers = [];
            snapshot.forEach((doc) => offers.push(doc.data()));

            let currentOfferIndex = 0;

            const renderOffer = (idx) => {
                const item = offers[idx];
                offerContent.style.opacity = 0;
                setTimeout(() => {
                    offerContent.innerHTML = `
                        <h4 style="font-size: 15px; color: #fff; margin: 0 0 2px 0; font-weight: 700;">${item.title || 'स्पेशल प्लान'}</h4>
                        <p style="font-size: 13px; color: #38bdf8; font-weight: bold; margin: 0 0 4px 0;">${item.price || '₹0'} ${item.validity ? '/ ' + item.validity : ''}</p>
                        <p style="font-size: 11px; color: #94a3b8; margin: 0;">${item.desc || 'अनलिमिटेड डेटा और हाई-स्पीड स्पीड'}</p>
                    `;
                    offerContent.style.opacity = 1;
                }, 200);
            };

            renderOffer(0);

            if (rechargeInterval) clearInterval(rechargeInterval);
            if (offers.length > 1) {
                rechargeInterval = setInterval(() => {
                    currentOfferIndex = (currentOfferIndex + 1) % offers.length;
                    renderOffer(currentOfferIndex);
                }, 3500);
            }

        }, (err) => {
            console.error("Recharge offer sync error:", err);
            offerContent.innerHTML = `<p style="font-size: 12px; color: #ef4444; margin: 0;">ऑफर्स लोड करने में असमर्थ</p>`;
        });
}

/**
 * Colorful Banner Animation
 */
function startBannerColorAnimation() {
    const bannerColors = [
        'linear-gradient(135deg, #0284c7, #0d9488)',
        'linear-gradient(135deg, #7c3aed, #db2777)',
        'linear-gradient(135deg, #ea580c, #d97706)'
    ];
    let colorIndex = 0;
    
    bannerInterval = setInterval(() => {
        colorIndex = (colorIndex + 1) % bannerColors.length;
        const banner = document.getElementById('connectionBanner');
        if (banner) banner.style.background = bannerColors[colorIndex];
    }, 4000);
}

window.renderHomeModule = renderHomeModule;
