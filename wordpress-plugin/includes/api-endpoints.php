<?php
/**
 * REST API endpoints for FairFence plugin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class FairFence_API_Endpoints {
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }
    
    /**
     * Register the actual routes
     */
    public function register_rest_routes() {
        $namespace = 'fairfence/v1';
        
        // Settings endpoint
        register_rest_route($namespace, '/settings', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_settings'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_settings'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => array(
                    'settings' => array(
                        'required' => true,
                        'type' => 'object',
                        'validate_callback' => array($this, 'validate_settings'),
                    ),
                ),
            ),
        ));
        
        // Public configuration endpoint (for frontend)
        register_rest_route($namespace, '/config', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_public_config'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
        ));
        
        // API Configuration endpoints (admin only)
        register_rest_route($namespace, '/api-config', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_api_config'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_api_config'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => array(
                    'config' => array(
                        'required' => true,
                        'type' => 'object',
                        'validate_callback' => array($this, 'validate_api_config'),
                    ),
                ),
            ),
        ));
        
        // Test connection endpoint
        register_rest_route($namespace, '/test-connection', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'test_connection'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => array(
                    'service' => array(
                        'required' => true,
                        'type' => 'string',
                        'enum' => array('supabase', 'stripe', 'smtp'),
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                ),
            ),
        ));
        
        // Testimonials endpoints
        register_rest_route($namespace, '/testimonials', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_testimonials'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'add_testimonial'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_testimonial_args(),
            ),
        ));
        
        register_rest_route($namespace, '/testimonials/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_testimonial'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_testimonial_args(),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_testimonial'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
        ));
        
        // FAQ endpoints
        register_rest_route($namespace, '/faq', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_faq'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'add_faq'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_faq_args(),
            ),
        ));
        
        register_rest_route($namespace, '/faq/(?P<id>\d+)', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_faq'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_faq_args(),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_faq'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
        ));
        
        // Services endpoints
        register_rest_route($namespace, '/services', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_services'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_services'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
        ));
        
        // Images endpoints
        register_rest_route($namespace, '/images', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_images'),
                'permission_callback' => array($this, 'public_permission_check'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'add_image'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_image_args(),
            ),
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_images'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
        ));
        
        register_rest_route($namespace, '/images/(?P<id>[\w]+)', array(
            array(
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => array($this, 'update_image'),
                'permission_callback' => array($this, 'admin_permission_check'),
                'args' => $this->get_image_args(),
            ),
            array(
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => array($this, 'delete_image'),
                'permission_callback' => array($this, 'admin_permission_check'),
            ),
        ));
    }
    
    /**
     * Public permission check (anyone can read)
     */
    public function public_permission_check() {
        return true;
    }
    
    /**
     * Admin permission check
     */
    public function admin_permission_check() {
        return current_user_can('manage_options');
    }
    
    /**
     * Validate settings
     */
    public function validate_settings($value, $request, $param) {
        if (!is_array($value)) {
            return false;
        }
        return true;
    }
    
    /**
     * Get settings
     */
    public function get_settings($request) {
        $settings = FairFence_Settings_Handler::get_all_settings();
        
        return new WP_REST_Response($settings, 200);
    }
    
    /**
     * Update settings
     */
    public function update_settings($request) {
        $settings = $request->get_param('settings');
        
        $updated = FairFence_Settings_Handler::update_settings($settings);
        
        if ($updated) {
            return new WP_REST_Response(array(
                'success' => true,
                'message' => __('Settings updated successfully', 'fairfence'),
                'settings' => FairFence_Settings_Handler::get_all_settings(),
            ), 200);
        }
        
        return new WP_Error('update_failed', __('Failed to update settings', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Get testimonials
     */
    public function get_testimonials($request) {
        $testimonials = FairFence_Settings_Handler::get_testimonials();
        
        return new WP_REST_Response($testimonials, 200);
    }
    
    /**
     * Add testimonial
     */
    public function add_testimonial($request) {
        $testimonial = array(
            'id' => uniqid(),
            'name' => sanitize_text_field($request->get_param('name')),
            'location' => sanitize_text_field($request->get_param('location')),
            'rating' => intval($request->get_param('rating')),
            'text' => sanitize_textarea_field($request->get_param('text')),
            'date' => sanitize_text_field($request->get_param('date')),
            'source' => sanitize_text_field($request->get_param('source')),
        );
        
        $testimonials = FairFence_Settings_Handler::get_testimonials();
        $testimonials[] = $testimonial;
        
        if (FairFence_Settings_Handler::update_testimonials($testimonials)) {
            return new WP_REST_Response($testimonial, 201);
        }
        
        return new WP_Error('add_failed', __('Failed to add testimonial', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Update testimonial
     */
    public function update_testimonial($request) {
        $id = $request->get_param('id');
        $testimonials = FairFence_Settings_Handler::get_testimonials();
        
        foreach ($testimonials as &$testimonial) {
            if ($testimonial['id'] == $id) {
                $testimonial['name'] = sanitize_text_field($request->get_param('name'));
                $testimonial['location'] = sanitize_text_field($request->get_param('location'));
                $testimonial['rating'] = intval($request->get_param('rating'));
                $testimonial['text'] = sanitize_textarea_field($request->get_param('text'));
                $testimonial['date'] = sanitize_text_field($request->get_param('date'));
                $testimonial['source'] = sanitize_text_field($request->get_param('source'));
                
                if (FairFence_Settings_Handler::update_testimonials($testimonials)) {
                    return new WP_REST_Response($testimonial, 200);
                }
            }
        }
        
        return new WP_Error('not_found', __('Testimonial not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Delete testimonial
     */
    public function delete_testimonial($request) {
        $id = $request->get_param('id');
        $testimonials = FairFence_Settings_Handler::get_testimonials();
        
        $filtered = array_filter($testimonials, function($testimonial) use ($id) {
            return $testimonial['id'] != $id;
        });
        
        if (count($filtered) < count($testimonials)) {
            if (FairFence_Settings_Handler::update_testimonials(array_values($filtered))) {
                return new WP_REST_Response(array('success' => true), 200);
            }
        }
        
        return new WP_Error('not_found', __('Testimonial not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Get FAQ
     */
    public function get_faq($request) {
        $faq = FairFence_Settings_Handler::get_faq();
        
        return new WP_REST_Response($faq, 200);
    }
    
    /**
     * Add FAQ
     */
    public function add_faq($request) {
        $faq_item = array(
            'id' => uniqid(),
            'question' => sanitize_text_field($request->get_param('question')),
            'answer' => sanitize_textarea_field($request->get_param('answer')),
        );
        
        $faq = FairFence_Settings_Handler::get_faq();
        $faq[] = $faq_item;
        
        if (FairFence_Settings_Handler::update_faq($faq)) {
            return new WP_REST_Response($faq_item, 201);
        }
        
        return new WP_Error('add_failed', __('Failed to add FAQ', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Update FAQ
     */
    public function update_faq($request) {
        $id = $request->get_param('id');
        $faq = FairFence_Settings_Handler::get_faq();
        
        foreach ($faq as &$item) {
            if ($item['id'] == $id) {
                $item['question'] = sanitize_text_field($request->get_param('question'));
                $item['answer'] = sanitize_textarea_field($request->get_param('answer'));
                
                if (FairFence_Settings_Handler::update_faq($faq)) {
                    return new WP_REST_Response($item, 200);
                }
            }
        }
        
        return new WP_Error('not_found', __('FAQ not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Delete FAQ
     */
    public function delete_faq($request) {
        $id = $request->get_param('id');
        $faq = FairFence_Settings_Handler::get_faq();
        
        $filtered = array_filter($faq, function($item) use ($id) {
            return $item['id'] != $id;
        });
        
        if (count($filtered) < count($faq)) {
            if (FairFence_Settings_Handler::update_faq(array_values($filtered))) {
                return new WP_REST_Response(array('success' => true), 200);
            }
        }
        
        return new WP_Error('not_found', __('FAQ not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Get services
     */
    public function get_services($request) {
        $services = FairFence_Settings_Handler::get_services();
        
        return new WP_REST_Response($services, 200);
    }
    
    /**
     * Update services
     */
    public function update_services($request) {
        $services = $request->get_params();
        
        if (FairFence_Settings_Handler::update_services($services)) {
            return new WP_REST_Response(array(
                'success' => true,
                'services' => FairFence_Settings_Handler::get_services(),
            ), 200);
        }
        
        return new WP_Error('update_failed', __('Failed to update services', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Get testimonial args for validation
     */
    private function get_testimonial_args() {
        return array(
            'name' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'location' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'rating' => array(
                'required' => true,
                'type' => 'integer',
                'minimum' => 1,
                'maximum' => 5,
            ),
            'text' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
            'date' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'source' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
        );
    }
    
    /**
     * Get FAQ args for validation
     */
    private function get_faq_args() {
        return array(
            'question' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'answer' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_textarea_field',
            ),
        );
    }
    
    /**
     * Get image args for validation
     */
    private function get_image_args() {
        return array(
            'id' => array(
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ),
            'url' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'esc_url_raw',
            ),
            'title' => array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'alt' => array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'category' => array(
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
                'enum' => array('', 'Hero Images', 'Service Images', 'Gallery Images', 'Testimonial Images'),
            ),
        );
    }
    
    /**
     * Get images
     */
    public function get_images($request) {
        $images = FairFence_Settings_Handler::get_images();
        
        return new WP_REST_Response($images, 200);
    }
    
    /**
     * Add image
     */
    public function add_image($request) {
        $image = array(
            'id' => $request->get_param('id'),
            'url' => esc_url_raw($request->get_param('url')),
            'title' => sanitize_text_field($request->get_param('title')),
            'alt' => sanitize_text_field($request->get_param('alt')),
            'category' => sanitize_text_field($request->get_param('category')),
        );
        
        $images = FairFence_Settings_Handler::get_images();
        $images[] = $image;
        
        if (FairFence_Settings_Handler::update_images($images)) {
            return new WP_REST_Response($image, 201);
        }
        
        return new WP_Error('add_failed', __('Failed to add image', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Update images (bulk update)
     */
    public function update_images($request) {
        $images = $request->get_params();
        
        if (FairFence_Settings_Handler::update_images($images)) {
            return new WP_REST_Response(array(
                'success' => true,
                'images' => FairFence_Settings_Handler::get_images(),
            ), 200);
        }
        
        return new WP_Error('update_failed', __('Failed to update images', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Update single image
     */
    public function update_image($request) {
        $id = $request->get_param('id');
        $images = FairFence_Settings_Handler::get_images();
        
        foreach ($images as &$image) {
            if ($image['id'] == $id) {
                $image['url'] = esc_url_raw($request->get_param('url'));
                $image['title'] = sanitize_text_field($request->get_param('title'));
                $image['alt'] = sanitize_text_field($request->get_param('alt'));
                $image['category'] = sanitize_text_field($request->get_param('category'));
                
                if (FairFence_Settings_Handler::update_images($images)) {
                    return new WP_REST_Response($image, 200);
                }
            }
        }
        
        return new WP_Error('not_found', __('Image not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Delete image
     */
    public function delete_image($request) {
        $id = $request->get_param('id');
        $images = FairFence_Settings_Handler::get_images();
        
        $filtered = array_filter($images, function($image) use ($id) {
            return $image['id'] != $id;
        });
        
        if (count($filtered) < count($images)) {
            if (FairFence_Settings_Handler::update_images(array_values($filtered))) {
                return new WP_REST_Response(array('success' => true), 200);
            }
        }
        
        return new WP_Error('not_found', __('Image not found', 'fairfence'), array('status' => 404));
    }
    
    /**
     * Get public configuration (for frontend)
     */
    public function get_public_config($request) {
        // Get configuration without sensitive values
        $config = FairFence_Settings_Handler::get_api_configuration(false, false);
        
        // Add any additional public data the frontend needs
        $general_settings = FairFence_Settings_Handler::get_general_settings();
        
        $public_config = array(
            'api' => array(
                'supabase_url' => $config['supabase_url'],
                'supabase_anon_key' => $config['supabase_anon_key'],
                'stripe_public_key' => $config['stripe_public_key'],
                'smtp_host' => $config['smtp_host'],
                'smtp_port' => $config['smtp_port'],
                'smtp_user' => $config['smtp_user'],
            ),
            'business' => array(
                'name' => $general_settings['business_name'],
                'phone' => $general_settings['phone'],
                'email' => $general_settings['email'],
                'address' => $general_settings['address'],
            ),
            'endpoints' => array(
                'api_base' => rest_url('fairfence/v1'),
            ),
        );
        
        return new WP_REST_Response($public_config, 200);
    }
    
    /**
     * Get API configuration (for admin)
     */
    public function get_api_config($request) {
        // Get configuration with masked sensitive values
        $config = FairFence_Settings_Handler::get_api_configuration(true, false);
        
        return new WP_REST_Response($config, 200);
    }
    
    /**
     * Update API configuration
     */
    public function update_api_config($request) {
        $config = $request->get_param('config');
        
        // Sanitize the configuration
        $sanitized_config = array();
        
        // Define field types and sanitization methods
        $field_definitions = array(
            'supabase_url' => 'esc_url_raw',
            'supabase_anon_key' => 'sanitize_text_field',
            'supabase_service_key' => 'sanitize_text_field',
            'session_secret' => 'sanitize_text_field',
            'stripe_public_key' => 'sanitize_text_field',
            'stripe_secret_key' => 'sanitize_text_field',
            'smtp_host' => 'sanitize_text_field',
            'smtp_port' => 'absint',
            'smtp_user' => 'sanitize_text_field',
            'smtp_password' => 'sanitize_text_field',
        );
        
        foreach ($field_definitions as $field => $sanitizer) {
            if (isset($config[$field])) {
                if ($sanitizer === 'esc_url_raw') {
                    $sanitized_config[$field] = esc_url_raw($config[$field]);
                } elseif ($sanitizer === 'absint') {
                    $sanitized_config[$field] = absint($config[$field]);
                } else {
                    $sanitized_config[$field] = sanitize_text_field($config[$field]);
                }
            }
        }
        
        $updated = FairFence_Settings_Handler::update_api_configuration($sanitized_config);
        
        if ($updated) {
            return new WP_REST_Response(array(
                'success' => true,
                'message' => __('API configuration updated successfully', 'fairfence'),
                'config' => FairFence_Settings_Handler::get_api_configuration(true, false),
            ), 200);
        }
        
        return new WP_Error('update_failed', __('Failed to update API configuration', 'fairfence'), array('status' => 500));
    }
    
    /**
     * Validate API configuration
     */
    public function validate_api_config($value, $request, $param) {
        if (!is_array($value)) {
            return false;
        }
        
        // Additional validation can be added here
        return true;
    }
    
    /**
     * Test API connection
     */
    public function test_connection($request) {
        $service = $request->get_param('service');
        
        switch ($service) {
            case 'supabase':
                $result = FairFence_Settings_Handler::test_supabase_connection();
                break;
                
            case 'stripe':
                // Implement Stripe connection test if needed
                $result = array(
                    'success' => false,
                    'message' => 'Stripe connection test not implemented yet'
                );
                break;
                
            case 'smtp':
                // Implement SMTP connection test if needed
                $result = array(
                    'success' => false,
                    'message' => 'SMTP connection test not implemented yet'
                );
                break;
                
            default:
                $result = array(
                    'success' => false,
                    'message' => 'Unknown service'
                );
        }
        
        return new WP_REST_Response($result, $result['success'] ? 200 : 400);
    }
}