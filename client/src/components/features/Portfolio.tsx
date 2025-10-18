import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  MapPin, 
  Clock, 
  Home,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Import ONLY stock images - NO DUPLICATE FENCE IMAGES from other components
import stockImage1 from "@assets/stock_images/professional_residen_37df0c68.jpg";
import stockImage2 from "@assets/stock_images/professional_residen_4b1572a3.jpg";
import stockImage3 from "@assets/stock_images/professional_residen_b2c1ec56.jpg";

interface Project {
  id: number;
  type: string;
  title: string;
  location: string;
  duration: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  features: string[];
}

export default function Portfolio() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projects: Project[] = [
    {
      id: 1,
      type: "timber",
      title: "Modern Timber Privacy Fence",
      location: "Hamilton East",
      duration: "2 days",
      description: "Complete boundary fence replacement with quality treated pine, custom-built gates, and privacy screening.",
      beforeImage: stockImage1,
      afterImage: stockImage3,
      features: ["1.8m height", "Treated pine", "25-year warranty posts", "Custom gates"]
    },
    {
      id: 2,
      type: "aluminum",
      title: "Pool Safety Fencing",
      location: "Rototuna",
      duration: "1 day",
      description: "Compliant pool fencing installation meeting all NZ safety standards, with self-closing magnetic gates.",
      beforeImage: stockImage2,
      afterImage: stockImage2,
      features: ["1.2m height", "Black powder coat", "Self-closing gates", "Council approved"]
    },
    {
      id: 3,
      type: "timber",
      title: "Heritage Style Picket Fence",
      location: "Flagstaff",
      duration: "3 days",
      description: "Traditional picket fence restoration matching the character home's original 1920s design.",
      beforeImage: stockImage3,
      afterImage: stockImage1,
      features: ["1.2m height", "Custom pickets", "Heritage white", "Decorative posts"]
    },
    {
      id: 4,
      type: "vinyl",
      title: "Maintenance-Free Boundary",
      location: "Huntington",
      duration: "2 days",
      description: "Full perimeter vinyl fencing for a corner property, zero maintenance with lifetime warranty.",
      beforeImage: stockImage1,
      afterImage: stockImage3,
      features: ["2.1m height", "UV resistant", "25-year warranty", "Wind rated"]
    },
    {
      id: 5,
      type: "aluminum",
      title: "Decorative Garden Fencing",
      location: "Chartwell",
      duration: "1 day",
      description: "Stylish aluminum slat fencing creating distinct garden zones while maintaining airflow.",
      beforeImage: stockImage2,
      afterImage: stockImage1,
      features: ["1.5m height", "Horizontal slats", "Monument color", "Easy access gate"]
    },
    {
      id: 6,
      type: "rural",
      title: "Lifestyle Block Fencing",
      location: "Tamahere",
      duration: "4 days",
      description: "Post and rail fencing for 2-hectare lifestyle block, including stock-proof gates.",
      beforeImage: stockImage3,
      afterImage: stockImage2,
      features: ["Post & rail", "Stock proof", "Electric ready", "Vehicle gates"]
    },
    {
      id: 7,
      type: "timber",
      title: "Contemporary Horizontal Slat",
      location: "Claudelands",
      duration: "2 days",
      description: "Modern horizontal slat design providing privacy while maintaining a contemporary aesthetic.",
      beforeImage: stockImage1,
      afterImage: stockImage3,
      features: ["1.8m height", "90mm slats", "Black posts", "LED lighting ready"]
    },
    {
      id: 8,
      type: "aluminum",
      title: "Commercial Security Fence",
      location: "Te Rapa",
      duration: "3 days",
      description: "Heavy-duty aluminum security fencing for commercial property with automated sliding gate.",
      beforeImage: stockImage2,
      afterImage: stockImage2,
      features: ["2.4m height", "Security spikes", "Automated gate", "CCTV mounts"]
    },
    {
      id: 9,
      type: "timber",
      title: "Acoustic Barrier Fence",
      location: "Dinsdale",
      duration: "3 days",
      description: "Acoustic-rated timber fence reducing road noise by 15dB for residential property.",
      beforeImage: stockImage3,
      afterImage: stockImage1,
      features: ["2.1m height", "Acoustic rated", "Double paling", "Council compliant"]
    },
    {
      id: 10,
      type: "vinyl",
      title: "Colonial Style Privacy",
      location: "Cambridge",
      duration: "2 days",
      description: "Classic colonial-style vinyl fencing with decorative post caps and lattice top sections.",
      beforeImage: stockImage1,
      afterImage: stockImage3,
      features: ["1.8m height", "Lattice top", "Colonial caps", "Double gates"]
    },
    {
      id: 11,
      type: "aluminum",
      title: "Modern Minimalist Design",
      location: "Hillcrest",
      duration: "1 day",
      description: "Sleek black aluminum fencing with clean lines complementing modern architecture.",
      beforeImage: stockImage2,
      afterImage: stockImage1,
      features: ["1.5m height", "Matte black", "Hidden fixings", "Minimalist design"]
    },
    {
      id: 12,
      type: "rural",
      title: "Equestrian Arena Fencing",
      location: "Matangi",
      duration: "5 days",
      description: "Professional equestrian arena fencing with rounded rails and safety considerations.",
      beforeImage: stockImage3,
      afterImage: stockImage2,
      features: ["1.4m height", "Rounded rails", "Safety gates", "Arena standard"]
    },
    {
      id: 13,
      type: "timber",
      title: "Premium Boundary Fence",
      location: "Ohaupo",
      duration: "2 days",
      description: "High-quality timber boundary fence with custom design elements for enhanced privacy and aesthetics.",
      beforeImage: stockImage1,
      afterImage: stockImage1,
      features: ["1.8m height", "Premium timber", "Weather resistant", "25-year posts"]
    },
    {
      id: 14,
      type: "timber",
      title: "Classic Paling Fence",
      location: "Te Awamutu",
      duration: "2 days",
      description: "Traditional paling fence installation with robust construction and excellent finish quality.",
      beforeImage: stockImage2,
      afterImage: stockImage2,
      features: ["1.8m height", "H3.2 treated", "Capped rails", "Professional finish"]
    },
    {
      id: 15,
      type: "aluminum",
      title: "Contemporary Panel Fence",
      location: "Cambridge",
      duration: "1 day",
      description: "Modern aluminum panel fencing with sleek design perfect for contemporary homes.",
      beforeImage: stockImage3,
      afterImage: stockImage1,
      features: ["1.5m height", "Powder coated", "Low maintenance", "Modern design"]
    },
    {
      id: 16,
      type: "timber",
      title: "Residential Privacy Screen",
      location: "Morrinsville",
      duration: "3 days",
      description: "Custom privacy screening solution for residential property with attention to detail.",
      beforeImage: stockImage1,
      afterImage: stockImage3,
      features: ["2.1m height", "Privacy slats", "Side access gate", "Quality hardware"]
    },
    {
      id: 17,
      type: "rural",
      title: "Farm Boundary Upgrade",
      location: "Tamahere",
      duration: "4 days",
      description: "Complete farm boundary fence upgrade with stock-proof construction and vehicle access.",
      beforeImage: stockImage2,
      afterImage: stockImage2,
      features: ["Post & batten", "Stock proof", "Farm gates", "Electric ready"]
    },
    {
      id: 18,
      type: "timber",
      title: "Garden Feature Fence",
      location: "Ngaruawahia",
      duration: "2 days",
      description: "Decorative garden fence combining functionality with aesthetic appeal for landscaped areas.",
      beforeImage: stockImage3,
      afterImage: stockImage1,
      features: ["1.2m height", "Decorative top", "Garden gates", "Natural finish"]
    },
    {
      id: 19,
      type: "aluminum",
      title: "Security Fence Installation",
      location: "Huntly",
      duration: "3 days",
      description: "Heavy-duty security fencing for commercial property with enhanced safety features.",
      beforeImage: stockImage1,
      afterImage: stockImage2,
      features: ["2.4m height", "Security rated", "Access control", "Durable finish"]
    },
    {
      id: 20,
      type: "timber",
      title: "Suburban Boundary Solution",
      location: "Raglan",
      duration: "2 days",
      description: "Complete boundary fence replacement for suburban property with matching gates.",
      beforeImage: stockImage2,
      afterImage: stockImage3,
      features: ["1.8m height", "Treated pine", "Pedestrian gate", "Neighborly design"]
    },
    {
      id: 21,
      type: "vinyl",
      title: "Weatherproof Privacy Fence",
      location: "Te Kowhai",
      duration: "2 days",
      description: "Weather-resistant vinyl fencing solution providing privacy and low maintenance.",
      beforeImage: stockImage3,
      afterImage: stockImage3,
      features: ["1.8m height", "UV stable", "No painting", "Wind resistant"]
    },
    {
      id: 22,
      type: "timber",
      title: "Heritage Property Fence",
      location: "Matangi",
      duration: "3 days",
      description: "Sympathetic fencing solution for heritage property maintaining character while ensuring security.",
      beforeImage: stockImage1,
      afterImage: stockImage1,
      features: ["1.5m height", "Heritage style", "Custom details", "Period appropriate"]
    }
  ];

  const fenceTypes = [
    { value: "all", label: "All Projects" },
    { value: "timber", label: "Timber" },
    { value: "aluminum", label: "Aluminum" },
    { value: "vinyl", label: "Vinyl/PVC" },
    { value: "rural", label: "Rural" }
  ];

  const filteredProjects = selectedType === "all" 
    ? projects 
    : projects.filter(p => p.type === selectedType);

  const openLightbox = (project: Project, imageIndex: number) => {
    setSelectedProject(project);
    setCurrentImageIndex(imageIndex);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 2);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + 2) % 2);
  };

  return (
    <section id="portfolio" className="py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/40 to-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-red-900/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Our Work</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Recent <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Projects Gallery</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every fence tells a story. Browse our recent installations across Hamilton and Waikato - 
            all completed by our dedicated team, no subcontractors.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {fenceTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              onClick={() => setSelectedType(type.value)}
              data-testid={`button-filter-${type.value}`}
            >
              {type.label}
              {type.value !== "all" && (
                <Badge variant="secondary" className="ml-2">
                  {projects.filter(p => p.type === type.value).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="group overflow-hidden bg-black/60 backdrop-blur-sm border-orange-950/30 hover-elevate active-elevate-2"
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.afterImage} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => openLightbox(project, 1)}
                />
                <Badge 
                  className="absolute top-2 right-2"
                  variant="secondary"
                >
                  After
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm">Click to view details</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{project.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>{project.location}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3" />
                  <span>{project.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {project.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedProject && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedProject(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <img 
                    src={currentImageIndex === 0 ? selectedProject.beforeImage : selectedProject.afterImage}
                    alt={currentImageIndex === 0 ? "Before" : "After"}
                    className="w-full h-[400px] object-cover"
                  />
                  <Badge className="absolute top-4 left-4">
                    {currentImageIndex === 0 ? "Before" : "After"}
                  </Badge>
                  
                  {/* Navigation */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedProject.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {selectedProject.type.charAt(0).toUpperCase() + selectedProject.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}