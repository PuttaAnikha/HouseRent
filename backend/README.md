# Nestora Backend API

This is the backend service for **Nestora**, a premium MERN stack real estate marketplace. It provides REST APIs for user authentication, property listing management, inquiries/bookings, search operations, and administrative dashboards.

## Technology Stack

- **Runtime Environment**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) stored in HTTP-only cookies
- **Security & Utilities**: `bcryptjs` for password hashing, `cookie-parser` for secure tokens, and `dotenv` for configuration.

---

## Folder Structure

```text
backend/
├── config/             # Database connection setup
├── controllers/        # Route controllers containing business logic
│   ├── adminController.js
│   ├── ownerController.js
│   └── userController.js
├── middlewares/        # Authentication, authorization, and error handling
├── models/             # Mongoose database schemas
│   ├── BookingSchema.js
│   ├── PropertySchema.js
│   └── UserSchema.js
├── routes/             # Express API route definitions
│   ├── adminRoutes.js
│   ├── ownerRoutes.js
│   └── userRoutes.js
├── package.json        # Node dependency manifest
└── server.js           # Express application entrypoint
```

---

## API Endpoints

### 1. User & Renter Routes (`/api/users`)
- **POST** `/register` - Register a new user (renter or owner)
- **POST** `/login` - Authenticate user and set HTTP-only cookie
- **GET** `/logout` - Clear authentication token
- **GET** `/profile` - Fetch current user's profile information *(Protected)*
- **PUT** `/profile` - Update user's profile information *(Protected)*
- **GET** `/properties` - Retrieve all active property listings (Public)
- **GET** `/property/:propertyId` - Get details of a specific property (Public)
- **GET** `/search` - Search/Filter properties by city, type, or price (Public)
- **POST** `/booking/send` - Send an inquiry/booking request for a property *(Protected)*
- **GET** `/bookings/my` - Fetch inquiries submitted by the current renter *(Protected)*

### 2. Property Owner Routes (`/api/owners`)
*Note: All endpoints require owner/admin privileges.*
- **POST** `/property/create` - Create a new property listing (with image URL and virtual video tour URL)
- **PUT** `/property/update/:propertyId` - Update an existing property listing
- **DELETE** `/property/delete/:propertyId` - Delete a property listing
- **GET** `/bookings/received` - View inquiries sent by renters for owner's properties
- **PUT** `/booking/status/:bookingId` - Approve, reject, or update status of an inquiry

### 3. Admin Routes (`/api/admins`)
*Note: All endpoints require administrator privileges.*
- **GET** `/users` - List all users in the system
- **GET** `/properties` - List all properties in the system
- **DELETE** `/user/:userId` - Remove a user profile
- **DELETE** `/property/:propertyId` - Remove a property listing
- **PUT** `/approve-owner/:userId` - Approve/verify an owner registration
- **POST** `/add-admin` - Create a new administrator account

---

## Getting Started

### 1. Environment Configuration
Create a `.env` file in the root of the `backend/` directory with the following keys:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/nestora
JWT_SECRET=your_jwt_secret_token_here
```

### 2. Installation & Running
From the backend directory:
```bash
# Install dependencies
npm install

# Start the dev server (using nodemon/node depending on package.json)
npm start
```
