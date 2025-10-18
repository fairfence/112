<?php
/**
 * Plugin Name: FairFence Content Manager
 * Plugin URI: https://fairfence.nz/
 * Description: WordPress plugin wrapper for FairFence React application with admin content management
 * Version: 1.0.0
 * Author: FairFence Contracting Waikato
 * Author URI: https://fairfence.nz/
 * License: GPL v2 or later
 * Text Domain: fairfence
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('FAIRFENCE_VERSION', '1.0.0');
define('FAIRFENCE_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FAIRFENCE_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Main plugin class
 */
class FairFencePlugin {
    
    /**
     * Instance of this class
     */
    private static $instance = null;
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        // Include required files
        $this->includes();
        
        // Initialize hooks
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));
        
        // Register shortcode
        add_shortcode('fairfence_app', array($this, 'render_app_shortcode'));
        
        // Register activation/deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    /**
     * Include required files
     */
    private function includes() {
        require_once FAIRFENCE_PLUGIN_DIR . 'includes/api-endpoints.php';
        require_once FAIRFENCE_PLUGIN_DIR . 'includes/settings-handler.php';
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Register REST API endpoints
        $api = new FairFence_API_Endpoints();
        $api->register_routes();
        
        // Load text domain for translations
        load_plugin_textdomain('fairfence', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('FairFence Settings', 'fairfence'),
            __('FairFence', 'fairfence'),
            'manage_options',
            'fairfence-settings',
            array($this, 'render_admin_page'),
            'dashicons-admin-generic',
            30
        );
        
        // Add submenu pages
        add_submenu_page(
            'fairfence-settings',
            __('Content Settings', 'fairfence'),
            __('Content', 'fairfence'),
            'manage_options',
            'fairfence-settings',
            array($this, 'render_admin_page')
        );
        
        add_submenu_page(
            'fairfence-settings',
            __('Testimonials', 'fairfence'),
            __('Testimonials', 'fairfence'),
            'manage_options',
            'fairfence-testimonials',
            array($this, 'render_testimonials_page')
        );
        
        add_submenu_page(
            'fairfence-settings',
            __('FAQ', 'fairfence'),
            __('FAQ', 'fairfence'),
            'manage_options',
            'fairfence-faq',
            array($this, 'render_faq_page')
        );
    }
    
    /**
     * Render admin page
     */
    public function render_admin_page() {
        include FAIRFENCE_PLUGIN_DIR . 'admin/admin-page.php';
    }
    
    /**
     * Render testimonials page
     */
    public function render_testimonials_page() {
        echo '<div id="fairfence-testimonials-root"></div>';
    }
    
    /**
     * Render FAQ page
     */
    public function render_faq_page() {
        echo '<div id="fairfence-faq-root"></div>';
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'fairfence') === false) {
            return;
        }
        
        // Enqueue React and dependencies
        $asset_file = FAIRFENCE_PLUGIN_DIR . 'build/index.asset.php';
        
        if (file_exists($asset_file)) {
            $asset = include $asset_file;
            
            wp_enqueue_script(
                'fairfence-admin',
                FAIRFENCE_PLUGIN_URL . 'build/index.js',
                $asset['dependencies'],
                $asset['version'],
                true
            );
            
            wp_localize_script('fairfence-admin', 'fairfenceAdmin', array(
                'apiUrl' => home_url('/wp-json/fairfence/v1'),
                'nonce' => wp_create_nonce('wp_rest'),
                'currentPage' => isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '',
            ));
        } else {
            // Fallback for development
            wp_enqueue_script(
                'fairfence-admin',
                FAIRFENCE_PLUGIN_URL . 'admin/admin-scripts.js',
                array('jquery'),
                FAIRFENCE_VERSION,
                true
            );
        }
        
        // Enqueue styles
        wp_enqueue_style(
            'fairfence-admin',
            FAIRFENCE_PLUGIN_URL . 'admin/admin-styles.css',
            array('wp-components'),
            FAIRFENCE_VERSION
        );
        
        // WordPress components styles
        wp_enqueue_style('wp-components');
    }
    
    /**
     * Enqueue public assets
     */
    public function enqueue_public_assets() {
        // Only enqueue if shortcode is present
        global $post;
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'fairfence_app')) {
            // Check if built files exist
            $app_js = FAIRFENCE_PLUGIN_DIR . 'public/app.js';
            $app_css = FAIRFENCE_PLUGIN_DIR . 'public/app.css';
            
            // Enqueue JavaScript
            if (file_exists($app_js)) {
                wp_enqueue_script(
                    'fairfence-app',
                    FAIRFENCE_PLUGIN_URL . 'public/app.js',
                    array(),
                    FAIRFENCE_VERSION . '.' . filemtime($app_js), // Add file modification time for cache busting
                    true
                );
                
                // Pass WordPress configuration to the app
                wp_localize_script('fairfence-app', 'fairfenceConfig', array(
                    'apiUrl' => home_url('/wp-json/fairfence/v1'),
                    'pluginUrl' => FAIRFENCE_PLUGIN_URL,
                    'publicUrl' => FAIRFENCE_PLUGIN_URL . 'public/',
                    'settings' => FairFence_Settings_Handler::get_all_settings(),
                ));
            }
            
            // Enqueue CSS
            if (file_exists($app_css)) {
                wp_enqueue_style(
                    'fairfence-app',
                    FAIRFENCE_PLUGIN_URL . 'public/app.css',
                    array(),
                    FAIRFENCE_VERSION . '.' . filemtime($app_css) // Add file modification time for cache busting
                );
            }
            
            // Enqueue any additional chunk files
            $chunks_dir = FAIRFENCE_PLUGIN_DIR . 'public/js/';
            if (is_dir($chunks_dir)) {
                $chunk_files = glob($chunks_dir . '*.js');
                foreach ($chunk_files as $index => $chunk_file) {
                    $chunk_name = basename($chunk_file, '.js');
                    wp_enqueue_script(
                        'fairfence-chunk-' . $chunk_name,
                        FAIRFENCE_PLUGIN_URL . 'public/js/' . basename($chunk_file),
                        array('fairfence-app'),
                        FAIRFENCE_VERSION . '.' . filemtime($chunk_file),
                        true
                    );
                }
            }
        }
    }
    
    /**
     * Render app shortcode
     */
    public function render_app_shortcode($atts) {
        $atts = shortcode_atts(array(
            'id' => 'fairfence-app-root',
            'class' => 'fairfence-app-container',
        ), $atts);
        
        return sprintf(
            '<div id="%s" class="%s" data-api-url="%s"></div>',
            esc_attr($atts['id']),
            esc_attr($atts['class']),
            esc_url(home_url('/wp-json/fairfence/v1'))
        );
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Create default settings
        FairFence_Settings_Handler::create_default_settings();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}

// Initialize plugin
FairFencePlugin::get_instance();