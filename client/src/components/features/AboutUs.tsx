import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles,
  Shield,
  Users,
  Heart
} from "lucide-react";

// Import fence images for visual richness
import vinylFenceImage from "@assets/fencing/vinyl-pvc-fence.webp";
import aboutImage from "@assets/IMG_0874_1758784125349.jpeg";
import galleryImage1 from "@assets/IMG_0457_1758784382482.jpeg";
import galleryImage2 from "@assets/IMG_0456_1758784382482.jpeg";

export default function AboutUs() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/30 to-black relative overflow-hidden">
      {/* Decorative Elements - using gradients instead of duplicate images */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-900/20 to-transparent rounded-full blur-3xl" />
        {/* Gradient patterns instead of images */}
        <div className="absolute top-20 left-0 w-64 h-48 bg-gradient-to-br from-orange-900/10 to-transparent rounded-xl" />
        <div className="absolute bottom-20 right-0 w-72 h-56 bg-gradient-to-tl from-red-900/10 to-transparent rounded-xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4 animate-pulse">About Us</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Where <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Fairness and Quality</span> Intersect
          </h2>
          <p className="text-lg text-muted-foreground">
            Welcome to Fairfence Contracting Waikato, a company that's built on the pillars of fairness and exceptional quality. Our commitment is to deliver fencing solutions that not only meet your needs but also uphold the values that are dear to us and our community here in New Zealand.
          </p>
        </div>

        {/* Main content grid with images */}
        <div className="space-y-12">
          {/* Guided by Fairness */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30 overflow-hidden">
              <div className="relative h-64 lg:h-96">
                <img 
                  src={vinylFenceImage} 
                  alt="Quality fencing work" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            </Card>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Guided by Fairness</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At Fairfence, fairness isn't just a part of our name; it's our foundational principle. We ensure transparency in our communications, fairness in our pricing, and integrity in our services. Our aim is to make you feel confident and content with every aspect of our partnership.
              </p>
            </div>
          </div>

          {/* Committed to Quality */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Committed to Quality</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Our dedication to quality extends beyond the materials we use and the fences we build. It's about providing a service experience that is seamless, responsive, and tailored to your specific needs. We pride ourselves on our meticulous approach and the expertise of our team, ensuring that every project is synonymous with excellence.
              </p>
            </div>
            <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30 overflow-hidden order-1 lg:order-2">
              <div className="relative h-64 lg:h-96">
                <img 
                  src={aboutImage} 
                  alt="FairFence quality fencing work" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            </Card>
          </div>

          {/* Embark on Your Journey */}
          <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30 overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Embark on Your Journey with Us</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Discover what makes Fairfence a trusted name in fencing. Whether you're at the planning stage or ready to initiate your project, we're here to offer the support and expertise you need. With Fairfence, you're not just choosing a fencing provider; you're opting for a partner who values your peace of mind as much as the final outcome.
                </p>
                
                {/* Project gallery */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
                  <div className="relative h-32 md:h-40 rounded-lg overflow-hidden">
                    <img 
                      src={galleryImage1} 
                      alt="FairFence project" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="relative h-32 md:h-40 rounded-lg overflow-hidden col-span-2">
                    <img 
                      src={galleryImage2} 
                      alt="FairFence quality work" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reach Out */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Reach Out to Fairfence Contracting Waikato</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
              Curious to learn more or ready to discuss your project? We're eager to connect with you. At Fairfence, we're dedicated to fostering enduring relationships based on mutual respect and shared values. Together, let's create spaces that are secure, beautiful, and thoughtfully constructed.
            </p>
            
            <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-sm border-orange-950/30 inline-block">
              <CardContent className="p-8">
                <p className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Fairfence Contracting Waikato
                </p>
                <p className="text-lg text-muted-foreground">
                  Building More Than Fences, Building Trust.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}