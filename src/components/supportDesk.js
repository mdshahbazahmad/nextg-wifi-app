/**
 * NextG WiFi - Support Desk & Direct Operator Complaint Component
 * File: src/components/supportDesk.js
 * Default Language: English / Auto-adaptive
 * Features: Direct Real-Time Firebase Sync to Operator Admin Portal
 */

function renderSupportDeskComponent(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <div class="support-wrapper">
            <h2 class="page-title">Raise Support Ticket</h2>

            <!-- 1. RAISE NEW TICKET FORM -->
            <div class="support-card">
                <div class="card-header">
                    <h4>🛠️ Report a Network / Hardware Problem</h4>
                    <p>Select your issue or describe it below. Ticket will be directly sent to Operator Admin Portal.</p>
                </div>

                <form id="ticketForm">
                    <!-- Select Category -->
                    <div class="form-group">
                        <label for="ticketCategory">Select Issue Category</label>
                        <select id="ticketCategory" required>
                            <option value="">-- Choose Category --</option>
                            <option value="Red Light Blinking">🔴 Red Light Blinking on Router</option>
                            <option value="Fiber Cable Cut / Damaged">✂️ Fiber Cable Cut / Damaged Wire</option>
                            <option value="Slow Internet Speed">🐢 Slow Internet Speed / High Ping</option>
                            <option value="No WiFi Signal">📶 No WiFi Signal / Router Issue</option>
                            <option value="Billing / Payment Issue">💳 Billing or Recharge Issue</option>
                            <option value="Other Complaint">✍️ Other Issue (Describe below)</option>
                        </select>
                    </div>

                    <!-- Custom Issue Description -->
                    <div class="form-group">
                        <label for="ticketDescription">Issue Details / Customer Message</label>
                        <textarea id="ticketDescription" rows="3" placeholder="Explain the exact problem you are facing..." required></textarea>
                    </div>

                    <!-- Optional Attachment -->
                    <div class="form-group">
                        <label for="ticketAttachment">📷 Attach Photo (Optional - Cut wire or router image)</label>
                        <input type="file" id="ticketAttachment" accept="image/*" style="padding: 8px;">
                    </div>

                    <button type="submit" class="submit-ticket-btn" id="submitTicketBtn">
                        🚀 Send Direct to Operator Portal
                    </button>
                </form>
            </div>

            <!-- 2. MY ACTIVE & PAST TICKETS LIST -->
            <div class="support-card">
                <div class="history-header">
                    <h4>🎫 My Reported Tickets</h4>
                    <span class="count-badge" id="ticketCountBadge">Loading...</span>
                </div>

                <div class="ticket-list" id="ticketListContainer">
                    <p style="font-size: 12px; color: #94a3b8; text-align: center; padding: 15px;">Fetching live tickets from server...</p>
                </div>
            </div>
        </div>

        <!-- SUCCESS POPUP / NOTIFICATION MODAL -->
        <div id="ticketSuccessModal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-icon">✅</div>
                <h3>Complaint Submitted!</h3>
                <p id="modalMessageText">Your complaint has been registered and directly sent to the Operator Admin Portal for immediate resolution.</p>
                <button class="modal-close-btn" id="closeModalBtn">Okay, Got It</button>
            </div>
        </div>

        <style>
            .support-wrapper { color: #fff; text-align: left; font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
            .support-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 16px; }

            .card-header h4 { font-size: 14px; margin: 0 0 4px 0; color: #f8fafc; }
            .card-header p { font-size: 11px; color: #94a3b8; margin: 0 0 14px 0; }

            .form-group { margin-bottom: 14px; }
            .form-group label { display: block; font-size: 11px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
            .form-group select, .form-group textarea, .form-group input { width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 13px; outline: none; }
            .form-group textarea { resize: vertical; }

            .submit-ticket-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #F58220, #e06f13); border: none; border-radius: 10px; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s; }
            .submit-ticket-btn:hover { opacity: 0.95; transform: translateY(-1px); }
            .submit-ticket-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .history-header h4 { font-size: 14px; margin: 0; }
            .count-badge { font-size: 10px; background: #0f172a; border: 1px solid #334155; padding: 2px 8px; border-radius: 10px; color: #38bdf8; }

            .ticket-list { display: flex; flex-direction: column; gap: 10px; }
            .ticket-item { background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 10px; }
            .tkt-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
            .tkt-top strong { font-size: 13px; color: #f8fafc; }
            
            .tkt-status { font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 10px; text-transform: capitalize; }
            .tkt-status.in-progress { background: rgba(245, 130, 32, 0.15); color: #F58220; border: 1px solid #F58220; }
            .tkt-status.pending { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
            .tkt-status.resolved { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid #22c55e; }

            .tkt-desc { font-size: 11px; color: #94a3b8; margin: 0 0 8px 0; }
            .tkt-footer { display: flex; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 6px; }
            .tkt-engineer { font-size: 10px; color: #38bdf8; margin-top: 4px; }

            /* POPUP NOTIFICATION MODAL STYLES */
            .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.75); align-items: center; justify-content: center; z-index: 9999; }
            .modal-overlay.active { display: flex; }
            .modal-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; width: 90%; max-width: 380px; padding: 20px; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); }
            .modal-icon { font-size: 40px; margin-bottom: 10px; }
            .modal-card h3 { color: #fff; margin: 0 0 8px 0; font-size: 16px; }
            .modal-card p { color: #94a3b8; font-size: 12px; margin: 0 0 16px 0; line-height: 1.4; }
            .modal-close-btn { width: 100%; padding: 10px; background: #38bdf8; color: #0f172a; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; }
        </style>
    `;

    // Fetch live user tickets and set submit listeners
    fetchAndListenUserTickets(containerElement);
    bindSupportDeskEvents(containerElement);
}

// 1. Fetch Real-time Live Complaints from Firestore
function fetchAndListenUserTickets(container) {
    const user = firebase.auth().currentUser;
    const ticketContainer = container.querySelector('#ticketListContainer');
    const countBadge = container.querySelector('#ticketCountBadge');

    if (!user) {
        if (ticketContainer) ticketContainer.innerHTML = `<p style="font-size: 12px; color: #ef4444; text-align: center;">Please sign in to view your tickets.</p>`;
        if (countBadge) countBadge.textContent = '0 Active';
        return;
    }

    // Real-time listener for customer tickets
    window.db.collection("support_tickets")
        .where("userId", "==", user.uid)
        .onSnapshot((snapshot) => {
            const tickets = [];
            snapshot.forEach((doc) => {
                tickets.push({ id: doc.id, ...doc.data() });
            });

            // Sort newest first
            tickets.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

            if (countBadge) countBadge.textContent = `${tickets.length} Active`;
            if (ticketContainer) ticketContainer.innerHTML = renderTicketItems(tickets);
        }, (error) => {
            console.error("Error fetching live support tickets:", error);
            if (ticketContainer) ticketContainer.innerHTML = `<p style="font-size: 12px; color: #ef4444; text-align: center;">Failed to load tickets.</p>`;
        });
}

// Helper: Render HTML list for tickets
function renderTicketItems(tickets) {
    if (!tickets || tickets.length === 0) {
        return `<p style="font-size: 12px; color: #64748b; text-align: center; padding: 15px;">No complaints registered yet.</p>`;
    }
    return tickets.map(tkt => {
        const statusClass = (tkt.status || 'Pending').toLowerCase().replace(/\s+/g, '-');
        return `
            <div class="ticket-item">
                <div class="tkt-top">
                    <strong>${tkt.category}</strong>
                    <span class="tkt-status ${statusClass}">${tkt.status || 'Pending'}</span>
                </div>
                <p class="tkt-desc">${tkt.description}</p>
                <div class="tkt-footer">
                    <span>Ticket ID: <strong>${tkt.ticketNum || tkt.id}</strong></span>
                    <span>Date: ${tkt.date}</span>
                </div>
                ${tkt.assignedTo ? `<div class="tkt-engineer">👤 Assigned Tech: <strong>${tkt.assignedTo}</strong></div>` : ''}
            </div>
        `;
    }).join('');
}

// 2. Event Listeners & Direct Operator Portal Dispatch
function bindSupportDeskEvents(container) {
    const form = container.querySelector('#ticketForm');
    const categorySelect = container.querySelector('#ticketCategory');
    const descArea = container.querySelector('#ticketDescription');
    const modal = container.querySelector('#ticketSuccessModal');
    const closeModalBtn = container.querySelector('#closeModalBtn');
    const submitBtn = container.querySelector('#submitTicketBtn');

    if (categorySelect && descArea) {
        categorySelect.addEventListener('change', (e) => {
            if (e.target.value === "Other Complaint") {
                descArea.placeholder = "Please describe your specific complaint in detail here...";
                descArea.focus();
            } else {
                descArea.placeholder = "Explain the exact problem you are facing...";
            }
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const user = firebase.auth().currentUser;
            if (!user) {
                alert("कृपया शिकायत दर्ज करने से पहले लॉगिन करें!");
                return;
            }

            const category = categorySelect.value;
            const description = descArea.value.trim();

            if (!category || !description) return;

            submitBtn.disabled = true;
            submitBtn.textContent = "⏳ Sending to Operator...";

            const now = new Date();
            const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            const ticketIdNum = "TKT-" + Math.floor(100000 + Math.random() * 900000);

            // Fetch user profile data if available
            const savedProfile = JSON.parse(localStorage.getItem('userProfileData')) || {};

            const ticketPayload = {
                ticketNum: ticketIdNum,
                userId: user.uid,
                userEmail: user.email || savedProfile.email || "N/A",
                userName: savedProfile.name || user.displayName || "NextG Customer",
                userPhone: savedProfile.phone || user.phoneNumber || "N/A",
                userAddress: savedProfile.address || "N/A",
                category: category,
                description: description,
                status: "Pending",
                date: dateStr,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                assignedTo: "Pending Allocation (Operator Portal)"
            };

            try {
                // Batch Write: Push to both support_tickets (Customer View) and operator_complaints (Admin Operator Portal)
                const batch = window.db.batch();

                const ticketRef = window.db.collection("support_tickets").doc();
                batch.set(ticketRef, ticketPayload);

                const operatorRef = window.db.collection("operator_complaints").doc(ticketRef.id);
                batch.set(operatorRef, { ...ticketPayload, operatorStatus: "UNREAD" });

                await batch.commit();

                // Reset Form
                form.reset();

                // Show Success Modal
                const modalMsg = container.querySelector('#modalMessageText');
                if (modalMsg) {
                    modalMsg.innerHTML = `Ticket <strong>#${ticketIdNum}</strong> has been registered and directly sent to the Operator Admin Portal for immediate action.`;
                }
                if (modal) modal.classList.add('active');

            } catch (error) {
                console.error("Firestore Error on Ticket Dispatch:", error);
                alert("शिकायत दर्ज करने में त्रुटि हुई: " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "🚀 Send Direct to Operator Portal";
            }
        });
    }
}

window.renderSupportDeskComponent = renderSupportDeskComponent;
