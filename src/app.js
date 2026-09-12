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
