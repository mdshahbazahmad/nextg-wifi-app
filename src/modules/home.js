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

// 2. Dynamic Alert / Power Cut Notification Data
// सामान्य स्थिति में null रखें (बॉक्स छुपा रहेगा)। 
// पावर कट या इशू होने पर नीचे दिए अनुसार अनकमेंट करें:
// const currentAlert = { type: 'danger', message: '⚠️ Maintenance Alert: Fiber line work in progress in your area.' };
const currentAlert = null; 

// 3. Recharge Plans Slides Data (Multiple Colorful Plans)
const homeRechargeSlides = [
  { title: 'Super Fiber Starter', speed: '50 Mbps', price: '₹499', validity: '30 Days', badge: 'Popular', bgGradient: 'from-blue-600 via-indigo-600 to-purple-600' },
  { title: 'Ultra Unlimited Plan', speed: '100 Mbps', price: '₹699', validity: '30 Days', badge: 'Best Value', bgGradient: 'from-violet-600 via-purple-600 to-pink-600' },
  { title: 'Giga Family Offer', speed: '200 Mbps', price: '₹6999', validity: '365 Days', badge: '1 Month Free', bgGradient: 'from-emerald-600 via-teal-600 to-cyan-600' },
  { title: 'Extreme Gaming Pack', speed: '300 Mbps', price: '₹1499', validity: '30 Days', badge: 'Low Latency', bgGradient: 'from-amber-500 via-orange-600 to-red-600' }
];

// 4. New Connection Offers Slides Data (Operator Offers)
const homeConnectionSlides = [
  { title: 'Home Fiber Starter', offer: 'FREE Installation + Dual Band Router', price: '₹1,499', bgGradient: 'from-teal-500 to-emerald-600' },
  { title: 'Giga Gamer Setup', offer: 'FREE Installation + Wi-Fi 6 Router + OTT', price: '₹2,999', bgGradient: 'from-cyan-600 to-blue-700' },
  { title: 'Business Combo Plan', offer: 'Free Static IP + 24/7 Priority Support', price: '₹4,999', bgGradient: 'from-rose-500 to-red-600' }
];

let rechargeInterval = null;
let connectionInterval = null;

export function initHomeModule() {
  const container = document.getElementById('view-home');
  if (!container) return;

  // Purane intervals clear karein (agar dubara load ho)
  if (rechargeInterval) clearInterval(rechargeInterval);
  if (connectionInterval) clearInterval(connectionInterval);

  // Render Whole Home Layout
  container.innerHTML = `
    <div class="space-y-4 pb-6">
      <!-- 1. ACTIVE PLAN WIDE CARD -->
      <div class="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden transition-all duration-300">
        <div class="flex justify-between items-start">
          <div>
            <span class="bg-blue-800/60 backdrop-blur-md text-blue-200 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Active Plan</span>
            <h3 class="font-black text-lg mt-1">${activePlanData.planName}</h3>
            <p class="text-xs text-blue-100 font-medium">${activePlanData.speed} Dynamic Speed</p>
          </div>
          <span class="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ${activePlanData.status}
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

      <!-- 2. DYNAMIC NOTIFICATION / ALERT BOX (Sirf issue/power cut par dikhega) -->
      <div id="homeAlertContainer" class="${currentAlert ? '' : 'hidden'} transition-all duration-300">
        <div class="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
          <div class="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
            <i data-lucide="alert-triangle" class="w-5 h-5"></i>
          </div>
          <p class="text-xs text-amber-900 dark:text-amber-200 font-semibold leading-relaxed" id="homeAlertText">
            ${currentAlert ? currentAlert.message : ''}
          </p>
        </div>
      </div>

      <!-- 3. AUTO-SLIDING RECHARGE PLANS SECTION -->
      <div class="space-y-2 pt-1">
        <div class="flex justify-between items-center px-1">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="credit-card" class="w-3.5 h-3.5 text-blue-500"></i> Featured Recharge Plans
          </h4>
          <span class="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">Auto Slide ➔</span>
        </div>

        <div id="rechargeSliderBox" class="p-4 rounded-2xl shadow-lg border text-white transition-all duration-700 ease-in-out">
          <!-- Slide content dynamically injected -->
        </div>
      </div>

      <!-- 4. AUTO-SLIDING NEW CONNECTION OFFERS SECTION -->
      <div class="space-y-2 pt-1">
        <div class="flex justify-between items-center px-1">
          <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-emerald-500"></i> New Connection Offers
          </h4>
          <span class="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">Auto Slide ➔</span>
        </div>

        <div id="connectionSliderBox" class="p-4 rounded-2xl shadow-lg border text-white transition-all duration-700 ease-in-out">
          <!-- Slide content dynamically injected -->
        </div>
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

// Auto Slide Logic for Recharge Plans (Every 3.5 Seconds)
function startRechargeAutoSlider() {
  const sliderBox = document.getElementById('rechargeSliderBox');
  if (!sliderBox) return;

  let currentIndex = 0;

  const renderSlide = () => {
    const item = homeRechargeSlides[currentIndex];
    sliderBox.className = `p-4 rounded-2xl shadow-lg border border-white/10 text-white bg-gradient-to-r ${item.bgGradient} transition-all duration-700 transform`;
    
    sliderBox.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <span class="bg-white/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">${item.badge}</span>
          <h5 class="font-extrabold text-base text-white mt-1">${item.title}</h5>
          <p class="text-xs text-white/80 font-medium">${item.speed} • Validity: ${item.validity}</p>
        </div>
        <div class="text-right">
          <span class="text-lg font-black text-white drop-shadow">${item.price}</span>
          <button class="block mt-1.5 bg-white text-gray-900 hover:bg-gray-100 active:scale-95 font-black text-[10px] px-3 py-1.5 rounded-xl shadow-md transition-all" onclick="document.getElementById('topBtnRecharge').click()">
            Recharge
          </button>
        </div>
      </div>
    `;
    currentIndex = (currentIndex + 1) % homeRechargeSlides.length;
  };

  renderSlide();
  rechargeInterval = setInterval(renderSlide, 3500);
}

// Auto Slide Logic for Connection Offers (Every 4 Seconds)
function startConnectionAutoSlider() {
  const sliderBox = document.getElementById('connectionSliderBox');
  if (!sliderBox) return;

  let currentIndex = 0;

  const renderSlide = () => {
    const item = homeConnectionSlides[currentIndex];
    sliderBox.className = `p-4 rounded-2xl shadow-lg border border-white/10 text-white bg-gradient-to-r ${item.bgGradient} transition-all duration-700 transform`;

    sliderBox.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <span class="bg-black/20 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Special Offer</span>
          <h5 class="font-extrabold text-base text-white mt-1">${item.title}</h5>
          <p class="text-xs text-white/90 font-medium">${item.offer}</p>
        </div>
        <div class="text-right">
          <span class="text-lg font-black text-white drop-shadow">${item.price}</span>
          <button class="block mt-1.5 bg-white text-emerald-800 hover:bg-gray-100 active:scale-95 font-black text-[10px] px-3 py-1.5 rounded-xl shadow-md transition-all" onclick="document.getElementById('topBtnNewConn').click()">
            Apply
          </button>
        </div>
      </div>
    `;
    currentIndex = (currentIndex + 1) % homeConnectionSlides.length;
  };

  renderSlide();
  connectionInterval = setInterval(renderSlide, 4000);
}
