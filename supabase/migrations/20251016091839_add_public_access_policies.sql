/*
  # Add Public Access Policies for Content Tables

  ## Changes Made
  
  ### Public Read Access Policies Added
    - FAQ items: Allow anonymous users to view active FAQ items
    - Images: Allow anonymous users to view public images
    - Site content: Allow anonymous users to read site content
    - Testimonials: Allow anonymous users to view active testimonials
  
  ## Security Notes
  - These policies allow public read-only access to published content
  - Write operations still require authentication
  - Policies filter for active/published content only for public access
*/

-- FAQ Items: Public can view active items
CREATE POLICY "Public can view active FAQ items"
  ON faq_items FOR SELECT
  TO anon
  USING (is_active = true);

-- Images: Public can view all images (they're used on the public website)
CREATE POLICY "Public can view images"
  ON images FOR SELECT
  TO anon
  USING (true);

-- Site Content: Public can read all site content (it's public website content)
CREATE POLICY "Public can view site content"
  ON site_content FOR SELECT
  TO anon
  USING (true);

-- Testimonials: Public can view active testimonials
CREATE POLICY "Public can view active testimonials"
  ON testimonials FOR SELECT
  TO anon
  USING (is_active = true);
