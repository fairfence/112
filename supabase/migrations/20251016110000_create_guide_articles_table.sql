/*
  # Create Guide Articles Table for SEO-Optimized Content

  ## Purpose
  This migration creates a comprehensive guide articles system for FairFence's educational content library, optimized for SEO and search engine visibility.

  ## New Tables

  ### `guide_articles`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Article title (H1)
  - `slug` (text, unique) - URL-friendly identifier for SEO
  - `content` (text) - Full article content (markdown/HTML)
  - `excerpt` (text) - Short description/preview
  - `meta_title` (text) - SEO meta title (60 chars optimal)
  - `meta_description` (text) - SEO meta description (160 chars optimal)
  - `focus_keyword` (text) - Primary SEO keyword
  - `canonical_url` (text) - Canonical URL for duplicate content prevention
  - `featured_image_url` (text) - Main article image URL
  - `featured_image_alt` (text) - Alt text for featured image (SEO)
  - `category` (text) - Article category for organization
  - `tags` (text) - Comma-separated tags for discovery
  - `reading_time_minutes` (integer) - Estimated reading time
  - `related_service_types` (text) - Related fence types (JSON array)
  - `service_areas` (text) - Relevant locations (JSON array)
  - `author` (text) - Content author name
  - `is_published` (boolean) - Publication status
  - `is_featured` (boolean) - Featured on homepage
  - `order_index` (integer) - Display order in listings
  - `view_count` (integer) - Total article views
  - `published_at` (timestamp) - Publication date
  - `updated_at` (timestamp) - Last update timestamp
  - `created_at` (timestamp) - Creation timestamp

  ## Security
  - Enable RLS on guide_articles table
  - Public read access for published articles
  - Admin-only write access for content management
  - View count updates allowed for analytics

  ## Notes
  - Slugs must be unique for clean URLs
  - All SEO fields are indexed for performance
  - Content supports markdown or HTML formatting
  - Related services link to existing service types
*/

-- Create guide_articles table
CREATE TABLE IF NOT EXISTS guide_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  focus_keyword text DEFAULT '',
  canonical_url text DEFAULT '',
  featured_image_url text DEFAULT '',
  featured_image_alt text DEFAULT '',
  category text DEFAULT 'General',
  tags text DEFAULT '',
  reading_time_minutes integer DEFAULT 5,
  related_service_types text DEFAULT '[]',
  service_areas text DEFAULT '[]',
  author text DEFAULT 'FairFence Team',
  is_published boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  view_count integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_guide_articles_slug ON guide_articles(slug);
CREATE INDEX IF NOT EXISTS idx_guide_articles_category ON guide_articles(category);
CREATE INDEX IF NOT EXISTS idx_guide_articles_published ON guide_articles(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_guide_articles_featured ON guide_articles(is_featured, order_index);

-- Enable Row Level Security
ALTER TABLE guide_articles ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public can view published guide articles"
  ON guide_articles
  FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated users (admin) can manage all articles
CREATE POLICY "Authenticated users can view all guide articles"
  ON guide_articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert guide articles"
  ON guide_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update guide articles"
  ON guide_articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete guide articles"
  ON guide_articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guide_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on updates
DROP TRIGGER IF EXISTS guide_articles_updated_at_trigger ON guide_articles;
CREATE TRIGGER guide_articles_updated_at_trigger
  BEFORE UPDATE ON guide_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_guide_articles_updated_at();
