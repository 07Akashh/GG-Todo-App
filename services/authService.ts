import { AUTH_HEADERS } from '@/config/api';
import api from './api';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: number;
  res?: {
    accessToken: string;
    _id: string;
    role: number;
    email: string;
    name: string;
    firebaseUid: string;
    lastLogin: string;
    status: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  err?: {
    errCode: number;
    msg: string;
  };
}

export interface ProfileResponse {
  status: number;
  res?: {
    _id: string;
    role: number;
    email: string;
    name: string;
    firebaseUid: string;
    lastLogin: string;
    status: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  err?: {
    errCode: number;
    msg: string;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
  status?: boolean;
  isDeleted?: boolean;
}

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', data, {
        headers: {
          Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle API error responses (409, etc.)
      if (error.response?.data) {
        return error.response.data;
      }
      // Handle network errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data, {
        headers: {
          Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle API error responses
      if (error.response?.data) {
        return error.response.data;
      }
      // Handle network errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  getProfile: async (accessToken: string): Promise<ProfileResponse> => {
    try {
      const response = await api.get<ProfileResponse>('/user/profile', {
        headers: {
          accessToken: accessToken,
          Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle API error responses
      if (error.response?.data) {
        return error.response.data;
      }
      // Handle network errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  logout: async (accessToken: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/logout',
        {},
        {
          headers: {
            accessToken: accessToken,
            Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      // Handle API error responses
      if (error.response?.data) {
        return error.response.data;
      }
      // Handle network errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  updateProfile: async (accessToken: string, data: UpdateProfileRequest): Promise<ProfileResponse> => {
    try {
      const response = await api.put<ProfileResponse>('/user/profile', data, {
        headers: {
          accessToken: accessToken,
          Authorization: `Basic ${AUTH_HEADERS.LOGIN}`,
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle API error responses
      if (error.response?.data) {
        return error.response.data;
      }
      // Handle network errors
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Network error. Please check your connection.');
    }
  },
};

