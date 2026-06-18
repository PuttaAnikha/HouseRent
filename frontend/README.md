# Nestora Frontend Client

This is the React-based Single Page Application (SPA) client for **Nestora**, built using Vite, Tailwind CSS, and custom styling systems.

## Features

- **🌓 Animated Dark Mode Toggle**: Responsive toggle bar header that saves user theme preferences to `localStorage` and applies smooth transitions.
- **✨ Cozy Amber Design**: Tailored theme replacing standard blue tones with warm amber (`#f59e0b`) to match Nestora's premium logo and aesthetic.
- **🔒 Isolated Favourites**: Dynamic, per-user Favorites management that protects guest actions and synchronizes favorites lists to specific logged-in users.
- **📹 Virtual Tour Lightbox**: Direct click-to-play video tour viewer inside a modal overlay to keep users engaged on property detail pages.
- **✉️ Direct Gmail Integration**: Renter detail pre-loading with automated mail-to client opens, alongside a secondary copy-to-clipboard backup.
- **📞 Indian Number Validator**: strict validation for standard Indian mobile numbers (`+91` followed by 10 digits) during user profile updates and registration.
- **📊 Market Insights & Dashboard**: Real-time insights, metrics, and property availability statistics visualized on interactive dashboards.

---

## Folder Structure

```text
frontend/
├── public/             # Static assets (favicons, SVG sprite icons)
├── src/
│   ├── assets/         # Images and SVGs
│   ├── components/     # Shared UI components (Navbar, Footer, SearchBar, PropertyCard)
│   ├── context/        # React context (AuthContext for user state, theme, etc.)
│   ├── modules/        # Module-specific dashboards
│   │   ├── admin/      # Administrator views (All Users, All Properties, All Bookings)
│   │   ├── common/     # Public pages (Home, Login, Register, Forgot Password)
│   │   └── user/       # User & Owner dashboards (Add Property, Received Bookings, My Properties)
│   ├── pages/          # Individual feature views (Favorites, MarketInsights, Profile, PropertyDetails)
│   ├── services/       # API integration layer (Axios instance and endpoint handlers)
│   ├── App.css         # Global stylesheets and theme variables
│   ├── App.jsx         # Main router layout
│   └── main.jsx        # Client entrypoint
├── index.html          # HTML shell template
├── tailwind.config.js  # Tailwind CSS utility definitions
└── vite.config.js      # Vite project configuration
```

---

## Getting Started

### 1. Installation
From the frontend directory:
```bash
npm install
```

### 2. Running Dev Server
```bash
npm run dev
```
The application will open on [http://localhost:5173](http://localhost:5173).

### 3. Production Build
To create a production-ready assets bundle:
```bash
npm run build
```
The output will be generated inside the `dist/` directory.
