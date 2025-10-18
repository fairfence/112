/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Customer name
      - `location` (text, optional) - Customer location
      - `rating` (integer, default 5) - Rating out of 5
      - `text` (text, not null) - Testimonial content
      - `source` (text, default 'Google') - Review source
      - `date` (text, optional) - Date of review
      - `is_active` (boolean, default true) - Active status
      - `is_featured` (boolean, default false) - Featured on homepage
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `testimonials` table
    - Add policies for authenticated users to manage testimonials
    - Add policy for public read access to active testimonials

  3. Indexes
    - Index on is_active for filtering
    - Index on is_featured for homepage display
    - Index on created_at for sorting
*/

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

-- Create policies for public read access to active testimonials
CREATE POLICY "Active testimonials are viewable by everyone"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policies for authenticated users to manage testimonials
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS testimonials_is_active_idx ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS testimonials_is_featured_idx ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS testimonials_created_at_idx ON testimonials(created_at DESC);

-- Insert sample testimonials
INSERT INTO testimonials (name, location, rating, text, source, date, is_featured) VALUES
  ('John Smith', 'Hamilton', 5, 'Excellent fencing work. Professional service and great quality.', 'Google', '2024-09-25', true),
  ('Sarah Johnson', 'Cambridge', 5, 'Very happy with our new fence. The team was professional and completed the work on time.', 'Google', '2024-09-20', true),
  ('Mike Wilson', 'Te Awamutu', 4, 'Good quality fence at a fair price. Would recommend.', 'Google', '2024-09-15', false)
ON CONFLICT DO NOTHING;