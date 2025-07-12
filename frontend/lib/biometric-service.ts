// Biometric Authentication API service
import apiClient from './api-client';
import { ApiResponse, BiometricData, BiometricEnrollRequest, BiometricAuthRequest } from './types';

export class BiometricService {
  /**
   * Get biometric data and statistics
   */
  static async getBiometricData(): Promise<BiometricData> {
    try {
      const response = await apiClient.get<ApiResponse<BiometricData>>('/biometric/data');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch biometric data');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch biometric data');
    }
  }

  /**
   * Enroll biometric data (Admin/Security Manager only)
   */
  static async enrollBiometric(data: BiometricEnrollRequest): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/biometric/enroll', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to enroll biometric');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to enroll biometric');
    }
  }

  /**
   * Authenticate using biometric data
   */
  static async authenticateBiometric(data: BiometricAuthRequest): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/biometric/authenticate', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Biometric authentication failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Biometric authentication failed');
    }
  }

  /**
   * Get biometric statistics
   */
  static async getBiometricStats(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/biometric/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch biometric stats');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch biometric stats');
    }
  }

  /**
   * Get biometric authentication history for a user
   */
  static async getBiometricHistory(userId: string): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/biometric/history/${userId}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch biometric history');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch biometric history');
    }
  }
}
