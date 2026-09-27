# Next G Wi-Fi App (Vite + PWA)

Next G Wi-Fi - Official Fiber & Broadband Self-Care App for seamless Online Recharges, One-Tap Instant Complaints, Live Validity Tracking, Remote Router Control, and New Connection Requests.

## Project Structure (Vite Edition)

```text
nextg-wifi-app/
├── index.html                # Vite SPA main entry point & PWA meta tags
├── package.json              # App scripts & dependencies
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel SPA rewrites & headers configuration
├── .gitignore                # Ignored files & folders
├── README.md                 # Project documentation
├── public/                   # Static assets folder
│   ├── favicon.ico
│   ├── manifest.json         # Web App Manifest
│   ├── pwabuilder-sw.js      # Service worker for PWA support
│   └── icons/                # PWA app icons (192x192 & 512x512)
└── src/                      # Source code folder
    ├── main.js               # Vite entry script
    ├── app.js                # Core app initialization
    ├── firebase-config.js    # Firebase credentials & database setup
    ├── components/           # UI Components
    │   ├── welcomeSplash.js  # Welcome & onboarding screen
    │   ├── appSettings.js    # User settings
    │   ├── billingHistory.js # Recharge & billing history
    │   ├── routerControl.js  # Remote router control & Wi-Fi settings
    │   ├── sidebar.js        # Navigation sidebar
    │   └── supportDesk.js    # Support & ticket booking
    └── modules/              # Logic Modules
        ├── app-config.js     # Global configuration
        ├── connection.js     # Auto-connect & router API handler
        ├── home.js           # Main dashboard
        ├── recharge.js       # Recharge plans handler
        └── status.js         # Connection status & validity tracker
