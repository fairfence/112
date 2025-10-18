import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Phone } from "lucide-react";

// No images used here - using gradients instead to avoid duplicates

export default function FAQ() {
  const faqs = [
    {
      question: "How long does a typical fence installation take?",
      answer: "Most residential fences are completed within 1-3 days, depending on the length and type. We'll give you an exact timeline during your free site visit. Our small team works efficiently - we don't drag jobs out like the big companies."
    },
    {
      question: "Do I need council consent for my fence?",
      answer: "Fences under 2.5m generally don't need consent in most areas, but there are exceptions for corner properties, heritage areas, and pool fencing. We handle all consent requirements and advise you during the quote process. Pool fences always need inspection."
    },
    {
      question: "What's your payment process?",
      answer: "We'll discuss payment terms during your quote. We accept bank transfer, credit card, or cash. Our goal is to ensure you're completely happy with the finished fence."
    },
    {
      question: "How do you handle Waikato's clay soil?",
      answer: "We have extensive experience dealing with Waikato's clay soil. We use longer posts, proper drainage techniques, and allow for ground movement. Our expertise ensures we know how to prevent leaning and sinking."
    },
    {
      question: "What warranty do you provide?",
      answer: "We provide a workmanship warranty on all installations, plus manufacturer warranties on materials. We're local - if anything needs attention, we're just a phone call away. Contact us for specific warranty details."
    },
    {
      question: "Can you match my neighbor's fence?",
      answer: "Absolutely! We can match existing fence styles, heights, and colors. During the site visit, we'll assess your neighbor's fence and ensure perfect alignment. We often do both sides of shared boundaries."
    },
    {
      question: "Do you remove old fences?",
      answer: "Yes, we handle complete removal and disposal of your old fence. This is included in our quote - no hidden surprises. We leave your property tidy, removing all debris on the same day."
    },
    {
      question: "What happens if it rains during installation?",
      answer: "Light rain doesn't stop us - we're Kiwis! Heavy rain may delay concreting, but we'll communicate any weather delays immediately. We plan around forecasts and have covered most weather scenarios."
    },
    {
      question: "How deep do you set the posts?",
      answer: "Standard depth is 600-900mm depending on fence height and soil conditions. Corner and gate posts go deeper (up to 1m). We never cut corners on post depth - it's the foundation of a lasting fence."
    },
    {
      question: "Can you install fences on slopes?",
      answer: "Yes, we're experts at sloped installations. We can step the fence, rake it (angle following slope), or combine both methods. We'll recommend the best approach for your property's gradient and aesthetic preferences."
    },
    {
      question: "What maintenance will my fence need?",
      answer: "Depends on material: Timber needs staining every 3-5 years, aluminum just needs occasional washing, vinyl/PVC is virtually maintenance-free. We provide detailed care instructions and are always available for maintenance advice."
    },
    {
      question: "Do you offer finance or payment plans?",
      answer: "We can arrange payment plans for larger projects. We also accept credit cards which you can use for your own payment terms. Talk to us about your needs - we're a small local business and understand budgets."
    },
    {
      question: "Are you really cheaper than the big companies?",
      answer: "Yes! We have lower overheads (no fancy offices or fleet of salespeople), use our buying power wisely, and don't subcontract. You get better value because you're paying for quality work, not corporate overhead."
    },
    {
      question: "What areas do you service?",
      answer: "All of Ohaupo and surrounding areas within 30km - including Cambridge, Te Awamutu, Morrinsville, Ngaruawahia, Huntly, and rural properties. Free quotes within this area, small travel charge may apply beyond."
    },
    {
      question: "How soon can you start?",
      answer: "Typically within 1-2 weeks of approval, sometimes sooner. We keep our schedule flexible for urgent jobs (storm damage, security concerns). During busy season (Oct-Mar) booking 2-3 weeks ahead is recommended."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-20 bg-gradient-to-b from-black via-orange-900/30 to-black relative overflow-hidden">
      {/* Decorative Elements with Fence Images */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-red-900/20 to-transparent rounded-full blur-3xl" />
        {/* Gradient patterns instead of duplicate images */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48">
          <div className="w-full h-full bg-gradient-to-br from-orange-900/10 via-red-900/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">
            <HelpCircle className="h-3 w-3 mr-1" />
            FAQs
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Common <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Questions Answered</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about getting your new fence. Can't find your answer? 
            Just give us a call - we're always happy to chat.
          </p>
        </div>

        <Card className="bg-black/60 backdrop-blur-sm border-orange-950/30 overflow-hidden">
          {/* Header gradient instead of duplicate image */}
          <div className="relative h-32 overflow-hidden bg-gradient-to-br from-orange-900/80 via-red-900/60 to-black/80">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
            </div>
          </div>
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-orange-950/30">
                  <AccordionTrigger 
                    className="px-6 hover:no-underline hover:bg-orange-900/10"
                    data-testid={`accordion-trigger-${index}`}
                  >
                    <span className="text-left pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-sm border-orange-950/30">
          <CardHeader>
            <CardTitle className="text-center">Still Have Questions?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Our friendly team is here to help. No question is too small - we'd rather you ask than wonder!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="secondary" className="px-6 py-3 text-base">
                <Phone className="h-4 w-4 mr-2" />
                Text: 021 0835 8914
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Response within 2 hours during business hours
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}