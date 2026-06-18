import axios from 'axios';

// Create configured axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://houserent-dxdr.onrender.com',
  withCredentials: true, // Needed for parsing HTTP-only cookies
});

// Request interceptor to dynamically inject the authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format errors standardly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API call error:', error.response || error);
    return Promise.reject(error);
  }
);

// =====================================
// PROPERTY API CALLS
// =====================================

export const propertyAPI = {
  // Fetch all properties (Public)
  getAll: async () => {
    const res = await api.get('/api/user/properties');
    return res.data;
  },

  // Get a single property by ID (Public)
  getById: async (propertyId) => {
    const res = await api.get(`/api/user/property/${propertyId}`);
    return res.data;
  },

  // Create property listing (Owner/Admin)
  create: async (data) => {
    const res = await api.post('/api/owner/property/create', data);
    return res.data;
  },

  // Update property listing (Owner/Admin)
  update: async (propertyId, data) => {
    const res = await api.put(`/api/owner/property/update/${propertyId}`, data);
    return res.data;
  },

  // Delete property listing (Owner/Admin)
  delete: async (propertyId) => {
    const res = await api.delete(`/api/owner/property/delete/${propertyId}`);
    return res.data;
  },

  // Dynamic filter search (Public)
  search: async (filters) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.propertyType) params.append('propertyType', filters.propertyType);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minArea) params.append('minArea', filters.minArea);
    if (filters.maxArea) params.append('maxArea', filters.maxArea);
    if (filters.amenities) params.append('amenities', filters.amenities);

    const res = await api.get(`/api/user/search?${params.toString()}`);
    return res.data;
  }
};

// =====================================
// BOOKING API CALLS (formerly Inquiry API)
// =====================================

export const inquiryAPI = {
  // Send booking request (User/Authenticated)
  send: async (propertyId, message, interestType) => {
    const res = await api.post('/api/user/booking/send', { propertyId, message, interestType });
    return res.data;
  },

  // Get current renter's bookings (Tenant's sent bookings)
  getMy: async () => {
    const res = await api.get('/api/user/bookings/my');
    return res.data;
  },

  // Get bookings received on owner's properties (Owner's received bookings)
  getReceived: async () => {
    const res = await api.get('/api/owner/bookings/received');
    return res.data;
  },

  // Update booking status (Owner/Admin)
  updateStatus: async (bookingId, status) => {
    const res = await api.put(`/api/owner/booking/status/${bookingId}`, { status });
    return res.data;
  }
};

// =====================================
// ADMIN API CALLS
// =====================================

export const adminAPI = {
  // Fetch all users list
  getUsers: async () => {
    const res = await api.get('/api/admin/users');
    return res.data;
  },

  // Fetch all properties list
  getProperties: async () => {
    const res = await api.get('/api/admin/properties');
    return res.data;
  },

  // Delete a user (and all their listings/bookings)
  deleteUser: async (userId) => {
    const res = await api.delete(`/api/admin/user/${userId}`);
    return res.data;
  },

  // Delete a property listing (and its bookings)
  deleteProperty: async (propertyId) => {
    const res = await api.delete(`/api/admin/property/${propertyId}`);
    return res.data;
  },

  // Approve Owner account
  approveOwner: async (userId) => {
    const res = await api.put(`/api/admin/approve-owner/${userId}`);
    return res.data;
  },

  // Create a new administrator account (Admins only)
  addAdmin: async (data) => {
    const res = await api.post('/api/admin/add-admin', data);
    return res.data;
  }
};

export default api;
