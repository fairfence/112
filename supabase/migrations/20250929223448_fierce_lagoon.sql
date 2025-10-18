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
CREATE INDEX IF NOT EXISTS images_uploaded_by_idx ON images(uploaded_by);
CREATE INDEX IF NOT EXISTS images_category_idx ON images(category);
CREATE INDEX IF NOT EXISTS images_uploaded_at_idx ON images(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS images_is_public_idx ON images(is_public);

-- Insert some sample data (optional)
INSERT INTO images (filename, url, category, alt, size, mime_type, is_public) VALUES
  ('hero-fence.jpg', '/images/hero-fence.jpg', 'hero', 'Professional fence installation', 245760, 'image/jpeg', true),
  ('timber-fence-sample.jpg', '/images/timber-fence-sample.jpg', 'portfolio', 'Timber fence example', 189440, 'image/jpeg', true),
  ('aluminum-fence-sample.jpg', '/images/aluminum-fence-sample.jpg', 'portfolio', 'Aluminum fence example', 167890, 'image/jpeg', true)
ON CONFLICT DO NOTHING;