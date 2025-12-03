// Load environment variables from .env file FIRST, before any other imports
import "dotenv/config";

import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    // Default to development mode if NODE_ENV is not explicitly set to "production"
    const nodeEnv = process.env.NODE_ENV || "development";
    const isDevelopment = nodeEnv !== "production";
    
    console.log(`\n=== Server Mode Detection ===`);
    console.log(`NODE_ENV from env: ${process.env.NODE_ENV || "(not set)"}`);
    console.log(`Resolved NODE_ENV: ${nodeEnv}`);
    console.log(`Is Development: ${isDevelopment}`);
    console.log(`Will use: ${isDevelopment ? "Vite Dev Server" : "Static Files"}`);
    console.log(`==============================\n`);
    
    if (isDevelopment) {
      try {
        log("Setting up Vite dev server...");
        await setupVite(app, server);
        log("✅ Vite dev server ready - No build needed!");
      } catch (viteError) {
        console.error("❌ Failed to setup Vite dev server:", viteError);
        throw viteError; // Re-throw to prevent fallback to serveStatic
      }
    } else {
      log("Setting up static file server (PRODUCTION MODE)...");
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
