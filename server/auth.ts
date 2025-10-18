// Supabase Auth integration for FairFence
import { Express, Request, Response, NextFunction } from "express";
import { getSupabaseClient } from "./db";
import { User as AuthUser } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Middleware to extract user from Supabase session
async function extractSupabaseUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = undefined;
      return next();
    }

    const token = authHeader.substring(7);
    
    const supabase = getSupabaseClient(true); // Use service role for verification
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      req.user = undefined;
    } else {
      req.user = user;
    }
    
    next();
  } catch (error) {
    console.warn('Error extracting Supabase user:', error);
    req.user = undefined;
    next();
  }
}

// Middleware to require authentication
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function setupAuth(app: Express) {
  console.log('✅ Setting up Supabase Auth middleware');
  
  // Apply Supabase auth middleware to all routes
  app.use(extractSupabaseUser);

  // Note: Auth endpoints (login/register/logout) are now handled directly by frontend using Supabase client


  app.get("/api/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    res.json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.user_metadata?.role || 'viewer',
      created_at: req.user.created_at,
    });
  });

  
  // Export middleware for use in protected routes
  app.use('/api/admin', requireAuth);
  
  console.log('✅ Supabase Auth setup complete');
}