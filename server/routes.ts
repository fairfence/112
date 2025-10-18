import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  testDatabaseConnection,
  getTablesList,
  findPricingTables,
  getTableStructure,
  fetchTableData,
  fetchPricingByType,
  fetchAllPricing,
  supabase,
  supabaseAdmin
} from "./db";
import configManager, { getConfigStatus } from "./config";
import { sendContactFormEmail, sendEmail, sendSiteSurveyEmail } from "./email";
import { insertQuoteSchema, type InsertQuote } from "@shared/schema";
import { createStorageAsync, type IDatabaseStorage } from "./storage";

// Storage instance - will be initialized after database is ready
let storage: IDatabaseStorage;

// Cache for pricing data
let pricingCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Fallback pricing data when database is empty
const fallbackPricing = {
  timber: {
    "1.2": 150,
    "1.5": 165,
    "1.8": 180,
    "2.1": 210,
    perMeter: true,
    description: "Quality timber fencing",
    materials: "H4 treated pine posts, H3.2 treated palings"
  },
  aluminum: {
    "1.2": 190,
    "1.5": 205,
    "1.8": 220,
    "2.1": 260,
    perMeter: true,
    description: "Modern aluminum fencing",
    materials: "Powder-coated aluminum, stainless steel fixings"
  },
  pvc: {
    "1.2": 210,
    "1.5": 230,
    "1.8": 250,
    "2.1": 290,
    perMeter: true,
    description: "Low-maintenance PVC/Vinyl fencing",
    materials: "UV-stabilized PVC, aluminum reinforced posts"
  },
  rural: {
    "1.2": 100,
    "1.5": 110,
    "1.8": 120,
    "2.1": 140,
    perMeter: true,
    description: "Rural and lifestyle fencing",
    materials: "H5 treated posts, H3.2 rails, 2.5mm HT wire"
  }
};

// Auth check middleware for admin routes - must be defined before use
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage after database is ready
  const { getAllConfig } = await import("./config");
  const config = getAllConfig();
  storage = await createStorageAsync(config.DATABASE_URL) as IDatabaseStorage;
  
  // Test database connection on startup
  testDatabaseConnection().then(connected => {
    if (connected) {
      console.log('✅ External database connection established');
    } else {
      console.warn('⚠️ Database connection failed - some features may be limited');
    }
  }).catch(error => {
    console.error('❌ Database connection test failed:', error);
  });

  // Add a simple status endpoint to check service health
  app.get('/api/status', async (req, res) => {
    try {
      const status = {
        server: 'running',
        timestamp: new Date().toISOString(),
        database: 'checking...',
        config: 'checking...'
      };
      
      // Quick database check
      try {
        await testDatabaseConnection();
        status.database = 'connected';
      } catch (dbError) {
        status.database = 'error';
      }
      
      // Quick config check
      try {
        const configStatus = getConfigStatus();
        status.config = configStatus.initialized ? 'loaded' : 'error';
      } catch (configError) {
        status.config = 'error';
      }
      
      res.json({ success: true, status });
    } catch (error) {
      console.error('Status check error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Status check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // API endpoint to get configuration status
  app.get('/api/config/status', async (req, res) => {
    try {
      const status = getConfigStatus();
      const config = {
        mode: status.mode,
        initialized: status.initialized,
        hasServiceKey: status.hasServiceKey,
        wordpressUrl: status.mode === 'wordpress' ? configManager.getAll().WORDPRESS_API_URL : null
      };
      res.json({ success: true, config });
    } catch (error) {
      console.error('Error fetching config status:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch configuration status' });
    }
  });

  // API endpoint to explore database tables
  app.get('/api/db/tables', requireAuth, async (req, res) => {
    try {
      const tables = await getTablesList();
      res.json({ success: true, tables });
    } catch (error) {
      console.error('Error fetching tables:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch tables' });
    }
  });

  // API endpoint to find pricing-related tables
  app.get('/api/db/pricing-tables', requireAuth, async (req, res) => {
    try {
      const tables = await findPricingTables();
      res.json({ success: true, tables });
    } catch (error) {
      console.error('Error finding pricing tables:', error);
      res.status(500).json({ success: false, error: 'Failed to find pricing tables' });
    }
  });

  // API endpoint to get table structure
  app.get('/api/db/table-structure/:tableName', requireAuth, async (req, res) => {
    try {
      const { tableName } = req.params;
      const structure = await getTableStructure(tableName);
      res.json({ success: true, structure });
    } catch (error) {
      console.error('Error fetching table structure:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch table structure' });
    }
  });

  // API endpoint to fetch pricing data (with caching)
  app.get('/api/pricing', async (req, res) => {
    try {
      // Check cache first
      const now = Date.now();
      if (pricingCache && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('Serving pricing from cache');
        return res.json({ success: true, data: pricingCache, cached: true });
      }

      console.log('Fetching fresh pricing from database...');
      
      // Fetch all pricing data from the database
      const rawPricingData = await fetchAllPricing();
      
      // Map service types to simplified keys
      const serviceTypeMapping: Record<string, string> = {
        'Timber Slat Fence': 'timber',
        'Timber Fence': 'timber',
        'Aluminium Fence': 'aluminum',
        'Aluminum Fence': 'aluminum',
        'PVC/Vinyl Fence': 'pvc',
        'PVC Fence': 'pvc',
        'Vinyl Fence': 'pvc',
        'Rural Fence': 'rural',
        'Rural Fencing': 'rural'
      };
      
      // Transform the data to match frontend format
      const transformedPricing: any = {};
      let hasData = false;
      
      if (rawPricingData && rawPricingData.length > 0) {
        hasData = true;
        
        // Group by fence type and height
        for (const row of rawPricingData) {
          // Find the simplified fence type key
          let fenceTypeKey = 'timber'; // default
          
          // Try exact match first
          if (serviceTypeMapping[row.servicetype]) {
            fenceTypeKey = serviceTypeMapping[row.servicetype];
          } else {
            // Try case-insensitive partial match
            const serviceTypeLower = row.servicetype?.toLowerCase() || '';
            if (serviceTypeLower.includes('timber')) {
              fenceTypeKey = 'timber';
            } else if (serviceTypeLower.includes('aluminium') || serviceTypeLower.includes('aluminum')) {
              fenceTypeKey = 'aluminum';
            } else if (serviceTypeLower.includes('pvc') || serviceTypeLower.includes('vinyl')) {
              fenceTypeKey = 'pvc';
            } else if (serviceTypeLower.includes('rural')) {
              fenceTypeKey = 'rural';
            }
          }
          
          // Initialize fence type object if not exists
          if (!transformedPricing[fenceTypeKey]) {
            transformedPricing[fenceTypeKey] = {
              perMeter: true
            };
          }
          
          // Add the height and price (using totallmincgst)
          const height = String(row.height); // Convert to string for key
          const price = parseFloat(row.totallmincgst) || 0;
          
          transformedPricing[fenceTypeKey][height] = price;
        }
        
        // Add descriptions from fallback pricing
        for (const [key, value] of Object.entries(fallbackPricing)) {
          if (transformedPricing[key] && typeof value === 'object') {
            const fallbackData = value as any;
            if (fallbackData.description) {
              transformedPricing[key].description = fallbackData.description;
            }
            if (fallbackData.materials) {
              transformedPricing[key].materials = fallbackData.materials;
            }
          }
        }
      }
      
      // Prepare response data
      const pricingData: any = {
        tables: [{ table_name: 'pricing', table_schema: 'public' }],
        data: { pricing: rawPricingData },
        fallback: !hasData,
        pricing: hasData ? transformedPricing : fallbackPricing
      };

      // Update cache
      pricingCache = pricingData;
      cacheTimestamp = now;

      res.json({ success: true, data: pricingData, cached: false });
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      
      // On error, use fallback pricing
      const pricingData = {
        tables: [],
        data: {},
        fallback: true,
        pricing: fallbackPricing
      };
      
      res.json({ success: true, data: pricingData, cached: false });
    }
  });

  // API endpoint to get specific fence type pricing
  app.get('/api/pricing/:fenceType', async (req, res) => {
    try {
      const { fenceType } = req.params;
      
      // Use Supabase to find pricing for specific fence type
      const result = await fetchPricingByType(fenceType);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error fetching specific pricing:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch pricing' });
    }
  });

  // API endpoint to explore all database schema
  app.get('/api/db/explore', requireAuth, async (req, res) => {
    try {
      // Get all tables
      const allTables = await getTablesList();
      
      // Get structure for each table
      const schema: any = {};
      
      for (const table of allTables) {
        const tableName = table.table_name;
        const structure = await getTableStructure(tableName);
        
        // Get sample data (limit 5 rows)
        try {
          const sampleData = await fetchTableData(tableName, 5);
          schema[tableName] = {
            columns: structure,
            sampleData: sampleData,
            rowCount: sampleData.length
          };
        } catch (err) {
          schema[tableName] = {
            columns: structure,
            error: 'Could not fetch sample data'
          };
        }
      }
      
      res.json({ 
        success: true, 
        tableCount: allTables.length,
        schema 
      });
    } catch (error) {
      console.error('Error exploring database:', error);
      res.status(500).json({ success: false, error: 'Failed to explore database' });
    }
  });

  // Auth check middleware already defined above

  // Import object storage services
  const { ObjectStorageService, ObjectNotFoundError } = await import('./objectStorage.js');
  const { ObjectPermission } = await import('./objectAcl.js');

  // CONTENT MANAGEMENT API ENDPOINTS
  
  // System initialization check - determine if database setup is needed
  app.get('/api/system-status', async (req, res) => {
    try {
      // Check if users table exists by trying to access it
      const client = 'getClient' in storage ? (storage as any).getClient(true) : null;
      if (!client) {
        return res.json({
          initialized: false,
          needsSetup: true,
          message: 'Database client not available'
        });
      }

      const { data, error } = await client
        .from('users')
        .select('id')
        .limit(1);

      const hasUsersTable = !error || error.code !== '42P01'; // Table doesn't exist error
      
      res.json({
        initialized: hasUsersTable,
        needsSetup: !hasUsersTable,
        message: hasUsersTable ? 'System initialized' : 'Database setup required'
      });
    } catch (error) {
      res.json({
        initialized: false,
        needsSetup: true,
        message: 'Unable to check system status'
      });
    }
  });

  // Database setup endpoint - allows unauthenticated access when system is uninitialized
  app.get('/api/admin/setup-sql', async (req, res) => {
    try {
      // Check if system is initialized first
      const client = 'getClient' in storage ? (storage as any).getClient(true) : null;
      if (client) {
        const { error } = await client.from('users').select('id').limit(1);
        const systemInitialized = !error || error.code !== '42P01';
        
        // If system is initialized, require authentication
        if (systemInitialized && !req.user) {
          return res.status(401).json({ error: 'Authentication required' });
        }
      }
      
      const { generateContentManagementSQL, generateTableCheckSQL } = await import('./sqlGenerator');
      
      res.json({
        success: true,
        setupSQL: generateContentManagementSQL(),
        checkSQL: generateTableCheckSQL(),
        instructions: "Copy and paste the setupSQL into your Supabase SQL Editor to create the content management tables. Then run checkSQL to verify the tables were created successfully."
      });
    } catch (error) {
      console.error('Error generating setup SQL:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate setup SQL'
      });
    }
  });

  // Check database table status endpoint - allows unauthenticated access when system is uninitialized  
  app.get('/api/admin/table-status', async (req, res) => {
    try {
      // Check if system is initialized first
      const client = 'getClient' in storage ? (storage as any).getClient(true) : null;
      if (client) {
        const { error } = await client.from('users').select('id').limit(1);
        const systemInitialized = !error || error.code !== '42P01';
        
        // If system is initialized, require authentication
        if (systemInitialized && !req.user) {
          return res.status(401).json({ error: 'Authentication required' });
        }
      }

      if (!client) {
        throw new Error('Database client not available');
      }

      // Check if content management tables exist
      const tables = ['users', 'site_content', 'testimonials', 'faq_items', 'services'];
      const status: Record<string, any> = {};

      for (const tableName of tables) {
        try {
          const { count, error } = await client
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          status[tableName] = {
            exists: !error,
            recordCount: error ? 0 : count || 0,
            error: error?.message || null
          };
        } catch (e: any) {
          status[tableName] = {
            exists: false,
            recordCount: 0,
            error: e.message
          };
        }
      }

      res.json({
        success: true,
        tableStatus: status
      });
    } catch (error) {
      console.error('Error checking table status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to check table status'
      });
    }
  });
  
  // Site content endpoints
  app.get('/api/admin/content', requireAuth, async (req, res) => {
    try {
      const content = await storage.getSiteContent();
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error fetching site content:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch content' });
    }
  });

  app.post('/api/admin/content', requireAuth, async (req, res) => {
    try {
      const { section, key, value } = req.body;
      const updatedBy = req.user?.id || 'unknown';
      const content = await storage.updateSiteContent(section, key, value, updatedBy);
      res.json({ success: true, data: content });
    } catch (error) {
      console.error('Error updating site content:', error);
      res.status(500).json({ success: false, error: 'Failed to update content' });
    }
  });

  // Content management endpoints
  app.delete('/api/admin/content/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSiteContent(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting site content:', error);
      res.status(500).json({ success: false, error: 'Failed to delete content' });
    }
  });

  // Images management endpoints
  app.get('/api/admin/images', requireAuth, async (req, res) => {
    try {
      const images = await storage.getImages();
      res.json({ success: true, data: images });
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch images' });
    }
  });

  app.post('/api/admin/images', requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id || '';
      const imageData = {
        ...req.body,
        uploadedBy: userId
      };
      
      const image = await storage.createImage(imageData);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      console.error('Error creating image:', error);
      res.status(500).json({ success: false, error: 'Failed to create image' });
    }
  });

  app.put('/api/admin/images/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const image = await storage.updateImage(id, req.body);
      res.json({ success: true, data: image });
    } catch (error) {
      console.error('Error updating image:', error);
      res.status(500).json({ success: false, error: 'Failed to update image' });
    }
  });

  app.delete('/api/admin/images/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ success: false, error: 'Failed to delete image' });
    }
  });

  // Upload endpoint for images
  app.post('/api/admin/images/upload', requireAuth, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Testimonials endpoints
  app.get('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
    }
  });

  app.post('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ success: false, error: 'Failed to create testimonial' });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await storage.updateTestimonial(id, req.body);
      res.json({ success: true, data: testimonial });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      res.status(500).json({ success: false, error: 'Failed to update testimonial' });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTestimonial(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      res.status(500).json({ success: false, error: 'Failed to delete testimonial' });
    }
  });

  // FAQ endpoints
  app.get('/api/admin/faq', requireAuth, async (req, res) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json({ success: true, data: faqItems });
    } catch (error) {
      console.error('Error fetching FAQ items:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch FAQ items' });
    }
  });

  app.post('/api/admin/faq', requireAuth, async (req, res) => {
    try {
      const faqItem = await storage.createFaqItem(req.body);
      res.status(201).json({ success: true, data: faqItem });
    } catch (error) {
      console.error('Error creating FAQ item:', error);
      res.status(500).json({ success: false, error: 'Failed to create FAQ item' });
    }
  });

  app.put('/api/admin/faq/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const faqItem = await storage.updateFaqItem(id, req.body);
      res.json({ success: true, data: faqItem });
    } catch (error) {
      console.error('Error updating FAQ item:', error);
      res.status(500).json({ success: false, error: 'Failed to update FAQ item' });
    }
  });

  app.delete('/api/admin/faq/:id', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFaqItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting FAQ item:', error);
      res.status(500).json({ success: false, error: 'Failed to delete FAQ item' });
    }
  });

  // IMAGE UPLOAD AND MANAGEMENT ENDPOINTS
  
  // Serve public assets from object storage
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve private objects with authentication check
  app.get("/objects/:objectPath(*)", requireAuth, async (req, res) => {
    const userId = req.user?.id;
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId: userId,
        requestedPermission: ObjectPermission.READ,
      });
      if (!canAccess) {
        return res.sendStatus(401);
      }
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Get upload URL for new image
  app.post("/api/admin/images/upload", requireAuth, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Update image after upload (sets ACL and makes it public)
  app.post("/api/admin/images/publish", requireAuth, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    const userId = req.user?.id || '';
    
    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public", // Make images public for website use
        },
      );

      res.status(200).json({
        objectPath: objectPath,
        publicURL: `${req.protocol}://${req.get('host')}${objectPath}`
      });
    } catch (error) {
      console.error("Error publishing image:", error);
      res.status(500).json({ error: "Failed to publish image" });
    }
  });


  // Debug endpoint to check actual quotes table structure
  app.get('/api/debug/quotes-structure', async (req, res) => {
    try {
      // Use the SupabaseStorage client
      const supabaseStorage = storage as any;
      const client = supabaseStorage.getClient ? supabaseStorage.getClient() : null;
      
      if (!client) {
        return res.json({ error: 'No Supabase client available' });
      }
      
      // Get existing data to see the actual structure
      const { data: existingQuotes, error: selectError } = await client
        .from('quotes')
        .select('*')
        .limit(5);
      
      console.log('📊 Existing quotes data:', existingQuotes);
      console.log('📊 Select error:', selectError);
      
      res.json({ 
        success: true,
        existingQuotes,
        selectError: selectError ? selectError.message : null,
        message: 'Table structure examined'
      });
    } catch (error: any) {
      console.error('Error examining table:', error);
      res.json({ error: error.message || 'Unknown error' });
    }
  });

  // Test email endpoint - demonstrates SendGrid functionality
  app.post('/api/test-email', async (req, res) => {
    try {
      const { to, subject, message } = req.body;
      
      // Validate required fields
      if (!to || !subject || !message) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: to, subject, message'
        });
      }

      // Send test email using the existing email service
      const emailSent = await sendEmail({
        to: to,
        from: process.env.SENDGRID_FROM || 'test@example.com',
        subject: subject,
        text: message,
        html: `<div style="font-family: Arial, sans-serif;">
          <h2>Test Email from SendGrid</h2>
          <p>${message}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email sent via SendGrid API
          </p>
        </div>`
      });

      if (emailSent) {
        res.json({
          success: true,
          message: 'Test email sent successfully!',
          to: to,
          subject: subject
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to send test email'
        });
      }
    } catch (error) {
      console.error('❌ Test email error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send test email'
      });
    }
  });

  // Contact Form Endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      console.log('📧 Contact form submission received:', req.body);
      
      // Validate request body using Zod schema
      const validationResult = insertQuoteSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error('❌ Contact form validation failed:', validationResult.error.issues);
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid form data',
          details: validationResult.error.issues 
        });
      }

      const contactData = validationResult.data;
      
      console.log('📋 Contact form data received successfully:', contactData);
      
      // Save to database
      try {
        const savedQuote = await storage.createQuote(contactData);
        console.log('✅ Quote saved to database:', savedQuote.id);
      } catch (dbError: any) {
        console.error('❌ Database save error:', dbError);
        // Continue with email even if database save fails
      }
      
      // Send email notification
      const emailSent = await sendContactFormEmail(contactData);
      
      if (emailSent) {
        console.log('✅ Contact form email sent successfully');
      } else {
        console.log('⚠️  Contact form email failed to send');
      }
      
      res.json({ 
        success: true, 
        message: 'Quote request received and saved successfully',
        emailSent
      });
      
    } catch (error) {
      console.error('❌ Error processing contact form:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process quote request' 
      });
    }
  });

  app.post('/api/site-survey', async (req, res) => {
    try {
      console.log('📋 Site survey submission received:', req.body);

      const {
        customerName,
        phone,
        email,
        propertyAddress,
        removalRequired,
        additionalNotes,
        fenceLines,
        photoUrls
      } = req.body;

      if (!customerName || !phone || !propertyAddress) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: customerName, phone, and propertyAddress are required'
        });
      }

      if (!fenceLines || !Array.isArray(fenceLines) || fenceLines.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one fence line is required'
        });
      }

      // Use admin client to bypass RLS for server-side insertions
      const dbClient = supabaseAdmin || supabase;

      if (!dbClient) {
        return res.status(500).json({
          success: false,
          error: 'Database connection not available'
        });
      }

      console.log('🔑 Using', supabaseAdmin ? 'service role (bypassing RLS)' : 'anon key (with RLS)');

      const { data: survey, error: surveyError } = await dbClient
        .from('site_surveys')
        .insert({
          customer_name: customerName,
          phone: phone,
          email: email || null,
          property_address: propertyAddress,
          removal_required: removalRequired || false,
          additional_notes: additionalNotes || null,
          status: 'new'
        })
        .select()
        .single();

      if (surveyError || !survey) {
        console.error('❌ Failed to save survey:', surveyError);
        return res.status(500).json({
          success: false,
          error: 'Failed to save survey data'
        });
      }

      console.log('✅ Survey saved with ID:', survey.id);

      const fenceLineInserts = fenceLines.map((line: any, index: number) => ({
        survey_id: survey.id,
        line_description: line.lineDescription || null,
        length: line.length,
        height: line.height || null,
        fence_type: line.fenceType,
        rail_wire_count: line.railWireCount || null,
        special_notes: line.specialNotes || null,
        line_order: index
      }));

      const { error: fenceLinesError } = await dbClient
        .from('fence_lines')
        .insert(fenceLineInserts);

      if (fenceLinesError) {
        console.error('❌ Failed to save fence lines:', fenceLinesError);
      } else {
        console.log(`✅ Saved ${fenceLineInserts.length} fence lines`);
      }

      if (photoUrls && Array.isArray(photoUrls) && photoUrls.length > 0) {
        const photoInserts = photoUrls.map((url: string) => {
          const filename = url.split('/').pop() || 'photo.jpg';
          const storagePath = url.includes('survey-photos') ? url.split('survey-photos/')[1] : filename;

          return {
            survey_id: survey.id,
            filename: filename,
            storage_path: storagePath,
            url: url,
            file_size: null,
            mime_type: 'image/jpeg'
          };
        });

        const { error: photosError } = await dbClient
          .from('survey_photos')
          .insert(photoInserts);

        if (photosError) {
          console.error('❌ Failed to save photo records:', photosError);
        } else {
          console.log(`✅ Saved ${photoInserts.length} photo records`);
        }
      }

      const emailSent = await sendSiteSurveyEmail({
        customerName,
        phone,
        email: email || null,
        propertyAddress,
        removalRequired: removalRequired || false,
        additionalNotes: additionalNotes || null,
        fenceLines,
        photoUrls: photoUrls || []
      });

      if (emailSent) {
        console.log('✅ Site survey email sent successfully');
      } else {
        console.log('⚠️  Site survey email failed to send');
      }

      res.json({
        success: true,
        message: 'Site survey submitted successfully',
        surveyId: survey.id,
        emailSent
      });

    } catch (error) {
      console.error('❌ Error processing site survey:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process site survey'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

export default registerRoutes;