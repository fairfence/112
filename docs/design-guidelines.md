# Design Guidelines for FairFence Public Website

## Design Approach
**Reference-Based Approach** - Taking inspiration from established trade service websites like BuildersCrack and modern contractor sites, focusing on trust-building, mobile optimization, and clear service presentation for the competitive Waikato fencing market.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand Orange: 25 100% 50% (vibrant orange #FF6B00)
- Dark Background: 0 0% 10% (dark charcoal for professional contrast)
- Light Background: 0 0% 98% (clean white for content areas)

**Secondary Colors:**
- Text Gray: 0 0% 20% (readable dark gray)
- Light Gray: 0 0% 85% (subtle borders and backgrounds)
- Success Green: 120 60% 45% (for trust indicators and checkmarks)

**Dark Mode Support:**
- Dark Primary: 0 0% 12%
- Dark Cards: 0 0% 18% 
- Dark Text: 0 0% 90%

### B. Typography
**Primary Font:** Inter or system font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI')
- Headers: Bold weights (700-800) for strong hierarchy
- Body: Regular (400) and medium (500) weights
- Mobile: Larger touch-friendly sizes (minimum 16px base)

### C. Layout System
**Tailwind Spacing:** Consistent use of 4, 8, 16, and 32 units (p-4, m-8, gap-16, etc.)
- Mobile-first approach with generous touch targets (minimum 44px)
- Container max-widths: mobile full-width, desktop 1200px
- Grid systems: 1-column mobile, 2-3 column desktop

### D. Component Library

**Navigation:**
- Sticky header with blur backdrop
- Large touch-friendly menu items
- Prominent phone number and quote CTA

**Hero Section:**
- Full-viewport mobile hero with compelling headline
- Orange gradient overlays for visual impact
- Single powerful CTA above the fold

**Service Cards:**
- Clean white cards with subtle shadows
- Orange accent borders and icons
- Clear pricing information where appropriate

**Forms:**
- Large input fields optimized for mobile keyboards
- Orange focus states and submit buttons
- Minimal required fields to reduce friction

**Trust Indicators:**
- Review stars and ratings prominently displayed
- Customer photo testimonials
- Local service area badges

### E. Mobile Optimization Priority
- Touch targets minimum 44px
- Simplified navigation with burger menu
- One-thumb scrolling and interaction patterns
- Fast loading with optimized images
- Smooth scrolling between sections

## Content Strategy
- Front-load value proposition and trust signals
- Maximum 4-5 main sections to avoid endless scrolling
- Simple pricing calculator with basic inputs (type, length, height)
- Honest testimonials from actual Google Reviews and BuildersCrack
- Clear service areas without overstating coverage

## Images Section
**Hero Image:** Large hero image showcasing a completed FairFence project (timber or aluminum fence) with property in background. Should be optimized for mobile viewing.

**Service Images:** Use provided project photos for each service type:
- Timber fencing examples
- Aluminum/Coloursteel installations  
- Rural/farm fencing projects
- Dig-free system demonstrations

**Before/After Gallery:** Organized project photos showing transformation results, optimized for mobile swiping.

**Team/Trust Images:** Professional photo of Alex Russell and team on-site to build local trust and credibility.

All images should be WebP format, properly compressed, and include alt text for accessibility.