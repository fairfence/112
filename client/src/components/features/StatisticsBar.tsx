import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Star,
  Shield,
  Clock
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix?: string;
}

interface StatisticsBarProps {
  variant?: "floating" | "inline";
}

export default function StatisticsBar({ variant = "inline" }: StatisticsBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { getContent } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      if (variant === "floating") {
        const scrollY = window.scrollY;
        setIsVisible(scrollY > 500);
      }
    };

    if (variant === "floating") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  const stats: Stat[] = [
    {
      icon: <Clock className="h-5 w-5" />,
      value: "5",
      suffix: "",
      label: "Years Experience"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      value: "500",
      suffix: "+",
      label: "Fences Built"
    },
    {
      icon: <Star className="h-5 w-5" />,
      value: getContent('business', 'rating_google', '5.0'),
      suffix: "★",
      label: "Google Rating"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      value: "2",
      suffix: " Year",
      label: "Warranty"
    }
  ];

  if (variant === "floating") {
    return (
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        data-testid="statistics-bar-floating"
      >
        <div className="bg-gradient-to-r from-black via-orange-950/95 to-black backdrop-blur-md border-t border-orange-950/30">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-center gap-3"
                  data-testid={`stat-floating-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="text-primary">{stat.icon}</div>
                  <div>
                    <div className="text-xl font-bold">
                      {stat.value}
                      <span className="text-primary">{stat.suffix}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-to-r from-black via-orange-950/50 to-black">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-black/60 backdrop-blur-sm border-orange-950/30 hover-elevate active-elevate-2"
              data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full text-primary mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">
                  {stat.value}
                  <span className="text-primary animate-pulse">{stat.suffix}</span>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Fully Insured
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            <Star className="h-3 w-3 mr-1" />
            {getContent('business', 'review_count_google', '87')} Google Reviews
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Family Owned Since 2019
          </Badge>
        </div>
      </div>
    </div>
  );
}