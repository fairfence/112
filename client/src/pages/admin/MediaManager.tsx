import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Upload, Image, Trash2, Copy, Filter, Grid3x3 as Grid3X3, List, Eye, RefreshCw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
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

export default function MediaManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);

  // Fetch media data
  const { data: mediaData, isLoading } = useQuery<{data: MediaItem[]}>({
    queryKey: ['/api/admin/images'],
    enabled: !!user
  });

  // Upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (imageData: any) => {
      const res = await apiRequest('POST', '/api/admin/images', imageData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MediaItem> }) => {
      const res = await apiRequest('PUT', `/api/admin/images/${id}`, data);
      return res.json();
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

  // Delete mutation
  const deleteImageMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/images/${id}`);
      return res.json();
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

  const images = mediaData?.data || [];
  const filteredImages = filterCategory === "all" 
    ? images 
    : images.filter(img => img.category === filterCategory);

  const predefinedCategories = [
    "hero", "services", "portfolio", "testimonials", "about", "contact", "team", "gallery"
  ];
  const existingCategories = Array.from(new Set(images.map(img => img.category).filter(Boolean)));
  const categories = ["all", ...predefinedCategories, ...existingCategories.filter(cat => !predefinedCategories.includes(cat))];

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied",
      description: "Image URL copied to clipboard",
    });
  };

  const handleBulkDelete = () => {
    if (selectedImages.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedImages.size} image(s)? This action cannot be undone.`
    );

    if (confirmed) {
      selectedImages.forEach(id => {
        deleteImageMutation.mutate(id);
      });
      setSelectedImages(new Set());
    }
  };

  const handleUpdateImageMetadata = (id: string, updates: Partial<MediaItem>) => {
    updateImageMutation.mutate({ id, data: updates });
  };

  const handlePreviewImage = (image: MediaItem) => {
    setPreviewImage(image);
    setShowImagePreview(true);
  };

  const getImageUsageAreas = (category: string) => {
    const usageMap: Record<string, string[]> = {
      "hero": ["Homepage hero section", "Main banner area"],
      "services": ["Services section cards", "Service type illustrations"],
      "portfolio": ["Project gallery", "Before/after showcases"],
      "testimonials": ["Customer review cards", "Testimonial backgrounds"],
      "about": ["About us section", "Team photos", "Company story"],
      "contact": ["Contact section", "Location images"],
      "team": ["Staff photos", "Team member profiles"],
      "gallery": ["General image gallery", "Project showcases"]
    };
    return usageMap[category] || ["General website use"];
  };

  const stats = [
    {
      title: "Total Images",
      value: images.length,
      description: "All uploaded images",
    },
    {
      title: "Categories",
      value: categories.length - 1, // Exclude "all"
      description: "Image categories",
    },
    {
      title: "Storage Used",
      value: images.reduce((total, img) => total + (img.size || 0), 0) > 0 
        ? `${(images.reduce((total, img) => total + (img.size || 0), 0) / 1024 / 1024).toFixed(1)} MB`
        : "0 MB",
      description: "Approximate size",
    },
  ];

  return (
    <AdminLayout 
      title="Media Manager" 
      subtitle="Upload and manage website images"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Images
            </CardTitle>
            <CardDescription>
              Upload new images to your media library. Choose appropriate categories for easy management.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Image Categories Guide:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>hero:</strong> Homepage banner images</div>
                <div><strong>services:</strong> Service type illustrations</div>
                <div><strong>portfolio:</strong> Project galleries</div>
                <div><strong>testimonials:</strong> Customer photos</div>
                <div><strong>about:</strong> Team and company photos</div>
                <div><strong>contact:</strong> Location and office images</div>
              </div>
            </div>
            <ObjectUploader
              maxNumberOfFiles={10}
              maxFileSize={20971520} // 20MB
              onGetUploadParameters={async () => {
                const response = await apiRequest('POST', '/api/admin/images/upload');
                const { uploadURL } = await response.json();
                return {
                  method: 'PUT' as const,
                  url: uploadURL
                };
              }}
              onComplete={(result) => {
                if (result.successful && result.successful.length > 0) {
                  result.successful.forEach(async (file) => {
                    try {
                      // First, publish the image to make it public and get the final URL
                      const publishResponse = await apiRequest('POST', '/api/admin/images/publish', {
                        imageURL: file.uploadURL
                      });
                      const { publicURL } = await publishResponse.json();
                      
                      // Then save the image metadata to the database
                      const imageData = {
                        filename: file.name,
                        url: publicURL,
                        category: 'uncategorized',
                        alt: file.name,
                        size: file.size || 0,
                        mimeType: file.type || '',
                        isPublic: true
                      };
                      uploadImageMutation.mutate(imageData);
                    } catch (error) {
                      console.error('Error processing uploaded file:', error);
                      toast({
                        title: "Upload Error",
                        description: `Failed to process ${file.name}`,
                        variant: "destructive",
                      });
                    }
                  });
                }
              }}
              buttonClassName="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </ObjectUploader>
          </CardContent>
        </Card>

        {/* Filters and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {predefinedCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)} ({images.filter(img => img.category === category).length})
                    </SelectItem>
                  ))}
                  {existingCategories.filter(cat => !predefinedCategories.includes(cat)).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category} ({images.filter(img => img.category === category).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedImages.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleteImageMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedImages.size})
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] })}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Images Display */}
        {filteredImages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {filterCategory === "all" 
                  ? "Upload your first image to get started"
                  : `No images in the "${filterCategory}" category`
                }
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <ImageCard 
                key={image.id} 
                image={image} 
                onCopyUrl={handleCopyUrl}
                onPreview={handlePreviewImage}
                onDelete={(id) => {
                  if (window.confirm('Delete this image?')) {
                    deleteImageMutation.mutate(id);
                  }
                }}
                onUpdate={handleUpdateImageMetadata}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredImages.map((image) => (
                  <ImageListItem
                    key={image.id}
                    image={image}
                    onCopyUrl={handleCopyUrl}
                    onPreview={handlePreviewImage}
                    onDelete={(id) => {
                      if (window.confirm('Delete this image?')) {
                        deleteImageMutation.mutate(id);
                      }
                    }}
                    onUpdate={handleUpdateImageMetadata}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Image Preview & Usage
              </DialogTitle>
              <DialogDescription>
                View image details and see where it's used on your website
              </DialogDescription>
            </DialogHeader>
            
            {previewImage && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={previewImage.url} 
                      alt={previewImage.alt || previewImage.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Filename:</span>
                      <code className="text-sm">{previewImage.filename}</code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Category:</span>
                      <Badge variant="outline">{previewImage.category || "uncategorized"}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Size:</span>
                      <span className="text-sm">{previewImage.size ? `${(previewImage.size / 1024).toFixed(1)} KB` : "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uploaded:</span>
                      <span className="text-sm">{new Date(previewImage.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Where This Image Appears:</h4>
                    <div className="space-y-2">
                      {getImageUsageAreas(previewImage.category).map((area, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Quick Actions:</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCopyUrl(previewImage.url)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Image URL
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => window.open(previewImage.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Usage Tips:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Use descriptive alt text for accessibility</li>
                      <li>• Choose appropriate categories for organization</li>
                      <li>• Optimize images before upload (WebP preferred)</li>
                      <li>• Keep file sizes under 1MB for best performance</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setShowImagePreview(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// Image Card Component for Grid View
function ImageCard({ 
  image, 
  onCopyUrl, 
  onPreview,
  onDelete, 
  onUpdate 
}: { 
  image: MediaItem; 
  onCopyUrl: (url: string) => void;
  onPreview: (image: MediaItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    category: image.category,
    alt: image.alt
  });

  const predefinedCategories = [
    "hero", "services", "portfolio", "testimonials", "about", "contact", "team", "gallery"
  ];

  const handleSave = () => {
    onUpdate(image.id, editData);
    setIsEditing(false);
  };

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square">
        <img 
          src={image.url} 
          alt={image.alt || image.filename}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPreview(image)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onCopyUrl(image.url)}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-medium truncate">{image.filename}</p>
        {isEditing ? (
          <div className="space-y-2 mt-2">
            <Select
              value={editData.category}
              onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {predefinedCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={editData.alt}
              onChange={(e) => setEditData(prev => ({ ...prev, alt: e.target.value }))}
              placeholder="Alt text"
              className="text-xs"
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave} className="text-xs">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="text-xs">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {image.category && (
              <Badge variant="outline" className="text-xs mb-1">
                {image.category}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-xs p-1 h-auto"
            >
              Edit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Image List Item Component for List View
function ImageListItem({ 
  image, 
  onCopyUrl, 
  onPreview,
  onDelete, 
  onUpdate 
}: { 
  image: MediaItem; 
  onCopyUrl: (url: string) => void;
  onPreview: (image: MediaItem) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    category: image.category,
    alt: image.alt
  });

  const predefinedCategories = [
    "hero", "services", "portfolio", "testimonials", "about", "contact", "team", "gallery"
  ];

  const handleSave = () => {
    onUpdate(image.id, editData);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
        <img 
          src={image.url} 
          alt={image.alt || image.filename}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{image.filename}</p>
        <p className="text-sm text-muted-foreground truncate">{image.url}</p>
        {isEditing ? (
          <div className="flex gap-2 mt-2">
            <Select
              value={editData.category}
              onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="text-xs h-8 w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {predefinedCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={editData.alt}
              onChange={(e) => setEditData(prev => ({ ...prev, alt: e.target.value }))}
              placeholder="Alt text"
              className="text-xs h-8"
            />
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            {image.category && (
              <Badge variant="outline" className="text-xs">
                {image.category}
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-xs h-6 px-2"
            >
              Edit
            </Button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPreview(image)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onCopyUrl(image.url)}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(image.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}