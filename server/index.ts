import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupAuth } from "./auth";
import { setupVite, serveStatic, log } from "./vite";
import configManager, { getConfig } from "./config";
import { initializeDatabase } from "./db";

const app = express();

// Basic Express middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
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
        const responseStr = JSON.stringify(capturedJsonResponse);
        // Show first 200 characters for better debugging visibility
        if (responseStr.length > 200) {
          logLine += ` :: ${responseStr.slice(0, 197)}...`;
        } else {
          logLine += ` :: ${responseStr}`;
        }
      }

      log(logLine);
    }
  });

  next();
});

// Add health check endpoint for deployment verification
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Add error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit in production to maintain service availability
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production to maintain service availability
});

(async () => {
  const server = express();
  
  try {
    // Initialize configuration first with error handling
    try {
      log('Initializing configuration...');
      await configManager.initialize();
      log('✅ Configuration loaded successfully');
      
      // Debug configuration status
      const configStatus = configManager.getStatus();
      log(`Configuration mode: ${configStatus.mode}`);
      log(`Has service key: ${configStatus.hasServiceKey}`);
    } catch (configError) {
      log('⚠️ Configuration initialization failed, using defaults');
      console.error('Configuration error:', configError);
      // Continue with default configuration
    }
    
    // Initialize database with error handling
    try {
      log('Initializing database...');
      await initializeDatabase();
      log('✅ Database initialized successfully');
    } catch (dbError) {
      log('⚠️ Database initialization failed');
      console.error('Database error:', dbError);
      // Database is critical - cannot continue without it
      throw dbError;
    }
    
    // Setup authentication after database is ready
    try {
      setupAuth(app);
      log('✅ Authentication middleware setup complete');
    } catch (authError) {
      log('❌ Failed to setup authentication');
      throw authError;
    }
    
    // Register routes
    try {
      const httpServer = await registerRoutes(app);
      log('✅ Routes registered successfully');
      
      // Error handler middleware (must be after routes)
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        
        // Log the error for debugging
        console.error('Request error:', err);
        
        // Send response but don't throw
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });

      // Setup static file serving based on environment
      if (app.get("env") === "development") {
        await setupVite(app, httpServer);
        log('✅ Development server (Vite) configured');
      } else {
        serveStatic(app);
        log('✅ Production static files configured');
      }

      // CRITICAL: Use PORT environment variable for Cloud Run/Autoscale
      // Simplified to avoid config loading issues during deployment
      let port = parseInt(process.env.PORT || '5000', 10);
      
      // Function to check if port is available
      const isPortAvailable = (testPort: number): Promise<boolean> => {
        return new Promise((resolve) => {
          const testServer = require('net').createServer();
          testServer.listen(testPort, '0.0.0.0', () => {
            testServer.close(() => resolve(true));
          });
          testServer.on('error', () => resolve(false));
        });
      };
      
      // Find available port if default is in use
      if (!process.env.PORT) { // Only check for alternative ports in development
        let portFound = false;
        for (let testPort = port; testPort <= port + 10; testPort++) {
          if (await isPortAvailable(testPort)) {
            port = testPort;
            portFound = true;
            break;
          }
        }
        
        if (!portFound) {
          console.error('❌ No available ports found in range 5000-5010');
          console.error('Please stop other processes or restart the environment');
          process.exit(1);
        }
        
        if (port !== parseInt(process.env.PORT || '5000', 10)) {
          log(`⚠️ Port 5000 in use, using port ${port} instead`);
        }
      }
      
      // CRITICAL: Bind to 0.0.0.0 for Cloud Run/Autoscale compatibility
      // The host MUST be 0.0.0.0, not localhost or 127.0.0.1
      httpServer.listen(port, '0.0.0.0', () => {
        log(`✅ Server started successfully`);
        log(`serving on http://0.0.0.0:${port}`);
        log(`Environment: ${app.get("env")}`);
        
        // Log configuration status if available
        try {
          const configStatus = configManager.getStatus();
          log(`Configuration mode: ${configStatus.mode}`);
          if (configStatus.mode === 'wordpress') {
            log(`WordPress API: ${getConfig('WORDPRESS_API_URL')}`);
          }
          log(`Service role key available: ${configStatus.hasServiceKey}`);
        } catch (statusError) {
          // Ignore status logging errors
        }
      });
      
      // Handle server errors
      httpServer.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`❌ Port ${port} is already in use`);
          console.error('Please stop other processes using this port:');
          console.error('  - Click the Stop button if the app is running');
          console.error('  - Press Ctrl+C in any terminal running the server');
          console.error('  - Run "killall node" to stop all Node.js processes');
          console.error('  - Restart the Repl if the issue persists');
        } else if (error.code === 'EACCES') {
          console.error(`❌ Permission denied to bind to port ${port}`);
        } else {
          console.error('❌ Server error:', error);
        }
        process.exit(1);
      });
      
    } catch (routeError) {
      log('❌ Failed to register routes');
      throw routeError; // This is critical, can't continue without routes
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Ensure clean exit
    process.exit(1);
  }
})();
