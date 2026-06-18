# Nestora - Premium Real Estate Marketplace

Nestora is a premium real estate and house rental marketplace designed to connect renters and property owners. Built on the MERN stack (MongoDB, Express.js, React, Node.js) with Tailwind CSS, Nestora features a modern, responsive user experience with premium design elements.

## Features

### 🌓 Smooth Dark Mode
- Toggle between light and dark theme directly from the navigation bar.
- Fully synchronized across pages using `localStorage` preference state.
- Custom CSS transitions for smooth, eye-pleasing dark transitions.

### 📹 Virtual Video Tour Lightbox
- Property owners can specify a virtual tour video URL (YouTube links or direct MP4 files) when creating a listing.
- Renters can launch the tour from a dedicated preview card that opens in a premium modal lightbox popup overlay.

### ✉️ Direct Gmail Integration
- Owners can message renters directly via Gmail in a new browser tab with pre-filled renter info and inquiry subjects.
- Clipboard copy backup with visual feedback is built-in.

### 🔒 User-Specific Favourites
- Tenants can save listings to their personal "Favourites" list.
- Storage lists are isolated per user profile using custom `localStorage` keys.
- Automatic guest protection redirects unauthenticated users to the login screen.

### 📱 Formatted Indian Contact Inputs
- Ensures only valid 10-digit Indian mobile numbers (prefixed with `+91`) can be registered or updated.
- Formats contact details dynamically on cards for clean readability.

---

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
