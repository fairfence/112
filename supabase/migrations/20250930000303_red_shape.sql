/*
  # Add Comprehensive Content Areas

  1. New Content Areas
    - Process section content (timeline steps)
    - Services section content (service descriptions and features)
    - Statistics content (numbers and labels)
    - Portfolio section content
    - FAQ section content
    - Testimonials section content
    - Footer content areas
    - Navigation content
    - Pricing calculator content
    - Trust indicators and badges

  2. Content Structure
    - Each content area has section.key format
    - Values are editable through admin interface
    - Default values provided for immediate use
*/

-- Process Timeline Content
INSERT INTO site_content (section, key, value) VALUES
('process', 'title', 'From First Call to Perfect Fence'),
('process', 'description', 'Our streamlined 5-step process ensures your fencing project runs smoothly from start to finish. The same team handles everything - no confusion, no delays.'),
('process', 'step1_title', 'Initial Contact'),
('process', 'step1_description', 'Call or text us for a quick chat about your project. We''ll answer your questions and arrange a convenient site visit time.'),
('process', 'step1_timeframe', 'Same day response'),
('process', 'step2_title', 'Free Site Visit'),
('process', 'step2_description', 'We''ll visit your property to measure, assess ground conditions, and discuss your exact requirements - no obligation.'),
('process', 'step2_timeframe', 'Within 2-3 days'),
('process', 'step3_title', 'Custom Quote'),
('process', 'step3_description', 'Receive a detailed, transparent quote with no hidden costs. We''ll explain every item and answer any questions.'),
('process', 'step3_timeframe', 'Within 24 hours'),
('process', 'step4_title', 'Professional Installation'),
('process', 'step4_description', 'Our same small team handles your entire installation from start to finish - no subcontractors, just us.'),
('process', 'step4_timeframe', '1-3 days typical'),
('process', 'step5_title', 'Final Inspection'),
('process', 'step5_description', 'We walk through the completed fence with you, ensure you''re 100% happy, and provide warranty documentation.'),
('process', 'step5_timeframe', 'Completion day'),
('process', 'cta_title', 'Ready to Start Your Project?'),
('process', 'cta_description', 'Most fences are completed within a week from approval. Get your free quote today!'),

-- Services Section Content
('services', 'title', 'Professional Fencing Solutions'),
('services', 'description', 'From residential timber to rural lifestyle fencing - we handle every project with the same attention to detail and fair pricing approach.'),
('services', 'timber_title', 'Quality Timber Fencing'),
('services', 'timber_description', 'Classic wooden fences perfect for Kiwi homes. Paling, panel, and picket styles available with quality H3.2 treated timber.'),
('services', 'timber_features', 'Residential paling,Privacy screens,Custom gates,25-year posts'),
('services', 'timber_price', 'From $180/m'),
('services', 'aluminum_title', 'Modern Aluminum Fencing'),
('services', 'aluminum_description', 'Sleek, durable aluminum fencing perfect for contemporary homes and pool areas. Low maintenance with excellent longevity.'),
('services', 'aluminum_features', 'Pool compliant,Security panels,Designer slats,Powder coated'),
('services', 'aluminum_price', 'From $220/m'),
('services', 'vinyl_title', 'Low-Maintenance Vinyl'),
('services', 'vinyl_description', 'Premium PVC/vinyl fencing that never needs painting or staining. Perfect for busy homeowners wanting lasting beauty.'),
('services', 'vinyl_features', 'Zero maintenance,UV resistant,25-year warranty,Wind rated'),
('services', 'vinyl_price', 'From $250/m'),
('services', 'rural_title', 'Rural & Lifestyle Fencing'),
('services', 'rural_description', 'Post and rail, wire, and electric fencing designed for lifestyle blocks and farms. Built to handle New Zealand conditions.'),
('services', 'rural_features', 'Stock proof,Electric ready,Vehicle gates,Farm grade'),
('services', 'rural_price', 'Quote on request'),
('services', 'additional_title', 'Additional Services'),
('services', 'additional_description', 'Beyond fencing, we offer complementary services to complete your outdoor project'),

-- Statistics Content
('statistics', 'experience_value', '5'),
('statistics', 'experience_label', 'Years Experience'),
('statistics', 'projects_value', '500'),
('statistics', 'projects_suffix', '+'),
('statistics', 'projects_label', 'Fences Built'),
('statistics', 'rating_value', '4.9'),
('statistics', 'rating_suffix', '★'),
('statistics', 'rating_label', 'Google Rating'),
('statistics', 'warranty_value', '2'),
('statistics', 'warranty_suffix', ' Year'),
('statistics', 'warranty_label', 'Warranty'),

-- About Section Content
('about', 'title', 'Where Fairness and Quality Intersect'),
('about', 'description', 'Welcome to Fairfence Contracting Waikato, a company that''s built on the pillars of fairness and exceptional quality. Our commitment is to deliver fencing solutions that not only meet your needs but also uphold the values that are dear to us and our community here in New Zealand.'),
('about', 'fairness_title', 'Guided by Fairness'),
('about', 'fairness_description', 'At Fairfence, fairness isn''t just a part of our name; it''s our foundational principle. We ensure transparency in our communications, fairness in our pricing, and integrity in our services. Our aim is to make you feel confident and content with every aspect of our partnership.'),
('about', 'quality_title', 'Committed to Quality'),
('about', 'quality_description', 'Our dedication to quality extends beyond the materials we use and the fences we build. It''s about providing a service experience that is seamless, responsive, and tailored to your specific needs. We pride ourselves on our meticulous approach and the expertise of our team, ensuring that every project is synonymous with excellence.'),
('about', 'journey_title', 'Embark on Your Journey with Us'),
('about', 'journey_description', 'Discover what makes Fairfence a trusted name in fencing. Whether you''re at the planning stage or ready to initiate your project, we''re here to offer the support and expertise you need. With Fairfence, you''re not just choosing a fencing provider; you''re opting for a partner who values your peace of mind as much as the final outcome.'),
('about', 'reach_out_title', 'Reach Out to Fairfence Contracting Waikato'),
('about', 'reach_out_description', 'Curious to learn more or ready to discuss your project? We''re eager to connect with you. At Fairfence, we''re dedicated to fostering enduring relationships based on mutual respect and shared values. Together, let''s create spaces that are secure, beautiful, and thoughtfully constructed.'),
('about', 'tagline', 'Building More Than Fences, Building Trust.'),

-- Portfolio Section Content
('portfolio', 'title', 'Recent Projects Gallery'),
('portfolio', 'description', 'Every fence tells a story. Browse our recent installations across Hamilton and Waikato - all completed by our dedicated team, no subcontractors.'),

-- FAQ Section Content
('faq', 'title', 'Common Questions Answered'),
('faq', 'description', 'Everything you need to know about getting your new fence. Can''t find your answer? Just give us a call - we''re always happy to chat.'),
('faq', 'still_questions_title', 'Still Have Questions?'),
('faq', 'still_questions_description', 'Our friendly team is here to help. No question is too small - we''d rather you ask than wonder!'),
('faq', 'response_note', 'Response within 2 hours during business hours'),

-- Testimonials Section Content
('testimonials', 'title', 'What Our Customers Say'),
('testimonials', 'description', 'Real reviews from real customers across Hamilton and Waikato'),
('testimonials', 'rating_text', '4.9 out of 5'),
('testimonials', 'review_count', '87 Reviews'),
('testimonials', 'see_more_text', 'See all our reviews on'),

-- Service Areas Content
('areas', 'title', 'Servicing All of Greater Waikato'),
('areas', 'description', 'Based in Ohaupo, we provide professional fencing services across the entire Waikato region and greater New Zealand. Free quotes within 30km of Ohaupo!'),
('areas', 'primary_title', 'Primary Service Areas - Same Day Quotes'),
('areas', 'primary_note', 'Free quotes within 30km radius'),
('areas', 'hamilton_title', 'Hamilton Suburbs We Service Daily'),
('areas', 'hamilton_note', 'Quick response guaranteed - We have teams working across Waikato every day'),
('areas', 'rural_title', 'Rural & Extended Waikato Coverage'),
('areas', 'rural_note', 'Lifestyle blocks welcome - We specialize in rural and lifestyle property fencing'),
('areas', 'expertise_title', 'Local Expertise Since 2019'),
('areas', 'expertise_description', 'We know Waikato''s conditions and requirements'),

-- Pricing Calculator Content
('pricing', 'title', 'Get an Instant Estimate'),
('pricing', 'description', 'Simple, transparent pricing. Get a rough estimate in seconds - final quotes may vary based on site conditions'),
('pricing', 'calculator_title', 'Fence Cost Calculator'),
('pricing', 'calculator_description', 'Enter your basic requirements for an instant estimate'),
('pricing', 'estimate_title', 'Fair Price Estimate'),
('pricing', 'estimate_note', 'Fair pricing guaranteed • GST included'),
('pricing', 'disclaimer_1', 'Estimates are indicative only'),
('pricing', 'disclaimer_2', '• Final pricing depends on site conditions'),
('pricing', 'disclaimer_3', '• Includes materials and installation'),
('pricing', 'disclaimer_4', '• Free on-site quotes available'),

-- Navigation Content
('navigation', 'company_name', 'FairFence'),
('navigation', 'company_tagline', 'Contracting Waikato'),
('navigation', 'phone_text', 'Text: 021 0835 8914'),
('navigation', 'phone_short', 'Text Us'),

-- Footer Content
('footer', 'company_description', 'Quality fencing at fair prices. Serving Ohaupo and greater New Zealand since 2019.'),
('footer', 'copyright_text', 'All rights reserved.'),
('footer', 'services_title', 'Services'),
('footer', 'quick_links_title', 'Quick Links'),
('footer', 'contact_title', 'Contact'),
('footer', 'phone_label', 'Text: 021 0835 8914'),
('footer', 'email_label', 'Admin@fairfence.co.nz'),
('footer', 'location_label', 'Ohaupo, New Zealand'),
('footer', 'quote_button_text', 'Get Free Quote'),

-- Trust Indicators
('trust', 'rating_badge', '4.9★'),
('trust', 'reviews_count', '87 Reviews'),
('trust', 'since_badge', 'Since 2019'),
('trust', 'experience_badge', '5 Years Experience'),
('trust', 'insured_badge', 'Fully Insured'),
('trust', 'family_owned_badge', 'Family Owned Since 2019'),

-- Call to Action Content
('cta', 'primary_text', 'Get Free Quote'),
('cta', 'secondary_text', 'View Our Services'),
('cta', 'phone_primary', 'Call Now'),
('cta', 'phone_secondary', 'Text Us'),
('cta', 'schedule_text', 'Schedule Visit'),
('cta', 'quote_text', 'Get Quote'),

-- Meta Content (for SEO and page titles)
('meta', 'page_title', 'FairFence Contracting Waikato - Professional Fencing Hamilton'),
('meta', 'page_description', 'Premium residential and rural fencing solutions in Hamilton. Timber, aluminum, PVC & dig-free installations. 4.9★ rating, 87 reviews. Get your free quote today!'),
('meta', 'keywords', 'fencing contractors Hamilton, fence installation Waikato, residential fencing, timber fencing, aluminum fencing'),

-- Error Messages and System Content
('system', 'loading_text', 'Loading...'),
('system', 'error_text', 'Something went wrong. Please try again.'),
('system', 'success_text', 'Success!'),
('system', 'no_data_text', 'No data available'),
('system', 'coming_soon_text', 'Coming soon'),

-- Seasonal/Promotional Content
('promo', 'current_offer', ''),
('promo', 'seasonal_message', ''),
('promo', 'urgent_notice', ''),
('promo', 'special_badge', ''),

-- Social Proof Content
('social', 'google_reviews_text', 'Google Reviews'),
('social', 'builderscrack_text', 'BuildersCrack'),
('social', 'facebook_text', 'Facebook'),
('social', 'testimonial_source_google', 'Google'),
('social', 'testimonial_source_builderscrack', 'BuildersCrack'),
('social', 'testimonial_source_facebook', 'Facebook')

ON CONFLICT (section, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();