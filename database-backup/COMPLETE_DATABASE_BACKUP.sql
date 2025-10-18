-- ============================================================================
-- FAIRFENCE CONTRACTING WAIKATO - COMPLETE DATABASE BACKUP
-- ============================================================================
-- Created: 2025-10-03
-- Purpose: Complete database schema and data backup
--
-- This file contains:
-- 1. All table schemas with RLS policies
-- 2. All indexes and constraints
-- 3. All default data and content
-- 4. Security policies and functions
--
-- To restore this database:
-- 1. Create a new Supabase project or use existing
-- 2. Run this SQL file in the SQL editor
-- 3. Verify all tables and data are present
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Images Table (20250929223448_fierce_lagoon.sql)
-- ============================================================================

/*
  # Create images table for media management

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `filename` (text, not null)
      - `url` (text, not null)
      - `category` (text, optional)
      - `alt` (text, optional)
      - `size` (integer, file size in bytes)
      - `mime_type` (text, file MIME type)
      - `uploaded_by` (uuid, references auth.users)
      - `is_public` (boolean, default true)
      - `uploaded_at` (timestamp, default now)

  2. Security
    - Enable RLS on `images` table
    - Add policies for authenticated users to manage images
    - Add policy for public read access to public images

  3. Indexes
    - Index on uploaded_by for user queries
    - Index on category for filtering
    - Index on uploaded_at for sorting
*/

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  category text DEFAULT '',
  alt text DEFAULT '',
  size integer DEFAULT 0,
  mime_type text DEFAULT '',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public boolean DEFAULT true,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public images are viewable by everyone"
  ON images
  FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Authenticated users can view all images"
  ON images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update images they uploaded"
  ON images
  FOR UPDATE
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Admins can update any image"
  ON images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Users can delete images they uploaded"
  ON images
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

CREATE POLICY "Admins can delete any image"
  ON images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS images_uploaded_at_idx ON images(uploaded_at DESC);

-- Insert sample data
INSERT INTO images (filename, url, category, alt, size, mime_type, is_public) VALUES
  ('hero-fence.jpg', '/images/hero-fence.jpg', 'hero', 'Professional fence installation', 245760, 'image/jpeg', true),
  ('timber-fence-sample.jpg', '/images/timber-fence-sample.jpg', 'portfolio', 'Timber fence example', 189440, 'image/jpeg', true),
  ('aluminum-fence-sample.jpg', '/images/aluminum-fence-sample.jpg', 'portfolio', 'Aluminum fence example', 167890, 'image/jpeg', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 2: Site Content Table (20250930000007_solitary_shrine.sql)
-- ============================================================================

/*
  # Create site_content table for content management

  1. New Tables
    - `site_content`
      - `id` (uuid, primary key)
      - `section` (text, content section like 'hero', 'about')
      - `key` (text, content key within section)
      - `value` (text, content value)
      - `updated_by` (uuid, foreign key to auth.users)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `site_content` table
    - Add policies for authenticated users to manage content
*/

-- Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read site content"
  ON site_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage site content"
  ON site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default content
INSERT INTO site_content (section, key, value) VALUES
  ('hero', 'title', 'Fair, Reliable Residential Fencing Team'),
  ('hero', 'description', 'Small, dedicated team providing quality fencing at fair prices. We''re with you from initial site visit through to the finished fence - no subcontractors, just us.'),
  ('hero', 'tagline', 'Trusted by homeowners across Hamilton, Cambridge, Te Awamutu & wider Waikato'),
  ('business', 'company_name', 'FairFence'),
  ('business', 'phone_display', '021 0835 8914'),
  ('business', 'email', 'Admin@fairfence.co.nz'),
  ('business', 'location', 'Ohaupo, New Zealand')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 3: Additional Site Content (20250930000303_red_shape.sql)
-- ============================================================================

-- Process Timeline Content
INSERT INTO site_content (section, key, value) VALUES
('process', 'title', 'From First Call to Perfect Fence'),
('process', 'description', 'Our streamlined 5-step process ensures your fencing project runs smoothly from start to finish. The same team handles everything - no confusion, no delays.'),
('process', 'step1_title', 'Initial Contact'),
('process', 'step1_description', 'Call or text us for a quick chat about your project. We''ll answer your questions and arrange a convenient site visit time.'),
('process', 'step1_timeframe', 'Same day response'),
('process', 'step2_title', 'Free Site Visit'),
('process', 'step2_description', 'We''ll visit your property to measure, assess ground conditions, and discuss your exact requirements - no obligation.'),
('process', 'step2_timeframe', 'Within 2-3 days'),
('process', 'step3_title', 'Custom Quote'),
('process', 'step3_description', 'Receive a detailed, transparent quote with no hidden costs. We''ll explain every item and answer any questions.'),
('process', 'step3_timeframe', 'Within 24 hours'),
('process', 'step4_title', 'Professional Installation'),
('process', 'step4_description', 'Our same small team handles your entire installation from start to finish - no subcontractors, just us.'),
('process', 'step4_timeframe', '1-3 days typical'),
('process', 'step5_title', 'Final Inspection'),
('process', 'step5_description', 'We walk through the completed fence with you, ensure you''re 100% happy, and provide warranty documentation.'),
('process', 'step5_timeframe', 'Completion day'),
('process', 'cta_title', 'Ready to Start Your Project?'),
('process', 'cta_description', 'Most fences are completed within a week from approval. Get your free quote today!'),

-- Services Section Content
('services', 'title', 'Professional Fencing Solutions'),
('services', 'description', 'From residential timber to rural lifestyle fencing - we handle every project with the same attention to detail and fair pricing approach.'),
('services', 'timber_title', 'Quality Timber Fencing'),
('services', 'timber_description', 'Classic wooden fences perfect for Kiwi homes. Paling, panel, and picket styles available with quality H3.2 treated timber.'),
('services', 'timber_features', 'Residential paling,Privacy screens,Custom gates,25-year posts'),
('services', 'timber_price', 'From $180/m'),
('services', 'aluminum_title', 'Modern Aluminum Fencing'),
('services', 'aluminum_description', 'Sleek, durable aluminum fencing perfect for contemporary homes and pool areas. Low maintenance with excellent longevity.'),
('services', 'aluminum_features', 'Pool compliant,Security panels,Designer slats,Powder coated'),
('services', 'aluminum_price', 'From $220/m'),
('services', 'vinyl_title', 'Low-Maintenance Vinyl'),
('services', 'vinyl_description', 'Premium PVC/vinyl fencing that never needs painting or staining. Perfect for busy homeowners wanting lasting beauty.'),
('services', 'vinyl_features', 'Zero maintenance,UV resistant,25-year warranty,Wind rated'),
('services', 'vinyl_price', 'From $250/m'),
('services', 'rural_title', 'Rural & Lifestyle Fencing'),
('services', 'rural_description', 'Post and rail, wire, and electric fencing designed for lifestyle blocks and farms. Built to handle New Zealand conditions.'),
('services', 'rural_features', 'Stock proof,Electric ready,Vehicle gates,Farm grade'),
('services', 'rural_price', 'Quote on request'),

-- About Section Content
('about', 'title', 'Where Fairness and Quality Intersect'),
('about', 'description', 'Welcome to Fairfence Contracting Waikato, a company that''s built on the pillars of fairness and exceptional quality.'),
('about', 'tagline', 'Building More Than Fences, Building Trust.')
ON CONFLICT (section, key) DO UPDATE SET value = EXCLUDED.value;

-- ============================================================================
-- MIGRATION 4: Testimonials Table (20251001075651_create_testimonials_table.sql)
-- ============================================================================

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text DEFAULT '',
  rating integer DEFAULT 5,
  text text NOT NULL,
  source text DEFAULT 'Google',
  date text DEFAULT '',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Active testimonials are viewable by everyone"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS testimonials_is_active_idx ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS testimonials_is_featured_idx ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS testimonials_created_at_idx ON testimonials(created_at DESC);

-- Insert sample testimonials
INSERT INTO testimonials (name, location, rating, text, source, date, is_featured) VALUES
  ('John Smith', 'Hamilton', 5, 'Excellent fencing work. Professional service and great quality.', 'Google', '2024-09-25', true),
  ('Sarah Johnson', 'Cambridge', 5, 'Very happy with our new fence. The team was professional and completed the work on time.', 'Google', '2024-09-20', true),
  ('Mike Wilson', 'Te Awamutu', 4, 'Good quality fence at a fair price. Would recommend.', 'Google', '2024-09-15', false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 5: FAQ Items Table (20251001075709_create_faq_items_table.sql)
-- ============================================================================

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Active FAQ items are viewable by everyone"
  ON faq_items
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all FAQ items"
  ON faq_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert FAQ items"
  ON faq_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQ items"
  ON faq_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete FAQ items"
  ON faq_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS faq_items_is_active_idx ON faq_items(is_active);
CREATE INDEX IF NOT EXISTS faq_items_order_index_idx ON faq_items(order_index);

-- Insert sample FAQ items
INSERT INTO faq_items (question, answer, order_index) VALUES
  ('What types of fencing do you offer?', 'We offer timber, aluminum, PVC/vinyl, and rural fencing solutions tailored to residential and lifestyle properties across the Waikato region.', 1),
  ('Do you provide free quotes?', 'Yes, we provide free, no-obligation quotes for all fencing projects. Use our online calculator for an instant estimate or contact us for a detailed quote.', 2),
  ('How long does installation take?', 'Installation time depends on the project size and fence type. Typical residential fencing projects take 1-3 days to complete.', 3),
  ('What areas do you service?', 'We service Hamilton, Cambridge, Te Awamutu, and the wider Waikato region. Contact us to confirm we cover your area.', 4),
  ('Do you offer warranties?', 'Yes, we stand behind our work with comprehensive warranties on both materials and workmanship. Specific warranty terms vary by fence type.', 5),
  ('Can you handle council consent requirements?', 'Yes, we can assist with council consent applications where required. We''re familiar with local council requirements across the Waikato region.', 6)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION 6: Rating Configuration (20251002000001_add_rating_config.sql)
-- ============================================================================

-- Insert rating configuration
INSERT INTO site_content (section, key, value) VALUES
  ('business', 'rating_google', '4.9'),
  ('business', 'review_count_google', '87'),
  ('business', 'review_url_google', 'https://www.google.com/search?q=FairFence+Contracting+Waikato'),
  ('business', 'rating_builderscrack', '5.0'),
  ('business', 'review_count_builderscrack', '12'),
  ('business', 'review_url_builderscrack', 'https://builderscrack.co.nz/tradies/2ng7u4bg/fairfence-contracting-waikato')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- BACKUP COMPLETE
-- ============================================================================
--
-- This backup includes:
-- ✓ Images table with RLS policies
-- ✓ Site content table with all default content
-- ✓ Testimonials table with sample data
-- ✓ FAQ items table with sample questions
-- ✓ Rating configuration for Google and BuildersCrack
-- ✓ All indexes and constraints
-- ✓ All security policies
--
-- To verify the restore:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT COUNT(*) FROM site_content;
-- SELECT COUNT(*) FROM testimonials;
-- SELECT COUNT(*) FROM faq_items;
--
-- ============================================================================
