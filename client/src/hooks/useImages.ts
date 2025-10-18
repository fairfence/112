import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// TypeScript types for images
export interface Image {
  id: string;
  filename: string;
  url: string;
  category: string;
  alt: string;
  size?: number;
  mimeType?: string;
  uploadedBy?: string;
  isPublic?: boolean;
  uploadedAt: string;
}

export interface CreateImageData {
  filename: string;
  url: string;
  category?: string;
  alt?: string;
  size?: number;
  mimeType?: string;
  isPublic?: boolean;
}

export interface UpdateImageData extends Partial<CreateImageData> {
  id: string;
}

export interface ImagesResponse {
  success: boolean;
  data: Image[];
  error?: string;
}

export function useImages() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch images query
  const imagesQuery = useQuery<ImagesResponse>({
    queryKey: ['/api/admin/images'],
    enabled: !!user,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create image mutation
  const createImageMutation = useMutation({
    mutationFn: async (data: CreateImageData) => {
      const response = await apiRequest('POST', '/api/admin/images', data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create image');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: "Image saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save image",
        variant: "destructive",
      });
    }
  });

  // Update image mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateImageData) => {
      const response = await apiRequest('PUT', `/api/admin/images/${id}`, data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update image');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: "Image updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update image",
        variant: "destructive",
      });
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/images/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete image');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  });

  // Bulk delete images mutation
  const bulkDeleteImagesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(id => 
        apiRequest('DELETE', `/api/admin/images/${id}`)
      );
      const responses = await Promise.all(promises);
      
      const failed = responses.filter(response => !response.ok);
      if (failed.length > 0) {
        throw new Error(`Failed to delete ${failed.length} image(s)`);
      }
      
      return { success: true, deletedCount: ids.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: `${data.deletedCount} image(s) deleted successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete images",
        variant: "destructive",
      });
    }
  });

  // Upload image mutation (handles the full upload flow)
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Get upload URL
      const uploadResponse = await apiRequest('POST', '/api/admin/images/upload');
      const { uploadURL } = await uploadResponse.json();

      // Step 2: Upload file to storage
      const uploadFileResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadFileResponse.ok) {
        throw new Error('Failed to upload file to storage');
      }

      // Step 3: Publish image (make it public and get final URL)
      const publishResponse = await apiRequest('POST', '/api/admin/images/publish', {
        imageURL: uploadURL
      });
      const { publicURL } = await publishResponse.json();

      // Step 4: Save image metadata to database
      const imageData: CreateImageData = {
        filename: file.name,
        url: publicURL,
        category: 'uncategorized',
        alt: file.name,
        size: file.size,
        mimeType: file.type,
        isPublic: true
      };

      const saveResponse = await apiRequest('POST', '/api/admin/images', imageData);
      return saveResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: "Image uploaded and saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    images: imagesQuery.data?.data || [],
    
    // Loading states
    isLoading: imagesQuery.isLoading,
    isFetching: imagesQuery.isFetching,
    isCreating: createImageMutation.isPending,
    isUpdating: updateImageMutation.isPending,
    isDeleting: deleteImageMutation.isPending,
    isBulkDeleting: bulkDeleteImagesMutation.isPending,
    isUploading: uploadImageMutation.isPending,
    
    // Error states
    error: imagesQuery.error as Error | null,
    createError: createImageMutation.error as Error | null,
    updateError: updateImageMutation.error as Error | null,
    deleteError: deleteImageMutation.error as Error | null,
    
    // Actions
    createImage: createImageMutation.mutate,
    updateImage: updateImageMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    bulkDeleteImages: bulkDeleteImagesMutation.mutate,
    uploadImage: uploadImageMutation.mutate,
    
    // Utilities
    refetch: imagesQuery.refetch,
    invalidate: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] }),
  };
}