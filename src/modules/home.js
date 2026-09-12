// src/modules/home.js
import { showToast } from './sidebar.js';

// 1. Active Plan Data (Admin / Dynamic Payload)
const activePlanData = {
  planName: 'Fiber Ultra Unlimited 100M',
  speed: '100 Mbps',
  daysRemaining: 14,
  expiryDate: '26 Sept 2026',
  dataUsed: '420 GB',
  status: 'Active'
};

// 2. Alert / Notification Data (Agar issue hoga tabhi show hoga, varna null/empty rakhein)
// Test karne ke liye alerts: { type: 'danger', message: '⚠️ Maintenance Alert: Fiber line work in progress in your area.' }
const currentAlert = null; // Normal condition me null rahega jisse box hidden rahega

// 3. Recharge & Connection Slides Data
const homeRechargeSlides = [
  { title: 'Super Fiber Starter', speed: '50 Mbps', price: '₹499', validity: '30 Days', badge: 'Popular' },
  { title: 'Ultra Unlimited Plan', speed: '100 Mbps', price: '₹699', validity: '30 Days', badge: 'Best Value' },
  { title: 'Giga Family Offer', speed: '200 Mbps', price: '₹6999', validity: '365 Days', badge: '1 Month Free' }
];

const homeConnectionSlides = [
  { title: 'Home Fiber Starter', offer: 'FREE Installation + Dual Band Router', price: '₹1,499' },
  { title: 'Giga Gamer Setup', offer: 'FREE Installation + Wi-Fi 6 Router + OTT', price: '₹2,999' }
];

let rechargeInterval = null;
let connectionInterval = null;

export function initHomeModule() {
  const container = document.getElementById('view-home');
  if (!container) return;

  // Clear existing intervals if re-initialized
  if (rechargeInterval) clearInterval(rechargeInterval);
  if (connectionInterval) clearInterval(connectionInterval);

  // Render Whole Home Layout
  container.innerHTML = `
    <!-- 1. ACTIVE PLAN WIDE CARD -->
    <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
      <div class="flex justify-between items-start">
        <div>
          <span class="bg-blue-800/60 backdrop-blur-md text-blue-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Active Plan</span>
          <h3 class="font-black text-lg mt-1">${activePlanData.planName}</h3>
          <p class="text-xs text-blue-100 font-medium">${activePlanData.speed} Dynamic Speed</p>
        </div>
        <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
          ● ${activePlanData.status}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-2 border-t border-blue-500/40 text-xs">
        <div>
          <p class="text-[10px] text-blue-200 uppercase font-bold">Expires In</p>
          <p class="font-extrabold text-sm">${activePlanData.daysRemaining} Days <span class="text-[10px] font-normal text-blue-200">(${activePlanData.expiryDate})</span></p>
        </div>
        <div>
          <p class="text-[10px] text-blue-200 uppercase font-bold">Data Consumption</p>
          <p class="font-extrabold text-sm">${activePlanData.dataUsed}</p>
        </div>
      </div>

      <div class="pt-2">
        <button id="btnHomeRechargeNow" class="w-full bg-white text-blue-700 hover:bg-blue-50 font-black text-xs py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5">
          <i data-lucide="zap" class="w-4 h-4 fill-blue-700"></i> Recharge Now
        </button>
      </div>
    </div>

    <!-- 2. DYNAMIC NOTIFICATION / ALERT BOX (Shows only if alert exists) -->
    <div id="homeAlertContainer" class="${currentAlert ? '' : 'hidden'}">
      <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-3 rounded-xl flex items-center gap-3">
        <i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600 shrink-0"></i>
        <p class="text-xs text-amber-800 dark:text-amber-200 font-semibold" id="homeAlertText">
          ${currentAlert ? currentAlert.message : ''}
        </p>
      </div>
    </div>

    <!-- 3. AUTO-SLIDING RECHARGE PLANS SECTION -->
    <div class="space-y-2 pt-1">
      <div class="flex justify-between items-center px-1">
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <i data-lucide="credit-card" class="w-3.5 h-3.5 text-blue-500"></i> Featured Recharge Plans
        </h4>
        <span class="text-[10px] text-blue-600 font-bold">Auto Slide ➔</span>
      </div>

      <div id="rechargeSliderBox" class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border dark:border-gray-700 transition-all duration-500">
        <!-- Slide content injected dynamically -->
      </div>
    </div>

    <!-- 4. AUTO-SLIDING NEW CONNECTION OFFERS SECTION -->
    <div class="space-y-2 pt-1">
      <div class="flex justify-between items-center px-1">
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-500"></i> New Connection Offers
        </h4>
        <span class="text-[10px] text-teal-600 font-bold">Auto Slide ➔</span>
      </div>

      <div id="connectionSliderBox" class="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-4 rounded-2xl shadow-md transition-all duration-500">
        <!-- Slide content injected dynamically -->
      </div>
    </div>
  `;

  // Icons Init
  if (window.lucide) window.lucide.createIcons();

  // Active Plan Recharge Button Event
  const btnHomeRechargeNow = document.getElementById('btnHomeRechargeNow');
  if (btnHomeRechargeNow) {
    btnHomeRechargeNow.addEventListener('click', () => {
      const topBtnRecharge = document.getElementById('topBtnRecharge');
      if (topBtnRecharge) topBtnRecharge.click();
    });
  }

  // Start Carousels
  startRechargeAutoSlider();
  startConnectionAutoSlider();
}

// Auto Slide Logic for Recharge Plans (Every 3 Seconds)
function startRechargeAutoSlider() {
  const sliderBox = document.getElementById('rechargeSliderBox');
  if (!sliderBox) return;

  let currentIndex = 0;

  const renderSlide = () => {
    const item = homeRechargeSlides[currentIndex];
    sliderBox.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <span class="bg-blue-100 dark:bg-blue-950 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">${item.badge}</span>
          <h5 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${item.title}</h5>
          <p class="text-xs text-gray-500 dark:text-gray-400">${item.speed} • Validity: ${item.validity}</p>
        </div>
        <div class="text-right">
          <span class="text-base font-black text-gray-900 dark:text-white">${item.price}</span>
          <button class="block mt-1 bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg shadow" onclick="document.getElementById('topBtnRecharge').click()">
            Recharge
          </button>
        </div>
      </div>
    `;
    currentIndex = (currentIndex + 1) % homeRechargeSlides.length;
  };

  renderSlide();
  rechargeInterval = setInterval(renderSlide, 3000);
}

// Auto Slide Logic for Connection Offers (Every 3.5 Seconds)
function startConnectionAutoSlider() {
  const sliderBox = document.getElementById('connectionSliderBox');
  if (!sliderBox) return;

  let currentIndex = 0;

  const renderSlide = () => {
    const item = homeConnectionSlides[currentIndex];
    sliderBox.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <span class="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Special Offer</span>
          <h5 class="font-bold text-sm text-white mt-1">${item.title}</h5>
          <p class="text-xs text-teal-100">${item.offer}</p>
        </div>
        <div class="text-right">
          <span class="text-base font-black text-white">${item.price}</span>
          <button class="block mt-1 bg-white text-teal-700 font-bold text-[10px] px-3 py-1 rounded-lg shadow" onclick="document.getElementById('topBtnNewConn').click()">
            Apply
          </button>
        </div>
      </div>
    `;
    currentIndex = (currentIndex + 1) % homeConnectionSlides.length;
  };

  renderSlide();
  connectionInterval = setInterval(renderSlide, 3500);
}
