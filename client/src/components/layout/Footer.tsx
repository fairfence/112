import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { getContent } = useSiteContent();

  return (
    <footer className="bg-gradient-to-b from-orange-950 to-black border-t border-orange-900/40">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">FF</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight" data-testid="footer-company-name">
                  {getContent('business', 'company_name', 'FairFence')}
                </span>
                <span className="text-xs text-muted-foreground" data-testid="footer-company-subtitle">
                  {getContent('business', 'company_subtitle', 'Contracting Waikato')}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4" data-testid="footer-description">
              {getContent('business', 'description', 'Quality fencing at fair prices. Serving Ohaupo and greater New Zealand since 2019.')}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{getContent('business', 'rating_google', '5.0')}★ Google</Badge>
              <span className="text-sm text-muted-foreground">{getContent('business', 'review_count_google', '87')} Reviews</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                "Timber Fencing",
                "Aluminum Fencing",
                "PVC/Vinyl Fencing",
                "Rural Fencing",
                "Dig-Free Installation"
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#services" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${service.toLowerCase().replace(/[\s/]+/g, '-')}`}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Get Quote", href: "#contact" },
                { label: "Pricing Calculator", href: "#pricing" },
                { label: "Service Areas", href: "#areas" },
                { label: "Reviews", href: "#testimonials" }
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <a 
                href={`sms:${getContent('business', 'phone_number', '02108358914')}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                data-testid="link-footer-phone"
              >
                <Phone className="h-4 w-4" />
                {getContent('business', 'phone_display', 'Text: 021 0835 8914')}
              </a>
              <a 
                href={`mailto:${getContent('business', 'email', 'Admin@fairfence.co.nz')}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                data-testid="link-footer-email"
              >
                <Mail className="h-4 w-4" />
                {getContent('business', 'email', 'Admin@fairfence.co.nz')}
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <div>
                  {getContent('business', 'location', 'Ohaupo, New Zealand')}
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-footer-quote"
            >
              Get Free Quote
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} {getContent('business', 'company_full_name', 'FairFence Contracting Waikato')}. All rights reserved.</p>
          <p className="mt-2">
            {getContent('business', 'footer_tagline', 'Website designed for mobile-first experience • Proudly serving New Zealand')}
          </p>
        </div>
      </div>
    </footer>
  );
}