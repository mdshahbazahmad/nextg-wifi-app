// src/modules/newConnection.js
import { showToast } from './sidebar.js';

// एडमिन पोर्टल / डेटाबेस से आने वाले dynamic न्यू कनेक्शन ऑफ़र
const sampleConnectionOffers = [
  {
    id: 'conn_1',
    title: 'Home Fiber Starter Offer',
    speed: '100 Mbps',
    installationFee: 'FREE Installation',
    router: 'Dual Band Wi-Fi 5 Router Included',
    price: '₹1,499 (3 Months Plan)',
    badge: 'Popular'
  },
  {
    id: 'conn_2',
    title: 'Giga Gamer & Work Setup',
    speed: '300 Mbps',
    installationFee: 'FREE Installation + OTT Apps',
    router: 'Wi-Fi 6 Giga Router Included',
    price: '₹2,999 (3 Months Plan)',
    badge: 'High Speed'
  }
];

export function initNewConnectionModule() {
  const container = document.getElementById('newConnectionOffersContainer');
  if (!container) return;

  // 1. Dynamic Connection Cards Render करना (recharge.js ki tarah direct template literal)
  container.innerHTML = sampleConnectionOffers.map(offer => `
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 space-y-3 relative mb-3">
      <span class="absolute top-3 right-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">${offer.badge}</span>
      <div>
        <h4 class="font-bold text-sm text-gray-900 dark:text-white">${offer.title}</h4>
        <p class="text-xs text-blue-600 dark:text-blue-400 font-extrabold mt-0.5">${offer.speed} • ${offer.installationFee}</p>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Includes: ${offer.router}</p>
      </div>
      <div class="flex justify-between items-center pt-2 border-t dark:border-gray-700">
        <span class="text-sm font-black text-gray-900 dark:text-white">${offer.price}</span>
        <button data-offer-title="${offer.title}" class="btnApplyConn bg-teal-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow hover:bg-teal-700 transition-all active:scale-95">
          Apply Now
        </button>
      </div>
    </div>
  `).join('');

  // 2. Apply Now बटन का इवेंट और Modal handling
  const modal = document.getElementById('newConnModal');
  const btnClose = document.getElementById('btnCloseNewConnModal');
  const selectedOfferLabel = document.getElementById('selectedConnOffer');
  const btnSubmit = document.getElementById('btnSubmitNewConn');

  document.querySelectorAll('.btnApplyConn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const offerTitle = e.currentTarget.getAttribute('data-offer-title');
      if (selectedOfferLabel) selectedOfferLabel.innerText = `Offer: ${offerTitle}`;
      if (modal) modal.classList.remove('hidden');
    });
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  // Form Submit Logic
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      const name = document.getElementById('newConnName')?.value;
      const phone = document.getElementById('newConnPhone')?.value;
      const address = document.getElementById('newConnAddress')?.value;

      if (!name || !phone || !address) {
        showToast('Please fill all details!');
        return;
      }

      if (modal) modal.classList.add('hidden');
      showToast('New connection request submitted successfully!');
    });
  }
}
