// FILEPATH: server/sqlGenerator.ts
// SQL generation for FairFence CMS table deployment
export function generateContentManagementSQL(): string {
  return `
-- FairFence Contracting Waikato - Content Management System Tables
-- Run this SQL in your Supabase SQL Editor to create the content management tables

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  last_login timestamp,
  created_at timestamp DEFAULT now()
);

-- Site content management (hero text, contact info, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  updated_by varchar,
  updated_at timestamp DEFAULT now(),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Customer testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text DEFAULT '',
  rating integer DEFAULT 5,
  text text NOT NULL,
  source text DEFAULT 'Google',
  date text DEFAULT '',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Service management
CREATE TABLE IF NOT EXISTS services (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL UNIQUE,
  title text NOT NULL,
  description text DEFAULT '',
  features text DEFAULT '',
  price_range text DEFAULT '',
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  updated_at timestamp DEFAULT now()
);

-- Images table for media management
CREATE TABLE IF NOT EXISTS images (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  category text DEFAULT '',
  alt text DEFAULT '',
  size integer DEFAULT 0,
  mime_type text DEFAULT '',
  uploaded_by varchar,
  is_public boolean DEFAULT true,
  uploaded_at timestamp DEFAULT now(),
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Enable RLS for images
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for images
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

CREATE POLICY "Users can update and delete their own images"
  ON images
  FOR ALL
  TO authenticated
  USING (uploaded_by = auth.uid())
  WITH CHECK (uploaded_by = auth.uid());

-- Create indexes for images
CREATE INDEX IF NOT EXISTS images_uploaded_by_idx ON images(uploaded_by);
CREATE INDEX IF NOT EXISTS images_category_idx ON images(category);
CREATE INDEX IF NOT EXISTS images_uploaded_at_idx ON images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS images_is_public_idx ON images(is_public);

-- Insert default data
INSERT INTO site_content (section, key, value) VALUES
('hero', 'title', 'Professional Fencing in Waikato'),
('hero', 'tagline', 'Quality fencing solutions for your property'),
('business', 'phone', '(07) 123-4567'),
('business', 'email', 'info@fairfencecontracting.co.nz'),
('about', 'description', 'FairFence Contracting Waikato provides professional fencing services across Hamilton and the Waikato region.')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO testimonials (name, location, rating, text, source, date, is_featured) VALUES
('John Smith', 'Hamilton', 5, 'Excellent fencing work. Professional service and great quality.', 'Google', '2024-09-25', true)
ON CONFLICT (name, text) DO NOTHING;

INSERT INTO faq_items (question, answer, order_index) VALUES
('What types of fencing do you offer?', 'We offer timber, aluminum, PVC/vinyl, and rural fencing solutions.', 1),
('Do you provide free quotes?', 'Yes, we provide free, no-obligation quotes for all fencing projects.', 2),
('How long does installation take?', 'Installation time depends on the project size, typically 1-3 days for residential properties.', 3)
ON CONFLICT (question) DO NOTHING;

-- Insert sample images
INSERT INTO images (filename, url, category, alt, size, mime_type, is_public) VALUES
('hero-fence.jpg', '/images/hero-fence.jpg', 'hero', 'Professional fence installation', 245760, 'image/jpeg', true),
('timber-fence-sample.jpg', '/images/timber-fence-sample.jpg', 'portfolio', 'Timber fence example', 189440, 'image/jpeg', true),
('aluminum-fence-sample.jpg', '/images/aluminum-fence-sample.jpg', 'portfolio', 'Aluminum fence example', 167890, 'image/jpeg', true)
ON CONFLICT (url) DO NOTHING;

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'site_content', 'testimonials', 'faq_items', 'services', 'images')
ORDER BY table_name;
`.trim();
}

export function generateTableCheckSQL(): string {
  return `
-- Check if content management tables exist
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('users', 'site_content', 'testimonials', 'faq_items', 'services', 'images')
ORDER BY table_name;
  `.trim();
}