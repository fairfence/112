# FairFence Contracting Waikato - Full Stack Application

## 🚀 Project Overview

**FairFence** is a modern, full-stack web application for FairFence Contracting Waikato, a professional fencing contractor serving Hamilton and the Waikato region of New Zealand. The platform provides an interactive pricing calculator, service portfolio, customer testimonials, and seamless appointment booking functionality.

### Key Features

- **Interactive Pricing Calculator**: Real-time fence cost estimation based on type, length, and height
- **Service Portfolio**: Comprehensive showcase of timber, aluminum, PVC/vinyl, and rural fencing options
- **Admin Dashboard**: Complete content management system with Supabase integration
- **Customer Testimonials**: Dynamic review display with ratings and location data
- **Contact Forms**: Lead generation with email notifications via SendGrid
- **WordPress Integration**: Optional plugin for WordPress sites
- **Dark Mode**: Modern dark theme with orange accent colors
- **Mobile-First Design**: Fully responsive across all devices

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Authentication**: Supabase Auth
- **Email**: SendGrid integration
- **Storage**: Google Cloud Storage (via Replit)
- **Deployment**: Replit Platform

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │   React Application   │        │   Admin Dashboard           │   │
│  │  (Vite + TypeScript)  │        │    (Content Management)     │   │
│  │   - Home Page         │        │    - Testimonials           │   │
│  │   - Pricing Calc      │        │    - FAQ Management         │   │
│  │   - Contact Forms     │        │    - Media Library          │   │
│  └──────────┬───────────┘        └──────────┬──────────────────┘   │
│             │                                │                       │
└─────────────┼────────────────────────────────┼──────────────────────┘
              │                                │
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXPRESS SERVER (Port 5000)                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │   REST API Routes    │        │   Supabase Integration      │   │
│  │   /api/pricing       │        │   - Authentication          │   │
│  │   /api/contact       │        │   - Database Operations     │   │
│  │   /api/admin/*       │        │   - Real-time Updates       │   │
│  └──────────┬───────────┘        └──────────┬──────────────────┘   │
│             │                                │                       │
└─────────────┼────────────────────────────────┼──────────────────────┘
              │                                │
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐        ┌─────────────────────────────┐   │
│  │  Supabase PostgreSQL │        │   External Services         │   │
│  │  - Pricing Table     │        │   - SendGrid Email          │   │
│  │  - Quotes Table      │        │   - Google Cloud Storage    │   │
│  │  - Users & Auth      │        │   - Calendly Integration    │   │
│  └──────────────────────┘        └─────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- SendGrid account (for email)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fairfence-app.git
   cd fairfence-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the `.env.example` to `.env` and configure:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # SendGrid Email
   SENDGRID_API_KEY=your-sendgrid-key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📡 API Documentation

### Public Endpoints

- `GET /api/pricing` - Fetch fence pricing data
- `POST /api/contact` - Submit contact form
- `GET /health` - Server health check
- `GET /api/status` - Detailed system status

### Admin Endpoints (Requires Authentication)

- `GET/POST /api/admin/content` - Site content management
- `GET/POST/PUT/DELETE /api/admin/testimonials` - Testimonials CRUD
- `GET/POST/PUT/DELETE /api/admin/faq` - FAQ management
- `POST /api/admin/images/upload` - Image upload
- `GET /api/admin/setup-sql` - Database setup SQL

## 💾 Database Schema

### Core Tables

- **quotes**: Customer quote requests and project details
- **pricing**: Fence pricing data by type and height
- **company_details**: Business information and settings
- **profiles**: User profile information
- **users**: System user accounts

### Authentication

Uses Supabase Auth with Row Level Security (RLS) policies for data protection.

## 🚢 Deployment

### Replit Deployment (Current)

The application is configured for Replit deployment with:
- Automatic environment variable detection
- Health check endpoints for monitoring
- Optimized for Replit's autoscale infrastructure

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** on your hosting platform

3. **Start the production server**
   ```bash
   npm start
   ```

### WordPress Plugin Deployment

1. **Build the WordPress plugin**
   ```bash
   npm run build:wordpress
   ```

2. **Upload to WordPress**
   - ZIP the `wordpress-plugin` folder
   - Upload via WordPress admin or FTP
   - Activate and use `[fairfence_app]` shortcode

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for admin operations | ✅ |
| `SENDGRID_API_KEY` | SendGrid API key for emails | ✅ |
| `PORT` | Server port (default: 5000) | ❌ |
| `NODE_ENV` | Environment mode | ❌ |

### Database Setup

The application includes automatic database setup:
1. Visit `/admin/database` after login
2. Generate setup SQL
3. Run in Supabase SQL Editor
4. Verify table creation

## 🐛 Troubleshooting

### Common Issues

**503 Service Unavailable**
- Check environment variables are set
- Verify Supabase connection
- Check server logs for specific errors

**Database Connection Failed**
- Verify `VITE_SUPABASE_URL` and keys
- Check Supabase project status
- Ensure RLS policies are configured

**Email Not Sending**
- Verify `SENDGRID_API_KEY` is valid
- Check SendGrid sender verification
- Review email service logs

### Debug Endpoints

- `GET /health` - Basic server health
- `GET /api/status` - Detailed system status
- `GET /api/config/status` - Configuration status

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Support

For technical support:
- Check the troubleshooting section
- Review server logs
- Contact the development team

---

**FairFence Contracting Waikato**  
Professional fencing services across Hamilton and Waikato  
📞 021 0835 8914 | 📧 admin@fairfence.co.nz