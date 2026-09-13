/**
 * NextG WiFi - Master App Controller (src/app.js)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Render Sidebar Component
    const sidebarContainer = document.getElementById("sidebarContainer");
    if (sidebarContainer && typeof renderSidebarComponent === "function") {
        renderSidebarComponent(sidebarContainer);
    }

    // 2. Render Default Main View (Home Module)
    const mainContent = document.getElementById("appContent");
    if (mainContent && typeof renderHomeModule === "function") {
        renderHomeModule(mainContent);
    }
});
/**
 * NextG WiFi - Main Router / App Navigation Logic
 */

// Global Module Switcher Function
window.switchAppTab = function(moduleName) {
    const container = document.getElementById("mainContainer");
    if (!container) {
        console.error("Main container (#mainContainer) not found!");
        return;
    }

    // Clear previous content
    container.innerHTML = "";

    // Route to correct component safely
    switch (moduleName) {
        case 'home':
            if (typeof renderHomeComponent === 'function') renderHomeComponent(container);
            break;
            
        case 'routerControl':
            if (typeof renderRouterControlComponent === 'function') {
                renderRouterControlComponent(container);
            } else {
                container.innerHTML = "<h2 style='color:#fff; padding:20px;'>Router Control Module Loading...</h2>";
            }
            break;

        case 'appSettings':
            if (typeof renderAppSettingsComponent === 'function') {
                renderAppSettingsComponent(container);
            } else {
                container.innerHTML = "<h2 style='color:#fff; padding:20px;'>App Settings Module Loading...</h2>";
            }
            break;

        case 'billingHistory':
            if (typeof renderBillingHistoryComponent === 'function') {
                renderBillingHistoryComponent(container);
            } else {
                container.innerHTML = "<h2 style='color:#fff; padding:20px;'>Invoices & Billing Loading...</h2>";
            }
            break;

        case 'supportDesk':
            if (typeof renderSupportDeskComponent === 'function') {
                renderSupportDeskComponent(container);
            } else {
                container.innerHTML = "<h2 style='color:#fff; padding:20px;'>Raise Support Ticket Loading...</h2>";
            }
            break;

        default:
            console.log("Unknown module:", moduleName);
            if (typeof renderHomeComponent === 'function') renderHomeComponent(container);
            break;
    }
};
