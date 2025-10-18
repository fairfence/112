/**
 * FairFence Admin React Interface
 * This script provides the admin interface for managing FairFence content
 */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        const adminRoot = document.getElementById('fairfence-admin-root');
        const testimonialsRoot = document.getElementById('fairfence-testimonials-root');
        const faqRoot = document.getElementById('fairfence-faq-root');
        
        if (!adminRoot && !testimonialsRoot && !faqRoot) {
            return;
        }
        
        // Get configuration from WordPress
        const config = window.fairfenceAdmin || {
            apiUrl: '/wp-json/fairfence/v1',
            nonce: '',
            currentPage: ''
        };
        
        /**
         * Security Helper - HTML Escaping Function
         */
        const escapeHtml = (unsafe) => {
            if (unsafe == null) return '';
            return String(unsafe)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        /**
         * API Helper functions
         */
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': config.nonce
            },
            
            get: async (endpoint) => {
                const response = await fetch(`${config.apiUrl}${endpoint}`, {
                    headers: api.headers
                });
                return response.json();
            },
            
            post: async (endpoint, data) => {
                const response = await fetch(`${config.apiUrl}${endpoint}`, {
                    method: 'POST',
                    headers: api.headers,
                    body: JSON.stringify(data)
                });
                return response.json();
            },
            
            put: async (endpoint, data) => {
                const response = await fetch(`${config.apiUrl}${endpoint}`, {
                    method: 'PUT',
                    headers: api.headers,
                    body: JSON.stringify(data)
                });
                return response.json();
            },
            
            delete: async (endpoint) => {
                const response = await fetch(`${config.apiUrl}${endpoint}`, {
                    method: 'DELETE',
                    headers: api.headers
                });
                return response.json();
            }
        };
        
        /**
         * Main Admin Component
         */
        class FairFenceAdmin {
            constructor() {
                this.state = {
                    loading: true,
                    saving: false,
                    testingConnection: false,
                    settings: {
                        general: {},
                        testimonials: [],
                        faq: [],
                        services: [],
                        images: [],
                        api_config: {}
                    },
                    activeTab: 'general',
                    mediaFrame: null
                };
                
                this.init();
            }
            
            async init() {
                await this.loadSettings();
                this.render();
                this.attachEventListeners();
            }
            
            async loadSettings() {
                try {
                    const settings = await api.get('/settings');
                    this.state.settings = settings;
                    this.state.loading = false;
                } catch (error) {
                    console.error('Failed to load settings:', error);
                    this.state.loading = false;
                }
            }
            
            async saveSettings() {
                this.state.saving = true;
                this.render();
                
                try {
                    const response = await api.post('/settings', {
                        settings: this.state.settings
                    });
                    
                    if (response.success) {
                        this.showNotice('Settings saved successfully!', 'success');
                    } else {
                        this.showNotice('Failed to save settings', 'error');
                    }
                } catch (error) {
                    console.error('Save error:', error);
                    this.showNotice('Error saving settings', 'error');
                }
                
                this.state.saving = false;
                this.render();
            }
            
            showNotice(message, type = 'info') {
                const notice = document.createElement('div');
                notice.className = `notice notice-${type} is-dismissible`;
                
                const paragraph = document.createElement('p');
                paragraph.textContent = message; // Safe: uses textContent instead of innerHTML
                notice.appendChild(paragraph);
                
                const container = document.querySelector('.wrap h1');
                container.parentNode.insertBefore(notice, container.nextSibling);
                
                setTimeout(() => notice.remove(), 5000);
            }
            
            safeSetContent(element, htmlContent) {
                // Clear existing content
                element.textContent = '';
                
                // Use DOMParser for safe HTML parsing
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                
                // Move all child nodes from parsed document body to target element
                while (doc.body.firstChild) {
                    element.appendChild(doc.body.firstChild);
                }
            }
            
            render() {
                if (!adminRoot) return;
                
                if (this.state.loading) {
                    adminRoot.textContent = '';
                    const spinner = document.createElement('div');
                    spinner.className = 'spinner is-active';
                    adminRoot.appendChild(spinner);
                    return;
                }
                
                // Clear existing content
                adminRoot.textContent = '';
                
                // Create container
                const container = document.createElement('div');
                container.className = 'fairfence-admin-container';
                
                // Create navigation
                const nav = document.createElement('nav');
                nav.className = 'nav-tab-wrapper';
                
                const tabs = [
                    { id: 'general', label: 'General Settings' },
                    { id: 'api_config', label: 'API Configuration' },
                    { id: 'testimonials', label: 'Testimonials' },
                    { id: 'faq', label: 'FAQ' },
                    { id: 'services', label: 'Services' },
                    { id: 'images', label: 'Images' }
                ];
                
                tabs.forEach(tab => {
                    const link = document.createElement('a');
                    link.href = '#';
                    link.className = `nav-tab ${this.state.activeTab === tab.id ? 'nav-tab-active' : ''}`;
                    link.dataset.tab = tab.id;
                    link.textContent = tab.label;
                    nav.appendChild(link);
                });
                
                // Create tab content
                const tabContent = document.createElement('div');
                tabContent.className = 'tab-content';
                this.safeSetContent(tabContent, this.renderTabContent());
                
                // Create submit section
                const submit = document.createElement('p');
                submit.className = 'submit';
                const button = document.createElement('button');
                button.className = 'button button-primary';
                button.id = 'save-settings';
                button.textContent = this.state.saving ? 'Saving...' : 'Save Settings';
                if (this.state.saving) {
                    button.disabled = true;
                }
                submit.appendChild(button);
                
                // Assemble everything
                container.appendChild(nav);
                container.appendChild(tabContent);
                container.appendChild(submit);
                adminRoot.appendChild(container);
            }
            
            renderTabContent() {
                switch(this.state.activeTab) {
                    case 'general':
                        return this.renderGeneralSettings();
                    case 'api_config':
                        return this.renderAPIConfiguration();
                    case 'testimonials':
                        return this.renderTestimonials();
                    case 'faq':
                        return this.renderFAQ();
                    case 'services':
                        return this.renderServices();
                    case 'images':
                        return this.renderImages();
                    default:
                        return '';
                }
            }
            
            renderGeneralSettings() {
                const general = this.state.settings.general || {};
                
                return `
                    <div class="form-table-wrapper">
                        <table class="form-table">
                            <tr>
                                <th><label for="business_name">Business Name</label></th>
                                <td>
                                    <input type="text" id="business_name" class="regular-text" 
                                           value="${escapeHtml(general.business_name || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="phone">Phone</label></th>
                                <td>
                                    <input type="text" id="phone" class="regular-text" 
                                           value="${escapeHtml(general.phone || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="email">Email</label></th>
                                <td>
                                    <input type="email" id="email" class="regular-text" 
                                           value="${escapeHtml(general.email || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="address">Address</label></th>
                                <td>
                                    <input type="text" id="address" class="regular-text" 
                                           value="${escapeHtml(general.address || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="tagline">Tagline</label></th>
                                <td>
                                    <input type="text" id="tagline" class="large-text" 
                                           value="${escapeHtml(general.tagline || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="about_text">About Text</label></th>
                                <td>
                                    <textarea id="about_text" class="large-text" rows="4">${escapeHtml(general.about_text || '')}</textarea>
                                </td>
                            </tr>
                        </table>
                    </div>
                `;
            }
            
            renderAPIConfiguration() {
                const config = this.state.settings.api_config || {};
                
                // Helper function to display masked or actual value
                const getFieldValue = (fieldName) => {
                    const maskedField = fieldName + '_masked';
                    const hasValueField = fieldName + '_has_value';
                    
                    if (config[maskedField]) {
                        return config[maskedField];
                    } else if (config[hasValueField]) {
                        return '••••••••';
                    }
                    return config[fieldName] || '';
                };
                
                return `
                    <div class="api-config-wrapper">
                        <div class="notice notice-info">
                            <p><strong>Important:</strong> These credentials are securely encrypted and stored in your WordPress database. Only public keys and URLs will be exposed to the frontend.</p>
                        </div>
                        
                        <h3>Supabase Configuration</h3>
                        <table class="form-table">
                            <tr>
                                <th><label for="supabase_url">Supabase URL</label></th>
                                <td>
                                    <input type="url" id="supabase_url" class="large-text" 
                                           placeholder="https://your-project.supabase.co"
                                           value="${escapeHtml(config.supabase_url || '')}" />
                                    <p class="description">Your Supabase project URL (public)</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="supabase_anon_key">Supabase Anon Key</label></th>
                                <td>
                                    <input type="text" id="supabase_anon_key" class="large-text" 
                                           placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                           value="${escapeHtml(config.supabase_anon_key || '')}" />
                                    <p class="description">Your Supabase anonymous key (public)</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="supabase_service_key">Supabase Service Role Key</label></th>
                                <td>
                                    <input type="password" id="supabase_service_key" class="large-text" 
                                           placeholder="Enter service role key (kept server-side only)"
                                           value="${escapeHtml(getFieldValue('supabase_service_key'))}" />
                                    <p class="description">Your Supabase service role key (sensitive - server-side only)</p>
                                </td>
                            </tr>
                            <tr>
                                <th></th>
                                <td>
                                    <button type="button" class="button button-secondary test-connection" data-service="supabase">
                                        <span class="dashicons dashicons-update"></span> 
                                        Test Supabase Connection
                                    </button>
                                    <span class="connection-status"></span>
                                </td>
                            </tr>
                        </table>
                        
                        <h3>Session Configuration</h3>
                        <table class="form-table">
                            <tr>
                                <th><label for="session_secret">Session Secret</label></th>
                                <td>
                                    <input type="password" id="session_secret" class="large-text" 
                                           placeholder="Generate a secure random string"
                                           value="${escapeHtml(getFieldValue('session_secret'))}" />
                                    <button type="button" class="button generate-secret" data-field="session_secret">
                                        Generate
                                    </button>
                                    <p class="description">Secret key for session encryption (sensitive - server-side only)</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h3>Payment Configuration (Optional)</h3>
                        <table class="form-table">
                            <tr>
                                <th><label for="stripe_public_key">Stripe Publishable Key</label></th>
                                <td>
                                    <input type="text" id="stripe_public_key" class="large-text" 
                                           placeholder="pk_test_... or pk_live_..."
                                           value="${escapeHtml(config.stripe_public_key || '')}" />
                                    <p class="description">Your Stripe publishable key (public)</p>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="stripe_secret_key">Stripe Secret Key</label></th>
                                <td>
                                    <input type="password" id="stripe_secret_key" class="large-text" 
                                           placeholder="sk_test_... or sk_live_..."
                                           value="${escapeHtml(getFieldValue('stripe_secret_key'))}" />
                                    <p class="description">Your Stripe secret key (sensitive - server-side only)</p>
                                </td>
                            </tr>
                        </table>
                        
                        <h3>Email Configuration (Optional)</h3>
                        <table class="form-table">
                            <tr>
                                <th><label for="smtp_host">SMTP Host</label></th>
                                <td>
                                    <input type="text" id="smtp_host" class="regular-text" 
                                           placeholder="smtp.gmail.com"
                                           value="${escapeHtml(config.smtp_host || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="smtp_port">SMTP Port</label></th>
                                <td>
                                    <input type="number" id="smtp_port" class="small-text" 
                                           placeholder="587"
                                           value="${escapeHtml(config.smtp_port || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="smtp_user">SMTP Username</label></th>
                                <td>
                                    <input type="text" id="smtp_user" class="regular-text" 
                                           placeholder="your-email@gmail.com"
                                           value="${escapeHtml(config.smtp_user || '')}" />
                                </td>
                            </tr>
                            <tr>
                                <th><label for="smtp_password">SMTP Password</label></th>
                                <td>
                                    <input type="password" id="smtp_password" class="regular-text" 
                                           placeholder="Enter SMTP password"
                                           value="${escapeHtml(getFieldValue('smtp_password'))}" />
                                    <p class="description">Your SMTP password or app-specific password</p>
                                </td>
                            </tr>
                        </table>
                        
                        <style>
                            .api-config-wrapper h3 {
                                margin-top: 30px;
                                padding-bottom: 10px;
                                border-bottom: 1px solid #ddd;
                            }
                            .connection-status {
                                margin-left: 10px;
                                font-weight: bold;
                            }
                            .connection-status.success {
                                color: #46b450;
                            }
                            .connection-status.error {
                                color: #dc3232;
                            }
                        </style>
                    </div>
                `;
            }
            
            renderTestimonials() {
                const testimonials = this.state.settings.testimonials || [];
                
                let html = `
                    <div class="testimonials-manager">
                        <button class="button button-secondary add-testimonial">Add New Testimonial</button>
                        <div class="testimonials-list">
                `;
                
                testimonials.forEach((testimonial, index) => {
                    html += `
                        <div class="testimonial-item" data-index="${index}">
                            <div class="testimonial-header">
                                <strong>${escapeHtml(testimonial.name)}</strong> - ${escapeHtml(testimonial.location)}
                                <button class="button-link delete-testimonial" data-index="${index}">Delete</button>
                            </div>
                            <div class="testimonial-fields">
                                <input type="text" placeholder="Name" class="regular-text" 
                                       data-field="name" value="${escapeHtml(testimonial.name)}" />
                                <input type="text" placeholder="Location" class="regular-text" 
                                       data-field="location" value="${escapeHtml(testimonial.location)}" />
                                <input type="number" placeholder="Rating" min="1" max="5" 
                                       data-field="rating" value="${escapeHtml(testimonial.rating)}" />
                                <textarea placeholder="Review text" class="large-text" rows="3" 
                                          data-field="text">${escapeHtml(testimonial.text)}</textarea>
                                <input type="text" placeholder="Date" class="regular-text" 
                                       data-field="date" value="${escapeHtml(testimonial.date)}" />
                                <input type="text" placeholder="Source (Google, BuildersCrack)" 
                                       data-field="source" value="${escapeHtml(testimonial.source)}" />
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
                
                return html;
            }
            
            renderFAQ() {
                const faq = this.state.settings.faq || [];
                
                let html = `
                    <div class="faq-manager">
                        <button class="button button-secondary add-faq">Add New FAQ</button>
                        <div class="faq-list">
                `;
                
                faq.forEach((item, index) => {
                    html += `
                        <div class="faq-item" data-index="${index}">
                            <div class="faq-header">
                                <strong>Q: ${escapeHtml(item.question)}</strong>
                                <button class="button-link delete-faq" data-index="${index}">Delete</button>
                            </div>
                            <div class="faq-fields">
                                <input type="text" placeholder="Question" class="large-text" 
                                       data-field="question" value="${escapeHtml(item.question)}" />
                                <textarea placeholder="Answer" class="large-text" rows="3" 
                                          data-field="answer">${escapeHtml(item.answer)}</textarea>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
                
                return html;
            }
            
            renderServices() {
                const services = this.state.settings.services || [];
                
                let html = `
                    <div class="services-manager">
                        <div class="services-list">
                `;
                
                services.forEach((service, index) => {
                    const features = Array.isArray(service.features) ? escapeHtml(service.features.join(', ')) : '';
                    
                    html += `
                        <div class="service-item" data-index="${index}">
                            <h3>${escapeHtml(service.title)}</h3>
                            <div class="service-fields">
                                <input type="text" placeholder="Title" class="large-text" 
                                       data-field="title" value="${escapeHtml(service.title)}" />
                                <textarea placeholder="Description" class="large-text" rows="2" 
                                          data-field="description">${escapeHtml(service.description)}</textarea>
                                <input type="text" placeholder="Features (comma-separated)" class="large-text" 
                                       data-field="features" value="${features}" />
                                <input type="text" placeholder="Price Range" class="regular-text" 
                                       data-field="priceRange" value="${escapeHtml(service.priceRange || '')}" />
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
                
                return html;
            }
            
            renderImages() {
                const images = this.state.settings.images || [];
                const categories = ['Hero Images', 'Service Images', 'Gallery Images', 'Testimonial Images'];
                
                let html = `
                    <div class="images-manager">
                        <div class="images-toolbar">
                            <button class="button button-primary add-image">
                                <span class="dashicons dashicons-upload"></span> Add New Image
                            </button>
                            <div class="category-filter">
                                <label>Filter by Category:</label>
                                <select class="image-category-filter">
                                    <option value="">All Categories</option>
                `;
                
                categories.forEach(cat => {
                    html += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
                });
                
                html += `
                                </select>
                            </div>
                        </div>
                        
                        <div class="images-grid">
                `;
                
                if (images.length === 0) {
                    html += `
                        <div class="no-images-notice">
                            <p>No images have been added yet. Click "Add New Image" to get started.</p>
                        </div>
                    `;
                } else {
                    images.forEach((image, index) => {
                        const imageClass = image.category ? `image-category-${image.category.replace(/\s+/g, '-').toLowerCase()}` : '';
                        html += `
                            <div class="image-item ${imageClass}" data-index="${index}" data-category="${escapeHtml(image.category || '')}">
                                <div class="image-preview">
                                    <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt || '')}" />
                                    <div class="image-overlay">
                                        <button class="button button-small replace-image" data-index="${index}">
                                            <span class="dashicons dashicons-update"></span> Replace
                                        </button>
                                        <button class="button button-small copy-url" data-url="${escapeHtml(image.url)}">
                                            <span class="dashicons dashicons-clipboard"></span> Copy URL
                                        </button>
                                        <button class="button button-small delete-image" data-index="${index}">
                                            <span class="dashicons dashicons-trash"></span> Delete
                                        </button>
                                    </div>
                                </div>
                                <div class="image-details">
                                    <input type="text" placeholder="Title" class="regular-text" 
                                           data-field="title" data-index="${index}" 
                                           value="${escapeHtml(image.title || '')}" />
                                    <input type="text" placeholder="Alt Text" class="regular-text" 
                                           data-field="alt" data-index="${index}" 
                                           value="${escapeHtml(image.alt || '')}" />
                                    <select class="image-category" data-field="category" data-index="${index}">
                                        <option value="">Select Category</option>
                        `;
                        
                        categories.forEach(cat => {
                            const selected = image.category === cat ? 'selected' : '';
                            html += `<option value="${escapeHtml(cat)}" ${selected}>${escapeHtml(cat)}</option>`;
                        });
                        
                        html += `
                                    </select>
                                    <div class="image-url-display">
                                        <small>URL: <code>${escapeHtml(image.url)}</code></small>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
                
                html += `
                        </div>
                    </div>
                `;
                
                return html;
            }
            
            attachEventListeners() {
                // Tab switching
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('nav-tab')) {
                        e.preventDefault();
                        this.state.activeTab = e.target.dataset.tab;
                        this.render();
                        this.attachEventListeners();
                    }
                    
                    // Save button
                    if (e.target.id === 'save-settings') {
                        e.preventDefault();
                        this.collectFormData();
                        this.saveSettings();
                    }
                    
                    // Add testimonial
                    if (e.target.classList.contains('add-testimonial')) {
                        this.state.settings.testimonials.push({
                            id: Date.now().toString(),
                            name: '',
                            location: '',
                            rating: 5,
                            text: '',
                            date: 'Recently',
                            source: 'Google'
                        });
                        this.render();
                        this.attachEventListeners();
                    }
                    
                    // Delete testimonial
                    if (e.target.classList.contains('delete-testimonial')) {
                        const index = parseInt(e.target.dataset.index);
                        this.state.settings.testimonials.splice(index, 1);
                        this.render();
                        this.attachEventListeners();
                    }
                    
                    // Add FAQ
                    if (e.target.classList.contains('add-faq')) {
                        this.state.settings.faq.push({
                            id: Date.now().toString(),
                            question: '',
                            answer: ''
                        });
                        this.render();
                        this.attachEventListeners();
                    }
                    
                    // Delete FAQ
                    if (e.target.classList.contains('delete-faq')) {
                        const index = parseInt(e.target.dataset.index);
                        this.state.settings.faq.splice(index, 1);
                        this.render();
                        this.attachEventListeners();
                    }
                    
                    // Image management events
                    if (e.target.classList.contains('add-image')) {
                        e.preventDefault();
                        this.openMediaLibrary((attachment) => {
                            this.state.settings.images.push({
                                id: attachment.id,
                                url: attachment.url,
                                title: attachment.title || '',
                                alt: attachment.alt || '',
                                category: ''
                            });
                            this.render();
                            this.attachEventListeners();
                        });
                    }
                    
                    // Replace image
                    if (e.target.classList.contains('replace-image')) {
                        e.preventDefault();
                        const index = parseInt(e.target.dataset.index);
                        this.openMediaLibrary((attachment) => {
                            this.state.settings.images[index] = {
                                ...this.state.settings.images[index],
                                id: attachment.id,
                                url: attachment.url
                            };
                            this.render();
                            this.attachEventListeners();
                        });
                    }
                    
                    // Delete image
                    if (e.target.classList.contains('delete-image')) {
                        e.preventDefault();
                        if (confirm('Are you sure you want to remove this image from the gallery?')) {
                            const index = parseInt(e.target.dataset.index);
                            this.state.settings.images.splice(index, 1);
                            this.render();
                            this.attachEventListeners();
                        }
                    }
                    
                    // Copy URL
                    if (e.target.classList.contains('copy-url')) {
                        e.preventDefault();
                        const url = e.target.dataset.url;
                        this.copyToClipboard(url);
                        this.showNotice('Image URL copied to clipboard!', 'success');
                    }
                    
                    // Test API connection
                    if (e.target.classList.contains('test-connection')) {
                        e.preventDefault();
                        const service = e.target.dataset.service;
                        this.testConnection(service);
                    }
                    
                    // Generate secret
                    if (e.target.classList.contains('generate-secret')) {
                        e.preventDefault();
                        const field = e.target.dataset.field;
                        const secret = this.generateSecret();
                        document.getElementById(field).value = secret;
                        this.collectFormData();
                    }
                });
                
                // Input change handlers
                document.addEventListener('input', (e) => {
                    this.collectFormData();
                });
                
                // Select change handlers
                document.addEventListener('change', (e) => {
                    // Image category filter
                    if (e.target.classList.contains('image-category-filter')) {
                        const category = e.target.value;
                        const imageItems = document.querySelectorAll('.image-item');
                        
                        imageItems.forEach(item => {
                            if (!category || item.dataset.category === category) {
                                item.style.display = '';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    }
                    
                    // Image field changes
                    if (e.target.dataset.field && e.target.dataset.index !== undefined) {
                        const index = parseInt(e.target.dataset.index);
                        const field = e.target.dataset.field;
                        if (this.state.settings.images[index]) {
                            this.state.settings.images[index][field] = e.target.value;
                        }
                    }
                });
            }
            
            openMediaLibrary(onSelect) {
                // Check if wp.media is available
                if (!window.wp || !window.wp.media) {
                    alert('WordPress Media Library is not available. Please ensure you are in the WordPress admin area.');
                    return;
                }
                
                // Create media frame if not exists
                if (!this.state.mediaFrame) {
                    this.state.mediaFrame = wp.media({
                        title: 'Select or Upload Image',
                        button: {
                            text: 'Use this image'
                        },
                        multiple: false,
                        library: {
                            type: 'image'
                        }
                    });
                    
                    // Handle image selection
                    this.state.mediaFrame.on('select', () => {
                        const attachment = this.state.mediaFrame.state().get('selection').first().toJSON();
                        if (onSelect) {
                            onSelect(attachment);
                        }
                    });
                }
                
                // Open the media frame
                this.state.mediaFrame.open();
            }
            
            copyToClipboard(text) {
                // Create temporary textarea
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                
                // Select and copy text
                textarea.select();
                document.execCommand('copy');
                
                // Clean up
                document.body.removeChild(textarea);
            }
            
            generateSecret() {
                // Generate a secure random string
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
                let secret = '';
                for (let i = 0; i < 32; i++) {
                    secret += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return secret;
            }
            
            async testConnection(service) {
                // Save current form data first
                this.collectFormData();
                await this.saveSettings();
                
                // Show loading state
                const statusEl = document.querySelector('.connection-status');
                if (statusEl) {
                    statusEl.textContent = 'Testing connection...';
                    statusEl.className = 'connection-status';
                }
                
                try {
                    const response = await api.post('/test-connection', {
                        service: service
                    });
                    
                    if (statusEl) {
                        if (response.success) {
                            statusEl.textContent = response.message || 'Connection successful!';
                            statusEl.className = 'connection-status success';
                        } else {
                            statusEl.textContent = response.message || 'Connection failed';
                            statusEl.className = 'connection-status error';
                        }
                        
                        // Clear status after 5 seconds
                        setTimeout(() => {
                            statusEl.textContent = '';
                            statusEl.className = 'connection-status';
                        }, 5000);
                    }
                } catch (error) {
                    console.error('Test connection error:', error);
                    if (statusEl) {
                        statusEl.textContent = 'Error testing connection';
                        statusEl.className = 'connection-status error';
                    }
                }
            }
            
            collectFormData() {
                // Collect general settings
                if (this.state.activeTab === 'general') {
                    const fields = ['business_name', 'phone', 'email', 'address', 'tagline', 'about_text'];
                    fields.forEach(field => {
                        const input = document.getElementById(field);
                        if (input) {
                            this.state.settings.general[field] = input.value;
                        }
                    });
                }
                
                // Collect testimonials
                if (this.state.activeTab === 'testimonials') {
                    const items = document.querySelectorAll('.testimonial-item');
                    items.forEach((item, index) => {
                        const fields = item.querySelectorAll('[data-field]');
                        fields.forEach(field => {
                            const fieldName = field.dataset.field;
                            let value = field.value;
                            
                            if (fieldName === 'rating') {
                                value = parseInt(value) || 5;
                            }
                            
                            this.state.settings.testimonials[index][fieldName] = value;
                        });
                    });
                }
                
                // Collect FAQ
                if (this.state.activeTab === 'faq') {
                    const items = document.querySelectorAll('.faq-item');
                    items.forEach((item, index) => {
                        const fields = item.querySelectorAll('[data-field]');
                        fields.forEach(field => {
                            const fieldName = field.dataset.field;
                            this.state.settings.faq[index][fieldName] = field.value;
                        });
                    });
                }
                
                // Collect API Configuration
                if (this.state.activeTab === 'api_config') {
                    const apiFields = [
                        'supabase_url', 'supabase_anon_key', 'supabase_service_key',
                        'session_secret', 'stripe_public_key', 'stripe_secret_key',
                        'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password'
                    ];
                    
                    apiFields.forEach(field => {
                        const input = document.getElementById(field);
                        if (input) {
                            const value = input.value;
                            // Only update if not a masked placeholder
                            if (!value.includes('•••')) {
                                this.state.settings.api_config[field] = value;
                            }
                        }
                    });
                }
                
                // Collect services
                if (this.state.activeTab === 'services') {
                    const items = document.querySelectorAll('.service-item');
                    items.forEach((item, index) => {
                        const fields = item.querySelectorAll('[data-field]');
                        fields.forEach(field => {
                            const fieldName = field.dataset.field;
                            let value = field.value;
                            
                            if (fieldName === 'features') {
                                value = value.split(',').map(f => f.trim()).filter(f => f);
                            }
                            
                            this.state.settings.services[index][fieldName] = value;
                        });
                    });
                }
                
                // Images are collected in real-time via event handlers
            }
        }
        
        // Initialize the admin interface
        if (adminRoot) {
            new FairFenceAdmin();
        }
    });
})();