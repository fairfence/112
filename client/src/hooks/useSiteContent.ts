import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

// TypeScript types for site content
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updated_by: string | null;
  updated_at: string;
}

export interface SiteContentResponse {
  success: boolean;
  data: SiteContent[];
  error?: string;
}

export function useSiteContent() {
  const { user } = useAuth();

  // Fetch site content query
  const siteContentQuery = useQuery<SiteContentResponse>({
    queryKey: ['/api/admin/content'],
    enabled: !!user,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const content = siteContentQuery.data?.data || [];

  // Helper function to get content by section and key with fallback
  const getContent = (section: string, key: string, defaultValue: string = ""): string => {
    const item = content.find(c => c.section === section && c.key === key);
    return item?.value || defaultValue;
  };

  // Helper function to get all content for a specific section
  const getSectionContent = (section: string): Record<string, string> => {
    const sectionItems = content.filter(c => c.section === section);
    return sectionItems.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
  };

  // Helper function to check if content exists
  const hasContent = (section: string, key: string): boolean => {
    return content.some(c => c.section === section && c.key === key);
  };

  return {
    // Data
    content,
    
    // Loading states
    isLoading: siteContentQuery.isLoading,
    isFetching: siteContentQuery.isFetching,
    
    // Error states
    error: siteContentQuery.error as Error | null,
    
    // Helper functions
    getContent,
    getSectionContent,
    hasContent,
    
    // Utilities
    refetch: siteContentQuery.refetch,
  };
}