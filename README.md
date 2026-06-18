# Nestora - Premium Real Estate Marketplace

Nestora is a premium real estate and house rental marketplace designed to connect renters and property owners. Built on the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS, Nestora features a modern, responsive user experience with premium design elements.

---

## Why Nestora?

Traditional real estate platforms are often cluttered, slow, and suffer from fragmented communication channels. Nestora solves these challenges by providing:

1. **Direct Landlord-Tenant Pipeline**: Cuts out intermediate agents and brokerages, allowing tenants and landlords to communicate directly and transparently.
2. **Reduced Communication Latency**: With one-click Gmail client integration and automated WhatsApp generation, landlords can respond to renter inquiries instantly.
3. **High-Fidelity Virtual Walk-throughs**: Virtual video tours integrated directly into listing detail pages reduce physical visitation requirements, saving time for both owners and renters.
4. **Data-Driven Discovery**: Simple, interactive dashboards allow users to view current market pricing insights and filter listings by location, type, and price range.
5. **Vetted Listing Quality**: Administrators have direct control to verify and approve property owners before they can list, ensuring a secure and spam-free marketplace.

---

## Features

### 🏢 Core Platform Features

- **Multi-Role Portals**: 
  - **Renter/Tenant Portal**: Search listings, track submitted bookings, and manage personal favourite properties.
  - **Owner/Landlord Portal**: Post new properties (with images/videos), update/delete listings, and review/approve/reject booking inquiries.
  - **Admin Dashboard**: Oversee the ecosystem by approving owner accounts, deleting inappropriate properties, deleting user accounts, and creating new admins.
- **Advanced Property Discovery**: Search and filter properties by city, type, and price range.
- **Inquiry & Booking Workflow**: Renters send direct inquiries for specific properties. Landlords receive inquiries with renter contact info and update request status (Pending, Approved, Rejected).
- **Market Insights Dashboard**: Real-time visualization of market metrics, active property counts, and price ranges.
- **Secure Authentication**: Cookie-based JWT authentication with role-based route protection.

### 🌓 Premium Enhancements

- **Smooth Dark Mode Toggle**: A modern slider in the navigation bar transitioning the site between light and dark modes with HSL variable synchronization.
- **Virtual Video Tour Lightbox**: Landlords can link YouTube or MP4 virtual walk-throughs, which tenants can view inside a modal lightbox overlay.
- **Direct Gmail Integration**: Landlords can click an inquiry's email to compose directly via Gmail in a new tab, preloaded with renter details, with clipboard backup.
- **User-Isolated Favourites**: Favourites lists are stored in isolated `localStorage` keys per user account to prevent session leaks.

## Folder Structure

- `/backend` - Node.js & Express REST API with MongoDB (Mongoose models, controllers, and middlewares).
- `/frontend` - Vite + React SPA client styled with Tailwind CSS and Framer Motion.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables by creating a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/nestora
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.
