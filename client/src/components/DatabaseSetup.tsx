// FILEPATH: client/src/components/DatabaseSetup.tsx
// Database setup component for FairFence admin interface
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Database, Copy, RefreshCw, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SqlResult {
  success: boolean;
  setupSQL?: string;
  checkSQL?: string;
  instructions?: string;
  error?: string;
}

interface TableStatus {
  success: boolean;
  tableStatus?: Record<string, {
    exists: boolean;
    recordCount: number;
    error: string | null;
  }>;
  error?: string;
}

export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState<SqlResult | null>(null);
  const [tableStatus, setTableStatus] = useState<TableStatus | null>(null);
  const { toast } = useToast();

  const fetchSetupSQL = async () => {
    setIsLoading(true);
    setSqlResult(null);
    
    try {
      const result = await apiRequest('GET', '/api/admin/setup-sql');
      const data = await result.json();
      setSqlResult(data);
    } catch (error) {
      setSqlResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate SQL'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkTableStatus = async () => {
    setIsLoading(true);
    
    try {
      const result = await apiRequest('GET', '/api/admin/table-status');
      const data = await result.json();
      setTableStatus(data);
    } catch (error) {
      setTableStatus({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check table status'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "SQL has been copied to your clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the SQL text",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Setup
          </CardTitle>
          <CardDescription>
            Set up content management tables in your Supabase database. 
            This provides SQL instructions to run in your Supabase SQL Editor.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={fetchSetupSQL}
              disabled={isLoading}
              data-testid="button-get-setup-sql"
            >
              {isLoading ? "Generating..." : "Get Setup SQL"}
            </Button>
            
            <Button 
              onClick={checkTableStatus}
              disabled={isLoading}
              variant="outline"
              data-testid="button-check-status"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Table Status
            </Button>
          </div>
          
          {sqlResult && sqlResult.success && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Instructions:</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {sqlResult.instructions}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open('https://supabase.com/dashboard/project/_/sql', '_blank')}
                >
                  Open Supabase SQL Editor
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Setup SQL</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(sqlResult.setupSQL!)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>
                <Textarea
                  value={sqlResult.setupSQL}
                  readOnly
                  className="font-mono text-sm h-64"
                  data-testid="textarea-setup-sql"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Verification SQL</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(sqlResult.checkSQL!)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy SQL
                  </Button>
                </div>
                <Textarea
                  value={sqlResult.checkSQL}
                  readOnly
                  className="font-mono text-sm h-20"
                  data-testid="textarea-check-sql"
                />
              </div>
            </div>
          )}

          {sqlResult && !sqlResult.success && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800">
              <XCircle className="w-5 h-5 text-red-600 mb-2" />
              <span className="font-medium text-red-800 dark:text-red-200">Error:</span>
              <p className="text-sm text-red-700 dark:text-red-300">
                {sqlResult.error}
              </p>
            </div>
          )}

          {tableStatus && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Table Status</CardTitle>
              </CardHeader>
              <CardContent>
                {tableStatus.success && tableStatus.tableStatus ? (
                  <div className="space-y-2">
                    {Object.entries(tableStatus.tableStatus).map(([tableName, status]) => (
                      <div key={tableName} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="font-medium">{tableName}</span>
                        <div className="flex items-center gap-2">
                          {status.exists ? (
                            <>
                              <Badge variant="default">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {status.recordCount} records
                              </Badge>
                            </>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Not found
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                    <XCircle className="w-5 h-5 text-red-600 mb-2" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {tableStatus.error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}