// src/modules/recharge.js
import { showToast } from './sidebar.js';

// यह डेटा एडमिन पोर्टल / डेटाबेस से dynamic आएगा
const samplePlansFromAdmin = [
  {
    id: 'plan_1',
    title: 'Super Fiber Starter',
    speed: '50 Mbps',
    validity: '30 Days',
    price: 499,
    badge: 'Popular',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'plan_2',
    title: 'Ultra Unlimited Plan',
    speed: '100 Mbps',
    validity: '30 Days',
    price: 699,
    badge: 'Best Value',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'plan_3',
    title: 'Giga Family Annual Offer',
    speed: '200 Mbps',
    validity: '365 Days',
    price: 6999,
    badge: '1 Month Free',
    color: 'from-amber-500 to-orange-600'
  }
];

export function initRechargeModule() {
  const container = document.getElementById('rechargePlansContainer');
  if (!container) return;

  // 1. Admin के डेटा को Color Card में Render करना
  container.innerHTML = samplePlansFromAdmin.map(plan => `
    <div class="bg-gradient-to-r ${plan.color} text-white p-4 rounded-2xl shadow-lg relative overflow-hidden flex justify-between items-center">
      <span class="absolute top-2 right-2 bg-white/20 backdrop-blur-md text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">${plan.badge}</span>
      <div>
        <h4 class="font-extrabold text-sm">${plan.title}</h4>
        <p class="text-xs text-white/90 font-medium">${plan.speed} • Unlimited Data</p>
        <span class="text-[11px] bg-black/20 px-2 py-0.5 rounded-md inline-block mt-1">Validity: ${plan.validity}</span>
      </div>
      <div class="text-right">
        <p class="text-xl font-black">₹${plan.price}</p>
        <button data-plan-id="${plan.id}" class="btnPayTrigger mt-1 bg-white text-gray-900 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:bg-gray-100 transition-all active:scale-95">
          Pay Now
        </button>
      </div>
    </div>
  `).join('');

  // 2. Pay Now बटन का क्लिक इवेंट (Modal Open करना)
  document.querySelectorAll('.btnPayTrigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planId = e.currentTarget.getAttribute('data-plan-id');
      const selectedPlan = samplePlansFromAdmin.find(p => p.id === planId);
      openPaymentModal(selectedPlan);
    });
  });

  setupPaymentHandlers();
}

function openPaymentModal(plan) {
  const modal = document.getElementById('paymentGatewayModal');
  const title = document.getElementById('payPlanTitle');
  const amount = document.getElementById('payPlanAmount');

  if (modal && title && amount) {
    title.innerText = plan.title;
    amount.innerText = `₹${plan.price}`;
    modal.classList.remove('hidden');
  }
}

// PhonePe / Paytm / GPay / QR Direct Trigger Setup
function setupPaymentHandlers() {
  const modal = document.getElementById('paymentGatewayModal');
  const btnClose = document.getElementById('btnClosePaymentModal');
  const btnPhonePe = document.getElementById('btnPayPhonePe');
  const btnPaytm = document.getElementById('btnPayPaytm');
  const btnConfirm = document.getElementById('btnConfirmPayment');

  if (btnClose) btnClose.addEventListener('click', () => modal.classList.add('hidden'));

  // UPI Intent Link (डायरेक्ट PhonePe / Paytm मोबाइल ऐप खोलने के लिए)
  const triggerUpiApp = (appName) => {
    const upiUri = `upi://pay?pa=operator@upi&pn=NextGBroadband&am=699&cu=INR`;
    window.location.href = upiUri; // यह सीधा PhonePe / Paytm / GPay ऐप खोल देगा
    showToast(`Redirecting to ${appName}...`);
  };

  if (btnPhonePe) btnPhonePe.addEventListener('click', () => triggerUpiApp('PhonePe'));
  if (btnPaytm) btnPaytm.addEventListener('click', () => triggerUpiApp('Paytm'));

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      modal.classList.add('hidden');
      showToast('Payment successful! Plan activated.');
    });
  }
}
