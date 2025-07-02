import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Salon API calls
export const salonAPI = {
  getAllSalons: (params) => api.get('/salons', { params }),
  getSalonById: (id) => api.get(`/salons/${id}`),
  getSalonByOwner: () => api.get('/salons/owner'),
  createSalon: (salonData) => api.post('/salons', salonData),
  updateSalon: (id, salonData) => api.put(`/salons/${id}`, salonData),
  deleteSalon: (id) => api.delete(`/salons/${id}`),
};

// Service API calls
export const serviceAPI = {
  getServicesBySalon: (salonId) => api.get(`/services/salon/${salonId}`),
  getServicesByCurrentSalon: () => api.get('/services/salon'),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (serviceData) => api.post('/services', serviceData),
  addService: (serviceData) => api.post('/services', serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),
};

// Booking API calls
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getBookingsByUser: () => api.get('/bookings/user'),
  getBookingsBySalon: (salonId) => api.get(`/bookings/salon/${salonId}`),
  getBookingsByCurrentSalon: () => api.get('/bookings/salon'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
};

// Review API calls
export const reviewAPI = {
  addReview: (reviewData) => api.post('/reviews', reviewData),
  updateReview: (bookingId, reviewData) => api.put(`/reviews/${bookingId}`, reviewData),
  deleteReview: (bookingId) => api.delete(`/reviews/${bookingId}`),
  getReviewsForSalon: (salonId) => api.get(`/reviews/salon/${salonId}`),
  getReviewsForService: (serviceId) => api.get(`/reviews/service/${serviceId}`),
};

// Upload API calls
export const uploadAPI = {
  uploadImage: (formData) => api.post('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api; 