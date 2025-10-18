import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteContent } from "@/hooks/useSiteContent";

// No fence images needed - using gradients instead to avoid duplicates

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  source: string;
}

export default function Testimonials() {
  const { getContent } = useSiteContent();

  const testimonials: Testimonial[] = [
    {
      name: "Bernadette Morton",
      location: "Hamilton East",
      rating: 5,
      text: "Alex and his team have recently done a retaining wall and a fence for us. They were quick and efficient and did a perfect job at a reasonable cost. We are very happy with the end result. They took great care making sure they did not damage the neighbours plants. We can unreservedly recommend FairFence Limited.",
      date: "9 months ago",
      source: "Google"
    },
    {
      name: "Robbie Hogan",
      location: "Hamilton",
      rating: 5,
      text: "Great Team Excellent Quality and workman's ship. Easy to talk with Very quick and efficient Highly recommend",
      date: "7 months ago",
      source: "Google"
    },
    {
      name: "boris bychkov",
      location: "Hamilton",
      rating: 5,
      text: "Very good guys highly recommend fairfence Ltd we love our fence thank you so much guys see yous soon A++++",
      date: "1 year ago",
      source: "Google"
    },
    {
      name: "Erin Roper",
      location: "Hamilton",
      rating: 5,
      text: "Alex has just done a big job for me which looks great,he goes out of his way to help with the end result. Highly recommended.",
      date: "9 months ago",
      source: "Google"
    },
    {
      name: "Heather Makin",
      location: "Hamilton",
      rating: 5,
      text: "Alex and the team were fast and efficient re-building our boundary fence, they kept us informed on progress and left the area tidy. Competitive and fair price. We would recommend them.",
      date: "10 months ago",
      source: "Google"
    },
    {
      name: "Customer",
      location: "Enderley, Hamilton",
      rating: 5,
      text: "Totally recommend Alex for your fencing needs. He works fast and accurate, without an overinflated quote. I got a quality job done that didn't cost me an arm and a leg. Fairfence indeed ! you can't go wrong with choosing this contractor. This is the kind of honest tradesman I can respect.",
      date: "Feb 2025",
      source: "BuildersCrack"
    },
    {
      name: "Customer",
      location: "Cambridge, Waipa",
      rating: 5,
      text: "Great effort Alex, thanks for your prompt response and excellent communication. Stuck to your word and delivered.... cheers!",
      date: "Mar 2025",
      source: "BuildersCrack"
    },
    {
      name: "tonu fleetclean",
      location: "Hamilton",
      rating: 5,
      text: "Great communication, great workmanship, and great pricing. Thank Alex,",
      date: "1 year ago",
      source: "Google"
    }
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/30 to-black relative">
      {/* Background decorative gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-orange-900/10 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-red-900/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
      </div>
      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-semibold" data-testid="text-rating">{getContent('business', 'rating_google', '5.0')}</span>
              <Star className="h-5 w-5 fill-primary text-primary" />
            </div>
            <Badge variant="secondary" data-testid="badge-review-count">{getContent('business', 'review_count_google', '87')} Reviews</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate bg-black/60 backdrop-blur-sm border-orange-950/30" data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <Badge variant="outline" className="text-xs">
                    {testimonial.source}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4 line-clamp-4">
                  "{testimonial.text}"
                </p>
                <div className="pt-4 border-t">
                  <p className="font-semibold text-sm" data-testid={`text-reviewer-${index}`}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location} • {testimonial.date}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            See all our reviews on
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline"
              onClick={() => window.open('https://www.google.com/search?q=FairFence+Contracting+Waikato', '_blank')}
              data-testid="button-google-reviews"
            >
              Google Reviews
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open('https://builderscrack.co.nz/tradies/2ng7u4bg/fairfence-contracting-waikato', '_blank')}
              data-testid="button-builderscrack"
            >
              BuildersCrack
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}