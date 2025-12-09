// frontend/src/lib/api-client.ts
import axios from 'axios';
import { 
  Configuration, 
  AuthenticationApi, 
  UserApi 
} from '../api/generated';

// Create axios instance - IMPORTANT: No /api in baseURL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// IMPORTANT: No basePath here or empty string
const apiConfig = new Configuration({
  basePath: '', // Empty string or use the same as axiosInstance
});

// Export typed APIs
export const authApi = new AuthenticationApi(apiConfig, undefined, axiosInstance);
export const userApi = new UserApi(apiConfig, undefined, axiosInstance);

export default axiosInstance;