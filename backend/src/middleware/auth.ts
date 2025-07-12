import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { config } from '@/config';
import { ApiResponse } from '@/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      const response: ApiResponse = {
        success: false,
        error: 'Access token required',
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Verify user exists and is active
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid or inactive user',
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Invalid token',
      timestamp: new Date().toISOString(),
    };
    res.status(403).json(response);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
      return;
    }

    if (!roles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Insufficient permissions',
        timestamp: new Date().toISOString(),
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};
