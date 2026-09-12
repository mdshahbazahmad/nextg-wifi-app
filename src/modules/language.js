// src/modules/language.js
import { showToast } from './sidebar.js';

// 1. Supported Languages Data
const supportedLanguages = [
  // Primary Languages (प्राथमिक भाषाएं)
  { code: 'en', name: 'English', native: 'English', category: 'primary' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', category: 'primary' },
  { code: 'ur', name: 'Urdu', native: 'اردو', category: 'primary' },

  // Regional Indian Languages (भारतीय भाषाएं)
  { code: 'bn', name: 'Bengali', native: 'বাংলা', category: 'indian' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', category: 'indian' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', category: 'indian' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', category: 'indian' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', category: 'indian' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', category: 'indian' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', category: 'indian' },

  // International Languages (अंतर्राष्ट्रीय भाषाएं)
  { code: 'ar', name: 'Arabic', native: 'العربية', category: 'international' },
  { code: 'es', name: 'Spanish', native: 'Español', category: 'international' },
  { code: 'fr', name: 'French', native: 'Français', category: 'international' },
  { code: 'de', name: 'German', native: 'Deutsch', category: 'international' }
];

// Current Active Language (Default: English)
let currentLangCode = localStorage.getItem('appLanguage') || 'en';

export function initLanguageModule() {
  // Inject Language Selection Modal if not exists
  createLanguageModal();

  // Attach Sidebar Language Button Event
  const btnLanguage = document.getElementById('btnSidebarLanguage');
  if (btnLanguage) {
    btnLanguage.addEventListener('click', () => {
      const modal = document.getElementById('languageModal');
      if (modal) modal.classList.remove('hidden');
    });
  }
}

// Language Modal Generator & Logic
function createLanguageModal() {
  if (document.getElementById('languageModal')) return;

  const modalHtml = `
    <div id="languageModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-5 space-y-4 border dark:border-gray-700 max-h-[85vh] flex flex-col">
        
        <!-- Header -->
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3 shrink-0">
          <h3 class="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <i data-lucide="globe" class="w-4 h-4 text-blue-500"></i> Select Language / भाषा चुनें
          </h3>
          <button id="btnCloseLangModal" class="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
        </div>

        <!-- Language Search Box -->
        <div class="shrink-0">
          <input type="text" id="inputSearchLang" placeholder="Search language / भाषा खोजें..." class="w-full p-2.5 text-xs rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium" />
        </div>

        <!-- Languages List (Scrollable) -->
        <div id="langListContainer" class="overflow-y-auto space-y-2 pr-1 flex-1 text-xs">
          <!-- Rendered Dynamically -->
        </div>

        <!-- Save Button -->
        <div class="pt-2 border-t dark:border-gray-700 shrink-0">
          <button id="btnSaveLanguage" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow transition-all active:scale-95">
            Apply Language
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  renderLanguageList(supportedLanguages);

  // Close Event
  document.getElementById('btnCloseLangModal')?.addEventListener('click', () => {
    document.getElementById('languageModal')?.classList.add('hidden');
  });

  // Search Filter Event
  document.getElementById('inputSearchLang')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = supportedLanguages.filter(l => 
      l.name.toLowerCase().includes(query) || l.native.toLowerCase().includes(query)
    );
    renderLanguageList(filtered);
  });

  // Save Language Event
  document.getElementById('btnSaveLanguage')?.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="app_lang_option"]:checked');
    if (selectedRadio) {
      currentLangCode = selectedRadio.value;
      localStorage.setItem('appLanguage', currentLangCode);
      
      const langObj = supportedLanguages.find(l => l.code === currentLangCode);
      showToast(`Language changed to ${langObj ? langObj.name : currentLangCode}!`);
      document.getElementById('languageModal')?.classList.add('hidden');
    }
  });
}

// Render Languages Grouped by Priority
function renderLanguageList(languages) {
  const container = document.getElementById('langListContainer');
  if (!container) return;

  if (languages.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-400 py-4">No language found</p>`;
    return;
  }

  container.innerHTML = languages.map(lang => `
    <label class="flex justify-between items-center p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 cursor-pointer transition-all">
      <div class="flex items-center gap-2.5">
        <span class="font-extrabold text-gray-900 dark:text-white">${lang.native}</span>
        <span class="text-[10px] text-gray-400">(${lang.name})</span>
        ${lang.category === 'primary' ? '<span class="bg-blue-100 text-blue-600 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">Top</span>' : ''}
      </div>
      <input type="radio" name="app_lang_option" value="${lang.code}" ${lang.code === currentLangCode ? 'checked' : ''} class="w-4 h-4 text-blue-600" />
    </label>
  `).join('');
}
