/**
 * WordPress Webpack Configuration
 * This file customizes the default @wordpress/scripts webpack config
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    
    // Entry point for the admin interface
    entry: {
        admin: path.resolve(__dirname, 'admin/src/index.js'),
    },
    
    // Output configuration
    output: {
        ...defaultConfig.output,
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    
    // Additional module rules if needed
    module: {
        ...defaultConfig.module,
        rules: [
            ...defaultConfig.module.rules,
            // Add custom rules here if needed
        ],
    },
    
    // Externals - WordPress dependencies
    externals: {
        ...defaultConfig.externals,
        jquery: 'jQuery',
    },
    
    // Resolve configuration
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@admin': path.resolve(__dirname, 'admin/src'),
        },
    },
};