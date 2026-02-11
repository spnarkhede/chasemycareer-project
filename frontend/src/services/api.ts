/**
 * Centralized API Service for ChaseMyCareer Frontend
 * 
 * This service handles all HTTP requests to the backend API.
 * It provides a clean interface for making API calls with:
 * - Automatic token management
 * - Error handling
 * - Request/response interceptors
 * - Type safety
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only data from response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data.data.session;

          // Update tokens
          localStorage.setItem('access_token', access_token);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

// ============================================================================
// Authentication API
// ============================================================================

export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (email: string, password: string, fullName?: string) => {
    return apiClient.post('/auth/signup', {
      email,
      password,
      full_name: fullName,
    });
  },

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    // Store tokens
    if (response.data?.session) {
      localStorage.setItem('access_token', response.data.session.access_token);
      localStorage.setItem('refresh_token', response.data.session.refresh_token);
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    return apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (email: string) => {
    return apiClient.post('/auth/forgot-password', {
      email,
    });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (password: string, token: string) => {
    return apiClient.post('/auth/reset-password', {
      password,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// ============================================================================
// User API
// ============================================================================

export const userApi = {
  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    return apiClient.get('/users/me');
  },

  /**
   * Update current user profile
   */
  updateCurrentUser: async (data: { full_name?: string; avatar_url?: string }) => {
    return apiClient.patch('/users/me', data);
  },

  /**
   * Get all users (admin only)
   */
  getAllUsers: async () => {
    return apiClient.get('/users');
  },

  /**
   * Get user by ID (admin only)
   */
  getUserById: async (id: string) => {
    return apiClient.get(`/users/${id}`);
  },
};

// ============================================================================
// Task API
// ============================================================================

export const taskApi = {
  /**
   * Get all tasks for current user
   */
  getTasks: async (dayNumber?: number) => {
    const params = dayNumber ? { day_number: dayNumber } : {};
    return apiClient.get('/tasks', { params });
  },

  /**
   * Get task by ID
   */
  getTaskById: async (id: string) => {
    return apiClient.get(`/tasks/${id}`);
  },

  /**
   * Create new task
   */
  createTask: async (task: any) => {
    return apiClient.post('/tasks', task);
  },

  /**
   * Update task
   */
  updateTask: async (id: string, updates: any) => {
    return apiClient.patch(`/tasks/${id}`, updates);
  },

  /**
   * Toggle task completion
   */
  toggleTask: async (id: string, completed: boolean) => {
    return apiClient.patch(`/tasks/${id}/toggle`, { completed });
  },

  /**
   * Delete task
   */
  deleteTask: async (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  },
};

// ============================================================================
// Job Application API
// ============================================================================

export const applicationApi = {
  /**
   * Get all applications for current user
   */
  getApplications: async (status?: string) => {
    const params = status ? { status } : {};
    return apiClient.get('/applications', { params });
  },

  /**
   * Get application by ID
   */
  getApplicationById: async (id: string) => {
    return apiClient.get(`/applications/${id}`);
  },

  /**
   * Create new application
   */
  createApplication: async (application: any) => {
    return apiClient.post('/applications', application);
  },

  /**
   * Update application
   */
  updateApplication: async (id: string, updates: any) => {
    return apiClient.patch(`/applications/${id}`, updates);
  },

  /**
   * Delete application
   */
  deleteApplication: async (id: string) => {
    return apiClient.delete(`/applications/${id}`);
  },

  /**
   * Get application statistics
   */
  getApplicationStats: async () => {
    return apiClient.get('/applications/stats');
  },
};

// ============================================================================
// Export default API client for custom requests
// ============================================================================

export default apiClient;
