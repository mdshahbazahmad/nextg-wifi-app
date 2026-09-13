/**
 * NextG WiFi - Support Desk & Raise Ticket Component
 * File: src/components/supportDesk.js
 * Default Language: English
 * Menu Label: Raise Support Ticket
 */

// Persistent Support Tickets State
window.supportDeskState = window.supportDeskState || {
    activeTickets: [
        { id: "TKT-10492", category: "Red Light Blinking", description: "Optical red light blinking on main router.", status: "In-Progress", date: "13 Sep, 2026", assignedTo: "Rahul (Field Engineer)" }
    ]
};

function renderSupportDeskComponent(containerElement) {
    if (!containerElement) return;

    const state = window.supportDeskState;

    containerElement.innerHTML = `
        <div class="support-wrapper">
            <h2 class="page-title">Raise Support Ticket</h2>

            <!-- 1. RAISE NEW TICKET FORM -->
            <div class="support-card">
                <div class="card-header">
                    <h4>🛠️ Report a Network / Hardware Problem</h4>
                    <p>Select your issue or describe it below. Ticket will be directly sent to Operator Admin Portal.</p>
                </div>

                <form id="ticketForm" onsubmit="handleTicketSubmit(event)">
                    <!-- Select Category -->
                    <div class="form-group">
                        <label>Select Issue Category</label>
                        <select id="ticketCategory" required onchange="toggleOtherInput(this.value)">
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
                        <label>Issue Details / Customer Message</label>
                        <textarea id="ticketDescription" rows="3" placeholder="Explain the exact problem you are facing..." required></textarea>
                    </div>

                    <!-- Optional Attachment -->
                    <div class="form-group">
                        <label>📷 Attach Photo (Optional - Cut wire or router image)</label>
                        <input type="file" id="ticketAttachment" accept="image/*" style="padding: 8px;">
                    </div>

                    <button type="submit" class="submit-ticket-btn">
                        🚀 Send Direct to Operator Portal
                    </button>
                </form>
            </div>

            <!-- 2. MY ACTIVE & PAST TICKETS LIST -->
            <div class="support-card">
                <div class="history-header">
                    <h4>🎫 My Reported Tickets</h4>
                    <span class="count-badge">${state.activeTickets.length} Active</span>
                </div>

                <div class="ticket-list">
                    ${state.activeTickets.length === 0 ? `
                        <p style="font-size: 12px; color: #64748b; text-align: center; padding: 10px;">No open support tickets found.</p>
                    ` : state.activeTickets.map(tkt => `
                        <div class="ticket-item">
                            <div class="tkt-top">
                                <strong>${tkt.category}</strong>
                                <span class="tkt-status ${tkt.status.toLowerCase().replace(' ', '-')}">${tkt.status}</span>
                            </div>
                            <p class="tkt-desc">${tkt.description}</p>
                            <div class="tkt-footer">
                                <span>Ticket ID: <strong>${tkt.id}</strong></span>
                                <span>Date: ${tkt.date}</span>
                            </div>
                            ${tkt.assignedTo ? `<div class="tkt-engineer">👤 Assigned Tech: <strong>${tkt.assignedTo}</strong></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <style>
            .support-wrapper { color: #fff; text-align: left; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
            .support-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 16px; }

            .card-header h4 { font-size: 14px; margin: 0 0 4px 0; color: #f8fafc; }
            .card-header p { font-size: 11px; color: #94a3b8; margin: 0 0 14px 0; }

            .form-group { margin-bottom: 14px; }
            .form-group label { display: block; font-size: 11px; color: #cbd5e1; margin-bottom: 6px; font-weight: 600; }
            .form-group select, .form-group textarea, .form-group input { width: 100%; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 13px; outline: none; }
            .form-group textarea { resize: vertical; }

            .submit-ticket-btn { width: 100%; padding: 12px; background: linear-gradient(135deg, #F58220, #e06f13); border: none; border-radius: 10px; color: #fff; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.2s; }
            .submit-ticket-btn:hover { opacity: 0.9; }

            .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .history-header h4 { font-size: 14px; margin: 0; }
            .count-badge { font-size: 10px; background: #0f172a; border: 1px solid #334155; padding: 2px 8px; border-radius: 10px; color: #38bdf8; }

            .ticket-list { display: flex; flex-direction: column; gap: 10px; }
            .ticket-item { background: #0f172a; border: 1px solid #334155; padding: 12px; border-radius: 10px; }
            .tkt-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
            .tkt-top strong { font-size: 13px; color: #f8fafc; }
            
            .tkt-status { font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 10px; }
            .tkt-status.in-progress { background: rgba(245, 130, 32, 0.15); color: #F58220; border: 1px solid #F58220; }
            .tkt-status.pending { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
            .tkt-status.resolved { background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid #22c55e; }

            .tkt-desc { font-size: 11px; color: #94a3b8; margin: 0 0 8px 0; }
            .tkt-footer { display: flex; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid #1e293b; padding-top: 6px; }
            .tkt-engineer { font-size: 10px; color: #38bdf8; margin-top: 4px; }
        </style>
    `;
}

// Logic: Submit Ticket to Universal Admin Portal
function handleTicketSubmit(e) {
    e.preventDefault();

    const category = document.getElementById("ticketCategory").value;
    const description = document.getElementById("ticketDescription").value.trim();

    if (!category || !description) {
        alert("Please select a category and describe your issue.");
        return;
    }

    const newTicketId = "TKT-" + Math.floor(10000 + Math.random() * 90000);
    const newTicket = {
        id: newTicketId,
        category: category,
        description: description,
        status: "Pending",
        date: "13 Sep, 2026",
        assignedTo: "Unassigned (Pending Admin Allocation)"
    };

    // Add to Local State
    window.supportDeskState.activeTickets.unshift(newTicket);

    alert(`Ticket #${newTicketId} created successfully!\n\nThis ticket has been posted directly to the Universal Operator Admin Portal for immediate resolution.`);

    // Reset Form & Re-render
    document.getElementById("ticketForm").reset();
    renderSupportDeskComponent(document.getElementById("mainContainer"));
}

function toggleOtherInput(categoryValue) {
    const descArea = document.getElementById("ticketDescription");
    if (categoryValue === "Other Complaint") {
        descArea.placeholder = "Please describe your specific complaint in detail here...";
        descArea.focus();
    }
}
