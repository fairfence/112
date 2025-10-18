# Configuration Integration Documentation

## Overview
The application now supports dual configuration modes:
1. **Replit Mode** - Uses environment variables (secrets)
2. **WordPress Mode** - Fetches configuration from WordPress REST API

## Configuration Loading Process

### 1. Initialization
When the server starts, it checks for `WORDPRESS_API_URL` environment variable:
- If set: Attempts to fetch configuration from WordPress
- If not set or WordPress unavailable: Falls back to environment variables

### 2. Caching Strategy
- **Environment Mode**: Configuration is cached indefinitely (environment vars don't change)
- **WordPress Mode**: Configuration is cached for 5 minutes, then refreshed automatically

### 3. WordPress Integration
The system fetches configuration from:
```
{WORDPRESS_API_URL}/wp-json/fairfence/v1/api-config
```

This endpoint should return:
```json
{
  "supabase_url": "...",
  "supabase_anon_key": "...",
  "supabase_service_key": "...",
  "session_secret": "...",
  "stripe_public_key": "...",
  "stripe_secret_key": "..."
}
```

## Testing the Configuration

### Test Environment Mode (Replit)
```bash
# Don't set WORDPRESS_API_URL
npx tsx server/test-config.ts
```

### Test WordPress Mode
```bash
# Set WordPress API URL
export WORDPRESS_API_URL="https://your-wordpress-site.com"
npx tsx server/test-config.ts
```

## How It Works

### Key Files
1. **server/config-loader.ts** - Core configuration loading logic with caching
2. **server/config.ts** - Backward compatibility layer for existing code
3. **server/index.ts** - Initializes configuration on startup
4. **server/db.ts** - Uses dynamic configuration via `getConfig()`

### Features
- **Automatic Fallback**: If WordPress is unavailable, falls back to environment variables
- **Performance Optimization**: Caches configuration to avoid repeated API calls
- **Timeout Protection**: 5-second timeout for WordPress availability check, 10-second for fetch
- **Error Handling**: Graceful degradation if WordPress API fails

## Deployment Scenarios

### Deploying on Replit
1. Set environment variables in Replit Secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Other required variables

2. Don't set `WORDPRESS_API_URL`

3. The app will automatically use environment variables

### Deploying with WordPress
1. Install and configure the WordPress plugin
2. Set API keys in WordPress admin panel
3. Set `WORDPRESS_API_URL` environment variable to your WordPress site URL
4. The app will fetch configuration from WordPress

### Hybrid Deployment
1. Set both environment variables and WordPress URL
2. App will try WordPress first, fall back to env vars if unavailable
3. Provides high availability - works even if WordPress is down

## Configuration Status API

Check current configuration status:
```
GET /api/config/status
```

Response:
```json
{
  "success": true,
  "config": {
    "mode": "wordpress" | "environment",
    "initialized": true,
    "hasServiceKey": true,
    "wordpressUrl": "https://..."
  }
}
```

## Troubleshooting

### WordPress Configuration Not Loading
1. Check `WORDPRESS_API_URL` is set correctly (no trailing slash)
2. Verify WordPress plugin is activated
3. Check API endpoint is accessible: `{WORDPRESS_API_URL}/wp-json/fairfence/v1/api-config`
4. Review server logs for specific errors

### Configuration Cache Issues
- Clear cache: The configuration automatically refreshes every 5 minutes in WordPress mode
- Force reload: Restart the server to force fresh configuration load

### Testing Configuration
Run the test script:
```bash
npx tsx server/test-config.ts
```

This will show:
- Which mode is active
- Whether required keys are set
- Cache performance
- WordPress connectivity (if configured)