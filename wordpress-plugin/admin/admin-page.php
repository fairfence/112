<?php
/**
 * Admin page template
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div id="fairfence-admin-root">
        <!-- React app will mount here -->
        <div class="notice notice-info">
            <p><?php _e('Loading FairFence admin interface...', 'fairfence'); ?></p>
        </div>
    </div>
    
    <noscript>
        <div class="notice notice-error">
            <p><?php _e('JavaScript must be enabled to use the FairFence admin interface.', 'fairfence'); ?></p>
        </div>
    </noscript>
</div>