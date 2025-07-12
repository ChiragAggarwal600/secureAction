// Security API service
import apiClient from './api-client';
import { ApiResponse, SecurityOverview, SecurityMetric } from './types';

export class SecurityService {
  /**
   * Get security dashboard overview
   */
  static async getOverview(): Promise<SecurityOverview> {
    try {
      const response = await apiClient.get<ApiResponse<SecurityOverview>>('/security/overview');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch security overview');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch security overview');
    }
  }

  /**
   * Get security metrics
   */
  static async getMetrics(params?: { category?: string; period?: string }): Promise<SecurityMetric[]> {
    try {
      const response = await apiClient.get<ApiResponse<SecurityMetric[]>>('/security/metrics', {
        params
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch security metrics');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch security metrics');
    }
  }
}
