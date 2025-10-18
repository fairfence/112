/*
  # Add Rating Configuration to Site Content

  1. Purpose
    - Centralize Google rating and review count configuration
    - Allow admin to update ratings site-wide through one location
    - Eliminate hardcoded rating values across components

  2. New Data
    - `business.rating_google` - Google rating value (e.g., "5.0")
    - `business.review_count_google` - Google review count (e.g., "87")
    - `business.google_reviews_url` - Link to Google reviews
    - `business.rating_builderscrack` - BuildersCrack rating value
    - `business.review_count_builderscrack` - BuildersCrack review count
    - `business.builderscrack_url` - Link to BuildersCrack profile

  3. Security
    - Uses existing RLS policies on site_content table
    - Only authenticated admins can modify these values
*/

-- Insert rating configuration into site_content table
INSERT INTO site_content (section, key, value)
VALUES
  ('business', 'rating_google', '5.0'),
  ('business', 'review_count_google', '87'),
  ('business', 'google_reviews_url', 'https://www.google.com/search?q=FairFence+Contracting+Waikato'),
  ('business', 'rating_builderscrack', '5.0'),
  ('business', 'review_count_builderscrack', '15'),
  ('business', 'builderscrack_url', 'https://builderscrack.co.nz/tradies/2ng7u4bg/fairfence-contracting-waikato')
ON CONFLICT DO NOTHING;
