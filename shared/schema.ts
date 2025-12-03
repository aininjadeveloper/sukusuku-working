import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with enhanced authentication support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For custom email/password auth
  authProvider: varchar("auth_provider").default("google"), // 'google' or 'email'
  isEmailVerified: boolean("is_email_verified").default(false),
  welcomeEmailSent: boolean("welcome_email_sent").default(false),
  penoraCredits: integer("penora_credits").default(100),
  imagegeneCredits: integer("imagegene_credits").default(50),
  totalCreditsUsed: integer("total_credits_used").default(0),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Authentication tokens table for secure session management
export const authTokens = pgTable("auth_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").notNull().unique(),
  type: varchar("type").notNull(), // 'session', 'jwt', 'api'
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_auth_tokens_user_id").on(table.userId),
  index("idx_auth_tokens_token").on(table.token),
]);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type AuthToken = typeof authTokens.$inferSelect;
export type InsertAuthToken = typeof authTokens.$inferInsert;

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
