import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Table, RefreshCw, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import DatabaseSetup from "@/components/DatabaseSetup";
import { PricingDataTable } from "@/components/admin/PricingDataTable";

interface TableInfo {
  table_name: string;
  table_schema: string;
}

interface SystemStatus {
  initialized: boolean;
  needsSetup: boolean;
  message: string;
}

export default function DatabaseManager() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch system status
  const { data: systemStatus, isLoading: statusLoading } = useQuery<SystemStatus>({
    queryKey: ['/api/system-status'],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch database tables
  const { data: tablesData, isLoading: tablesLoading, refetch: refetchTables } = useQuery<{success: boolean; tables: TableInfo[]}>({
    queryKey: ['/api/db/tables'],
    enabled: !!user && systemStatus?.initialized,
  });

  // Fetch pricing data status
  const { data: pricingData, isLoading: pricingLoading } = useQuery<{success: boolean; data: any}>({
    queryKey: ['/api/pricing'],
    enabled: !!user,
  });

  const tables = tablesData?.tables || [];
  const isSystemInitialized = systemStatus?.initialized || false;

  const stats = [
    {
      title: "System Status",
      value: isSystemInitialized ? "Initialized" : "Setup Required",
      description: systemStatus?.message || "Checking...",
      icon: isSystemInitialized ? CheckCircle : AlertTriangle,
      color: isSystemInitialized ? "text-green-600" : "text-yellow-600"
    },
    {
      title: "Database Tables",
      value: tables.length,
      description: "Available tables",
      icon: Table,
      color: "text-blue-600"
    },
    {
      title: "Pricing Data",
      value: pricingData?.data?.data?.pricing?.length || 0,
      description: "Pricing records",
      icon: Activity,
      color: "text-purple-600"
    },
  ];

  return (
    <AdminLayout 
      title="Database Manager" 
      subtitle="Monitor and manage database operations"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status Alert */}
        {!isSystemInitialized && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Database Setup Required</p>
                  <p className="text-sm text-muted-foreground">
                    Your database needs to be set up before you can manage content.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Data</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Connection Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge variant={isSystemInitialized ? "default" : "secondary"}>
                        {isSystemInitialized ? "Connected" : "Setup Required"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tables</span>
                      <Badge variant="secondary">
                        {tables.length} found
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pricing Data</span>
                      <Badge variant={pricingData?.success ? "default" : "outline"}>
                        {pricingData?.success ? "Available" : "Loading..."}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => refetchTables()}
                    disabled={tablesLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Tables
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("setup")}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Database Setup
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <PricingDataTable />
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Table className="h-5 w-5" />
                    Database Tables
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchTables()}
                    disabled={tablesLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardTitle>
                <CardDescription>
                  Available tables in your database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: "quotes", description: "Customer quote requests and project details" },
                    { name: "pricing", description: "Fence pricing data by type and height" },
                    { name: "profiles", description: "User profile information" },
                    { name: "users", description: "System user accounts" },
                    { name: "user_roles", description: "User permissions and roles" },
                    { name: "user_invitations", description: "Pending user invitations" },
                    { name: "company_details", description: "Business information and settings" },
                    { name: "quote_templates", description: "Reusable quote templates" }
                  ].map((table) => (
                    <div
                      key={table.name}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Table className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{table.name}</p>
                          <p className="text-sm text-muted-foreground">{table.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}