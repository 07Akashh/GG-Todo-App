// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:8080' : 'https://todo-backend-liart-delta.vercel.app',
  TIMEOUT: 30000, // 30 seconds
};

// Auth headers
export const AUTH_HEADERS = {
  SIGNUP: 'cHJlcEluc3RhOnByZXAxMjNASW5zdGE=',
  LOGIN: 'U3RyYW5naWZ5TWFzdGVyOlN0cmFuZ2lmeUF1dGhAMTIz',
};

