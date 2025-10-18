# FairFence Contracting Waikato - Professional Fencing Website

## Overview

FairFence is a React-based web application for a professional fencing contractor serving Hamilton and the Waikato region of New Zealand. The platform showcases various fencing services including timber, aluminum, PVC/vinyl, and rural fencing with modern dig-free installation options. The application features an interactive pricing calculator, service portfolio, customer testimonials, and contact forms to generate leads and bookings for the business.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens based on orange (#FF6B00) brand colors
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Design System
- **Component Library**: Comprehensive shadcn/ui component collection (40+ components)
- **Theme**: Dark mode by default with orange/black gradient color scheme
- **Typography**: System font stack with Inter fallback
- **Layout**: Mobile-first responsive design with Tailwind breakpoints
- **Brand Colors**: Primary orange (#FF6B00), dark backgrounds, and gradient overlays

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Session-based (connect-pg-simple for PostgreSQL sessions)
- **API Design**: RESTful endpoints with /api prefix routing

### Data Layer
- **ORM**: Drizzle with migrations support and Zod schema validation
- **Schema**: Basic user table with UUID primary keys and username/password fields
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

### Application Features
- **Pricing Calculator**: Interactive tool for fence cost estimation by type, length, and height
- **Service Portfolio**: Detailed showcase of timber, aluminum, PVC, and rural fencing options
- **Booking System**: Modal-based appointment scheduling with external calendar integration
- **Testimonials**: Customer review display with ratings and location data
- **Contact Forms**: Lead generation with service-specific inquiry routing
- **Service Areas**: Geographic coverage mapping for Waikato region
- **Image Management**: WordPress admin interface for easy image upload, replacement, and management with category organization

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **TypeScript**: Full TypeScript support with strict type checking
- **Build Tools**: Vite with ES modules, esbuild for production builds

### UI and Styling
- **Radix UI**: Complete accessible component primitives library
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Class Variance Authority**: Component variant management
- **Embla Carousel**: Touch-friendly carousel components

### Database and Backend
- **PostgreSQL**: Neon serverless database for production data storage
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Express.js**: Web application framework with middleware support
- **Session Management**: PostgreSQL-backed session storage

### Development and Deployment
- **Replit Platform**: Development environment with integrated hosting
- **TSX**: TypeScript execution for development server
- **Date-fns**: Date manipulation and formatting utilities

### External Services
- **Calendly**: Appointment booking integration for site visits
- **Font Services**: Google Fonts for typography (DM Sans, Architects Daughter, Fira Code, Geist Mono)
- **Image Assets**: Local asset management with attached_assets directory