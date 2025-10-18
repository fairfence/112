<?php
/**
 * Settings handler for FairFence plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class FairFence_Settings_Handler {
    
    /**
     * Option keys
     */
    const OPTION_GENERAL = 'fairfence_general_settings';
    const OPTION_TESTIMONIALS = 'fairfence_testimonials';
    const OPTION_FAQ = 'fairfence_faq';
    const OPTION_SERVICES = 'fairfence_services';
    const OPTION_IMAGES = 'fairfence_images';
    const OPTION_API_CONFIG = 'fairfence_api_configuration';
    
    /**
     * Encryption key generation using WordPress salts
     */
    private static function get_encryption_key() {
        return substr(hash('sha256', wp_salt('auth') . wp_salt('secure_auth')), 0, 32);
    }
    
    /**
     * Encrypt sensitive data
     */
    private static function encrypt_value($value) {
        if (empty($value)) {
            return '';
        }
        
        $key = self::get_encryption_key();
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($value, 'AES-256-CBC', $key, 0, $iv);
        
        if ($encrypted === false) {
            return $value; // Return original if encryption fails
        }
        
        return base64_encode($iv . $encrypted);
    }
    
    /**
     * Decrypt sensitive data
     */
    private static function decrypt_value($encrypted_value) {
        if (empty($encrypted_value)) {
            return '';
        }
        
        $key = self::get_encryption_key();
        $data = base64_decode($encrypted_value);
        
        if ($data === false || strlen($data) < 16) {
            return $encrypted_value; // Return as-is if not encrypted
        }
        
        $iv = substr($data, 0, 16);
        $encrypted = substr($data, 16);
        $decrypted = openssl_decrypt($encrypted, 'AES-256-CBC', $key, 0, $iv);
        
        return $decrypted !== false ? $decrypted : $encrypted_value;
    }
    
    /**
     * Mask sensitive value (show only last 4 characters)
     */
    public static function mask_value($value, $show_chars = 4) {
        if (empty($value) || strlen($value) <= $show_chars) {
            return $value;
        }
        
        $masked_length = strlen($value) - $show_chars;
        return str_repeat('•', $masked_length) . substr($value, -$show_chars);
    }
    
    /**
     * Get all settings
     */
    public static function get_all_settings() {
        return array(
            'general' => self::get_general_settings(),
            'testimonials' => self::get_testimonials(),
            'faq' => self::get_faq(),
            'services' => self::get_services(),
            'images' => self::get_images(),
            'api_config' => self::get_api_configuration(true), // Include masked values for admin
        );
    }
    
    /**
     * Get general settings
     */
    public static function get_general_settings() {
        $defaults = array(
            'business_name' => 'FairFence Contracting Waikato',
            'phone' => '027 960 3892',
            'email' => 'alex@fairfence.nz',
            'address' => 'Ohaupo, Waikato',
            'tagline' => 'Where Fairness and Quality Intersect',
            'about_text' => 'Welcome to Fairfence Contracting Waikato, a company that\'s built on the pillars of fairness and exceptional quality.',
        );
        
        return wp_parse_args(get_option(self::OPTION_GENERAL, array()), $defaults);
    }
    
    /**
     * Get testimonials
     */
    public static function get_testimonials() {
        $default = array(
            array(
                'id' => '1',
                'name' => 'Bernadette Morton',
                'location' => 'Hamilton East',
                'rating' => 5,
                'text' => 'Alex and his team have recently done a retaining wall and a fence for us. They were quick and efficient and did a perfect job at a reasonable cost.',
                'date' => '9 months ago',
                'source' => 'Google'
            ),
            array(
                'id' => '2',
                'name' => 'Robbie Hogan',
                'location' => 'Hamilton',
                'rating' => 5,
                'text' => 'Great Team Excellent Quality and workman\'s ship. Easy to talk with Very quick and efficient Highly recommend',
                'date' => '7 months ago',
                'source' => 'Google'
            ),
        );
        
        return get_option(self::OPTION_TESTIMONIALS, $default);
    }
    
    /**
     * Get FAQ
     */
    public static function get_faq() {
        $default = array(
            array(
                'id' => '1',
                'question' => 'How long does a typical fence installation take?',
                'answer' => 'Most residential fences are completed within 1-3 days, depending on the length and type.'
            ),
            array(
                'id' => '2',
                'question' => 'Do I need council consent for my fence?',
                'answer' => 'Fences under 2.5m generally don\'t need consent in most areas, but there are exceptions.'
            ),
        );
        
        return get_option(self::OPTION_FAQ, $default);
    }
    
    /**
     * Get services
     */
    public static function get_services() {
        $default = array(
            array(
                'id' => 'timber',
                'title' => 'Quality Timber Fencing',
                'description' => 'Quality timber fencing installed by our team from start to finish.',
                'features' => array('Residential paling', 'Privacy screens', 'Custom gates', 'Fair pricing'),
                'priceRange' => 'Contact for pricing',
            ),
            array(
                'id' => 'aluminum',
                'title' => 'Modern Aluminum Fencing',
                'description' => 'Reliable aluminum solutions installed by our experienced team.',
                'features' => array('Pool fencing', 'Security panels', 'Designer slats', 'Fair pricing'),
                'priceRange' => 'Contact for pricing',
            ),
        );
        
        return get_option(self::OPTION_SERVICES, $default);
    }
    
    /**
     * Get images
     */
    public static function get_images() {
        $default = array();
        
        // Include existing uploaded images if they exist
        $uploads_dir = wp_upload_dir();
        $existing_images = array();
        
        // Check for existing plugin images in the uploads directory
        $plugin_images_dir = $uploads_dir['basedir'] . '/fairfence-images';
        if (is_dir($plugin_images_dir)) {
            $files = glob($plugin_images_dir . '/*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);
            foreach ($files as $file) {
                $filename = basename($file);
                $existing_images[] = array(
                    'id' => md5($filename),
                    'url' => $uploads_dir['baseurl'] . '/fairfence-images/' . $filename,
                    'title' => pathinfo($filename, PATHINFO_FILENAME),
                    'alt' => '',
                    'category' => '',
                );
            }
        }
        
        $saved_images = get_option(self::OPTION_IMAGES, $default);
        
        // Merge existing images with saved metadata
        if (!empty($existing_images) && empty($saved_images)) {
            return $existing_images;
        }
        
        return $saved_images;
    }
    
    /**
     * Update general settings
     */
    public static function update_settings($settings) {
        if (isset($settings['general'])) {
            update_option(self::OPTION_GENERAL, $settings['general']);
        }
        
        if (isset($settings['testimonials'])) {
            update_option(self::OPTION_TESTIMONIALS, $settings['testimonials']);
        }
        
        if (isset($settings['faq'])) {
            update_option(self::OPTION_FAQ, $settings['faq']);
        }
        
        if (isset($settings['services'])) {
            update_option(self::OPTION_SERVICES, $settings['services']);
        }
        
        if (isset($settings['images'])) {
            update_option(self::OPTION_IMAGES, $settings['images']);
        }
        
        return true;
    }
    
    /**
     * Update testimonials
     */
    public static function update_testimonials($testimonials) {
        return update_option(self::OPTION_TESTIMONIALS, $testimonials);
    }
    
    /**
     * Update FAQ
     */
    public static function update_faq($faq) {
        return update_option(self::OPTION_FAQ, $faq);
    }
    
    /**
     * Update services
     */
    public static function update_services($services) {
        return update_option(self::OPTION_SERVICES, $services);
    }
    
    /**
     * Update images
     */
    public static function update_images($images) {
        return update_option(self::OPTION_IMAGES, $images);
    }
    
    /**
     * Get API configuration
     * @param bool $include_masked Whether to include masked sensitive values
     * @param bool $decrypt Whether to decrypt the values
     */
    public static function get_api_configuration($include_masked = false, $decrypt = false) {
        $defaults = array(
            'supabase_url' => '',
            'supabase_anon_key' => '',
            'supabase_service_key' => '',
            'session_secret' => '',
            'stripe_public_key' => '',
            'stripe_secret_key' => '',
            'smtp_host' => '',
            'smtp_port' => '',
            'smtp_user' => '',
            'smtp_password' => '',
        );
        
        $config = wp_parse_args(get_option(self::OPTION_API_CONFIG, array()), $defaults);
        
        // List of sensitive fields that need encryption
        $sensitive_fields = array(
            'supabase_service_key',
            'session_secret',
            'stripe_secret_key',
            'smtp_password'
        );
        
        // Process the configuration based on requirements
        foreach ($config as $key => $value) {
            if (in_array($key, $sensitive_fields)) {
                if ($decrypt && !empty($value)) {
                    // Decrypt for internal use
                    $config[$key] = self::decrypt_value($value);
                } elseif ($include_masked && !empty($value)) {
                    // Mask for admin display
                    $decrypted = self::decrypt_value($value);
                    $config[$key . '_masked'] = self::mask_value($decrypted);
                    $config[$key . '_has_value'] = !empty($value);
                    // Don't include the actual encrypted value
                    unset($config[$key]);
                } else {
                    // Remove sensitive values for public access
                    unset($config[$key]);
                }
            }
        }
        
        return $config;
    }
    
    /**
     * Update API configuration
     */
    public static function update_api_configuration($config) {
        // List of sensitive fields that need encryption
        $sensitive_fields = array(
            'supabase_service_key',
            'session_secret',
            'stripe_secret_key',
            'smtp_password'
        );
        
        // Get existing config to preserve unchanged values
        $existing = get_option(self::OPTION_API_CONFIG, array());
        
        // Process the new configuration
        foreach ($config as $key => $value) {
            // Skip if value is placeholder (masked values)
            if (strpos($value, '•••') !== false && isset($existing[$key])) {
                // Keep existing encrypted value
                $config[$key] = $existing[$key];
            } elseif (in_array($key, $sensitive_fields) && !empty($value)) {
                // Encrypt new sensitive values
                $config[$key] = self::encrypt_value($value);
            }
        }
        
        return update_option(self::OPTION_API_CONFIG, $config);
    }
    
    /**
     * Test Supabase connection
     */
    public static function test_supabase_connection() {
        $config = self::get_api_configuration(false, true);
        
        if (empty($config['supabase_url']) || empty($config['supabase_anon_key'])) {
            return array(
                'success' => false,
                'message' => 'Supabase URL and Anon Key are required'
            );
        }
        
        // Test the connection by making a simple request to Supabase
        $response = wp_remote_get($config['supabase_url'] . '/rest/v1/', array(
            'headers' => array(
                'apikey' => $config['supabase_anon_key'],
                'Authorization' => 'Bearer ' . $config['supabase_anon_key']
            ),
            'timeout' => 10
        ));
        
        if (is_wp_error($response)) {
            return array(
                'success' => false,
                'message' => 'Connection failed: ' . $response->get_error_message()
            );
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        
        if ($status_code === 200 || $status_code === 401) {
            // 200 = success, 401 = auth required (means connection works)
            return array(
                'success' => true,
                'message' => 'Connection successful!'
            );
        } else {
            return array(
                'success' => false,
                'message' => 'Connection failed with status: ' . $status_code
            );
        }
    }
    
    /**
     * Create default settings on activation
     */
    public static function create_default_settings() {
        // Only create if not already exists
        if (false === get_option(self::OPTION_GENERAL)) {
            add_option(self::OPTION_GENERAL, self::get_general_settings());
        }
        
        if (false === get_option(self::OPTION_TESTIMONIALS)) {
            add_option(self::OPTION_TESTIMONIALS, self::get_testimonials());
        }
        
        if (false === get_option(self::OPTION_FAQ)) {
            add_option(self::OPTION_FAQ, self::get_faq());
        }
        
        if (false === get_option(self::OPTION_SERVICES)) {
            add_option(self::OPTION_SERVICES, self::get_services());
        }
        
        if (false === get_option(self::OPTION_IMAGES)) {
            add_option(self::OPTION_IMAGES, self::get_images());
        }
    }
    
    /**
     * Delete all settings (cleanup on uninstall)
     */
    public static function delete_all_settings() {
        delete_option(self::OPTION_GENERAL);
        delete_option(self::OPTION_TESTIMONIALS);
        delete_option(self::OPTION_FAQ);
        delete_option(self::OPTION_SERVICES);
        delete_option(self::OPTION_IMAGES);
    }
}