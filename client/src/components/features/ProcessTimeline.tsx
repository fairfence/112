import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  FileText,
  Wrench,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

import coloursteelImage from "@assets/fencing/coloursteel-aluminium.jpg";
import exposedPostImage from "@assets/fencing/exposed-post-paling.jpeg";
import timberFenceImage from "@assets/fencing/timber-fence.jpeg";
import timberGateImage from "@assets/fencing/timber-fence-gate.jpeg";
import aluminiumGateImage from "@assets/fencing/aluminium-fence-gate.jpg";

export default function ProcessTimeline() {
  const steps = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Initial Contact",
      description: "Call or text us for a quick chat about your project. We'll answer your questions and arrange a convenient site visit time.",
      timeframe: "Same day response",
      details: ["Free consultation", "Project discussion", "Rough estimate"],
      image: timberGateImage,
      imagePosition: "top"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Free Site Visit",
      description: "We'll visit your property to measure, assess ground conditions, and discuss your exact requirements - no obligation.",
      timeframe: "Within 2-3 days",
      details: ["Accurate measurements", "Ground assessment", "Design options"],
      image: coloursteelImage,
      imagePosition: "left"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Custom Quote",
      description: "Receive a detailed, transparent quote with no hidden costs. We'll explain every item and answer any questions.",
      timeframe: "Within 24 hours",
      details: ["Itemized pricing", "Material options", "Timeline included"],
      image: exposedPostImage,
      imagePosition: "right"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Professional Installation",
      description: "Our same small team handles your entire installation from start to finish - no subcontractors, just us.",
      timeframe: "1-3 days typical",
      details: ["Same team throughout", "Daily progress updates", "Site left tidy"],
      image: timberFenceImage,
      imagePosition: "left"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Final Inspection",
      description: "We walk through the completed fence with you, ensure you're 100% happy, and provide warranty documentation.",
      timeframe: "Completion day",
      details: ["Quality check", "2-year warranty", "Maintenance tips"],
      image: aluminiumGateImage,
      imagePosition: "featured"
    }
  ];

  return (
    <section id="process" className="py-16 sm:py-20 bg-gradient-to-b from-black via-orange-900/40 to-black relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-0 w-full h-24 bg-gradient-to-r from-transparent via-orange-800/30 to-transparent transform rotate-1" />
        <div className="absolute bottom-32 left-0 w-full h-20 bg-gradient-to-r from-transparent via-red-900/20 to-transparent transform -rotate-2" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            From First Call to <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Perfect Fence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our streamlined 5-step process ensures your fencing project runs smoothly from start to finish. 
            The same team handles everything - no confusion, no delays.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 via-red-500 to-orange-500 opacity-30" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              const isFeatured = step.imagePosition === "featured";

              return (
                <div key={index} className="relative">
                  {/* Mobile Connection */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-8 top-24 w-0.5 h-24 bg-gradient-to-b from-orange-500 to-red-500 opacity-30" />
                  )}

                  {isFeatured ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative z-10 mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-2xl ring-4 ring-orange-500/20">
                          {step.icon}
                        </div>
                      </div>

                      <Card className="w-full max-w-4xl bg-black/60 backdrop-blur-sm border-orange-950/30 hover:border-orange-800/50 transition-all duration-500 overflow-hidden group">
                        <div className="relative h-64 sm:h-80 overflow-hidden">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-center gap-4 mb-3">
                              <Badge variant="secondary" className="text-base px-4 py-1.5">
                                Step {index + 1}
                              </Badge>
                              <Badge className="bg-orange-600/90 text-base px-4 py-1.5">
                                {step.timeframe}
                              </Badge>
                            </div>
                            <h3 className="text-3xl font-bold mb-3">{step.title}</h3>
                          </div>
                        </div>

                        <CardContent className="p-8">
                          <p className="text-lg text-muted-foreground mb-6">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap gap-4 justify-center">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-orange-950/30 rounded-lg border border-orange-900/30">
                                <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
                                <span className="text-sm font-medium">{detail}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className={`flex flex-col lg:flex-row items-center gap-8 ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}>
                      {/* Content Card */}
                      <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                        <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30 hover:border-orange-800/50 hover:shadow-2xl hover:shadow-orange-900/20 transition-all duration-500 overflow-hidden group">
                          <div className="flex flex-col lg:flex-row">
                            {step.imagePosition === "left" && (
                              <div className="lg:w-2/5 h-48 lg:h-auto relative overflow-hidden">
                                <img
                                  src={step.image}
                                  alt={step.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 to-transparent" />
                                <div className="absolute top-4 left-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-80">
                                    {step.icon}
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.imagePosition === "top" && (
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={step.image}
                                  alt={step.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-orange-600/90 text-sm px-3 py-1">
                                    {step.timeframe}
                                  </Badge>
                                </div>
                              </div>
                            )}

                            <div className="flex-1">
                              <CardContent className="p-6 lg:p-8">
                                <div className="flex items-center gap-3 mb-3">
                                  <Badge variant="secondary" className="text-sm">
                                    Step {index + 1}
                                  </Badge>
                                  {step.imagePosition !== "top" && (
                                    <Badge className="bg-orange-600/90 text-sm">
                                      {step.timeframe}
                                    </Badge>
                                  )}
                                </div>

                                <h3 className="text-2xl font-bold mb-3">
                                  {step.title}
                                </h3>

                                <p className="text-muted-foreground mb-5 leading-relaxed">
                                  {step.description}
                                </p>

                                <div className={`flex flex-col gap-2.5 ${
                                  isEven ? 'lg:items-end' : 'lg:items-start'
                                }`}>
                                  {step.details.map((detail, idx) => (
                                    <div key={idx} className="flex items-center gap-2.5 text-sm bg-orange-950/20 px-3 py-2 rounded-md border border-orange-900/20">
                                      <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
                                      <span className="font-medium">{detail}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </div>

                            {step.imagePosition === "right" && (
                              <div className="lg:w-2/5 h-48 lg:h-auto relative overflow-hidden order-first lg:order-last">
                                <img
                                  src={step.image}
                                  alt={step.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-bl from-orange-900/40 to-transparent" />
                                <div className="absolute top-4 right-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-80">
                                    {step.icon}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      </div>

                      {/* Icon Circle - Only for non-featured */}
                      <div className="relative z-10 hidden lg:block">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-orange-500/10">
                          {step.icon}
                        </div>
                        {index < steps.length - 1 && (
                          <ArrowRight className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 h-6 w-6 text-orange-500 opacity-50 animate-pulse" />
                        )}
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 hidden lg:block" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-sm border-orange-950/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-3">Ready to Start Your Project?</h3>
              <p className="text-muted-foreground mb-6">
                Most fences are completed within a week from approval. Get your free quote today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:02108358914" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25"
                  data-testid="button-call"
                >
                  <Phone className="h-5 w-5 animate-pulse" />
                  <span>021 0835 8914</span>
                </a>
                <Badge variant="outline" className="px-4 py-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  Free quotes within 30km
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}