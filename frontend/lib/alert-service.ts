// Alerts API service
import apiClient from './api-client';
import { ApiResponse, Alert, CreateAlertRequest, AlertFilterParams } from './types';

export class AlertService {
  /**
   * Get alerts list
   */
  static async getAlerts(params?: AlertFilterParams): Promise<Alert[]> {
    try {
      const response = await apiClient.get<ApiResponse<Alert[]>>('/alerts', {
        params
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch alerts');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch alerts');
    }
  }

  /**
   * Create new alert
   */
  static async createAlert(alert: CreateAlertRequest): Promise<Alert> {
    try {
      const response = await apiClient.post<ApiResponse<Alert>>('/alerts', alert);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to create alert');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create alert');
    }
  }

  /**
   * Mark alert as read
   */
  static async markAsRead(id: string): Promise<Alert> {
    try {
      const response = await apiClient.put<ApiResponse<Alert>>(`/alerts/${id}/read`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to mark alert as read');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to mark alert as read');
    }
  }

  /**
   * Resolve alert
   */
  static async resolveAlert(id: string, resolutionNotes?: string): Promise<Alert> {
    try {
      const response = await apiClient.put<ApiResponse<Alert>>(`/alerts/${id}/resolve`, {
        resolutionNotes
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to resolve alert');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to resolve alert');
    }
  }

  /**
   * Delete alert (Admin only)
   */
  static async deleteAlert(id: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/alerts/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete alert');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete alert');
    }
  }
}
