import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, CircleCheck as CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

// Import hero images
import timberGateImage from "@assets/fencing/timber-fence-gate.jpeg";
import aluminiumFenceImage from "@assets/fencing/aluminium-fence-gate.jpg";
import timberFenceImage from "@assets/fencing/timber-fence.jpeg";

// Import new fence images for carousel
import newImage1 from "@assets/IMG_0032_1758750142435.jpeg";
import newImage2 from "@assets/IMG_0874_1758750142436.jpeg";
import newImage3 from "@assets/IMG_0852_1758750142436.jpeg";
import newImage4 from "@assets/IMG_0456_1758750142437.jpeg"; // Old logo now used here

interface HeroProps {
  onGetQuote?: () => void;
  onViewServices?: () => void;
}

export default function Hero({ onGetQuote, onViewServices }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getContent } = useSiteContent();
  
  const heroImages = [
    { src: timberGateImage, alt: "Quality Timber Fence Gate" },
    { src: aluminiumFenceImage, alt: "Modern Aluminium Fencing" },
    { src: timberFenceImage, alt: "Beautiful Timber Fencing" },
    { src: newImage1, alt: "Premium Boundary Fencing" },
    { src: newImage2, alt: "Classic Paling Installation" },
    { src: newImage3, alt: "Contemporary Panel Fencing" },
    { src: newImage4, alt: "Residential Privacy Fencing" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleGetQuote = () => {
    if (onGetQuote) {
      onGetQuote();
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    console.log('Get quote triggered');
  };

  const handleViewServices = () => {
    if (onViewServices) {
      onViewServices();
    } else {
      document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
    }
    console.log('View services triggered');
  };

  return (
    <section className="relative min-h-[100vh] flex items-center pt-20 pb-8 overflow-hidden">
      {/* Black to Orange Gradient Background - Brighter Center */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-900/70 to-black" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-orange-800/40 to-black" />
        
        {/* Flowing orange gradient accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-900/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-800/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-950/20 to-transparent rounded-full blur-3xl" />
        
        {/* Tiger Stripe Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-0 w-full h-20 bg-gradient-to-r from-transparent via-orange-900/50 to-transparent transform rotate-2" />
          <div className="absolute top-48 left-0 w-full h-16 bg-gradient-to-r from-transparent via-red-900/40 to-transparent transform -rotate-1" />
          <div className="absolute bottom-32 left-0 w-full h-24 bg-gradient-to-r from-transparent via-orange-800/50 to-transparent transform rotate-1" />
          <div className="absolute bottom-10 left-0 w-full h-12 bg-gradient-to-r from-transparent via-red-950/40 to-transparent transform -rotate-2" />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 text-primary" />
                {getContent('business', 'rating_google', '5.0')} Google Rating
              </Badge>
              <Badge variant="secondary" data-testid="badge-reviews">{getContent('business', 'review_count_google', '87')} Reviews</Badge>
              <Badge variant="secondary" className="gap-1" data-testid="badge-experience">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Since 2019
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" data-testid="hero-title">
              {getContent('hero', 'title', 'Fair, Reliable Residential Fencing Team')}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground" data-testid="hero-description">
              {getContent('hero', 'description', 'Small, dedicated team providing quality fencing at fair prices. We\'re with you from initial site visit through to the finished fence - no subcontractors, just us.')}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span data-testid="text-response-time">Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span data-testid="text-warranty">Quality Guaranteed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                size="lg" 
                className="gap-2 text-base"
                onClick={handleGetQuote}
                data-testid="button-hero-quote"
              >
                Get Free Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-base"
                onClick={handleViewServices}
                data-testid="button-hero-services"
              >
                View Our Services
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground" data-testid="hero-tagline">
                {getContent('hero', 'tagline', 'Trusted by homeowners across Hamilton, Cambridge, Te Awamutu & wider Waikato')}
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative group">
              {/* Image Carousel */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-4 h-[350px]">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'bg-orange-500 w-8' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Info Box */}
              <div className="bg-black/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-900/50 shadow-xl">
                <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" data-testid="hero-info-title">
                  {getContent('hero', 'info_title', 'Why Choose Our Small Team?')}
                </h3>
                <div className="space-y-1">
                  {[
                    getContent('hero', 'feature_1', 'Fair pricing on quality fencing'),
                    getContent('hero', 'feature_2', 'Same team from quote to completion'),
                    getContent('hero', 'feature_3', 'No subcontractors - we build it all'),
                    getContent('hero', 'feature_4', 'Personal service, honest quotes'),
                    getContent('business', 'phone_display', 'Text us: 021 0835 8914')
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-orange-500 flex-shrink-0" />
                      <span className="text-xs" data-testid={`text-feature-${index}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}