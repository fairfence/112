# WordPress Plugin Deployment Guide

## Overview
This guide explains how to deploy the FairFence Content Manager plugin to a WordPress installation. The plugin includes a React application that displays on your WordPress site using the `[fairfence_app]` shortcode.

## Prerequisites
- Node.js 18+ installed on your development machine
- Access to your WordPress site's admin panel
- FTP/File manager access to your WordPress installation

## Build Process

### 1. Building for Production

Before deploying, you need to build the React application for production:

```bash
# Install dependencies (if not already installed)
npm install

# Build the React app for WordPress
npm run build:wordpress
```

This command will:
- Build the React app for production
- Output files to `wordpress-plugin/public/` directory
- Generate `app.js` and `app.css` files
- Copy all required assets (images, fonts) to the public folder
- Use relative paths for all assets

### 2. Verify Build Output

After building, verify the following files exist in `wordpress-plugin/public/`:
- `app.js` - Main JavaScript bundle
- `app.css` - Compiled styles
- `images/` - Directory containing all image assets
- Any additional chunk files in `js/` directory (if code splitting is used)

## Deployment Steps

### Method 1: Manual Upload via WordPress Admin

1. **Prepare the Plugin Folder**
   - Ensure the production build is complete (run `npm run build:wordpress`)
   - Navigate to the `wordpress-plugin` directory
   - Create a ZIP file of the entire `wordpress-plugin` folder

2. **Upload to WordPress**
   - Log in to your WordPress admin panel
   - Navigate to **Plugins → Add New**
   - Click **Upload Plugin**
   - Choose the ZIP file and click **Install Now**
   - After installation, click **Activate Plugin**

### Method 2: FTP/File Manager Upload

1. **Prepare Files**
   - Complete the production build
   - Ensure all files in `wordpress-plugin/` are ready

2. **Upload via FTP**
   - Connect to your server via FTP
   - Navigate to `/wp-content/plugins/`
   - Create a new folder called `fairfence-plugin`
   - Upload all contents from your local `wordpress-plugin/` directory

3. **Activate the Plugin**
   - Go to WordPress admin → **Plugins**
   - Find "FairFence Content Manager" and click **Activate**

### Method 3: Using WordPress CLI (if available)

```bash
# From your WordPress root directory
wp plugin install /path/to/fairfence-plugin.zip --activate
```

## Configuration

### 1. Plugin Settings
After activation, navigate to **FairFence** in your WordPress admin menu to:
- Configure content settings
- Manage testimonials
- Update FAQ items

### 2. Add to Pages
To display the FairFence app on any WordPress page or post:

```
[fairfence_app]
```

You can also customize the container:

```
[fairfence_app id="custom-id" class="custom-class"]
```

### 3. API Configuration
The plugin automatically configures API endpoints at:
- `your-site.com/wp-json/fairfence/v1`

These endpoints are used by the React app to communicate with WordPress.

## Post-Deployment Checklist

- [ ] Plugin is activated in WordPress admin
- [ ] JavaScript console shows no errors
- [ ] CSS styles are loading correctly
- [ ] Images and assets are displaying
- [ ] API endpoints are accessible
- [ ] Shortcode renders the app correctly
- [ ] Mobile responsive design is working

## Updating the Plugin

To update the plugin with new changes:

1. Make your changes to the React app
2. Test locally with `npm run dev`
3. Build for production: `npm run build:wordpress`
4. Upload only the changed files:
   - `wordpress-plugin/public/app.js`
   - `wordpress-plugin/public/app.css`
   - Any new image assets or chunk files
5. Clear WordPress cache if using a caching plugin

## Troubleshooting

### App Not Displaying
- Check if shortcode `[fairfence_app]` is added to the page
- Verify plugin is activated
- Check browser console for JavaScript errors
- Ensure build files exist in `wordpress-plugin/public/`

### Styles Not Loading
- Clear browser cache
- Check if `app.css` exists in `wordpress-plugin/public/`
- Verify no CSS conflicts with WordPress theme

### JavaScript Errors
- Check browser console for specific errors
- Ensure all dependencies are included in the build
- Verify API URLs are correct in the configuration

### Images Not Loading
- Check if images exist in `wordpress-plugin/public/images/`
- Verify file permissions (should be readable)
- Check browser network tab for 404 errors

## Development vs Production

### Development Mode
```bash
npm run dev
```
- Runs on local development server (port 5000)
- Hot module replacement enabled
- Source maps included
- Not optimized for production

### Production Build
```bash
npm run build:wordpress
```
- Optimized and minified code
- Assets copied to WordPress plugin directory
- Ready for deployment
- Cache-busting via file modification timestamps

## Security Considerations

1. **File Permissions**
   - Plugin files: 644 (readable by all, writable by owner)
   - Directories: 755 (readable/executable by all, writable by owner)

2. **API Security**
   - WordPress nonce verification is implemented
   - REST API endpoints use WordPress authentication

3. **Content Security**
   - All user inputs are sanitized using WordPress functions
   - SQL queries use prepared statements

## Support

For issues or questions:
1. Check the browser console for errors
2. Review WordPress debug logs
3. Ensure all prerequisites are met
4. Verify the build process completed successfully

## Version Information

- Plugin Version: 1.0.0
- Minimum WordPress Version: 5.0
- Tested up to: WordPress 6.4
- Minimum PHP Version: 7.4