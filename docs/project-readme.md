# FairFence Contracting Waikato - Full Stack Application

## 🚀 Project Overview

**FairFence** is a modern, full-stack web application for FairFence Contracting Waikato, a professional fencing contractor serving Hamilton and the Waikato region of New Zealand. The platform provides an interactive pricing calculator, service portfolio, customer testimonials, and seamless appointment booking functionality.

### Key Features

- **Interactive Pricing Calculator**: Real-time fence cost estimation based on type, length, and height
- **Service Portfolio**: Comprehensive showcase of timber, aluminum, PVC/vinyl, and rural fencing options
- **Booking System**: Modal-based appointment scheduling with Calendly integration
- **Customer Testimonials**: Dynamic review display with ratings and location data
- **Service Area Mapping**: Geographic coverage visualization for the Waikato region
- **WordPress Integration**: Content management through WordPress admin interface
- **Dark Mode**: Modern dark theme with orange accent colors
- **Mobile-First Design**: Fully responsive across all devices
- **Real-time Pricing**: Database-driven pricing with caching for performance

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase/Neon)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **CMS**: WordPress Plugin Integration
- **Deployment**: Replit Platform

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │   React Application   │        │   WordPress Admin Interface  │   │
│  │  (Vite + TypeScript)  │        │    (Content Management)      │   │
│  │   - Components        │        │    - Settings                │   │
│  │   - Pages             │        │    - Testimonials            │   │
│  │   - Hooks             │        │    - FAQ                     │   │
│  │   - Services          │        │    - Images                  │   │
│  └──────────┬───────────┘        └──────────┬──────────────────┘   │
│             │                                │                       │
└─────────────┼────────────────────────────────┼──────────────────────┘
              │                                │
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS SERVER (Port 5000)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │   REST API Routes    │        │   WordPress REST API         │   │
│  │   /api/pricing       │        │   /wp-json/fairfence/v1/*    │   │
│  │   /api/settings      │        │   - Settings                 │   │
│  │   /api/contact       │        │   - Testimonials             │   │
│  │   /api/booking       │        │   - FAQ                      │   │
│  │   /api/quote         │        │   - Images                   │   │
│  └──────────┬───────────┘        └──────────┬──────────────────┘   │
│             │                                │                       │
└─────────────┼────────────────────────────────┼──────────────────────┘
              │                                │
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │  Supabase PostgreSQL │        │   WordPress Database         │   │
│  │  - Pricing Table     │        │   - Options Table            │   │
│  │  - Users Table       │        │   - Settings                 │   │
│  │  - Sessions          │        │   - Media Library            │   │
│  └──────────────────────┘        └─────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation

### Backend Architecture
- **Express.js** server with middleware
- **PostgreSQL** database with Drizzle ORM
- **Session management** with connect-pg-simple
- **RESTful API** design with /api prefix
- **WordPress plugin** for content management

## 📁 Complete File Structure

```
fairfence-application/
├── client/                         # Frontend React application
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── AboutUs.tsx       # About section component
│   │   │   ├── BookingModal.tsx  # Appointment booking modal
│   │   │   ├── Contact.tsx       # Contact form component
│   │   │   ├── FAQ.tsx           # Frequently asked questions
│   │   │   ├── Footer.tsx        # Site footer
│   │   │   ├── Hero.tsx          # Hero landing section
│   │   │   ├── Navigation.tsx    # Main navigation bar
│   │   │   ├── Portfolio.tsx     # Project portfolio gallery
│   │   │   ├── PricingCalculator.tsx # Interactive pricing tool
│   │   │   ├── ProcessTimeline.tsx   # Installation process steps
│   │   │   ├── ServiceAreas.tsx      # Coverage area map
│   │   │   ├── Services.tsx          # Service offerings
│   │   │   ├── StatisticsBar.tsx     # Key statistics display
│   │   │   ├── Testimonials.tsx      # Customer reviews
│   │   │   └── ui/                   # shadcn/ui components (40+ files)
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.tsx          # Main landing page
│   │   │   ├── StaffPortal.tsx   # Staff management portal
│   │   │   └── not-found.tsx     # 404 error page
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── use-mobile.tsx    # Mobile detection hook
│   │   │   └── use-toast.ts      # Toast notification hook
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── queryClient.ts    # TanStack Query configuration
│   │   │   └── utils.ts          # Helper functions
│   │   ├── App.tsx                # Main application component
│   │   ├── main.tsx               # Application entry point
│   │   └── index.css              # Global styles & theme
│   └── index.html                 # HTML template
│
├── server/                        # Backend Express server
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # API route definitions
│   ├── storage.ts                 # Storage interface
│   ├── db.ts                      # Database connection & queries
│   └── vite.ts                    # Vite middleware setup
│
├── shared/                        # Shared code between frontend/backend
│   └── schema.ts                  # Database schema definitions
│
├── wordpress-plugin/              # WordPress integration plugin
│   ├── admin/                     # Admin interface files
│   │   ├── admin-page.php        # Admin settings page
│   │   ├── admin-scripts.js      # Admin JavaScript
│   │   └── admin-styles.css      # Admin styles
│   ├── includes/                  # Plugin core files
│   │   ├── api-endpoints.php     # REST API definitions
│   │   └── settings-handler.php  # Settings management
│   ├── public/                    # Public assets
│   │   ├── app.js                # Built React app
│   │   ├── app.css               # Built styles
│   │   └── images/               # Image assets
│   ├── fairfence-plugin.php      # Main plugin file
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── package.json              # WordPress dependencies
│
├── attached_assets/               # Static assets & images
│   ├── fencing/                   # Fencing type images
│   └── stock_images/              # Stock photography
│
├── Configuration Files
├── package.json                   # Node.js dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── vite.config.wordpress.ts       # WordPress build config
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── drizzle.config.ts              # Database ORM configuration
├── components.json                # shadcn/ui components config
├── design_guidelines.md           # Design system documentation
└── replit.md                      # Project documentation
```

## 📦 Dependencies

### Production Dependencies

```json
{
  "@hookform/resolvers": "^3.10.0",
  "@neondatabase/serverless": "^0.10.4",
  "@radix-ui/react-*": "Multiple components (40+ packages)",
  "@supabase/supabase-js": "^2.57.4",
  "@tanstack/react-query": "^5.60.5",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "connect-pg-simple": "^10.0.0",
  "date-fns": "^3.6.0",
  "drizzle-orm": "^0.39.1",
  "drizzle-zod": "^0.7.0",
  "embla-carousel-react": "^8.6.0",
  "express": "^4.21.2",
  "express-session": "^1.18.1",
  "framer-motion": "^11.13.1",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.453.0",
  "memorystore": "^1.6.7",
  "next-themes": "^0.4.6",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.55.0",
  "react-icons": "^5.4.0",
  "react-resizable-panels": "^2.1.7",
  "recharts": "^2.15.2",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "tw-animate-css": "^1.2.5",
  "vaul": "^1.1.2",
  "wouter": "^3.3.5",
  "ws": "^8.18.0",
  "zod": "^3.24.2"
}
```

### Development Dependencies

```json
{
  "@replit/vite-plugin-cartographer": "^0.3.0",
  "@replit/vite-plugin-runtime-error-modal": "^0.0.3",
  "@tailwindcss/typography": "^0.5.15",
  "@tailwindcss/vite": "^4.1.3",
  "@types/*": "TypeScript type definitions",
  "@vitejs/plugin-react": "^4.3.2",
  "autoprefixer": "^10.4.20",
  "drizzle-kit": "^0.30.4",
  "esbuild": "^0.25.0",
  "postcss": "^8.4.47",
  "tailwindcss": "^3.4.17",
  "tsx": "^4.19.1",
  "typescript": "5.6.3",
  "vite": "^5.4.19"
}
```

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **WordPress**: 5.0 or higher (for plugin)
- **PHP**: 7.4 or higher (for WordPress)
- **Memory**: 512MB minimum, 1GB recommended
- **Disk Space**: 500MB minimum

### External Service Dependencies

- **Supabase**: PostgreSQL database hosting
- **Neon**: Alternative PostgreSQL provider
- **Calendly**: Appointment booking integration
- **Google Fonts**: Typography services
- **Replit**: Development and hosting platform

## 🚀 Setup Instructions

### 1. Prerequisites

- Install Node.js 18+ and npm
- Set up a PostgreSQL database (Supabase or Neon)
- Clone the repository

```bash
git clone [repository-url]
cd fairfence-application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Supabase Configuration
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-session-secret-here
```

### 4. Database Setup

#### Using Supabase

1. Create a new Supabase project
2. Get your connection string from Supabase Dashboard
3. Update `DATABASE_URL` in `.env`
4. Run database migrations:

```bash
npm run db:push
```

#### Database Schema

The application uses the following tables:

**pricing table:**
```sql
CREATE TABLE pricing (
  id SERIAL PRIMARY KEY,
  servicetype VARCHAR(255) NOT NULL,
  height DECIMAL(3,1) NOT NULL,
  totallmincgst DECIMAL(10,2),
  totalperpanel DECIMAL(10,2),
  description TEXT,
  materials TEXT
);
```

**users table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 6. WordPress Plugin Installation (Optional)

If using the WordPress integration:

1. Build the WordPress plugin:
```bash
npm run build:wordpress
```

2. Upload the `wordpress-plugin` folder to your WordPress `/wp-content/plugins/` directory

3. Activate "FairFence Content Manager" in WordPress admin

4. Use shortcode `[fairfence_app]` to display the app

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://user:pass@host/db` |
| `SUPABASE_URL` | Supabase project URL | ✅ | `https://abc.supabase.co` |
| `SUPABASE_ANON_KEY` | Public Supabase key | ✅ | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin access | ✅ | `eyJ...` |
| `PORT` | Server port | ❌ | `5000` (default) |
| `NODE_ENV` | Environment mode | ❌ | `development` or `production` |
| `SESSION_SECRET` | Express session secret | ✅ | Random string |

### WordPress Configuration

The WordPress plugin requires:

- WordPress 5.0+
- PHP 7.4+
- Write permissions for uploads
- REST API enabled

Configure in WordPress admin under **FairFence** menu:

- Content settings
- Testimonials management
- FAQ items
- Image library

## 📡 API Documentation

### Express REST API Endpoints

#### Pricing Endpoints

**GET /api/pricing**
- Fetches all pricing data
- Response: 
```json
{
  "success": true,
  "data": {
    "pricing": {
      "timber": { "1.2": 150, "1.5": 165, "1.8": 180, "2.1": 210 },
      "aluminum": { "1.2": 190, "1.5": 205, "1.8": 220, "2.1": 260 }
    }
  }
}
```

**GET /api/pricing/:fenceType**
- Get pricing for specific fence type
- Parameters: `fenceType` (timber|aluminum|pvc|rural)

#### Contact & Booking

**POST /api/contact**
- Submit contact form
- Body: `{ name, email, phone, message }`

**POST /api/booking**
- Create booking request
- Body: `{ name, email, phone, service, preferredDate }`

**POST /api/quote**
- Request custom quote
- Body: `{ name, email, phone, fenceType, length, height, address }`

#### Database Management

**GET /api/db/tables**
- List all database tables

**GET /api/db/pricing-tables**
- Find pricing-related tables

**GET /api/db/table-structure/:tableName**
- Get table column structure

### WordPress REST API Endpoints

Base URL: `/wp-json/fairfence/v1`

#### Settings

- **GET /settings** - Get all settings
- **POST /settings** - Update settings (admin only)

#### Testimonials

- **GET /testimonials** - Get all testimonials
- **POST /testimonials** - Add testimonial (admin only)
- **PUT /testimonials/:id** - Update testimonial (admin only)
- **DELETE /testimonials/:id** - Delete testimonial (admin only)

#### FAQ

- **GET /faq** - Get all FAQ items
- **POST /faq** - Add FAQ item (admin only)
- **PUT /faq/:id** - Update FAQ item (admin only)
- **DELETE /faq/:id** - Delete FAQ item (admin only)

#### Services

- **GET /services** - Get all services
- **PUT /services** - Update services (admin only)

#### Images

- **GET /images** - Get all images
- **POST /images** - Add image (admin only)
- **PUT /images/:id** - Update image metadata (admin only)
- **DELETE /images/:id** - Delete image (admin only)

## 💾 Database Schema

### Pricing Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `servicetype` | VARCHAR(255) | Type of fencing service |
| `height` | DECIMAL(3,1) | Fence height in meters |
| `totallmincgst` | DECIMAL(10,2) | Total price per linear meter including GST |
| `totalperpanel` | DECIMAL(10,2) | Total price per panel |
| `description` | TEXT | Service description |
| `materials` | TEXT | Materials used |

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `username` | TEXT | Unique username |
| `password` | TEXT | Hashed password |

## 🚢 Deployment Guide

### Replit Deployment

1. **Import to Replit**
   - Fork/import the repository to Replit
   - Set environment variables in Secrets tab
   - Configure domain settings

2. **Database Setup**
   - Use Replit's PostgreSQL integration
   - Or connect to external Supabase/Neon database
   - Run migrations: `npm run db:push`

3. **Build & Deploy**
   ```bash
   npm run build
   npm run start
   ```

4. **Configure Domain**
   - Set up custom domain in Replit
   - Update CORS settings if needed

### WordPress Plugin Deployment

1. **Build Plugin**
   ```bash
   npm run build:wordpress
   ```

2. **Upload to WordPress**
   - ZIP the `wordpress-plugin` folder
   - Upload via WordPress admin
   - Or FTP to `/wp-content/plugins/`

3. **Activate & Configure**
   - Activate plugin in WordPress admin
   - Configure settings under FairFence menu
   - Add `[fairfence_app]` shortcode to pages

### Production Environment Setup

1. **Environment Variables**
   - Set all required environment variables
   - Use strong SESSION_SECRET
   - Enable SSL for database connections

2. **Database**
   - Set up production PostgreSQL instance
   - Configure connection pooling
   - Enable SSL mode

3. **Performance Optimization**
   - Enable caching (5-minute pricing cache)
   - Use CDN for static assets
   - Enable gzip compression

## 🔧 Operations & Maintenance

### Updating Pricing Data

#### Via Database
```sql
UPDATE pricing 
SET totallmincgst = 175 
WHERE servicetype = 'Timber Fence' AND height = 1.5;
```

#### Via API (if implemented)
```bash
POST /api/admin/pricing
{
  "servicetype": "Timber Fence",
  "height": 1.5,
  "totallmincgst": 175
}
```

### Image Management

Through WordPress Admin:

1. Navigate to **FairFence → Images**
2. Upload new images via Media Library
3. Categorize images:
   - Hero Images
   - Service Images
   - Gallery Images
   - Testimonial Images
4. Update alt text and titles

### Backup Procedures

#### Database Backup
```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Using Supabase Dashboard
# Go to Settings → Backups → Download
```

#### Application Backup
```bash
# Full backup
tar -czf fairfence_backup_$(date +%Y%m%d).tar.gz .

# Code only (excludes node_modules)
git archive --format=tar.gz HEAD > code_backup_$(date +%Y%m%d).tar.gz
```

### Monitoring & Logs

#### Application Logs
- Development: Console output
- Production: Check Replit logs or server logs
- Location: `/tmp/logs/` (if configured)

#### Database Monitoring
- Supabase: Dashboard → Database → Monitoring
- Neon: Console → Monitoring tab
- Query performance: Check slow query logs

#### Error Tracking
```javascript
// Browser console for frontend errors
// Server logs for backend errors
// Network tab for API issues
```

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Failed
```
Error: Database connection failed
```
**Solution:**
- Check DATABASE_URL is correct
- Verify SSL mode is enabled
- Check database is accessible
- Confirm credentials are valid

#### 2. Build Errors
```
Error: Module not found
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 3. WordPress Plugin Not Working
**Symptoms:** Shortcode shows as text
**Solution:**
- Verify plugin is activated
- Check JavaScript console for errors
- Ensure build files exist in `wordpress-plugin/public/`
- Clear WordPress cache

#### 4. Pricing Data Not Loading
**Solution:**
- Check Supabase RLS policies
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Check network tab for API errors
- Review server logs

### Debug Procedures

1. **Enable Debug Mode**
   ```env
   NODE_ENV=development
   DEBUG=express:*
   ```

2. **Check Logs**
   ```bash
   # Server logs
   npm run dev 2>&1 | tee debug.log
   
   # Database queries
   # Add to db.ts: console.log(query)
   ```

3. **Test API Endpoints**
   ```bash
   # Test pricing endpoint
   curl http://localhost:5000/api/pricing
   
   # Test database connection
   curl http://localhost:5000/api/db/tables
   ```

### Log Locations

- **Server Logs**: Console output or `/var/log/fairfence/`
- **Database Logs**: Supabase/Neon dashboard
- **WordPress Logs**: `/wp-content/debug.log`
- **Browser Console**: F12 → Console tab
- **Network Logs**: F12 → Network tab

## 📝 Additional Notes

### Security Considerations
- All user inputs are sanitized
- SQL injection prevention via parameterized queries
- XSS protection through React's JSX
- CSRF protection via session tokens
- Environment variables for sensitive data

### Performance Optimization
- 5-minute cache for pricing data
- Lazy loading for images
- Code splitting for routes
- Database connection pooling
- CDN for static assets

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

### License
MIT License - See LICENSE file for details

### Support & Contact
For technical support or questions about deployment, refer to the project documentation or contact the development team.

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Maintained By:** FairFence Contracting Waikato Development Team