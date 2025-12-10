import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";
import type { Profile } from "passport-google-oauth20";

export function setupGoogleAuth(app: Express) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("Google OAuth credentials not found - Google login will be disabled");
    return;
  }

  const serverUrl = process.env.SERVER_URL || process.env.CLIENT_URL || '';

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${serverUrl}/api/auth/google/callback`
  },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
      try {
        const userEmail = profile.emails?.[0]?.value;
        if (!userEmail) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        const userData = {
          id: profile.id,
          email: userEmail,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          profileImageUrl: profile.photos?.[0]?.value,
          authProvider: 'google',
          isEmailVerified: true,
          lastLoginAt: new Date(),
        };

        console.log('Google Auth - Processing user:', userData.email);

        // Check if this is a new user (doesn't exist yet)
        const existingUser = userData.email ? await storage.getUserByEmail(userData.email) : null;
        const isNewUser = !existingUser;

        const user = await storage.upsertUser(userData);
        console.log('Google Auth - User upserted successfully:', user.id);

        // Send welcome email for new Google users using Gmail service
        if (isNewUser && user.email) {
          try {
            await storage.sendWelcomeEmail(user);
            console.log('Welcome email sent to new Google user:', user.email);
          } catch (error) {
            console.error('Failed to send welcome email to Google user:', error);
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Google Auth - Error:', error);
        // Provide better error message for database connection issues
        if (error instanceof Error) {
          if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
            const dbError = new Error('Database connection failed. Please ensure your local PostgreSQL server is running and DATABASE_URL in .env is correct.');
            console.error('❌ Database connection error:', dbError.message);
            return done(dbError, undefined);
          }
        }
        return done(error as Error, undefined);
      }
    }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );
}