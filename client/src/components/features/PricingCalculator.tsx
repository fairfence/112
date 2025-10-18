import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Info, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import BookingModal from "../forms/BookingModal";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

// Type definitions for the pricing API response
interface PricingRow {
  id: string;
  servicetype: string;
  code: string;
  name: string;
  height: number;
  spansize: number;
  panelcost: number;
  perlm: number | null;
  labourperpanel: number;
  labourperm: number | null;
  totalperpanel: number;
  totallmincgst: number;
  created_at: string;
}

interface FenceTypeData {
  [key: string]: number | boolean | string | undefined;
  perMeter?: boolean;
  description?: string;
  materials?: string;
}

interface PricingData {
  [fenceType: string]: FenceTypeData;
}

interface ApiResponse {
  success: boolean;
  data: {
    tables: Array<{ table_name: string; table_schema: string; }>;
    data: {
      pricing: PricingRow[];
    };
    fallback?: boolean;
    pricing?: PricingData;
  };
  cached?: boolean;
}

interface PricingCalculatorProps {
  onQuoteRequest?: (data: any) => void;
  className?: string;
}

export default function PricingCalculator({ onQuoteRequest, className }: PricingCalculatorProps) {
  const [serviceType, setServiceType] = useState("");
  const [fenceStyle, setFenceStyle] = useState("");
  const [length, setLength] = useState("");
  const [estimate, setEstimate] = useState<number | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  // Fetch pricing from API
  const { data: pricingData, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['/api/pricing'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2
  });

  // Extract pricing from API response
  const databasePricing = pricingData?.data?.data?.pricing || [];
  const fallbackPricing = pricingData?.data?.pricing || {};
  const usingFallback = pricingData?.data?.fallback === true;
  const isDataFromDatabase = !usingFallback && databasePricing.length > 0;
  
  // Process database pricing into grouped structure
  const groupedPricing = databasePricing.reduce((acc: Record<string, PricingRow[]>, row: PricingRow) => {
    if (!acc[row.servicetype]) {
      acc[row.servicetype] = [];
    }
    acc[row.servicetype].push(row);
    return acc;
  }, {});
  
  // Get available service types
  const serviceTypes = Object.keys(groupedPricing);
  
  // Get available styles for selected service type
  const availableStyles = serviceType ? groupedPricing[serviceType] || [] : [];
  
  // Get selected pricing row
  const selectedPricingRow = availableStyles.find(row => `${row.name}-${row.height}m` === fenceStyle);

  const calculateEstimate = () => {
    if (!serviceType || !length) return;
    if (isDataFromDatabase && !fenceStyle) return;
    
    const lengthNum = parseFloat(length);
    let total = 0;
    
    if (isDataFromDatabase && selectedPricingRow) {
      // Use actual database pricing
      const pricePerMeter = selectedPricingRow.totallmincgst;
      if (!pricePerMeter || !isFinite(pricePerMeter)) {
        console.error('Invalid pricing data:', selectedPricingRow);
        return;
      }
      total = lengthNum * pricePerMeter;
      console.log('Using database pricing:', selectedPricingRow);
    } else if (usingFallback) {
      // Fallback to legacy pricing structure if needed
      const fenceData = fallbackPricing[serviceType.toLowerCase()];
      const heightStr = "1.8"; // Default height for fallback
      const pricePerMeter = (fenceData && typeof fenceData[heightStr] === 'number') ? fenceData[heightStr] : 150;
      total = lengthNum * pricePerMeter;
      console.log('Using fallback pricing');
    }
    
    setEstimate(total);
    console.log('Estimate calculated:', total);
    console.log('Using database pricing:', isDataFromDatabase);
    console.log('Using fallback pricing:', usingFallback);
    
    // Show booking modal after 2 seconds when estimate is calculated
    setTimeout(() => {
      setShowBooking(true);
    }, 2000);
  };

  const handleQuoteRequest = () => {
    const data = { 
      serviceType, 
      fenceStyle, 
      length, 
      height: selectedPricingRow?.height, 
      estimate,
      pricingDetails: selectedPricingRow
    };
    if (onQuoteRequest) {
      onQuoteRequest(data);
    } else {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    console.log('Quote request:', data);
  };
  
  // Reset fence style when service type changes
  const handleServiceTypeChange = (value: string) => {
    setServiceType(value);
    setFenceStyle("");
    setEstimate(null);
  };

  return (
    <section id="pricing" className={cn("py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/40 to-black relative", className)}>
      {/* Tiger Stripe Accents */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-orange-900/20 to-black" />
        <div className="absolute top-20 left-0 w-full h-24 bg-gradient-to-r from-transparent via-orange-800/30 to-transparent transform rotate-2" />
        <div className="absolute bottom-32 left-0 w-full h-20 bg-gradient-to-r from-transparent via-red-900/20 to-transparent transform -rotate-1" />
      </div>
      <div className="relative z-10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-4">Quick Calculator</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get an Instant Estimate
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, transparent pricing. Get a rough estimate in seconds - final quotes may vary based on site conditions
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Fence Cost Calculator
              </CardTitle>
              <CardDescription>
                Enter your basic requirements for an instant estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Show loading state while fetching pricing */}
              {isLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
              
              {/* Show data source info */}
              {!isLoading && (databasePricing.length > 0 || Object.keys(fallbackPricing).length > 0) && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {isDataFromDatabase ? `Using live database pricing (${databasePricing.length} options)` : "Using standard pricing"}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="service-type">Service Type</Label>
                <Select value={serviceType} onValueChange={handleServiceTypeChange}>
                  <SelectTrigger id="service-type" data-testid="select-service-type">
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] max-h-[300px]">
                    {isDataFromDatabase ? (
                      serviceTypes.map((type) => (
                        <SelectItem key={type} value={type} data-testid={`option-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                          {type}
                        </SelectItem>
                      ))
                    ) : (
                      // Fallback options when database is not available
                      <>
                        <SelectItem value="timber" data-testid="option-timber">Timber Fencing</SelectItem>
                        <SelectItem value="aluminum" data-testid="option-aluminum">Aluminum Fencing</SelectItem>
                        <SelectItem value="pvc" data-testid="option-pvc">PVC/Vinyl Fencing</SelectItem>
                        <SelectItem value="rural" data-testid="option-rural">Rural Fencing</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Fence Style Selection - only show when service type is selected */}
              {serviceType && isDataFromDatabase && availableStyles.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="fence-style">Fence Style</Label>
                  <Select value={fenceStyle} onValueChange={setFenceStyle}>
                    <SelectTrigger id="fence-style" data-testid="select-fence-style">
                      <SelectValue placeholder="Select fence style & height" />
                    </SelectTrigger>
                    <SelectContent className="z-[200] max-h-[400px]">
                      {availableStyles.map((style) => {
                        const styleKey = `${style.name}-${style.height}m`;
                        return (
                          <SelectItem key={style.id} value={styleKey} data-testid={`option-${style.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                            {style.name} ({style.height}m) - ${style.totallmincgst}/m
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="length">Fence Length (meters)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="e.g., 25"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  data-testid="input-length"
                />
              </div>


              <div className="flex gap-3">
                <Button 
                  onClick={calculateEstimate}
                  className="flex-1"
                  disabled={!serviceType || !length || isLoading || (isDataFromDatabase && !fenceStyle)}
                  data-testid="button-calculate"
                >
                  Calculate Estimate
                </Button>
              </div>

              {estimate !== null && (
                <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/30 transform hover:scale-105 transition-all">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Fair Price Estimate</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse" data-testid="text-estimate">
                        ${estimate.toLocaleString('en-NZ')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                        <Info className="h-3 w-3" />
                        Fair pricing guaranteed • GST included
                      </p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500" 
                        onClick={() => setShowBooking(true)}
                        data-testid="button-schedule-visit"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-orange-500/50" 
                        onClick={handleQuoteRequest}
                        data-testid="button-get-exact-quote"
                      >
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Estimates are indicative only
                </p>
                <p>• Final pricing depends on site conditions</p>
                <p>• Includes materials and installation</p>
                <p>• Free on-site quotes available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
      
      {/* Booking Modal */}
      <BookingModal 
        isOpen={showBooking} 
        onClose={() => setShowBooking(false)}
        estimate={estimate || undefined}
      />
    </section>
  );
}