/**
 * NextG WiFi - New Connection Module
 * File: src/modules/connection.js
 * Features: Real-Time Live Firestore Sync from Operator Portal, Dynamic Colorful Offer Cards, Instant Application Form Submissions
 */

// Preset vibrant gradient pairs for dynamic colorful cards
const CARD_GRADIENTS = [
    { bg: "linear-gradient(135deg, #7c3aed, #4c1d95)", accent: "#a855f7" },
    { bg: "linear-gradient(135deg, #0284c7, #0369a1)", accent: "#38bdf8" },
    { bg: "linear-gradient(135deg, #b91c1c, #7f1d1d)", accent: "#ef4444" },
    { bg: "linear-gradient(135deg, #059669, #064e3b)", accent: "#34d399" },
    { bg: "linear-gradient(135deg, #d97706, #78350f)", accent: "#fbbf24" },
    { bg: "linear-gradient(135deg, #db2777, #831843)", accent: "#f472b6" }
];

function renderConnectionModule(container) {
    if (!container) return;

    // Base UI Layout
    container.innerHTML = `
        <div class="connection-module-wrapper" style="max-width: 600px; margin: 0 auto; color: #fff; text-align: left; font-family: system-ui, -apple-system, sans-serif;">
            <div style="margin-bottom: 16px;">
                <h2 style="font-size: 20px; color: #ffffff; font-weight: 800; margin: 0 0 4px 0;">🌐 नया वाई-फ़ाई कनेक्शन (New WiFi Connection)</h2>
                <p style="font-size: 12px; color: #94a3b8; margin: 0;">ऑपरेटर के नए लाइव ऑफर्स देखें और घर बैठे कनेक्शन अप्लाई करें</p>
            </div>

            <!-- DYNAMIC COLORFUL OFFERS LIST CONTAINER -->
            <div id="connectionOffersContainer">
                <div style="text-align: center; padding: 30px; background: #1e293b; border-radius: 16px; border: 1px solid #334155;">
                    <p style="font-size: 13px; color: #38bdf8; margin: 0;">⏳ ऑपरेटर पोर्टल से लाइव कनेक्शन ऑफर्स लोड हो रहे हैं...</p>
                </div>
            </div>

            <!-- NEW CONNECTION BOOKING FORM -->
            <div class="app-card" style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-top: 20px; margin-bottom: 20px;">
                <h4 style="font-size: 15px; color: #fff; margin: 0 0 4px 0; font-weight: 700;">📝 नए कनेक्शन के लिए आवेदन करें</h4>
                <p style="font-size: 11px; color: #94a3b8; margin: 0 0 14px 0;">विवरण भरें, ऑपरेटर टीम 24 घंटे के अंदर कनेक्शन चालू कर देगी</p>

                <form id="newConnectionForm" onsubmit="handleNewConnectionSubmit(event)">
                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 11px; color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 4px;">चुना गया प्लान (Selected Offer)</label>
                        <input type="text" id="selectedPlanInput" placeholder="ऊपर दिए गए कार्ड्स में से 'Book Now' चुनें" readonly required style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #F58220; font-size: 12px; font-weight: bold; outline: none;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 11px; color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 4px;">आपका पूरा नाम (Full Name)</label>
                        <input type="text" id="custFullName" placeholder="उदा. राहुल शर्मा" required style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                    </div>

                    <div style="margin-bottom: 12px;">
                        <label style="font-size: 11px; color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 4px;">मोबाइल नंबर (Mobile Number)</label>
                        <input type="tel" id="custMobile" placeholder="10 अंकों का मोबाइल नंबर" required pattern="[0-9]{10}" style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; outline: none;">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="font-size: 11px; color: #cbd5e1; font-weight: bold; display: block; margin-bottom: 4px;">पूरा पता व लैंडमार्क (Address & Landmark)</label>
                        <textarea id="custAddress" placeholder="मकान नंबर, स्ट्रीट, क्षेत्र, निकटतम लैंडमार्क व पिनकोड..." rows="3" required style="width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; resize: none; outline: none;"></textarea>
                    </div>

                    <button type="submit" id="submitBookingBtn" class="app-btn" style="width: 100%; background: linear-gradient(135deg, #F58220, #e06f13); border: none; border-radius: 10px; color: #ffffff; font-weight: bold; font-size: 13px; padding: 12px; cursor: pointer;">
                        🚀 आवेदन सबमिट करें (Submit Request)
                    </button>
                </form>
            </div>
        </div>
    `;

    // Initialize Firestore Realtime Listener for Dynamic Offers
    listenToOperatorConnectionOffers();
}

/**
 * 1. Listen Live to Connection Offers Created in Operator Portal
 */
function listenToOperatorConnectionOffers() {
    const offersContainer = document.getElementById("connectionOffersContainer");
    if (!offersContainer) return;

    if (!window.db) {
        offersContainer.innerHTML = `
            <div style="background: #1e293b; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #ef4444;">
                <p style="font-size: 12px; color: #ef4444; margin: 0;">🔴 Database Connection Error: Firebase initialized नहीं है!</p>
            </div>
        `;
        return;
    }

    // Real-Time Listener on "connection_offers" Firestore collection
    window.db.collection("connection_offers")
        .where("status", "==", "ACTIVE")
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                offersContainer.innerHTML = `
                    <div style="background: #1e293b; padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #334155;">
                        <p style="font-size: 13px; color: #94a3b8; margin: 0;">वर्तमान में ऑपरेटर द्वारा कोई नया कनेक्शन ऑफर पोस्ट नहीं किया गया है।</p>
                    </div>
                `;
                return;
            }

            let htmlContent = "";
            let index = 0;

            snapshot.forEach((doc) => {
                const offer = doc.data();
                const offerId = doc.id;
                const gradientObj = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
                index++;

                const title = offer.title || "नया हाई-स्पीड कनेक्शन";
                const price = offer.price ? (typeof offer.price === 'number' ? `₹${offer.price}` : offer.price) : "₹0";
                const duration = offer.duration || "वैधता अनुसार";
                const speed = offer.speed || "Unlimited Speed";
                const benefits = offer.benefits || "फ्री इंस्टॉलेशन + फ्री वाई-फाई राउटर";
                const badge = offer.badge || "SPECIAL OFFER 🔥";

                htmlContent += `
                    <div class="connection-card" style="background: ${gradientObj.bg}; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 18px; margin-bottom: 16px; position: relative; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.35);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <h3 style="font-size: 16px; color: #ffffff; font-weight: 800; margin: 0;">${title}</h3>
                            <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(6px); color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 9px; border-radius: 10px; text-transform: uppercase;">${badge}</span>
                        </div>

                        <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px;">
                            <span style="font-size: 26px; font-weight: 900; color: #ffffff;">${price}</span>
                            <span style="font-size: 12px; color: #e2e8f0; font-weight: 600;">(${duration})</span>
                        </div>

                        <p style="font-size: 13px; color: #f8fafc; font-weight: 700; margin: 0 0 10px 0;">⚡ स्पीड: ${speed}</p>

                        <div style="background: rgba(0,0,0,0.25); padding: 10px 12px; border-radius: 10px; margin-bottom: 14px; font-size: 12px; color: #f1f5f9; display: flex; align-items: center; gap: 6px;">
                            <span>🎁 <strong>ऑफर लाभ:</strong> ${benefits}</span>
                        </div>

                        <button onclick="window.selectOfferForBooking('${title.replace(/'/g, "\\'")}', '${price}')" style="width: 100%; background: #ffffff; color: #0f172a; font-weight: 800; font-size: 13px; padding: 11px; border: none; border-radius: 10px; cursor: pointer; transition: 0.2s;">
                            यह कनेक्शन बुक करें (Book Now)
                        </button>
                    </div>
                `;
            });

            offersContainer.innerHTML = htmlContent;

        }, (error) => {
            console.error("Error fetching live connection offers:", error);
            offersContainer.innerHTML = `
                <div style="background: #1e293b; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #ef4444;">
                    <p style="font-size: 12px; color: #ef4444; margin: 0;">लाइव ऑफर्स लोड करने में त्रुटि: ${error.message}</p>
                </div>
            `;
        });
}

/**
 * 2. Select Offer & Auto Fill Input
 */
window.selectOfferForBooking = function(title, price) {
    const input = document.getElementById('selectedPlanInput');
    if (input) {
        input.value = `${title} (${price})`;
        const formContainer = document.getElementById('newConnectionForm');
        if (formContainer) {
            formContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

/**
 * 3. Handle Application Form Submission Direct to Firestore & Operator Admin Portal
 */
window.handleNewConnectionSubmit = async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBookingBtn');
    const selectedPlan = document.getElementById('selectedPlanInput').value;
    const fullName = document.getElementById('custFullName').value.trim();
    const mobile = document.getElementById('custMobile').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    if (!selectedPlan || !fullName || !mobile || !address) {
        alert("कृपया सभी आवश्यक फ़ील्ड भरें!");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "⏳ सबमिट किया जा रहा है...";
    }

    const applicationPayload = {
        applicationNum: "APP-" + Math.floor(100000 + Math.random() * 900000),
        selectedPlan: selectedPlan,
        customerName: fullName,
        customerPhone: mobile,
        address: address,
        status: "NEW_REQUEST",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    try {
        if (window.db) {
            // Write directly to operator_connection_requests for Operator Portal sync
            await window.db.collection("operator_connection_requests").add(applicationPayload);
        }

        alert(`🎉 आपका आवेदन (${applicationPayload.applicationNum}) सफलतापूर्वक जमा हो गया है! ऑपरेटर टीम जल्द आपसे संपर्क करेगी।`);
        
        const form = document.getElementById('newConnectionForm');
        if (form) form.reset();

    } catch (err) {
        console.error("Error submitting connection request:", err);
        alert("आवेदन जमा करने में त्रुटि आई। कृपया पुनः प्रयास करें।");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "🚀 आवेदन सबमिट करें (Submit Request)";
        }
    }
};

window.renderConnectionModule = renderConnectionModule;
