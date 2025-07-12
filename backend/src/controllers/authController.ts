import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '@/db';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import { ApiResponse, AuthRequest, AuthResponse } from '@/types';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  department: z.string().optional(),
});

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Find user by email
      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          passwordHash: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid credentials',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Generate JWT tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(tokenPayload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      const refreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );

      // Update last login
      await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Create session
      await db.userSession.create({
        data: {
          userId: user.id,
          sessionToken: refreshToken,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
        refreshToken,
      };

      const response: ApiResponse<AuthResponse> = {
        success: true,
        data: authResponse,
        message: 'Login successful',
        timestamp: new Date().toISOString(),
      };

      logger.info('User logged in successfully', { userId: user.id, email: user.email });
      res.json(response);
    } catch (error: any) {
      logger.error('Login error:', error);
      
      if (error instanceof z.ZodError) {
        const response: ApiResponse = {
          success: false,
          error: error.errors[0]?.message || 'Validation error',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, password, username, firstName, lastName, department } = validatedData;

      // Check if user already exists
      const existingUser = await db.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          error: 'User with this email or username already exists',
          timestamp: new Date().toISOString(),
        };
        res.status(409).json(response);
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, config.security.bcryptRounds);

      // Create user
      const user = await db.user.create({
        data: {
          email,
          username,
          firstName,
          lastName,
          department,
          passwordHash,
          role: 'VIEWER', // Default role
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      logger.info('User registered successfully', { userId: user.id, email: user.email });

      const response: ApiResponse = {
        success: true,
        data: user,
        message: 'User registered successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error: any) {
      logger.error('Registration error:', error);
      
      if (error instanceof z.ZodError) {
        const response: ApiResponse = {
          success: false,
          error: error.errors[0]?.message || 'Validation error',
          timestamp: new Date().toISOString(),
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (token) {
        // Invalidate session if refresh token is provided
        const refreshToken = req.body.refreshToken;
        if (refreshToken) {
          await db.userSession.updateMany({
            where: { sessionToken: refreshToken },
            data: { isActive: false },
          });
        }
      }

      const response: ApiResponse = {
        success: true,
        message: 'Logout successful',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Logout error:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      };
      res.status(500).json(response);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        const response: ApiResponse = {
          success: false,
          error: 'Refresh token required',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;

      // Check if session exists and is active
      const session = await db.userSession.findFirst({
        where: {
          sessionToken: refreshToken,
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

      if (!session || !session.user.isActive) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid refresh token',
          timestamp: new Date().toISOString(),
        };
        res.status(401).json(response);
        return;
      }

      // Generate new access token (simplified for demo)
      const newToken = 'demo-token-' + Date.now();

      const response: ApiResponse = {
        success: true,
        data: { token: newToken },
        message: 'Token refreshed successfully',
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error: any) {
      logger.error('Refresh token error:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Invalid refresh token',
        timestamp: new Date().toISOString(),
      };
      res.status(401).json(response);
    }
  }
}
