/**
 * NextG WiFi - Sidebar Component
 * File: src/components/sidebar.js
 */

// 1. Global Functions (Direct Window Attachment to Fix Freeze)
window.openSidebar = function() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.style.left = "0px";
        backdrop.style.display = "block";
        window.loadSavedUserProfile(); // Refresh profile state when opened
    } else {
        console.error("Sidebar elements missing in DOM!");
    }
};

window.closeSidebar = function() {
    const drawer = document.getElementById("sidebarDrawer");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (drawer && backdrop) {
        drawer.style.left = "-300px";
        backdrop.style.display = "none";
    }
};

window.handleSidebarClick = function(moduleName) {
    window.closeSidebar();
    
    // Switch Page/Module safely
    if (typeof switchAppTab === 'function') {
        switchAppTab(moduleName);
    } else if (typeof window.switchAppTab === 'function') {
        window.switchAppTab(moduleName);
    }
};

// --- PROFILE EDITING & STORAGE FUNCTIONS --- //

// Load profile data from localStorage
window.loadSavedUserProfile = function() {
    const profile = JSON.parse(localStorage.getItem('userProfileData')) || {
        name: "NextG Consumer",
        email: "user@nextgwifi.com",
        phone: "+91 9876543210",
        address: "Not Provided",
        docType: "Aadhaar / ID",
        docStatus: "Verified",
        avatar: null
    };

    const nameEl = document.getElementById("drawerUserName");
    const emailEl = document.getElementById("drawerUserEmail");
    const avatarEl = document.getElementById("drawerAvatarCircle");

    if (nameEl) nameEl.innerText = profile.name;
    if (emailEl) emailEl.innerText = profile.email;

    if (avatarEl) {
        if (profile.avatar) {
            avatarEl.innerHTML = `<img src="${profile.avatar}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" />`;
        } else {
            avatarEl.innerText = profile.name ? profile.name.charAt(0).toUpperCase() : "N";
        }
    }
};

// Open Edit Profile Modal
window.openProfileModal = function() {
    const modal = document.getElementById("profileEditModal");
    if (!modal) return;

    const profile = JSON.parse(localStorage.getItem('userProfileData')) || {
        name: "NextG Consumer",
        email: "user@nextgwifi.com",
        phone: "+91 9876543210",
        address: "",
        docType: "National ID",
        docStatus: "Submitted"
    };

    document.getElementById("editNameInput").value = profile.name || "";
    document.getElementById("editEmailInput").value = profile.email || "";
    document.getElementById("editPhoneInput").value = profile.phone || "";
    document.getElementById("editAddressInput").value = profile.address || "";
    document.getElementById("editDocTypeInput").value = profile.docType || "Identity Card";

    modal.style.display = "flex";
};

// Close Edit Profile Modal
window.closeProfileModal = function() {
    const modal = document.getElementById("profileEditModal");
    if (modal) modal.style.display = "none";
};

// Handle Profile Form Submission & Save to LocalStorage
window.saveUserProfileData = function(event) {
    if (event) event.preventDefault();

    const name = document.getElementById("editNameInput").value.trim();
    const email = document.getElementById("editEmailInput").value.trim();
    const phone = document.getElementById("editPhoneInput").value.trim();
    const address = document.getElementById("editAddressInput").value.trim();
    const docType = document.getElementById("editDocTypeInput").value.trim();
    const photoInput = document.getElementById("editPhotoInput");

    let currentProfile = JSON.parse(localStorage.getItem('userProfileData')) || {};

    currentProfile.name = name || "NextG Consumer";
    currentProfile.email = email || "user@nextgwifi.com";
    currentProfile.phone = phone || "";
    currentProfile.address = address || "";
    currentProfile.docType = docType || "Identity Document";

    const saveAndClose = () => {
        localStorage.setItem('userProfileData', JSON.stringify(currentProfile));
        window.loadSavedUserProfile();
        window.closeProfileModal();
        alert("✅ प्रोफाइल जानकारी सफलतापूर्वक सहेज ली गई!");
    };

    // If a new Profile Photo (DP) was selected
    if (photoInput && photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentProfile.avatar = e.target.result; // Base64 Image
            saveAndClose();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveAndClose();
    }
};


// 2. Main Render Function
function renderSidebarComponent(containerElement) {
    if (!containerElement) return;

    containerElement.innerHTML = `
        <!-- Dark Backdrop Overlay -->
        <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="window.closeSidebar()"></div>

        <!-- Sliding Menu Drawer -->
        <div class="sidebar-wrapper" id="sidebarDrawer">
            <!-- Header -->
            <div class="sidebar-header">
                <div class="user-profile-box">
                    <div class="avatar-circle" id="drawerAvatarCircle">N</div>
                    <div class="user-info">
                        <h4 id="drawerUserName">NextG Consumer</h4>
                        <p id="drawerUserEmail">user@nextgwifi.com</p>
                    </div>
                    <button type="button" class="edit-profile-btn" onclick="window.openProfileModal()" title="Edit Profile">✏️</button>
                </div>
                <button type="button" class="close-sidebar-btn" onclick="window.closeSidebar()">✕</button>
            </div>

            <!-- Navigation Links -->
            <div class="nav-section-title">NAVIGATION</div>
            <div class="sidebar-menu">
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('home')">
                    🏠 Home Overview
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('routerControl')">
                    ⚙️ Router Remote Control
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('appSettings')">
                    📱 App Settings
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('billingHistory')">
                    📄 Invoices & Billing
                </button>
                <button type="button" class="sidebar-item" onclick="window.handleSidebarClick('supportDesk')">
                    🎟️ Raise Support Ticket
                </button>
            </div>

            <!-- Logout -->
            <div class="sidebar-footer">
                <button type="button" class="logout-btn" onclick="handleLogout()">
                    🚪 Log Out
                </button>
            </div>
        </div>

        <!-- Profile Edit Modal Window -->
        <div class="profile-modal-overlay" id="profileEditModal" style="display:none;">
            <div class="profile-modal-card">
                <div class="modal-header">
                    <h3>✏️ प्रोफाइल अपडेट करें</h3>
                    <button type="button" onclick="window.closeProfileModal()" class="close-modal-btn">✕</button>
                </div>
                <form onsubmit="window.saveUserProfileData(event)">
                    <div class="form-group">
                        <label>प्रोफाइल फोटो (DP):</label>
                        <input type="file" id="editPhotoInput" accept="image/*" class="modal-input" />
                    </div>
                    <div class="form-group">
                        <label>पूरा नाम (Full Name):</label>
                        <input type="text" id="editNameInput" class="modal-input" placeholder="नाम दर्ज करें" required />
                    </div>
                    <div class="form-group">
                        <label>ईमेल (Gmail ID):</label>
                        <input type="email" id="editEmailInput" class="modal-input" placeholder="example@gmail.com" required />
                    </div>
                    <div class="form-group">
                        <label>फोन नंबर (Phone):</label>
                        <input type="tel" id="editPhoneInput" class="modal-input" placeholder="+91 XXXXXXXXXX" />
                    </div>
                    <div class="form-group">
                        <label>इंस्टॉल्ड पता (Installation Address):</label>
                        <textarea id="editAddressInput" class="modal-input" placeholder="अपना पूरा पता लिखें..." rows="2"></textarea>
                    </div>
                    <div class="form-group">
                        <label>आइडेंटिटी/KYC दस्तावेज़ का नाम:</label>
                        <input type="text" id="editDocTypeInput" class="modal-input" placeholder="उदा: Aadhaar Card, Voter ID" />
                    </div>
                    <div class="modal-actions">
                        <button type="button" onclick="window.closeProfileModal()" class="btn-cancel">रद्द करें</button>
                        <button type="submit" class="btn-save">सेव करें</button>
                    </div>
                </form>
            </div>
        </div>

        <style>
            .sidebar-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.65);
                backdrop-filter: blur(4px);
                z-index: 99998;
                display: none;
            }

            .sidebar-wrapper {
                position: fixed;
                top: 0;
                left: -300px; /* Hidden off-screen */
                width: 280px;
                height: 100vh;
                background: #0f172a;
                padding: 20px 16px;
                color: #fff;
                text-align: left;
                z-index: 99999;
                transition: left 0.25s ease-in-out;
                box-shadow: 4px 0 20px rgba(0,0,0,0.6);
                overflow-y: auto;
                box-sizing: border-box;
            }

            .sidebar-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #1e293b;
            }

            .close-sidebar-btn {
                background: #1e293b;
                border: 1px solid #334155;
                color: #94a3b8;
                font-size: 16px;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .user-profile-box { display: flex; align-items: center; gap: 10px; width: 85%; }
            .avatar-circle { width: 38px; height: 38px; background: #F58220; color: #fff; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
            .user-info { flex-grow: 1; overflow: hidden; }
            .user-info h4 { font-size: 13px; margin: 0; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .user-info p { font-size: 10px; color: #64748b; margin: 2px 0 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .edit-profile-btn { background: none; border: none; font-size: 14px; cursor: pointer; padding: 2px 5px; border-radius: 4px; }
            .edit-profile-btn:hover { background: #1e293b; }

            .nav-section-title { font-size: 10px; font-weight: bold; color: #64748b; margin-bottom: 10px; letter-spacing: 1px; }
            .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
            .sidebar-item { display: flex; align-items: center; gap: 10px; background: #1e293b; border: 1px solid #334155; padding: 12px 14px; border-radius: 10px; color: #f8fafc; font-size: 13px; font-weight: 600; cursor: pointer; text-align: left; transition: 0.2s; width: 100%; }
            .sidebar-item:active { border-color: #F58220; background: #26334d; }

            .sidebar-footer { margin-top: 30px; border-top: 1px solid #1e293b; padding-top: 15px; }
            .logout-btn { width: 100%; padding: 10px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; border-radius: 8px; font-weight: bold; cursor: pointer; }

            /* Profile Modal Styling */
            .profile-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); z-index: 100000; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box; }
            .profile-modal-card { background: #0f172a; border: 1px solid #334155; width: 100%; max-width: 360px; border-radius: 14px; padding: 18px; color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #1e293b; padding-bottom: 8px; }
            .modal-header h3 { margin: 0; font-size: 15px; color: #F58220; }
            .close-modal-btn { background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; }
            .form-group { margin-bottom: 12px; }
            .form-group label { display: block; font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
            .modal-input { width: 100%; padding: 8px 10px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; color: #fff; font-size: 12px; box-sizing: border-box; }
            .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 15px; }
            .btn-cancel { background: #334155; border: none; color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; }
            .btn-save { background: #F58220; border: none; color: #fff; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px; }
        </style>
    `;

    // Load saved data on initial render
    setTimeout(() => { window.loadSavedUserProfile(); }, 100);
}
