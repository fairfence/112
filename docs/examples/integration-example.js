/**
 * FairFence WordPress Integration Example
 * 
 * This file demonstrates how the existing React application can be modified
 * to optionally fetch content from the WordPress REST API when available.
 * 
 * IMPORTANT: This is documentation only. DO NOT modify the existing React components.
 * Instead, use these examples as a guide for future integration if needed.
 */

// ============================================================================
// EXAMPLE 1: Detecting WordPress Environment
// ============================================================================

/**
 * Check if WordPress API is available
 * Add this utility function to detect if the app is running with WordPress
 */
const isWordPressAvailable = () => {
    return typeof window.fairfenceConfig !== 'undefined' 
        && window.fairfenceConfig.apiUrl;
};

// ============================================================================
// EXAMPLE 2: Fetching Settings from WordPress
// ============================================================================

/**
 * Example of how to modify a component to fetch from WordPress when available
 * This would go in a component like Testimonials.tsx
 */
const TestimonialsExample = () => {
    const [testimonials, setTestimonials] = React.useState([]);
    
    React.useEffect(() => {
        if (isWordPressAvailable()) {
            // Fetch from WordPress API
            fetch(`${window.fairfenceConfig.apiUrl}/testimonials`)
                .then(res => res.json())
                .then(data => setTestimonials(data))
                .catch(err => {
                    console.error('Failed to fetch from WordPress:', err);
                    // Fall back to default data
                    setTestimonials(defaultTestimonials);
                });
        } else {
            // Use default hardcoded data
            setTestimonials(defaultTestimonials);
        }
    }, []);
    
    // Rest of component...
};

// ============================================================================
// EXAMPLE 3: Using React Query with WordPress API
// ============================================================================

/**
 * Example using React Query (which the app already uses)
 * This pattern allows seamless switching between WordPress and default data
 */
const useWordPressData = (endpoint, defaultData) => {
    return useQuery({
        queryKey: [`wordpress-${endpoint}`],
        queryFn: async () => {
            if (isWordPressAvailable()) {
                const response = await fetch(
                    `${window.fairfenceConfig.apiUrl}/${endpoint}`
                );
                if (!response.ok) throw new Error('Failed to fetch');
                return response.json();
            }
            return defaultData;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

// Usage in component:
const FAQExample = () => {
    const { data: faqItems = [] } = useWordPressData('faq', defaultFAQItems);
    
    return (
        <div>
            {faqItems.map(item => (
                <div key={item.id}>
                    {/* Render FAQ items here */}
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// EXAMPLE 4: Service Configuration
// ============================================================================

/**
 * Example of how Services component could be modified to use WordPress data
 */
const ServicesIntegrationExample = () => {
    const { data: services = [] } = useWordPressData('services', defaultServices);
    const { data: settings = {} } = useWordPressData('settings', {});
    
    // Merge WordPress settings with component data
    const enhancedServices = services.map(service => ({
        ...service,
        // Add pricing from WordPress if available
        priceRange: settings.pricing?.[service.id] || service.priceRange,
    }));
    
    return (
        <div>
            {enhancedServices.map(service => (
                <div key={service.id}>
                    {/* Render service cards here */}
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// EXAMPLE 5: Complete Integration Pattern
// ============================================================================

/**
 * This pattern shows how to create a wrapper component that provides
 * WordPress data to the entire app without modifying existing components
 */
const WordPressDataProvider = ({ children }) => {
    const [wpData, setWpData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (isWordPressAvailable()) {
            Promise.all([
                fetch(`${window.fairfenceConfig.apiUrl}/settings`).then(r => r.json()),
                fetch(`${window.fairfenceConfig.apiUrl}/testimonials`).then(r => r.json()),
                fetch(`${window.fairfenceConfig.apiUrl}/faq`).then(r => r.json()),
                fetch(`${window.fairfenceConfig.apiUrl}/services`).then(r => r.json()),
            ])
            .then(([settings, testimonials, faq, services]) => {
                setWpData({ settings, testimonials, faq, services });
                setLoading(false);
            })
            .catch(err => {
                console.error('WordPress data fetch failed:', err);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);
    
    // Create a context or pass props
    return React.cloneElement(children, { wpData, loading });
};

// ============================================================================
// EXAMPLE 6: Conditional Rendering Based on WordPress
// ============================================================================

/**
 * Example showing how to conditionally show WordPress-managed content
 */
const ContactInfoExample = () => {
    const [contactInfo, setContactInfo] = React.useState({
        phone: '027 960 3892', // Default
        email: 'alex@fairfence.nz', // Default
        address: 'Ohaupo, Waikato' // Default
    });
    
    React.useEffect(() => {
        if (isWordPressAvailable() && window.fairfenceConfig.settings) {
            const { general } = window.fairfenceConfig.settings;
            if (general) {
                setContactInfo({
                    phone: general.phone || contactInfo.phone,
                    email: general.email || contactInfo.email,
                    address: general.address || contactInfo.address,
                });
            }
        }
    }, []);
    
    return (
        <div className="contact-info">
            <p>Phone: {contactInfo.phone}</p>
            <p>Email: {contactInfo.email}</p>
            <p>Address: {contactInfo.address}</p>
        </div>
    );
};

// ============================================================================
// DEPLOYMENT INSTRUCTIONS
// ============================================================================

/**
 * How to deploy the WordPress plugin:
 * 
 * 1. Build the plugin:
 *    - Navigate to wordpress-plugin directory
 *    - Run: npm install
 *    - Run: npm run build
 * 
 * 2. Package the plugin:
 *    - Create a zip file of the wordpress-plugin directory
 *    - Ensure all PHP files and the build directory are included
 * 
 * 3. Install on WordPress:
 *    - Upload the zip file via WordPress admin > Plugins > Add New
 *    - Or extract to wp-content/plugins/ directory
 *    - Activate the plugin
 * 
 * 4. Configure:
 *    - Go to FairFence Settings in WordPress admin
 *    - Edit content as needed
 *    - Save settings
 * 
 * 5. Display the app:
 *    - Add shortcode [fairfence_app] to any page or post
 *    - The React app will load with WordPress-managed content
 * 
 * 6. Optional integration:
 *    - If you want the existing React app to use WordPress data
 *    - Implement the patterns shown in this file
 *    - Ensure fallback to default data when WordPress is not available
 */

// ============================================================================
// WORDPRESS API ENDPOINTS
// ============================================================================

/**
 * Available WordPress REST API endpoints created by the plugin:
 * 
 * GET  /wp-json/fairfence/v1/settings
 *      Returns all settings (general, testimonials, faq, services)
 * 
 * POST /wp-json/fairfence/v1/settings
 *      Updates all settings (requires admin authentication)
 * 
 * GET  /wp-json/fairfence/v1/testimonials
 *      Returns array of testimonials
 * 
 * POST /wp-json/fairfence/v1/testimonials
 *      Add new testimonial (requires admin authentication)
 * 
 * PUT  /wp-json/fairfence/v1/testimonials/{id}
 *      Update specific testimonial (requires admin authentication)
 * 
 * DELETE /wp-json/fairfence/v1/testimonials/{id}
 *        Delete specific testimonial (requires admin authentication)
 * 
 * GET  /wp-json/fairfence/v1/faq
 *      Returns array of FAQ items
 * 
 * POST /wp-json/fairfence/v1/faq
 *      Add new FAQ (requires admin authentication)
 * 
 * PUT  /wp-json/fairfence/v1/faq/{id}
 *      Update specific FAQ (requires admin authentication)
 * 
 * DELETE /wp-json/fairfence/v1/faq/{id}
 *        Delete specific FAQ (requires admin authentication)
 * 
 * GET  /wp-json/fairfence/v1/services
 *      Returns array of services
 * 
 * PUT  /wp-json/fairfence/v1/services
 *      Update services (requires admin authentication)
 */

// ============================================================================
// NOTES
// ============================================================================

/**
 * Important considerations:
 * 
 * 1. This integration is OPTIONAL - the React app works without WordPress
 * 2. Always provide fallback data when WordPress is unavailable
 * 3. The WordPress plugin is completely separate and can be deployed independently
 * 4. No modifications to the existing React app are required for the plugin to work
 * 5. The plugin provides its own admin interface for content management
 * 6. Content changes in WordPress are immediately available via the REST API
 * 7. Consider caching strategies for production deployments
 * 8. Ensure CORS headers are properly configured if apps are on different domains
 */

export {
    isWordPressAvailable,
    useWordPressData,
    WordPressDataProvider
};