import { authService, LoginRequest, SignupRequest, UpdateProfileRequest } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: number;
  firebaseUid?: string;
  avatar?: string;
  lastLogin?: string;
  status: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  hasCompletedOnboarding: false,
};

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data);
      
      // Handle success response (status 200)
      if (response.status === 200 && response.res) {
        // Store token and user data
        await AsyncStorage.setItem('accessToken', response.res.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(response.res));
        
        return {
          user: response.res,
          accessToken: response.res.accessToken,
        };
      }
      
      // Handle error response (status 409, etc.)
      if (response.err) {
        return rejectWithValue(response.err.msg || 'Registration failed');
      }
      
      // Fallback error
      return rejectWithValue('Registration failed. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      
      // Handle success response (status 200)
      if (response.status === 200 && response.res) {
        // Store token and user data
        await AsyncStorage.setItem('accessToken', response.res.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(response.res));
        
        return {
          user: response.res,
          accessToken: response.res.accessToken,
        };
      }
      
      // Handle error response
      if (response.err) {
        return rejectWithValue(response.err.msg || 'Login failed');
      }
      
      // Fallback error
      return rejectWithValue('Login failed. Please check your credentials.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const loadAuthState = createAsyncThunk(
  'auth/loadAuthState',
  async () => {
    try {
      const [token, userData, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('onboardingCompleted'),
      ]);

      if (token && userData) {
        const user = JSON.parse(userData);
        return {
          user,
          accessToken: token,
          hasCompletedOnboarding: onboardingStatus === 'true',
        };
      }

      return {
        hasCompletedOnboarding: onboardingStatus === 'true',
      };
    } catch (error) {
      console.error('Error loading auth state:', error);
      return { hasCompletedOnboarding: false };
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;

      // Call logout API if we have an access token
      if (accessToken) {
        try {
          await authService.logout(accessToken);
        } catch (error) {
          // Even if API call fails, we should still clear local storage
          console.error('Logout API call failed:', error);
        }
      }

      // Clear local storage regardless of API call result
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
    } catch (error: any) {
      // Even if there's an error, clear local storage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('user');
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;
      
      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await authService.getProfile(accessToken);
      
      // Handle success response (status 200)
      if (response.status === 200 && response.res) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.res));
        return response.res;
      }
      
      // Handle error response
      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to fetch profile');
      }
      
      // Fallback error
      return rejectWithValue('Failed to fetch profile. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: UpdateProfileRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;
      
      if (!accessToken) {
        return rejectWithValue('No access token available');
      }

      const response = await authService.updateProfile(accessToken, data);
      
      // Handle success response (status 200)
      if (response.status === 200 && response.res) {
        // Update stored user data
        await AsyncStorage.setItem('user', JSON.stringify(response.res));
        return response.res;
      }
      
      // Handle error response
      if (response.err) {
        return rejectWithValue(response.err.msg || 'Failed to update profile');
      }
      
      // Fallback error
      return rejectWithValue('Failed to update profile. Please try again.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Load auth state
    builder
      .addCase(loadAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user && action.payload.accessToken) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.isAuthenticated = true;
        }
        state.hasCompletedOnboarding = action.payload.hasCompletedOnboarding || false;
      })
      .addCase(loadAuthState.rejected, (state) => {
        state.isLoading = false;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    });

    // Complete onboarding
    builder.addCase(completeOnboarding.fulfilled, (state) => {
      state.hasCompletedOnboarding = true;
    });

    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

