import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hammer, Shield, Sparkles, Zap, ArrowRight, CircleCheck as CheckCircle2 } from "lucide-react";

// Import service images
import timberServiceImage from "@assets/fencing/timber-fence.jpeg";
import aluminumServiceImage from "@assets/fencing/aluminium-fence-gate.jpg";
import vinylServiceImage from "@assets/fencing/vinyl-pvc-fence.webp";
import ruralServiceImage from "@assets/fencing/files_7134594-1760607584209-IMG_0562.jpg";

interface ServicesProps {
  className?: string;
}

export default function Services({ className }: ServicesProps) {
  const services = [
    {
      id: "timber",
      icon: <Hammer className="h-6 w-6" />,
      title: "Quality Timber Fencing",
      description: "Classic wooden fences perfect for Kiwi homes. Paling, panel, and picket styles available with quality H3.2 treated timber.",
      features: ["Residential paling", "Privacy screens", "Custom gates", "25-year posts"],
      priceRange: "From $180/m",
      image: timberServiceImage,
      gradient: "from-amber-900/40 to-orange-900/40"
    },
    {
      id: "aluminum",
      icon: <Shield className="h-6 w-6" />,
      title: "Modern Aluminum Fencing",
      description: "Sleek, durable aluminum fencing perfect for contemporary homes and pool areas. Low maintenance with excellent longevity.",
      features: ["Pool compliant", "Security panels", "Designer slats", "Powder coated"],
      priceRange: "From $220/m",
      image: aluminumServiceImage,
      gradient: "from-slate-900/40 to-gray-900/40"
    },
    {
      id: "vinyl",
      icon: <Sparkles className="h-6 w-6" />,
      title: "Low-Maintenance Vinyl",
      description: "Premium PVC/vinyl fencing that never needs painting or staining. Perfect for busy homeowners wanting lasting beauty.",
      features: ["Zero maintenance", "UV resistant", "25-year warranty", "Wind rated"],
      priceRange: "From $250/m",
      image: vinylServiceImage,
      gradient: "from-blue-900/40 to-indigo-900/40"
    },
    {
      id: "rural",
      icon: <Zap className="h-6 w-6" />,
      title: "Rural & Lifestyle Fencing",
      description: "Post and rail, wire, and electric fencing designed for lifestyle blocks and farms. Built to handle New Zealand conditions.",
      features: ["Stock proof", "Electric ready", "Vehicle gates", "Farm grade"],
      priceRange: "Quote on request",
      image: ruralServiceImage,
      gradient: "from-green-900/40 to-emerald-900/40"
    }
  ];

  return (
    <section id="services" className={`py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/40 to-black relative overflow-hidden ${className || ''}`}>
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-red-900/20 to-transparent rounded-full blur-3xl" />
        {/* Tiger stripe patterns */}
        <div className="absolute top-20 left-0 w-full h-24 bg-gradient-to-r from-transparent via-orange-800/30 to-transparent transform rotate-1" />
        <div className="absolute bottom-32 left-0 w-full h-20 bg-gradient-to-r from-transparent via-red-900/20 to-transparent transform -rotate-2" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Our Services</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Professional <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Fencing Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From residential timber to rural lifestyle fencing - we handle every project with the same attention to detail and fair pricing approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className="group overflow-hidden bg-black/60 backdrop-blur-sm border-orange-950/30 hover-elevate active-elevate-2"
              data-testid={`card-service-${service.id}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} to-black/80`} />
                <div className="absolute top-4 left-4">
                  <div className="p-3 bg-primary/20 backdrop-blur-sm rounded-lg text-primary">
                    {service.icon}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  data-testid={`button-quote-${service.id}`}
                >
                  Get Quote
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-sm border-orange-950/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-3">Additional Services</h3>
              <p className="text-muted-foreground mb-6">
                Beyond fencing, we offer complementary services to complete your outdoor project
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[
                  "Fence Repairs",
                  "Gate Installation", 
                  "Retaining Walls",
                  "Deck Construction"
                ].map((service, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
              <Button 
                className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-additional-services"
              >
                Discuss Your Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}