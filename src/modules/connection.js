/**
 * NextG WiFi - New Connection Module (src/modules/connection.js)
 * Dynamic Colorful Offer Cards & Application Form
 */

function renderConnectionModule(container) {
    // Mock Data from Operator Dashboard / Universal Portal
    const connectionOffers = [
        {
            id: "conn_1",
            title: "🎉 फेस्टिवल धमाका ऑफर",
            price: "₹1,499",
            duration: "3 महीने की वैधता",
            speed: "50 Mbps Unlimited",
            benefits: "फ्री Dual-Band Fiber Router + फ्री इंस्टॉलेशन",
            badge: "POPULAR 🔥",
            bgGradient: "linear-gradient(135deg, #7c3aed, #4c1d95)",
            accentColor: "#a855f7"
        },
        {
            id: "conn_2",
            title: "💎 6 Months Super Saver",
            price: "₹3,000",
            duration: "6 महीने की वैधता",
            speed: "100 Mbps Unlimited",
            benefits: "फ्री Giga-Fiber Router + OTT Apps फ्री",
            badge: "BEST VALUE ⚡",
            bgGradient: "linear-gradient(135deg, #0284c7, #0369a1)",
            accentColor: "#38bdf8"
        },
        {
            id: "conn_3",
            title: "🚀 Annual Enterprise Plan",
            price: "₹5,999",
            duration: "12 महीने की वैधता",
            speed: "200 Mbps Ultra Fast",
            benefits: "फ्री WiFi 6 Mesh Router + VIP Priority Support",
            badge: "MAX SPEED 👑",
            bgGradient: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
            accentColor: "#ef4444"
        }
    ];

    // Build Colorful New Connection Cards
    let offersHTML = connectionOffers.map(offer => `
        <div class="app-card" style="background: ${offer.bgGradient}; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; margin-bottom: 16px; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="font-size: 17px; color: #ffffff; font-weight: 800;">${offer.title}</h3>
                <span style="background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 10px;">${offer.badge}</span>
            </div>

            <div style="display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px;">
                <span style="font-size: 28px; font-weight: 900; color: #ffffff;">${offer.price}</span>
                <span style="font-size: 12px; color: #e2e8f0;">(${offer.duration})</span>
            </div>

            <p style="font-size: 13px; color: #f8fafc; font-weight: 700; margin-bottom: 10px;">⚡ स्पीड: ${offer.speed}</p>

            <div style="background: rgba(0,0,0,0.25); padding: 10px; border-radius: 10px; margin-bottom: 14px; font-size: 12px; color: #f1f5f9; display: flex; align-items: center; gap: 6px;">
                <span>🎁 <strong>ऑफर लाभ:</strong> ${offer.benefits}</span>
            </div>

            <button onclick="selectOfferForBooking('${offer.title}', '${offer.price}')" class="app-btn" style="background: #ffffff; color: #0f172a; font-weight: 800; font-size: 13px; padding: 10px;">
                यह कनेक्शन बुक करें (Book Now)
            </button>
        </div>
    `).join('');

    container.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h2 style="font-size: 20px; color: #ffffff; font-weight: 800;">नया वाई-फ़ाई कनेक्शन</h2>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 2px;">ऑपरेटर के नए ऑफर्स देखें और घर बैठे कनेक्शन अप्लाई करें</p>
        </div>

        <!-- COLORFUL OFFERS LIST FROM OPERATOR PORTAL -->
        ${offersHTML}

        <!-- NEW CONNECTION BOOKING FORM -->
        <div class="app-card" style="background: #1e293b; border: 1px solid #334155; margin-top: 20px; margin-bottom: 16px;">
            <h4 style="font-size: 16px; color: #fff; margin-bottom: 4px;">📝 नए कनेक्शन के लिए आवेदन करें</h4>
            <p style="font-size: 11px; color: #94a3b8; margin-bottom: 14px;">विवरण भरें, हमारी टीम 24 घंटे में कनेक्शन चालू कर देगी</p>

            <form onsubmit="handleNewConnectionSubmit(event)">
                <div style="margin-bottom: 10px;">
                    <label style="font-size: 11px; color: #cbd5e1; font-weight: bold;">चुना गया प्लान (Selected Offer)</label>
                    <input type="text" id="selectedPlanInput" value="🎉 फेस्टिवल धमाका ऑफर (₹1,499)" readonly style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #F58220; font-size: 12px; font-weight: bold;">
                </div>

                <div style="margin-bottom: 10px;">
                    <label style="font-size: 11px; color: #cbd5e1; font-weight: bold;">आपका नाम (Full Name)</label>
                    <input type="text" placeholder="उदा. राहुल कुमार" required style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                </div>

                <div style="margin-bottom: 10px;">
                    <label style="font-size: 11px; color: #cbd5e1; font-weight: bold;">मोबाइल नंबर (Mobile Number)</label>
                    <input type="tel" placeholder="10 अंकों का नंबर" required pattern="[0-9]{10}" style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px;">
                </div>

                <div style="margin-bottom: 14px;">
                    <label style="font-size: 11px; color: #cbd5e1; font-weight: bold;">पूरा पता व लैंडमार्क (Address & Landmark)</label>
                    <textarea placeholder="मकान नं., स्ट्रीट, क्षेत्र, पिनकोड" rows="3" required style="width: 100%; margin-top: 4px; padding: 8px 10px; border-radius: 8px; border: 1px solid #475569; background: #0f172a; color: #fff; font-size: 12px; resize: none;"></textarea>
                </div>

                <button type="submit" class="app-btn" style="background: #F58220; font-size: 13px; padding: 12px;">
                    आवेदन सबमिट करें (Submit Request)
                </button>
            </form>
        </div>
    `;

    // Global Functions for Actions
    window.selectOfferForBooking = function(title, price) {
        const input = document.getElementById('selectedPlanInput');
        if (input) {
            input.value = `${title} (${price})`;
            input.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.handleNewConnectionSubmit = function(e) {
        e.preventDefault();
        alert('🎉 आपका नए कनेक्शन का आवेदन सफलतापूर्वक जमा हो गया है! हमारी ऑपरेटर टीम जल्द आपसे संपर्क करेगी।');
    };
}
