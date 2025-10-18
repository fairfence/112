/*
  # Create Site Surveys Table

  1. New Tables
    - `site_surveys`
      - `id` (uuid, primary key) - Unique identifier for survey
      - `customer_name` (text, required) - Customer's full name
      - `phone` (text, required) - Contact phone number
      - `email` (text, optional) - Customer email address
      - `property_address` (text, required) - Property location
      - `removal_required` (boolean, default false) - Whether old fence removal is needed
      - `additional_notes` (text, optional) - Other work or special requirements
      - `status` (text, default 'new') - Survey status: new, contacted, quoted, completed
      - `created_at` (timestamp) - When survey was submitted
      - `updated_at` (timestamp) - Last update timestamp
    
    - `fence_lines`
      - `id` (uuid, primary key) - Unique identifier for fence line
      - `survey_id` (uuid, foreign key) - References site_surveys
      - `line_description` (text, optional) - Description of fence line location
      - `length` (numeric, required) - Length in metres
      - `height` (text, optional) - Fence height (1.2m, 1.8m, 2.1m, Custom)
      - `fence_type` (text, required) - Type of fencing
      - `rail_wire_count` (text, optional) - Number of rails/wires for farm fencing
      - `special_notes` (text, optional) - Special notes for this fence line
      - `line_order` (integer, default 0) - Display order
      - `created_at` (timestamp) - When line was added
    
    - `survey_photos`
      - `id` (uuid, primary key) - Unique identifier for photo
      - `survey_id` (uuid, foreign key) - References site_surveys
      - `filename` (text, required) - Original filename
      - `storage_path` (text, required) - Path in Supabase Storage
      - `url` (text, required) - Public URL to access photo
      - `file_size` (integer) - Size in bytes
      - `mime_type` (text) - Image MIME type
      - `uploaded_at` (timestamp) - When photo was uploaded

  2. Security
    - Enable RLS on all new tables
    - Add policies for public insert (surveys can be submitted by anyone)
    - Add policies for authenticated read/update (admin access)
*/

-- Create site_surveys table
CREATE TABLE IF NOT EXISTS site_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  property_address text NOT NULL,
  removal_required boolean DEFAULT false,
  additional_notes text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fence_lines table
CREATE TABLE IF NOT EXISTS fence_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES site_surveys(id) ON DELETE CASCADE,
  line_description text,
  length numeric NOT NULL,
  height text,
  fence_type text NOT NULL,
  rail_wire_count text,
  special_notes text,
  line_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create survey_photos table
CREATE TABLE IF NOT EXISTS survey_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES site_surveys(id) ON DELETE CASCADE,
  filename text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  file_size integer,
  mime_type text,
  uploaded_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fence_lines_survey_id ON fence_lines(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_photos_survey_id ON survey_photos(survey_id);
CREATE INDEX IF NOT EXISTS idx_site_surveys_status ON site_surveys(status);
CREATE INDEX IF NOT EXISTS idx_site_surveys_created_at ON site_surveys(created_at DESC);

-- Enable Row Level Security
ALTER TABLE site_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE fence_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_surveys
-- Allow anyone to insert surveys (public quote requests)
CREATE POLICY "Anyone can submit site surveys"
  ON site_surveys FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all surveys
CREATE POLICY "Authenticated users can view all surveys"
  ON site_surveys FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update surveys
CREATE POLICY "Authenticated users can update surveys"
  ON site_surveys FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete surveys
CREATE POLICY "Authenticated users can delete surveys"
  ON site_surveys FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for fence_lines
-- Allow anyone to insert fence lines when submitting survey
CREATE POLICY "Anyone can submit fence lines"
  ON fence_lines FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all fence lines
CREATE POLICY "Authenticated users can view all fence lines"
  ON fence_lines FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update fence lines
CREATE POLICY "Authenticated users can update fence lines"
  ON fence_lines FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete fence lines
CREATE POLICY "Authenticated users can delete fence lines"
  ON fence_lines FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for survey_photos
-- Allow anyone to insert photos when submitting survey
CREATE POLICY "Anyone can upload survey photos"
  ON survey_photos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all photos
CREATE POLICY "Authenticated users can view all photos"
  ON survey_photos FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update photos
CREATE POLICY "Authenticated users can update photos"
  ON survey_photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete photos
CREATE POLICY "Authenticated users can delete photos"
  ON survey_photos FOR DELETE
  TO authenticated
  USING (true);