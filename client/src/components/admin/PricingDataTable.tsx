import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { DataTable, DataTableColumn } from "./DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Ruler, Calendar } from "lucide-react";

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

interface PricingApiResponse {
  success: boolean;
  data: {
    data: {
      pricing: PricingRow[];
    };
    fallback?: boolean;
  };
}

export function PricingDataTable() {
  const { user } = useAuth();

  // Fetch pricing data
  const { data: pricingData, isLoading } = useQuery<PricingApiResponse>({
    queryKey: ['/api/pricing'],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const pricingRows = pricingData?.data?.data?.pricing || [];
  const isUsingFallback = pricingData?.data?.fallback === true;

  // Data table columns
  const columns: DataTableColumn<PricingRow>[] = [
    {
      key: "servicetype",
      label: "Service Type",
      sortable: true,
      description: "Type of fencing service offered",
      render: (servicetype) => (
        <Badge variant="outline" className="text-xs">
          {servicetype}
        </Badge>
      ),
    },
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      description: "Specific product or fence style name",
      render: (name) => (
        <div className="max-w-md">
          <p className="font-medium text-sm">{name}</p>
        </div>
      ),
    },
    {
      key: "height",
      label: "Height",
      sortable: true,
      description: "Fence height in meters",
      render: (height) => (
        <div className="flex items-center gap-1">
          <Ruler className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{height}m</span>
        </div>
      ),
    },
    {
      key: "totallmincgst",
      label: "Price/Meter",
      sortable: true,
      description: "Total price per linear meter including GST",
      render: (price) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-green-600" />
          <span className="font-medium">${price}/m</span>
        </div>
      ),
    },
    {
      key: "totalperpanel",
      label: "Price/Panel",
      sortable: true,
      description: "Total price per panel including materials and labor",
      render: (price) => (
        <div className="flex items-center gap-1">
          <Package className="h-3 w-3 text-blue-600" />
          <span className="text-sm">${price}</span>
        </div>
      ),
    },
    {
      key: "code",
      label: "Code",
      description: "Internal product code for reference",
      render: (code) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {code}
        </code>
      ),
    },
    {
      key: "created_at",
      label: "Added",
      sortable: true,
      description: "Date when this pricing was added to the system",
      render: (created_at) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: "Total Products",
      value: pricingRows.length,
      description: "Available pricing options",
    },
    {
      title: "Service Types",
      value: new Set(pricingRows.map(row => row.servicetype)).size,
      description: "Unique fence types",
    },
    {
      title: "Price Range",
      value: pricingRows.length > 0 
        ? `$${Math.min(...pricingRows.map(r => r.totallmincgst))} - $${Math.max(...pricingRows.map(r => r.totallmincgst))}`
        : "N/A",
      description: "Per meter pricing range",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {isUsingFallback && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Using Fallback Pricing</p>
                <p className="text-sm text-muted-foreground">
                  Database pricing not available. Showing default pricing structure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pricing Data Table */}
      <DataTable
        data={pricingRows}
        columns={columns}
        loading={isLoading}
        searchable
        title="Pricing Database"
        description="Current pricing data from your database"
        emptyMessage="No pricing data found. Check your database connection."
        caption="Pricing data table showing fence types, heights, and costs per meter"
        ariaLabel="Pricing data table with fence types, dimensions, and pricing information"
      />
    </div>
  );
}