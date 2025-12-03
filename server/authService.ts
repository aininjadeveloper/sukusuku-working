import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users, authTokens, type User, type LoginInput, type RegisterInput } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { storage } from './storage';

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Using a default secret for development only.");
}
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-do-not-use-in-production';
const JWT_EXPIRES_IN = '7d';
const SESSION_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export class AuthService {
  // Generate JWT token
  static generateJWT(userId: string): string {
    return jwt.sign(
      { userId, iat: Date.now() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Verify JWT token
  static verifyJWT(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch {
      return null;
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Verify password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Register new user with email/password
  static async register(data: RegisterInput): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(data.password);

    // Create user with default credits
    const [user] = await db.insert(users).values({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash,
      authProvider: 'email',
      isEmailVerified: false,
      penoraCredits: 100,
      imagegeneCredits: 50,
      totalCreditsUsed: 0,
    }).returning();

    // Generate token
    const token = this.generateJWT(user.id);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);

    // Store token in database
    await db.insert(authTokens).values({
      userId: user.id,
      token,
      type: 'jwt',
      expiresAt,
    });

    // Send welcome email for new user registration using Gmail service
    if (user.email && user.firstName) {
      try {
        await storage.sendWelcomeEmail(user);

        // Update user to mark welcome email as sent
        await db.update(users)
          .set({ welcomeEmailSent: true, updatedAt: new Date() })
          .where(eq(users.id, user.id));
        console.log(`Welcome email sent to new user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to send welcome email to ${user.email}:`, error);
      }
    }

    return { user, token };
  }

  // Login with email/password
  static async login(data: LoginInput): Promise<{ user: User; token: string }> {
    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user registered with email/password
    if (user.authProvider !== 'email' || !user.passwordHash) {
      throw new Error('Please use Google login for this account');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

    // Generate token
    const token = this.generateJWT(user.id);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);

    // Clean up old tokens and store new one
    await db.delete(authTokens).where(and(eq(authTokens.userId, user.id), eq(authTokens.type, 'jwt')));
    await db.insert(authTokens).values({
      userId: user.id,
      token,
      type: 'jwt',
      expiresAt,
    });

    return { user, token };
  }

  // Get user by token
  static async getUserByToken(token: string): Promise<User | null> {
    // First verify JWT
    const decoded = this.verifyJWT(token);
    if (!decoded) return null;

    // Check token in database
    const [tokenRecord] = await db.select().from(authTokens)
      .where(and(eq(authTokens.token, token), eq(authTokens.type, 'jwt')))
      .limit(1);

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return null;
    }

    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    return user || null;
  }

  // Logout (remove token)
  static async logout(token: string): Promise<void> {
    await db.delete(authTokens).where(eq(authTokens.token, token));
  }

  // Generate app-specific token for Penora/ImageGene
  static async generateAppToken(userId: string, appName: string): Promise<string> {
    // Get user details for the token
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new Error('User not found');
    }

    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        penoraCredits: user.penoraCredits || 100,
        imagegeneCredits: user.imagegeneCredits || 50,
        appName,
        iat: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Shorter expiry for app tokens
    );
  }

  // Clean up expired tokens
  static async cleanupExpiredTokens(): Promise<void> {
    await db.delete(authTokens).where(sql`expires_at < NOW()`);
  }
}