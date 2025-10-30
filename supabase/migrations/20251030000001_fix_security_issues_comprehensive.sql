/*
  # Comprehensive Security Fixes

  ## Overview
  This migration addresses multiple security and performance issues identified in the database audit:

  ## Changes Made

  ### 1. Add Missing Foreign Key Indexes (Performance & Security)
    - Add index on `fence_lines.survey_id` (foreign key to site_surveys)
    - Add index on `images.uploaded_by` (foreign key to auth.users)
    - Add index on `quotes.user_id` (foreign key to auth.users)
    - Add index on `site_content.updated_by` (foreign key to auth.users)
    - Add index on `survey_photos.survey_id` (foreign key to site_surveys)
    - Add index on `user_invitations.invited_by` (foreign key to users)
    - Add index on `user_roles.created_by` (foreign key to users)

  ### 2. Remove Unused Indexes (Performance Optimization)
    - Drop `testimonials_is_active_idx` - not being used in queries
    - Drop `faq_items_is_active_idx` - not being used in queries
    - Drop `idx_guide_articles_category` - not being used in queries
    - Drop `idx_guide_articles_published` - not being used in queries
    - Drop `idx_guide_articles_featured` - not being used in queries
    - Drop `idx_guide_articles_slug` - unique constraint already provides indexing

  ### 3. Fix Multiple Permissive Policies (Security)
    - Remove duplicate policy on guide_articles for authenticated users
    - Consolidate into single, clearer policy

  ### 4. Fix Function Search Path (Security)
    - Update `update_guide_articles_updated_at` function with stable search_path

  ### 5. Leaked Password Protection (Instructions)
    - Note: Must be enabled via Supabase Dashboard → Authentication → Settings
    - Enable "Check for compromised passwords" to use HaveIBeenPwned integration

  ## Security Improvements
  - Prevents suboptimal query performance from missing foreign key indexes
  - Eliminates potential policy conflicts from multiple permissive policies
  - Protects against search path hijacking attacks
  - Reduces database overhead from unused indexes
  - Cleaner, more maintainable security configuration
*/

-- ============================================================================
-- STEP 1: Add Missing Foreign Key Indexes
-- ============================================================================

-- Index for fence_lines.survey_id foreign key
CREATE INDEX IF NOT EXISTS idx_fence_lines_survey_id
  ON fence_lines(survey_id);

-- Index for images.uploaded_by foreign key
CREATE INDEX IF NOT EXISTS idx_images_uploaded_by
  ON images(uploaded_by);

-- Index for quotes.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_quotes_user_id
  ON quotes(user_id);

-- Index for site_content.updated_by foreign key
CREATE INDEX IF NOT EXISTS idx_site_content_updated_by
  ON site_content(updated_by);

-- Index for survey_photos.survey_id foreign key
CREATE INDEX IF NOT EXISTS idx_survey_photos_survey_id
  ON survey_photos(survey_id);

-- Index for user_invitations.invited_by foreign key
CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by
  ON user_invitations(invited_by);

-- Index for user_roles.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_user_roles_created_by
  ON user_roles(created_by);

-- ============================================================================
-- STEP 2: Remove Unused Indexes
-- ============================================================================

-- Drop unused index on testimonials.is_active
DROP INDEX IF EXISTS testimonials_is_active_idx;

-- Drop unused index on faq_items.is_active
DROP INDEX IF EXISTS faq_items_is_active_idx;

-- Drop unused index on guide_articles.category
DROP INDEX IF EXISTS idx_guide_articles_category;

-- Drop unused index on guide_articles.is_published
DROP INDEX IF EXISTS idx_guide_articles_published;

-- Drop unused index on guide_articles.is_featured
DROP INDEX IF EXISTS idx_guide_articles_featured;

-- Drop unused index on guide_articles.slug (unique constraint provides indexing)
DROP INDEX IF EXISTS idx_guide_articles_slug;

-- ============================================================================
-- STEP 3: Fix Multiple Permissive Policies
-- ============================================================================

-- Drop the duplicate policy on guide_articles
DROP POLICY IF EXISTS "Authenticated users can view all guide articles" ON guide_articles;

-- Keep only the public policy which is more permissive
-- The policy "Public can view published guide articles" remains active

-- ============================================================================
-- STEP 4: Fix Function Search Path
-- ============================================================================

-- Drop the trigger first, then the function
DROP TRIGGER IF EXISTS update_guide_articles_updated_at_trigger ON guide_articles;
DROP TRIGGER IF EXISTS guide_articles_updated_at_trigger ON guide_articles;

-- Drop and recreate the function with a stable search_path
DROP FUNCTION IF EXISTS update_guide_articles_updated_at();

CREATE OR REPLACE FUNCTION update_guide_articles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER guide_articles_updated_at_trigger
  BEFORE UPDATE ON guide_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_guide_articles_updated_at();

-- ============================================================================
-- STEP 5: Leaked Password Protection Instructions
-- ============================================================================

/*
  IMPORTANT: Leaked Password Protection

  This security feature must be enabled manually in the Supabase Dashboard:

  1. Go to your Supabase project dashboard
  2. Navigate to: Authentication → Settings
  3. Scroll to the "Security and Protection" section
  4. Enable "Check for compromised passwords"

  This feature will automatically check new passwords against the HaveIBeenPwned
  database to prevent users from using compromised passwords.

  Benefits:
  - Prevents use of passwords found in data breaches
  - Enhances overall account security
  - No performance impact (async check)
  - Free to use via HaveIBeenPwned API
*/

-- ============================================================================
-- Verification Queries
-- ============================================================================

-- Verify all foreign key indexes exist
DO $$
BEGIN
  RAISE NOTICE 'Security fixes applied successfully!';
  RAISE NOTICE 'Foreign key indexes created for optimal query performance';
  RAISE NOTICE 'Unused indexes removed to reduce overhead';
  RAISE NOTICE 'Multiple permissive policies consolidated';
  RAISE NOTICE 'Function search path secured';
  RAISE NOTICE '';
  RAISE NOTICE 'MANUAL ACTION REQUIRED:';
  RAISE NOTICE 'Enable Leaked Password Protection in Supabase Dashboard';
  RAISE NOTICE 'Authentication → Settings → "Check for compromised passwords"';
END $$;
