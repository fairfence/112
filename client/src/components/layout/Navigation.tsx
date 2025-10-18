import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import fairfenceLogo from "@assets/IMG_0801_1758753451867.jpeg";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Our Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "Reviews", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Areas", href: "#areas" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={cn("fixed top-0 w-full bg-gradient-to-r from-black/95 via-orange-950/95 to-black/95 backdrop-blur-md border-b border-orange-900/40 z-50", className)}>
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={fairfenceLogo} 
              alt="FairFence Contracting Waikato" 
              className="h-10 md:h-12 w-auto object-contain rounded-md"
              data-testid="image-logo"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight" data-testid="text-company-name">FairFence</span>
              <span className="text-xs text-muted-foreground" data-testid="text-tagline">Contracting Waikato</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </a>
            ))}
            <Button 
              className="gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 animate-pulse" 
              size="sm"
              data-testid="button-call-now"
              onClick={() => window.location.href = "sms:02108358914"}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Text: 021 0835 8914</span>
              <span className="sm:hidden">Text Us</span>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu-toggle">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                    data-testid={`link-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                ))}
                <Button 
                  className="gap-2 w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500" 
                  size="lg"
                  data-testid="button-mobile-call"
                  onClick={() => window.location.href = "sms:02108358914"}
                >
                  <Phone className="h-5 w-5" />
                  Text: 021 0835 8914
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}