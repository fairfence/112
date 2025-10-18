import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// TypeScript types for testimonials
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  source: string;
  date: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface CreateTestimonialData {
  name: string;
  location: string;
  rating: number;
  text: string;
  source: string;
  date: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateTestimonialData extends Partial<CreateTestimonialData> {
  id: string;
}

export interface TestimonialsResponse {
  success: boolean;
  data: Testimonial[];
  error?: string;
}

export function useTestimonials() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch testimonials query
  const testimonialsQuery = useQuery<TestimonialsResponse>({
    queryKey: ['/api/admin/testimonials'],
    enabled: !!user,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create testimonial mutation
  const createTestimonialMutation = useMutation({
    mutationFn: async (data: CreateTestimonialData) => {
      const response = await apiRequest('POST', '/api/admin/testimonials', data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create testimonial');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create testimonial",
        variant: "destructive",
      });
    }
  });

  // Update testimonial mutation
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateTestimonialData) => {
      const response = await apiRequest('PUT', `/api/admin/testimonials/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update testimonial');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    }
  });

  // Delete testimonial mutation
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/testimonials/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete testimonial');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  });

  // Bulk delete testimonials mutation
  const bulkDeleteTestimonialsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => 
        apiRequest('DELETE', `/api/admin/testimonials/${id}`)
      );
      const responses = await Promise.all(promises);
      
      const failed = responses.filter(response => !response.ok);
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} testimonial(s)`);
      }
      
      return { success: true, deletedCount: ids.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: `${data.deletedCount} testimonial(s) deleted successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete testimonials",
        variant: "destructive",
      });
    }
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const response = await apiRequest('PUT', `/api/admin/testimonials/${id}`, { isFeatured });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update testimonial');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Success",
        description: "Testimonial featured status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update testimonial",
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    testimonials: testimonialsQuery.data?.data || [],
    
    // Loading states
    isLoading: testimonialsQuery.isLoading,
    isFetching: testimonialsQuery.isFetching,
    isCreating: createTestimonialMutation.isPending,
    isUpdating: updateTestimonialMutation.isPending,
    isDeleting: deleteTestimonialMutation.isPending,
    isBulkDeleting: bulkDeleteTestimonialsMutation.isPending,
    isTogglingFeatured: toggleFeaturedMutation.isPending,
    
    // Error states
    error: testimonialsQuery.error as Error | null,
    createError: createTestimonialMutation.error as Error | null,
    updateError: updateTestimonialMutation.error as Error | null,
    deleteError: deleteTestimonialMutation.error as Error | null,
    
    // Actions
    createTestimonial: createTestimonialMutation.mutate,
    updateTestimonial: updateTestimonialMutation.mutate,
    deleteTestimonial: deleteTestimonialMutation.mutate,
    bulkDeleteTestimonials: bulkDeleteTestimonialsMutation.mutate,
    toggleFeatured: toggleFeaturedMutation.mutate,
    
    // Utilities
    refetch: testimonialsQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] }),
  };
}