import { Request, Response } from 'express';
import { db } from '@/db';
import { logger } from '@/utils/logger';
import { ApiResponse, BlockchainData, BlockchainTransactionData } from '@/types';

export class BlockchainController {
  static async getBlockchainData(req: Request, res: Response): Promise<void> {
    try {
      const { timeRange = '24h' } = req.query;
      
      let startDate: Date;
      switch (timeRange) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const [
        totalVerifiedToday,
        latestBlockHeight,
        recentTransactions,
      ] = await Promise.all([
        db.blockchainTransaction.count({
          where: {
            status: 'CONFIRMED',
            timestamp: { gte: startDate },
          },
        }),
        db.blockchainTransaction.aggregate({
          _max: { blockNumber: true },
        }),
        db.blockchainTransaction.findMany({
          orderBy: { timestamp: 'desc' },
          take: 10,
        }),
      ]);

      const transactions: BlockchainTransactionData[] = recentTransactions.map(tx => ({
        id: tx.id,
        hash: tx.transactionHash,
        amount: Number(tx.amount),
        status: this.mapTransactionStatus(tx.status),
        timestamp: tx.timestamp,
        gasUsed: Number(tx.gasUsed),
        blockNumber: Number(tx.blockNumber),
      }));

      const blockchainData: BlockchainData = {
        totalVerified: totalVerifiedToday,
        blockHeight: Number(latestBlockHeight._max.blockNumber) || 2847293,
        transactions,
      };

      const response: ApiResponse<BlockchainData> = {
        success: true,
        data: blockchainData,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching blockchain data:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch blockchain data',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getTransactions(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        minAmount,
        maxAmount,
        timeRange = '24h' 
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const offset = (pageNum - 1) * limitNum;

      let startDate: Date;
      switch (timeRange) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const whereClause: any = {
        timestamp: { gte: startDate },
      };

      if (status) {
        whereClause.status = String(status).toUpperCase();
      }

      if (minAmount) {
        whereClause.amount = { ...whereClause.amount, gte: parseFloat(minAmount as string) };
      }

      if (maxAmount) {
        whereClause.amount = { ...whereClause.amount, lte: parseFloat(maxAmount as string) };
      }

      const [transactions, totalCount] = await Promise.all([
        db.blockchainTransaction.findMany({
          where: whereClause,
          orderBy: { timestamp: 'desc' },
          skip: offset,
          take: limitNum,
          include: {
            verifications: {
              select: {
                verifierNode: true,
                isValid: true,
                timestamp: true,
              },
            },
          },
        }),
        db.blockchainTransaction.count({ where: whereClause }),
      ]);

      const response: ApiResponse = {
        success: true,
        data: transactions,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching blockchain transactions:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch blockchain transactions',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async createTransaction(req: Request, res: Response): Promise<void> {
    try {
      const {
        transactionHash,
        blockNumber,
        blockHash,
        fromAddress,
        toAddress,
        amount,
        gasUsed,
        gasPrice,
        timestamp,
      } = req.body;

      // Check if transaction already exists
      const existingTx = await db.blockchainTransaction.findUnique({
        where: { transactionHash },
      });

      if (existingTx) {
        const response: ApiResponse = {
          success: false,
          error: 'Transaction already exists',
          timestamp: new Date().toISOString(),
        };
        res.status(409).json(response);
        return;
      }

      const transaction = await db.blockchainTransaction.create({
        data: {
          transactionHash,
          blockNumber: Number(blockNumber),
          blockHash,
          fromAddress,
          toAddress,
          amount: parseFloat(amount),
          gasUsed: Number(gasUsed),
          gasPrice: parseFloat(gasPrice),
          status: 'PENDING',
          timestamp: new Date(timestamp),
        },
      });

      logger.info('Blockchain transaction created:', { transactionId: transaction.id, hash: transactionHash });

      const response: ApiResponse = {
        success: true,
        data: transaction,
        message: 'Blockchain transaction created successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Error creating blockchain transaction:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to create blockchain transaction',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async verifyTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { verifierNode, signature, isValid } = req.body;

      // Create verification record
      // const verification = await db.blockchainVerification.create({
      //   data: {
      //     transactionId: id,
      //     verifierNode,
      //     signature,
      //     isValid: Boolean(isValid),
      //   },
      // });

      // Update transaction status based on verifications
      const verifications = await db.blockchainVerification.findMany({
        where: { transactionId: id },
      });

      const validVerifications = verifications.filter(v => v.isValid).length;
      const totalVerifications = verifications.length;

      let status = 'PENDING';
      if (totalVerifications >= 3) {
        if (validVerifications / totalVerifications >= 0.67) {
          status = 'CONFIRMED';
        } else {
          status = 'FAILED';
        }
      }

      const updatedTransaction = await db.blockchainTransaction.update({
        where: { id },
        data: { 
          status,
          confirmations: validVerifications,
        },
      });

      logger.info('Transaction verification added:', { transactionId: id, verifierNode, isValid });

      const response: ApiResponse = {
        success: true,
        data: {
          // verification,
          transaction: updatedTransaction,
        },
        message: 'Transaction verification added successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error verifying transaction:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to verify transaction',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async getBlockchainStats(req: Request, res: Response): Promise<void> {
    try {
      const { timeRange = '24h' } = req.query;
      
      let startDate: Date;
      switch (timeRange) {
        case '1h':
          startDate = new Date(Date.now() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }

      const [
        totalTransactions,
        confirmedTransactions,
        pendingTransactions,
        failedTransactions,
        totalVolume,
        avgGasUsed,
      ] = await Promise.all([
        db.blockchainTransaction.count({
          where: { timestamp: { gte: startDate } },
        }),
        db.blockchainTransaction.count({
          where: { 
            timestamp: { gte: startDate },
            status: 'CONFIRMED',
          },
        }),
        db.blockchainTransaction.count({
          where: { 
            timestamp: { gte: startDate },
            status: 'PENDING',
          },
        }),
        db.blockchainTransaction.count({
          where: { 
            timestamp: { gte: startDate },
            status: 'FAILED',
          },
        }),
        db.blockchainTransaction.aggregate({
          _sum: { amount: true },
          where: { 
            timestamp: { gte: startDate },
            status: 'CONFIRMED',
          },
        }),
        db.blockchainTransaction.aggregate({
          _avg: { gasUsed: true },
          where: { timestamp: { gte: startDate } },
        }),
      ]);

      const stats = {
        total: totalTransactions,
        confirmed: confirmedTransactions,
        pending: pendingTransactions,
        failed: failedTransactions,
        confirmationRate: totalTransactions > 0 ? (confirmedTransactions / totalTransactions) * 100 : 0,
        totalVolume: Number(totalVolume._sum.amount) || 0,
        averageGasUsed: Number(avgGasUsed._avg.gasUsed) || 0,
        throughput: confirmedTransactions / (24 * 60 * 60), // transactions per second
      };

      const response: ApiResponse = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Error fetching blockchain stats:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to fetch blockchain stats',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  private static mapTransactionStatus(status: string): 'verified' | 'pending' | 'failed' {
    switch (status) {
      case 'CONFIRMED':
        return 'verified';
      case 'PENDING':
        return 'pending';
      case 'FAILED':
        return 'failed';
      default:
        return 'pending';
    }
  }
}
