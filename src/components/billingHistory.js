/**
 * NextG WiFi - Invoices & Billing Component
 * File: src/components/billingHistory.js
 * Default Language: English
 * Menu Label: Invoices & Billing
 */

// Persistent Billing State
window.billingState = window.billingState || {
    currentPlan: "NextG Speed Unlimited 100 Mbps",
    monthlyAmount: "₹699",
    dueDate: "28 Sep, 2026",
    autoPayStatus: false,
    invoices: [
        { id: "INV-2026-08", month: "August 2026", date: "28 Aug 2026", amount: "₹699", status: "Paid", method: "UPI / PhonePe" },
        { id: "INV-2026-07", month: "July 2026", date: "28 Jul 2026", amount: "₹699", status: "Paid", method: "Credit Card" },
        { id: "INV-2026-06", month: "June 2026", date: "28 Jun 2026", amount: "₹699", status: "Paid", method: "NetBanking" },
        { id: "INV-2026-05", month: "May 2026", date: "28 May 2026", amount: "₹699", status: "Paid", method: "UPI / Paytm" }
    ]
};

function renderBillingHistoryComponent(containerElement) {
    if (!containerElement) return;

    const state = window.billingState;

    containerElement.innerHTML = `
        <div class="billing-wrapper">
            <!-- Exact Title Matching: Invoices & Billing -->
            <h2 class="page-title">Invoices & Billing</h2>

            <!-- 1. CURRENT BILLING SUMMARY -->
            <div class="billing-card highlight-card">
                <div class="card-top">
                    <div>
                        <span class="plan-tag">ACTIVE PLAN</span>
                        <h3 class="plan-title">${state.currentPlan}</h3>
                    </div>
                    <span class="plan-price">${state.monthlyAmount}<span>/mo</span></span>
                </div>

                <div class="due-info-box">
                    <div>
                        <small>Next Billing Date</small>
                        <strong>${state.dueDate}</strong>
                    </div>
                    <button class="pay-now-btn" onclick="payUpcomingBill()">Pay Bill Now</button>
                </div>

                <div class="autopay-row">
                    <span>🔄 Auto-Pay Next Month's Bill</span>
                    <label class="switch">
                        <input type="checkbox" id="autoPayToggle" ${state.autoPayStatus ? 'checked' : ''} onchange="toggleAutoPay(this.checked)">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>

            <!-- 2. INVOICES LIST & GST RECEIPTS -->
            <div class="billing-card">
                <div class="history-header">
                    <h4>📄 GST Invoices & Receipts</h4>
                    <span class="count-badge">${state.invoices.length} Invoices</span>
                </div>

                <div class="invoice-list">
                    ${state.invoices.map(inv => `
                        <div class="invoice-item">
                            <div class="inv-left">
                                <div class="inv-icon">📄</div>
                                <div class="inv-details">
                                    <strong>${inv.month} (${inv.id})</strong>
                                    <span>${inv.date} • ${inv.method}</span>
                                </div>
                            </div>
                            <div class="inv-right">
                                <span class="inv-amount">${inv.amount}</span>
                                <span class="status-badge paid">✓ ${inv.status}</span>
                                <button class="download-btn" onclick="downloadInvoicePDF('${inv.id}')" title="Download GST Receipt">📥 PDF</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <style>
            .billing-wrapper { color: #fff; text-align: left; }
            .page-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
            .billing-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 16px; }
            .highlight-card { background: linear-gradient(135deg, #1e293b, #0f172a); border-color: #F58220; }

            .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
            .plan-tag { font-size: 9px; font-weight: bold; background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid #22c55e; padding: 2px 8px; border-radius: 12px; }
            .plan-title { font-size: 15px; margin: 6px 0 0 0; color: #f8fafc; }
            .plan-price { font-size: 20px; font-weight: bold; color: #F58220; }
            .plan-price span { font-size: 11px; color: #94a3b8; }

            .due-info-box { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 14px; border-radius: 12px; border: 1px solid #334155; }
            .due-info-box small { font-size: 10px; color: #94a3b8; display: block; }
            .due-info-box strong { font-size: 13px; color: #f8fafc; }
            .pay-now-btn { background: #F58220; border: none; padding: 8px 14px; border-radius: 8px; color: #fff; font-weight: bold; font-size: 12px; cursor: pointer; }

            .autopay-row { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid #334155; font-size: 12px; color: #cbd5e1; }

            /* Toggle Switch */
            .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .3s; border-radius: 20px; }
            .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
            input:checked + .slider { background-color: #16a34a; }
            input:checked + .slider:before { transform: translateX(20px); }

            .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
            .history-header h4 { font-size: 14px; margin: 0; }
            .count-badge { font-size: 10px; background: #0f172a; border: 1px solid #334155; padding: 2px 8px; border-radius: 10px; color: #38bdf8; }

            .invoice-list { display: flex; flex-direction: column; gap: 10px; }
            .invoice-item { display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px; border-radius: 10px; border: 1px solid #334155; }
            .inv-left { display: flex; align-items: center; gap: 10px; }
            .inv-icon { font-size: 18px; background: #1e293b; padding: 6px; border-radius: 8px; }
            .inv-details strong { font-size: 12px; color: #f8fafc; display: block; }
            .inv-details span { font-size: 10px; color: #64748b; }

            .inv-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
            .inv-amount { font-size: 13px; font-weight: bold; color: #f8fafc; }
            .status-badge.paid { font-size: 9px; color: #22c55e; }
            .download-btn { background: #1e293b; border: 1px solid #334155; color: #38bdf8; padding: 2px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; }
            .download-btn:hover { border-color: #38bdf8; }
        </style>
    `;
}

// Logic 1: Download Invoice PDF
function downloadInvoicePDF(invoiceId) {
    alert(`Downloading GST Invoice Receipt for ${invoiceId}...`);
}

// Logic 2: Toggle Auto-Pay
function toggleAutoPay(isAuto) {
    window.billingState.autoPayStatus = isAuto;
    alert(isAuto ? "Auto-Pay Enabled!" : "Auto-Pay Disabled.");
}

// Logic 3: Pay Upcoming Bill
function payUpcomingBill() {
    alert("Opening Payment Gateway...");
}
