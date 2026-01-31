import axios from 'axios';

// URL Backend Production
const API_URL = 'https://api.sukajayalempasing.my.id/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// --- INTERCEPTOR ---
// Sebelum request dikirim, cek apakah ada token di localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;