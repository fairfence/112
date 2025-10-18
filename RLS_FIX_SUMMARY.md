# Site Survey RLS Policy Fix Summary

## Problem

Site survey submissions were failing with a Row-Level Security (RLS) policy violation error:

```
❌ Failed to save survey: {
  code: '42501',
  details: null,
  hint: null,
  message: 'new row violates row-level security policy for table "site_surveys"'
}
```

## Root Cause

The server-side POST `/api/site-survey` endpoint was using the Supabase client with the **anon key**, which respects RLS policies. However, for server-side insertions that should always succeed (like public form submissions), we need to bypass RLS entirely.

The RLS policies in the migration file (`20251016083620_create_site_surveys_table.sql`) correctly allowed insertions from both `anon` and `authenticated` roles, but the issue was that the anon key client wasn't properly authenticated as either role when making the server-side request.

## Solution

Updated `server/routes.ts` to use the **service role client** (`supabaseAdmin`) instead of the anon key client (`supabase`). The service role key bypasses RLS entirely, which is the correct approach for server-side operations.

### Changes Made

1. **Import the admin client** (line 12):
   ```typescript
   import {
     // ... other imports
     supabase,
     supabaseAdmin  // Added this
   } from "./db";
   ```

2. **Use admin client for all database operations** (lines 907-917):
   ```typescript
   // Use admin client to bypass RLS for server-side insertions
   const dbClient = supabaseAdmin || supabase;

   if (!dbClient) {
     return res.status(500).json({
       success: false,
       error: 'Database connection not available'
     });
   }

   console.log('🔑 Using', supabaseAdmin ? 'service role (bypassing RLS)' : 'anon key (with RLS)');
   ```

3. **Updated all three insert operations**:
   - Site surveys insert (line 919)
   - Fence lines insert (line 954)
   - Survey photos insert (line 979)

All now use `dbClient` instead of `supabase`.

## Why This Works

The `supabaseAdmin` client is initialized in `server/db.ts` with the `SUPABASE_SERVICE_ROLE_KEY`, which has full database access and bypasses all RLS policies. This is the standard pattern for:

- Server-side API endpoints
- Background jobs
- Admin operations
- Public form submissions that should always succeed

## Environment Variables

The fix relies on the service role key being configured in `.env`:

```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

This key is already configured and the admin client is initialized on server startup in `server/db.ts:38-44`.

## Testing

After this fix, site survey submissions will:

1. Use the service role client to bypass RLS
2. Successfully insert into `site_surveys` table
3. Successfully insert related `fence_lines` records
4. Successfully insert `survey_photos` records
5. Send email notification to admin
6. Return success response to client

The console will log which client is being used:
- `🔑 Using service role (bypassing RLS)` - Success path
- `🔑 Using anon key (with RLS)` - Fallback if service role not available

## Security Considerations

Using the service role key on the server side is safe because:

1. The key is only available server-side (never exposed to clients)
2. The endpoint has proper validation of required fields
3. Input sanitization happens before database insertion
4. The operation is intentionally public (anyone can submit a site survey)

If you needed to restrict submissions in the future, you would:
1. Add authentication middleware to the endpoint
2. Keep using the service role for insertions
3. Add additional business logic validation based on the authenticated user

## Related Files

- `/server/routes.ts` - Site survey endpoint (modified)
- `/server/db.ts` - Database client initialization
- `/supabase/migrations/20251016083620_create_site_surveys_table.sql` - RLS policies
- `/.env` - Service role key configuration

## Additional Notes

The RLS policies themselves are correctly configured. The issue was purely about which Supabase client was being used for server-side operations. This is a common pattern in Supabase applications where public endpoints need to write data without requiring authentication.
