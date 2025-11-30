import { API_CONFIG } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api/v1`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json, text/plain, */*',
  },
});

// Helper function to mask sensitive data in headers
const maskSensitiveHeaders = (headers: any): any => {
  const masked = { ...headers };
  if (masked.Authorization) {
    masked.Authorization = masked.Authorization.substring(0, 20) + '...';
  }
  if (masked.accessToken) {
    masked.accessToken = masked.accessToken.substring(0, 20) + '...';
  }
  return masked;
};

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    // Only add Bearer token if Authorization header is not already set
    // This allows endpoints like profile to use Basic auth
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details (only in dev mode)
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.log('\n📤 ========== API REQUEST ==========');
      console.log(`🕐 Time: ${timestamp}`);
      console.log(`🔹 Method: ${config.method?.toUpperCase()}`);
      console.log(`🔹 URL: ${config.baseURL}${config.url}`);
      console.log(`🔹 Headers:`, maskSensitiveHeaders(config.headers));
      if (config.data) {
        console.log(`🔹 Body:`, config.data);
      }
      if (config.params) {
        console.log(`🔹 Params:`, config.params);
      }
      console.log('=====================================\n');
    }

    // Add timestamp to config for response logging
    (config as any).metadata = { startTime: Date.now() };

    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('\n❌ ========== REQUEST ERROR ==========');
      console.error(`🔹 Error:`, error.message);
      console.error('=====================================\n');
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and log responses
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as AxiosRequestConfig & { metadata?: { startTime: number } };
    const duration = config.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;

    // Log response details (only in dev mode)
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.log('\n📥 ========== API RESPONSE ==========');
      console.log(`🕐 Time: ${timestamp}`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`🔹 Method: ${config.method?.toUpperCase()}`);
      console.log(`🔹 URL: ${config.baseURL}${config.url}`);
      console.log(`🔹 Status: ${response.status} ${response.statusText}`);
      console.log(`🔹 Data:`, response.data);
      console.log('=====================================\n');
    }

    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { metadata?: { startTime: number } };
    const duration = config?.metadata?.startTime ? Date.now() - config.metadata.startTime : 0;

    // Log error details (only in dev mode)
    if (__DEV__) {
      const timestamp = new Date().toISOString();
      console.error('\n❌ ========== API ERROR ==========');
      console.error(`🕐 Time: ${timestamp}`);
      console.error(`⏱️  Duration: ${duration}ms`);
      if (config) {
        console.error(`🔹 Method: ${config.method?.toUpperCase()}`);
        console.error(`🔹 URL: ${config.baseURL}${config.url}`);
      }
      if (error.response) {
        console.error(`🔹 Status: ${error.response.status} ${error.response.statusText}`);
        console.error(`🔹 Response Data:`, error.response.data);
      } else if (error.request) {
        console.error(`🔹 Request made but no response received`);
        console.error(`🔹 Error:`, error.message);
      } else {
        console.error(`🔹 Error:`, error.message);
      }
      console.error('=====================================\n');
    }

    if (error.response?.status === 401 || error.response?.status === 402) {
      // Token expired or invalid
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

