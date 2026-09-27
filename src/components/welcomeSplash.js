// Welcome Splash & Onboarding Screen Component

export function renderWelcomeSplash() {
  const container = document.createElement('div');
  container.id = 'welcome-splash-container';
  container.className = 'welcome-splash-overlay';

  container.innerHTML = `
    <div class="splash-card">
      <div class="splash-logo-container">
        <img src="https://i.postimg.cc/wxhBT76M/Next-Wi-Fi-Icon-512x512.png" alt="NextG WiFi Logo" class="splash-logo" />
      </div>
      <h2 class="splash-title">NextG WiFi</h2>
      <p class="splash-subtitle">High-Speed Fiber & Broadband Services</p>
      
      <div class="splash-features">
        <div class="feature-item">
          <span>⚡ Dynamic Remote Control</span>
        </div>
        <div class="feature-item">
          <span>📱 Instant Mobile Auto-Connect</span>
        </div>
        <div class="feature-item">
          <span>💳 One-Tap Recharges & Billing</span>
        </div>
      </div>

      <button id="btn-get-started" class="btn-get-started">
        Get Started
      </button>
    </div>
  `;

  // Attach button click event
  setTimeout(() => {
    const btn = document.getElementById('btn-get-started');
    if (btn) {
      btn.addEventListener('click', () => {
        dismissWelcomeSplash();
      });
    }
  }, 0);

  return container;
}

export function dismissWelcomeSplash() {
  const splashElement = document.getElementById('welcome-splash-container');
  if (splashElement) {
    splashElement.style.opacity = '0';
    splashElement.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      splashElement.remove();
    }, 400);
  }
}
