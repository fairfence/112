# FairFence WordPress Plugin

A WordPress plugin wrapper for the FairFence React application that provides content management capabilities without modifying the original React code.

## Features

- **Admin Interface**: Manage all FairFence content from WordPress admin
- **REST API**: Provides endpoints for content delivery
- **Content Management**: Edit testimonials, FAQs, services, and business information
- **Shortcode Support**: Display the React app anywhere with `[fairfence_app]`
- **Standalone**: Works independently without breaking the existing React app

## Installation

1. **Download the Plugin**
   - Package the `wordpress-plugin` directory as a ZIP file
   - Or clone directly to `wp-content/plugins/fairfence-plugin/`

2. **Install in WordPress**
   - Go to WordPress Admin > Plugins > Add New
   - Upload the ZIP file and activate
   - Or activate from the Plugins page if manually installed

3. **Configure Content**
   - Navigate to "FairFence" in the WordPress admin menu
   - Edit your content across different tabs:
     - General Settings (business info)
     - Testimonials
     - FAQ
     - Services

## Usage

### Display the App

Add the shortcode to any page or post:
```
[fairfence_app]
```

### Admin Interface

Access the admin interface at:
- **WordPress Admin > FairFence**

Available sections:
- **General Settings**: Business name, phone, email, address, tagline
- **Testimonials**: Add, edit, or remove customer testimonials
- **FAQ**: Manage frequently asked questions
- **Services**: Update service descriptions and pricing

### REST API Endpoints

The plugin provides the following REST API endpoints:

#### Public Endpoints (No authentication required)
- `GET /wp-json/fairfence/v1/settings` - Get all settings
- `GET /wp-json/fairfence/v1/testimonials` - Get testimonials
- `GET /wp-json/fairfence/v1/faq` - Get FAQ items
- `GET /wp-json/fairfence/v1/services` - Get services

#### Admin Endpoints (Requires admin authentication)
- `POST /wp-json/fairfence/v1/settings` - Update settings
- `POST /wp-json/fairfence/v1/testimonials` - Add testimonial
- `PUT /wp-json/fairfence/v1/testimonials/{id}` - Update testimonial
- `DELETE /wp-json/fairfence/v1/testimonials/{id}` - Delete testimonial
- `POST /wp-json/fairfence/v1/faq` - Add FAQ
- `PUT /wp-json/fairfence/v1/faq/{id}` - Update FAQ
- `DELETE /wp-json/fairfence/v1/faq/{id}` - Delete FAQ
- `PUT /wp-json/fairfence/v1/services` - Update services

## Integration with Existing React App

The plugin is designed to work independently, but the React app can optionally fetch content from WordPress when available.

See `integration-example.js` for examples of how to:
- Detect WordPress environment
- Fetch content from WordPress API
- Provide fallback to default data
- Integrate with React Query

### Basic Integration Pattern

```javascript
// Check if WordPress API is available
const isWordPressAvailable = () => {
    return typeof window.fairfenceConfig !== 'undefined' 
        && window.fairfenceConfig.apiUrl;
};

// Fetch with fallback
const fetchContent = async () => {
    if (isWordPressAvailable()) {
        return fetch(`${window.fairfenceConfig.apiUrl}/testimonials`)
            .then(res => res.json())
            .catch(() => defaultTestimonials);
    }
    return defaultTestimonials;
};
```

## Building for Production

If you want to use WordPress's build tools for the admin interface:

1. Navigate to the plugin directory:
   ```bash
   cd wordpress-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the admin interface:
   ```bash
   npm run build
   ```

Note: The plugin works with the included vanilla JavaScript admin interface, so building is optional unless you want to use modern React for the admin.

## Plugin Structure

```
wordpress-plugin/
├── fairfence-plugin.php      # Main plugin file
├── admin/
│   ├── admin-page.php        # Admin page template
│   ├── admin-scripts.js      # Admin JavaScript
│   └── admin-styles.css      # Admin styles
├── includes/
│   ├── api-endpoints.php     # REST API definitions
│   └── settings-handler.php  # Settings management
├── public/                   # Built React app (if integrated)
├── package.json              # Node dependencies
├── webpack.config.js         # Build configuration
└── integration-example.js    # Integration documentation
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher
- MySQL 5.6 or higher

## Support

For issues or questions about the WordPress plugin, please refer to the documentation or contact the FairFence team.

## License

GPL v2 or later

## Credits

Developed for FairFence Contracting Waikato
- Website: https://fairfence.nz/
- Phone: 027 960 3892
- Email: alex@fairfence.nz