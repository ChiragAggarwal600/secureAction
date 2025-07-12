// Threat Intelligence API service
import apiClient from './api-client';
import { ApiResponse, ThreatEvent, CreateThreatRequest, ThreatFilterParams } from './types';

export class ThreatService {
  /**
   * Get threat events list
   */
  static async getThreats(params?: ThreatFilterParams): Promise<ThreatEvent[]> {
    try {
      const response = await apiClient.get<ApiResponse<ThreatEvent[]>>('/threats', {
        params
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch threats');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch threats');
    }
  }

  /**
   * Get specific threat event
   */
  static async getThreat(id: string): Promise<ThreatEvent> {
    try {
      const response = await apiClient.get<ApiResponse<ThreatEvent>>(`/threats/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch threat');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch threat');
    }
  }

  /**
   * Create new threat event
   */
  static async createThreat(threat: CreateThreatRequest): Promise<ThreatEvent> {
    try {
      const response = await apiClient.post<ApiResponse<ThreatEvent>>('/threats', threat);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create threat');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create threat');
    }
  }

  /**
   * Update threat status
   */
  static async updateThreatStatus(id: string, status: string): Promise<ThreatEvent> {
    try {
      const response = await apiClient.put<ApiResponse<ThreatEvent>>(`/threats/${id}/status`, {
        status
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to update threat status');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update threat status');
    }
  }

  /**
   * Get threat statistics
   */
  static async getThreatStats(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/threats/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch threat stats');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch threat stats');
    }
  }
}
