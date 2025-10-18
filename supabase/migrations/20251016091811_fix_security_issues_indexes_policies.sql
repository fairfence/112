/*
  # Security Improvements: Remove Unused/Duplicate Indexes and Consolidate RLS Policies

  ## Changes Made
  
  ### 1. Duplicate Indexes Removed
    - Drop `idx_faq_items_is_active` (keeping `faq_items_is_active_idx`)
    - Drop `idx_testimonials_is_active` (keeping `testimonials_is_active_idx`)
  
  ### 2. Unused Indexes Removed
    - Drop `idx_site_content_updated_by` on `site_content`
    - Drop `idx_user_invitations_invited_by` on `user_invitations`
    - Drop `idx_user_roles_created_by` on `user_roles`
    - Drop `testimonials_is_featured_idx` on `testimonials`
    - Drop `idx_quotes_user_id` on `quotes`
    - Drop `idx_images_uploaded_by` on `images`
    - Drop `idx_fence_lines_survey_id` on `fence_lines`
    - Drop `idx_survey_photos_survey_id` on `survey_photos`
    - Drop `idx_site_surveys_status` on `site_surveys`
    - Drop `idx_site_surveys_created_at` on `site_surveys`
  
  ### 3. Redundant RLS Policies Consolidated
    - Consolidate FAQ items SELECT policies (keep broader policy)
    - Consolidate images SELECT policies (keep broader policy)
    - Consolidate site_content SELECT policies (keep broader policy)
    - Consolidate testimonials SELECT policies (keep broader policy)
    - Consolidate user_invitations policies (remove duplicate "Enable access" policies)

  ## Security Improvements
  - Reduced database overhead from unused indexes
  - Eliminated potential policy conflicts from multiple permissive policies
  - Cleaner, more maintainable RLS configuration
*/

-- ============================================================================
-- STEP 1: Remove Duplicate Indexes
-- ============================================================================

-- Drop duplicate index on faq_items (keeping faq_items_is_active_idx)
DROP INDEX IF EXISTS idx_faq_items_is_active;

-- Drop duplicate index on testimonials (keeping testimonials_is_active_idx)
DROP INDEX IF EXISTS idx_testimonials_is_active;

-- ============================================================================
-- STEP 2: Remove Unused Indexes
-- ============================================================================

DROP INDEX IF EXISTS idx_site_content_updated_by;
DROP INDEX IF EXISTS idx_user_invitations_invited_by;
DROP INDEX IF EXISTS idx_user_roles_created_by;
DROP INDEX IF EXISTS testimonials_is_featured_idx;
DROP INDEX IF EXISTS idx_quotes_user_id;
DROP INDEX IF EXISTS idx_images_uploaded_by;
DROP INDEX IF EXISTS idx_fence_lines_survey_id;
DROP INDEX IF EXISTS idx_survey_photos_survey_id;
DROP INDEX IF EXISTS idx_site_surveys_status;
DROP INDEX IF EXISTS idx_site_surveys_created_at;

-- ============================================================================
-- STEP 3: Consolidate Redundant RLS Policies
-- ============================================================================

-- FAQ Items: Remove narrower policy, keep broader one
DROP POLICY IF EXISTS "Active FAQ items are viewable by everyone" ON faq_items;
-- Keep: "Authenticated users can view all FAQ items"

-- Images: Remove redundant policy
DROP POLICY IF EXISTS "Public can view public images" ON images;
-- Keep: "Authenticated users can view all images"

-- Site Content: Remove redundant policy
DROP POLICY IF EXISTS "Public can read site content" ON site_content;
-- Keep: "Authenticated users can read site content"

-- Testimonials: Remove narrower policy
DROP POLICY IF EXISTS "Active testimonials are viewable by everyone" ON testimonials;
-- Keep: "Authenticated users can view all testimonials"

-- User Invitations: Remove duplicate "Enable access" policies
DROP POLICY IF EXISTS "Enable access for authenticated users" ON user_invitations;
-- Keep the more specific policies:
-- - "Authenticated read invitations"
-- - "Authenticated insert invitations"
-- - "Authenticated update invitations"
-- - "Authenticated delete invitations"
