// Authentication API service
import apiClient from './api-client';
import { ApiResponse, LoginRequest, LoginResponse, User } from './types';

export class AuthService {
  /**
   * Login user and store authentication token
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Store token in localStorage
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('refresh_token', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', {
        refreshToken
      });

      if (response.data.success && response.data.data) {
        // Update stored tokens
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('refresh_token', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Token refresh failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Token refresh failed');
    }
  }

  /**
   * Logout user and clear authentication data
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local data
      console.warn('Server logout failed, clearing local data');
    } finally {
      // Clear all auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  /**
   * Get authentication token
   */
  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
