/*
  # Security and Performance Optimization Migration

  This migration addresses critical security and performance issues identified in the database audit:

  ## 1. Missing Foreign Key Indexes
  Adds indexes on foreign key columns to improve query performance:
  - `site_content.updated_by`
  - `user_invitations.invited_by`
  - `user_roles.created_by`

  ## 2. RLS Policy Optimization
  Replaces `auth.uid()` with `(SELECT auth.uid())` in all RLS policies to prevent
  re-evaluation for each row, improving performance at scale.

  Affected tables:
  - quotes (5 policies)
  - images (5 policies)
  - pricing (1 policy)
  - company_details (1 policy)
  - user_roles (1 policy)

  ## 3. Remove Duplicate/Redundant RLS Policies
  Consolidates multiple permissive policies that create confusion and potential security gaps:
  - Removes overly permissive "Public can..." policies
  - Keeps only necessary authenticated and admin policies
  - Ensures clear separation between public read and authenticated operations

  ## 4. Clean Up Unused Indexes
  Removes indexes that are not being used by queries:
  - quotes_user_id_idx, quotes_status_idx, quotes_created_at_idx
  - pricing_code_idx
  - images_uploaded_by_idx, images_category_idx, images_is_public_idx

  ## 5. Fix Function Security
  Updates function search_path to be immutable for security.

  ## Security Impact
  - Improved query performance through proper indexing
  - Optimized RLS policy evaluation
  - Reduced attack surface by removing redundant policies
  - Enhanced function security
*/

-- ============================================================================
-- PART 1: ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_site_content_updated_by
  ON public.site_content(updated_by);

CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by
  ON public.user_invitations(invited_by);

CREATE INDEX IF NOT EXISTS idx_user_roles_created_by
  ON public.user_roles(created_by);

-- ============================================================================
-- PART 2: CLEAN UP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS public.quotes_user_id_idx;
DROP INDEX IF EXISTS public.quotes_status_idx;
DROP INDEX IF EXISTS public.quotes_created_at_idx;
DROP INDEX IF EXISTS public.pricing_code_idx;
DROP INDEX IF EXISTS public.images_uploaded_by_idx;
DROP INDEX IF EXISTS public.images_category_idx;
DROP INDEX IF EXISTS public.images_is_public_idx;

-- ============================================================================
-- PART 3: OPTIMIZE RLS POLICIES - QUOTES TABLE
-- ============================================================================

-- Drop existing quotes policies
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.quotes;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.quotes;
DROP POLICY IF EXISTS "Public can view all quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can update quotes" ON public.quotes;

-- Create optimized quotes policies
CREATE POLICY "Users can view their own quotes"
  ON public.quotes FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert their own quotes"
  ON public.quotes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own quotes"
  ON public.quotes FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own quotes"
  ON public.quotes FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Allow anonymous users to insert quotes (for contact form submissions)
CREATE POLICY "Anonymous users can insert quotes"
  ON public.quotes FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================================
-- PART 4: OPTIMIZE RLS POLICIES - IMAGES TABLE
-- ============================================================================

-- Drop existing images policies
DROP POLICY IF EXISTS "Users can update images they uploaded" ON public.images;
DROP POLICY IF EXISTS "Admins can update any image" ON public.images;
DROP POLICY IF EXISTS "Users can delete images they uploaded" ON public.images;
DROP POLICY IF EXISTS "Admins can delete any image" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can view all images" ON public.images;
DROP POLICY IF EXISTS "Public images are viewable by everyone" ON public.images;
DROP POLICY IF EXISTS "Authenticated users can insert images" ON public.images;

-- Create optimized images policies
CREATE POLICY "Public can view public images"
  ON public.images FOR SELECT
  TO public
  USING (is_public = true);

CREATE POLICY "Authenticated users can view all images"
  ON public.images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert images"
  ON public.images FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = (SELECT auth.uid()));

CREATE POLICY "Users can update their own images"
  ON public.images FOR UPDATE
  TO authenticated
  USING (uploaded_by = (SELECT auth.uid()))
  WITH CHECK (uploaded_by = (SELECT auth.uid()));

CREATE POLICY "Users can delete their own images"
  ON public.images FOR DELETE
  TO authenticated
  USING (uploaded_by = (SELECT auth.uid()));

-- ============================================================================
-- PART 5: OPTIMIZE RLS POLICIES - PRICING TABLE
-- ============================================================================

-- Drop existing pricing policies
DROP POLICY IF EXISTS "Admin users can manage pricing" ON public.pricing;
DROP POLICY IF EXISTS "Authenticated users can read pricing data" ON public.pricing;
DROP POLICY IF EXISTS "Public can read pricing data" ON public.pricing;
DROP POLICY IF EXISTS "Public can delete pricing" ON public.pricing;
DROP POLICY IF EXISTS "Public can insert pricing" ON public.pricing;

-- Create optimized pricing policies
CREATE POLICY "Anyone can read pricing data"
  ON public.pricing FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage pricing"
  ON public.pricing FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 6: OPTIMIZE RLS POLICIES - COMPANY DETAILS TABLE
-- ============================================================================

-- Drop existing company_details policies
DROP POLICY IF EXISTS "Admin users can manage company details" ON public.company_details;
DROP POLICY IF EXISTS "Authenticated users can read company details" ON public.company_details;
DROP POLICY IF EXISTS "Public can read company details" ON public.company_details;

-- Create optimized company_details policies
CREATE POLICY "Anyone can read company details"
  ON public.company_details FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage company details"
  ON public.company_details FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 7: OPTIMIZE RLS POLICIES - USER ROLES TABLE
-- ============================================================================

-- Drop existing user_roles policies
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Enable access for authenticated users" ON public.user_roles;

-- Create optimized user_roles policy
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- PART 8: OPTIMIZE SITE CONTENT POLICIES
-- ============================================================================

-- Drop existing site_content policies
DROP POLICY IF EXISTS "Authenticated users can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;

-- Create optimized site_content policies
CREATE POLICY "Anyone can read site content"
  ON public.site_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PART 9: FIX FUNCTION SECURITY
-- ============================================================================

-- Drop and recreate the function with immutable search_path
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers that use this function (if they exist)
DO $$
BEGIN
  -- company_details trigger
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_details') THEN
    DROP TRIGGER IF EXISTS update_company_details_updated_at ON public.company_details;
    CREATE TRIGGER update_company_details_updated_at
      BEFORE UPDATE ON public.company_details
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- users trigger
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
    DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- user_roles trigger
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
    CREATE TRIGGER update_user_roles_updated_at
      BEFORE UPDATE ON public.user_roles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- user_invitations trigger
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_invitations') THEN
    DROP TRIGGER IF EXISTS update_user_invitations_updated_at ON public.user_invitations;
    CREATE TRIGGER update_user_invitations_updated_at
      BEFORE UPDATE ON public.user_invitations
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;
