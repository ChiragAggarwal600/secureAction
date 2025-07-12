// Fraud Detection API service
import apiClient from './api-client';
import { ApiResponse, FraudEvent, FraudFilterParams } from './types';

export class FraudService {
  /**
   * Get fraud events list
   */
  static async getFraudEvents(params?: FraudFilterParams): Promise<FraudEvent[]> {
    try {
      const response = await apiClient.get<ApiResponse<FraudEvent[]>>('/fraud/events', {
        params
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch fraud events');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch fraud events');
    }
  }

  /**
   * Get specific fraud event
   */
  static async getFraudEvent(id: string): Promise<FraudEvent> {
    try {
      const response = await apiClient.get<ApiResponse<FraudEvent>>(`/fraud/events/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch fraud event');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch fraud event');
    }
  }

  /**
   * Review fraud event
   */
  static async reviewFraudEvent(id: string, status: string, notes?: string): Promise<FraudEvent> {
    try {
      const response = await apiClient.put<ApiResponse<FraudEvent>>(`/fraud/events/${id}/review`, {
        status,
        notes
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to review fraud event');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to review fraud event');
    }
  }

  /**
   * Get fraud statistics
   */
  static async getFraudStats(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/fraud/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch fraud stats');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch fraud stats');
    }
  }
}
