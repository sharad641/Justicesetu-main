// Use VITE_API_URL if deployed on Vercel, otherwise fallback to local backend for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store', // Prevent aggressive browser caching returning HTTP 304s
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getProfile: () => request('/auth/me', { method: 'GET' }),
  getLawyers: () => request('/users/lawyers', { method: 'GET' }),
  updateProfile: (profileData) => request('/users/update', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Cases
  getCases: () => request('/cases', { method: 'GET' }),
  getCaseById: (id) => request(`/cases/${id}`, { method: 'GET' }),
  createCase: (caseData) => request('/cases', { method: 'POST', body: JSON.stringify(caseData) }),

  // Consultations
  getMyConsultations: () => request('/consultations/my-consultations', { method: 'GET' }),
  bookConsultation: (bookingData) => request('/consultations/book', { method: 'POST', body: JSON.stringify(bookingData) }),
  updateConsultationLink: (id, link) => request(`/consultations/${id}/link`, { method: 'PUT', body: JSON.stringify({ link }) }),

  // Document Vault Routes
  uploadDocument: (documentData) => request('/documents/upload', { method: 'POST', body: JSON.stringify(documentData) }),
  getMyDocuments: () => request('/documents/my-vault', { method: 'GET' }),

  // Case Tracker Routes
  addCaseUpdate: (updateData) => request('/tracker/update', { method: 'POST', body: JSON.stringify(updateData) }),
  getCaseHistory: (cvrNumber) => request(`/tracker/track/${cvrNumber}`, { method: 'GET' }),

  // Admin Control Panel Routes
  getAdminStats: () => request('/admin/stats', { method: 'GET' }),
  getAllUsers: () => request('/admin/users', { method: 'GET' }),
  getPendingLawyers: () => request('/admin/pending-lawyers', { method: 'GET' }),
  verifyLawyer: (id) => request(`/admin/verify-lawyer/${id}`, { method: 'PUT' }),

  // AI Assistant
  askAI: (query, history) => request('/ai/ask', { method: 'POST', body: JSON.stringify({ query, history }) }),
};

export default api;
