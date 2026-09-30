import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eec_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized (except on login attempt)
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('eec_auth_token');
        localStorage.removeItem('eec_user_info');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

// Event Services
export const eventApi = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMetadata: () => api.get('/events/metadata')
};

// Registration Services
export const regApi = {
  rsvp: (eventId) => api.post(`/registrations/rsvp/${eventId}`),
  cancel: (registrationId) => api.post(`/registrations/cancel/${registrationId}`),
  getMyRegistrations: () => api.get('/registrations/my-registrations'),
  checkStatus: (eventId) => api.get(`/registrations/status/${eventId}`),
  getAttendees: (eventId) => api.get(`/registrations/event/${eventId}/attendees`),
  toggleCheckIn: (registrationId) => api.patch(`/registrations/${registrationId}/checkin`)
};

// Export Services
export const exportApi = {
  downloadCsv: async (eventId, title) => {
    const response = await api.get(`/export/event/${eventId}/csv`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `SRM_EEC_${title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  downloadJson: async (eventId, title) => {
    const response = await api.get(`/export/event/${eventId}/json`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `SRM_EEC_${title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

// Dashboard Stats Services
export const statsApi = {
  getDashboardStats: () => api.get('/stats/dashboard')
};

export default api;
