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
CREATE POLICY "Authenticated users can read site content"
  ON site_content
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site content"
  ON site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site content"
  ON site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site content"
  ON site_content
  FOR DELETE
  TO authenticated
  USING (true);

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