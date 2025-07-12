// Blockchain Security API service
import apiClient from './api-client';
import { ApiResponse, BlockchainTransaction, BlockchainFilterParams } from './types';

export class BlockchainService {
  /**
   * Get blockchain transactions
   */
  static async getTransactions(params?: BlockchainFilterParams): Promise<BlockchainTransaction[]> {
    try {
      const response = await apiClient.get<ApiResponse<BlockchainTransaction[]>>('/blockchain/transactions', {
        params
      });
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch blockchain transactions');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch blockchain transactions');
    }
  }

  /**
   * Get specific transaction
   */
  static async getTransaction(id: string): Promise<BlockchainTransaction> {
    try {
      const response = await apiClient.get<ApiResponse<BlockchainTransaction>>(`/blockchain/transactions/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch transaction');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch transaction');
    }
  }

  /**
   * Verify blockchain transaction
   */
  static async verifyTransaction(id: string): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/blockchain/verify/${id}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to verify transaction');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to verify transaction');
    }
  }

  /**
   * Get blockchain statistics
   */
  static async getBlockchainStats(): Promise<any> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/blockchain/stats');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to fetch blockchain stats');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch blockchain stats');
    }
  }
}
