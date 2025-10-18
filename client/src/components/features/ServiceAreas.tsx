import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle2 } from "lucide-react";

// No fence images needed - using gradients instead to avoid duplicates

interface ServiceAreasProps {
  className?: string;
}

export default function ServiceAreas({ className }: ServiceAreasProps) {
  const primaryAreas = [
    "Ohaupo", "Cambridge", "Te Awamutu", "Hamilton Central"
  ];

  const hamiltonSuburbs = [
    "Rototuna", "Flagstaff", "Hamilton East", "Claudelands", "Chartwell",
    "Hillcrest", "Silverdale", "Dinsdale", "Nawton", "Frankton",
    "Melville", "Glenview", "Fitzroy", "Bader", "Maeroa",
    "Enderley", "Fairfield", "Riverlea", "Te Rapa", "Pukete",
    "St Andrews", "Huntington", "Queenwood", "Forest Lake", "Bryant Park"
  ];

  const ruralTowns = [
    "Ngāruawāhia", "Huntly", "Taupiri", "Gordonton", "Matangi",
    "Tamahere", "Ohaupo", "Whatawhata", "Raglan", "Te Kowhai",
    "Horsham Downs", "Horotiu", "Newstead", "Rukuhia",
    "Pirongia", "Te Pahu", "Kihikihi", "Pukeatua", "Mystery Creek"
  ];

  return (
    <section id="areas" className={`py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/40 to-black relative overflow-hidden ${className || ''}`}>
      {/* Background decorative gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-0 w-96 h-64 bg-gradient-to-br from-orange-900/10 to-transparent rotate-3 rounded-3xl blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-52 bg-gradient-to-tr from-red-900/10 to-transparent -rotate-2 rounded-3xl blur-3xl" />
      </div>
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Service Areas</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Servicing All of <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Greater Waikato</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Based in Ohaupo, we provide professional fencing services across the entire Waikato region and greater New Zealand. 
            <span className="font-semibold text-foreground">Free quotes within 30km of Ohaupo!</span>
          </p>
        </div>

        <div className="space-y-8">
          {/* Primary Cities */}
          <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Primary Service Areas - Same Day Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {primaryAreas.map((area) => (
                  <div 
                    key={area}
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg border border-orange-950/30"
                    data-testid={`area-primary-${area.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{area}</span>
                  </div>
                ))}
              </div>
              <Badge variant="outline" className="mt-4">
                <MapPin className="h-3 w-3 mr-1" />
                Free quotes within 30km radius
              </Badge>
            </CardContent>
          </Card>

          {/* Hamilton Suburbs */}
          <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30">
            <CardHeader>
              <CardTitle>Hamilton Suburbs We Service Daily</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hamiltonSuburbs.map((area) => (
                  <Badge 
                    key={area} 
                    variant="secondary"
                    className="hover-elevate"
                    data-testid={`area-suburb-${area.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-900/10 rounded-lg border border-orange-950/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Quick response guaranteed</span> - 
                  We have teams working across Waikato every day
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rural & Extended Areas */}
          <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30">
            <CardHeader>
              <CardTitle>Rural & Extended Waikato Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ruralTowns.map((area) => (
                  <Badge 
                    key={area} 
                    variant="outline"
                    className="hover-elevate"
                    data-testid={`area-rural-${area.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 p-4 bg-orange-900/10 rounded-lg border border-orange-950/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Lifestyle blocks welcome</span> - 
                  We specialize in rural and lifestyle property fencing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 bg-gray-900/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Local Expertise Since 2019</p>
                  <p className="text-sm text-muted-foreground">
                    We know Waikato's conditions and requirements
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-check-coverage"
              >
                Check Your Area
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}