import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.marqait.com/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    
    if (status === 401 && originalRequest && !originalRequest.url?.includes('/auth/')) {
      try {
        const { authService } = await import('../api/services/auth');
        await authService.refreshToken();
        
        const token = localStorage.getItem('auth_token');
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    if (status === 401 && originalRequest?.url?.includes('/auth/')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    
    if (status === 403) {
      console.error('Access forbidden');
    }
    
    if (status && status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;