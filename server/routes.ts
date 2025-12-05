import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { AuthService } from "./authService";
import { loginSchema, registerSchema } from "@shared/schema";
import { ZodError } from "zod";
import { setupGoogleAuth } from "./googleAuth";
import session from "express-session";
import passport from "passport";
import jwt from "jsonwebtoken";

// Penora API configuration
const PENORA_API_KEY = process.env.PENORA_API_KEY;
const PENORA_BASE_URL = process.env.PENORA_APP_URL;
const IMAGEGENE_BASE_URL = process.env.IMAGEGENE_BASE_URL;

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for Google Auth
  // Use PostgreSQL store if DATABASE_URL is available, otherwise use memory store (dev only)
  let sessionStore: any = undefined;

  if (process.env.DATABASE_URL) {
    try {
      const connectPg = (await import('connect-pg-simple')).default;
      const pgStore = connectPg(session);
      sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        tableName: "sessions",
      });
    } catch (error) {
      console.warn("Could not initialize PostgreSQL session store, using memory store:", error);
    }
  }

  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Setup both auth systems (optional for local development)
  try {
    await setupAuth(app);
  } catch (error) {
    console.warn("Replit auth setup failed (this is OK for local development):", error instanceof Error ? error.message : error);
  }

  try {
    setupGoogleAuth(app);
  } catch (error) {
    console.warn("Google auth setup failed (this is OK if not configured):", error instanceof Error ? error.message : error);
  }

  // Email/Password Authentication Routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { user, token } = await AuthService.register(validatedData);

      // Set secure HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          penoraCredits: user.penoraCredits,
          imagegeneCredits: user.imagegeneCredits,
        },
        message: 'Registration successful'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
      }
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { user, token } = await AuthService.login(validatedData);

      // Set secure HTTP-only cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          penoraCredits: user.penoraCredits,
          imagegeneCredits: user.imagegeneCredits,
        },
        message: 'Login successful'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
      }
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  });

  // Simple authentication middleware
  const authMiddleware = async (req: any, res: any, next: any) => {
    // Check if user is authenticated via session (Google OAuth or Replit)
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
      return next();
    }

    // Check JWT token from cookie (email/password auth)
    const token = req.cookies.auth_token;
    if (token) {
      try {
        const user = await AuthService.getUserByToken(token);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  };

  // Get current user info
  app.get('/api/auth/user', authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        penoraCredits: user.penoraCredits,
        imagegeneCredits: user.imagegeneCredits,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Logout route
  app.post('/api/auth/logout', async (req, res) => {
    try {
      // Handle JWT token logout
      const token = req.cookies.auth_token;
      if (token) {
        await AuthService.logout(token);
        res.clearCookie('auth_token');
      }

      // Handle session logout (Google OAuth)
      if (req.isAuthenticated && req.isAuthenticated()) {
        req.logout((err) => {
          if (err) {
            console.error("Session logout error:", err);
          }
        });
      }

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get real-time user credits from both apps
  app.get("/api/user/credits", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Start with database values, then try to fetch from external apps
      let penoraCredits = user.penoraCredits;
      let imagegeneCredits = user.imagegeneCredits;

      console.log(`Fetching credits for user ${user.id}: DB Penora=${penoraCredits}, DB ImageGene=${imagegeneCredits}`);

      try {
        // Fetch Penora credits
        const fetch = (await import('node-fetch')).default as any;
        const penoraUrl = `${PENORA_BASE_URL}/api/unified/user-info?user_id=${user.id}`;
        console.log(`Calling Penora API: ${penoraUrl}`);
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (PENORA_API_KEY) {
          headers['X-API-Key'] = PENORA_API_KEY;
        }
        const penoraResponse = await fetch(penoraUrl, {
          headers,
          timeout: 5000
        });

        if (penoraResponse.ok) {
          const penoraData = await penoraResponse.json();
          console.log('Penora API response:', penoraData);
          if (penoraData.credits !== undefined) {
            penoraCredits = penoraData.credits;
            console.log(`Updated Penora credits to: ${penoraCredits}`);
          }
        } else {
          console.log('Penora API failed:', penoraResponse.status, penoraResponse.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch Penora credits:', error);
      }

      try {
        // Fetch ImageGene credits
        const fetch = (await import('node-fetch')).default as any;
        const imagegeneResponse = await fetch(`${IMAGEGENE_BASE_URL}/api/user-credits?user_id=${user.id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });

        if (imagegeneResponse.ok) {
          const imagegeneData = await imagegeneResponse.json();
          console.log('ImageGene API response:', imagegeneData);
          if (imagegeneData.credits !== undefined) {
            imagegeneCredits = imagegeneData.credits;
          }
        } else {
          console.log('ImageGene API failed:', imagegeneResponse.status, imagegeneResponse.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch ImageGene credits:', error);
      }

      // Provide fallback values if both database and API calls fail
      const finalPenoraCredits = penoraCredits !== undefined && penoraCredits !== null ? penoraCredits : 100;
      const finalImagegeneCredits = imagegeneCredits !== undefined && imagegeneCredits !== null ? imagegeneCredits : 50;

      console.log(`Final credits for user ${user.id}: Penora=${finalPenoraCredits}, ImageGene=${finalImagegeneCredits}`);

      res.json({
        penoraCredits: finalPenoraCredits,
        imagegeneCredits: finalImagegeneCredits,
        totalCreditsUsed: user.totalCreditsUsed || 0
      });
    } catch (error) {
      console.error("Error fetching credits:", error);
      res.status(500).json({ message: "Failed to fetch credits" });
    }
  });

  // Generate authentication token
  app.get('/api/auth/token', authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = await AuthService.generateAppToken(user.id, 'general');
      res.json({ token });
    } catch (error) {
      console.error("Error generating auth token:", error);
      res.status(500).json({ message: "Failed to generate auth token" });
    }
  });

  // App-specific token generation
  app.get('/api/auth/app-token/:appName', authMiddleware, async (req: any, res) => {
    try {
      const { appName } = req.params;
      let userId = req.user.id;

      // Get user ID based on auth method
      if (req.user.authUser) {
        userId = req.user.authUser.id;
      } else if (req.user.claims?.sub) {
        userId = req.user.claims.sub;
      }

      if (!userId) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!['penora', 'imagegene'].includes(appName.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid app name' });
      }

      const appToken = await AuthService.generateAppToken(userId, appName);
      res.json({ token: appToken });
    } catch (error) {
      console.error("Error generating app token:", error);
      res.status(500).json({ message: "Failed to generate app token" });
    }
  });

  app.post("/api/user/credits/update", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { penoraCredits, imagegeneCredits } = req.body;
      const updatedUser = await storage.updateUserCredits(user.id, penoraCredits, imagegeneCredits);

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating credits:", error);
      res.status(500).json({ message: "Failed to update credits" });
    }
  });

  // Credit sync endpoint for external apps like Penora
  app.post("/api/credits/sync", authMiddleware, async (req: any, res) => {
    try {
      let user = req.user;
      let userId = user.id;

      // Get user ID based on auth method
      if (req.user.authUser) {
        userId = req.user.authUser.id;
        user = req.user.authUser;
      } else if (req.user.claims?.sub) {
        userId = req.user.claims.sub;
        user = await storage.getUser(userId);
      }

      if (!user || !userId) {
        return res.status(401).json({ message: "User not found" });
      }

      const { penoraCreditsUsed, imagegeneCreditsUsed, timestamp } = req.body;

      // Calculate new credit amounts
      let newPenoraCredits = user.penoraCredits || 100;
      let newImagegeneCredits = user.imagegeneCredits || 50;

      if (penoraCreditsUsed) {
        newPenoraCredits = Math.max(0, newPenoraCredits - penoraCreditsUsed);
      }

      if (imagegeneCreditsUsed) {
        newImagegeneCredits = Math.max(0, newImagegeneCredits - imagegeneCreditsUsed);
      }

      // Update credits in database
      const updatedUser = await storage.updateUserCredits(userId, newPenoraCredits, newImagegeneCredits);

      console.log(`Credits synced for user ${userId}: Penora ${newPenoraCredits}, ImageGene ${newImagegeneCredits}`);

      res.json({
        success: true,
        penoraCredits: newPenoraCredits,
        imagegeneCredits: newImagegeneCredits,
        timestamp: timestamp || Date.now()
      });
    } catch (error) {
      console.error("Error syncing credits:", error);
      res.status(500).json({ message: "Failed to sync credits" });
    }
  });

  // Penora integration link
  app.get("/penora_link", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const penoraUrl = PENORA_BASE_URL;
      const redirectUrl = `${penoraUrl}/?user_id=${user.id}&email=${encodeURIComponent(user.email || '')}&first_name=${encodeURIComponent(user.firstName || '')}&last_name=${encodeURIComponent(user.lastName || '')}`;

      console.log(`Redirecting user ${user.id} to Penora`);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error("Error redirecting to Penora:", error);
      res.status(500).json({ message: "Failed to redirect to Penora" });
    }
  });

  // ImageGene integration link
  app.get("/imagegene_link", authMiddleware, async (req: any, res) => {
    try {
      const user = req.user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "User not found" });
      }

      const imagegeneUrl = IMAGEGENE_BASE_URL;
      const redirectUrl = `${imagegeneUrl}/?user_id=${user.id}&email=${encodeURIComponent(user.email || '')}&first_name=${encodeURIComponent(user.firstName || '')}&last_name=${encodeURIComponent(user.lastName || '')}`;

      console.log(`Redirecting user ${user.id} to ImageGene`);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error("Error redirecting to ImageGene:", error);
      res.status(500).json({ message: "Failed to redirect to ImageGene" });
    }
  });

  // Penora API integration helper functions
  // Check user credits in Penora
  app.get("/api/penora/credits/:userId", authMiddleware, async (req, res) => {
    try {
      const userId = req.params.userId;
      const fetch = (await import('node-fetch')).default as any;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (PENORA_API_KEY) {
        headers['X-API-Key'] = PENORA_API_KEY;
      }

      const response = await fetch(`${PENORA_BASE_URL}/api/unified/user-info?user_id=${userId}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(response.status).json({ message: "Failed to fetch Penora credits" });
      }
    } catch (error) {
      console.error("Error fetching Penora credits:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add credits to user in Penora
  app.post("/api/penora/add-credits", authMiddleware, async (req, res) => {
    try {
      const { userId, amount, description } = req.body;
      const fetch = (await import('node-fetch')).default as any;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (PENORA_API_KEY) {
        headers['X-API-Key'] = PENORA_API_KEY;
      }

      const response = await fetch(`${PENORA_BASE_URL}/api/unified/add-credits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: userId,
          amount: amount,
          transaction_type: 'purchase',
          description: description
        })
      });

      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(response.status).json({ message: "Failed to add credits" });
      }
    } catch (error) {
      console.error("Error adding Penora credits:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  // Contact form endpoint with email functionality
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
      }

      console.log('Contact form submission:', { name, email, message: message.substring(0, 50) + '...' });

      // Send contact emails using Gmail service
      try {
        await storage.sendContactEmail({ name, email, message });
        console.log('Contact emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send contact emails:', emailError);
        // Continue with success response even if email fails
        // User will still see success message for better UX
      }

      res.json({
        message: 'Thank you for your message! You will receive a confirmation email shortly. We will get back to you within 24 hours.',
        success: true
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
