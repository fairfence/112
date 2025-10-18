import Navigation from "@/components/layout/Navigation";
import Hero from "@/components/layout/Hero";
import Footer from "@/components/layout/Footer";
import StatisticsBar from "@/components/features/StatisticsBar";
import AboutUs from "@/components/features/AboutUs";
import ProcessTimeline from "@/components/features/ProcessTimeline";
import Services from "@/components/features/Services";
import Testimonials from "@/components/features/Testimonials";
import PricingCalculator from "@/components/features/PricingCalculator";
import FAQ from "@/components/features/FAQ";
import ServiceAreas from "@/components/features/ServiceAreas";
import Portfolio from "@/components/features/Portfolio";
import Contact from "@/components/forms/Contact";
import RequestQuote from "@/components/forms/RequestQuote";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <StatisticsBar variant="inline" />
        <AboutUs />
        <ProcessTimeline />
        <Services />
        <Testimonials />
        <PricingCalculator />
        <RequestQuote />
        <FAQ />
        <ServiceAreas />
        <Contact />
      </main>
      <Footer />
      {/* Floating Statistics Bar */}
      <StatisticsBar variant="floating" />
    </div>
  );
}