/**
 * NextG WiFi - Sidebar Logic & Module Switcher
 */

function loadModule(moduleName) {
    // Update active class on sidebar items
    const items = document.querySelectorAll('.sidebar-item');
    items.forEach(item => item.classList.remove('active'));
    
    // Highlight clicked item based on text/onclick
    event.currentTarget.classList.add('active');

    const container = document.getElementById('mainContainer');

    if (moduleName === 'home') {
        if (typeof renderHomeModule === 'function') {
            renderHomeModule(container);
        } else {
            container.innerHTML = `<h2>Home Module</h2><p>डैशबोर्ड होम लोड हो रहा है...</p>`;
        }
    } else if (moduleName === 'recharge') {
        container.innerHTML = `<h2>Recharge Plans</h2><p>यहाँ आपके रिचार्ज पैक्स दिखेंगे।</p>`;
    } else if (moduleName === 'status') {
        container.innerHTML = `<h2>Network Status</h2><p>आपके राउटर/कनेक्शन की स्थिति एकदम ठीक है (Online)।</p>`;
    } else if (moduleName === 'connection') {
        container.innerHTML = `<h2>New Connection Request</h2><p>नया कनेक्शन फॉर्म जल्द यहाँ दिखेगा।</p>`;
    }
}
