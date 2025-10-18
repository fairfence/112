/*
  # Enable Leaked Password Protection

  ## What is Leaked Password Protection?
  
  Supabase Auth can check passwords against the HaveIBeenPwned database to prevent
  users from using compromised passwords that have been leaked in data breaches.

  ## How to Enable (Manual Steps Required)
  
  Leaked password protection MUST be enabled through the Supabase Dashboard:
  
  1. Go to your Supabase Dashboard: https://supabase.com/dashboard
  2. Select your project
  3. Navigate to: Authentication → Policies
  4. Find the "Password Settings" section
  5. Enable "Check password against HaveIBeenPwned"
  
  ## Why Can't This Be Done via SQL?
  
  This setting is stored in Supabase's internal configuration system, not in the
  PostgreSQL database itself. It can only be modified through the Supabase API
  or Dashboard.

  ## Alternative: API-based Enablement
  
  If you have the Supabase Management API access, you can enable it via:
  
  ```bash
  curl -X PATCH 'https://api.supabase.com/v1/projects/{ref}/config/auth' \
    -H "Authorization: Bearer {access_token}" \
    -H "Content-Type: application/json" \
    -d '{"SECURITY_LEAKED_PASSWORD_PROTECTION": true}'
  ```

  ## Verification
  
  Once enabled, Supabase will automatically:
  - Check new user passwords during signup
  - Check passwords during password reset
  - Reject passwords that appear in the HaveIBeenPwned database
  - Return an error message to the user if their password is compromised

  ## Note
  
  This migration file serves as documentation only. No SQL changes are applied here
  since the setting must be configured outside of the database.
*/

-- This is a documentation-only migration
-- The actual setting must be enabled through the Supabase Dashboard
SELECT 1 WHERE false; -- No-op statement
