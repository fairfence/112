import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/admin/DataTable";
import { useTestimonials, Testimonial, CreateTestimonialData } from "@/hooks/useTestimonials";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, CreditCard as Edit2, Trash2, UserCheck, Calendar, MapPin, Quote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().optional(),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Testimonial must be at least 10 characters"),
  source: z.string().min(1, "Source is required"),
  date: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export default function TestimonialsManager() {
  const {
    testimonials,
    isLoading,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    bulkDeleteTestimonials,
    toggleFeatured,
    isCreating,
    isUpdating,
    isDeleting,
    isBulkDeleting,
  } = useTestimonials();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState<Testimonial[]>([]);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      location: "",
      rating: 5,
      text: "",
      source: "Google",
      date: "",
      isActive: true,
      isFeatured: false,
    },
  });

  // Data table columns configuration
  const columns: DataTableColumn<Testimonial>[] = [
    {
      key: "name",
      label: "Customer",
      sortable: true,
      description: "Customer name and location information",
      render: (_, testimonial) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{testimonial.name}</p>
            {testimonial.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {testimonial.location}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      description: "Customer satisfaction rating from 1 to 5 stars",
      render: (rating) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
              aria-hidden="true"
            />
          ))}
          <span className="ml-2 text-sm font-medium" aria-label={`${rating} out of 5 stars`}>
            {rating}/5
          </span>
        </div>
      ),
    },
    {
      key: "text",
      label: "Review",
      description: "Customer review text and feedback",
      render: (text) => (
        <div className="max-w-md">
          <div className="flex items-start gap-2">
            <Quote className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm line-clamp-2">{text}</p>
          </div>
        </div>
      ),
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      description: "Platform where the review was originally posted",
      render: (source) => (
        <Badge variant="secondary" className="text-xs">
          {source}
        </Badge>
      ),
    },
    {
      key: "isFeatured",
      label: "Status",
      description: "Review visibility and featured status",
      render: (_, testimonial) => (
        <div className="flex flex-col gap-1">
          {testimonial.isFeatured && (
            <Badge variant="default" className="text-xs">
              Featured
            </Badge>
          )}
          <Badge variant={testimonial.isActive ? "secondary" : "outline"} className="text-xs">
            {testimonial.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date Added",
      sortable: true,
      description: "Date when the testimonial was added to the system",
      render: (createdAt) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      ),
    },
  ];

  // Data table actions
  const actions: DataTableAction<Testimonial>[] = [
    {
      label: "Toggle Featured",
      icon: Star,
      description: "Mark testimonial as featured or remove from featured list",
      onClick: (testimonial) => {
        toggleFeatured({
          id: testimonial.id,
          isFeatured: !testimonial.isFeatured,
        });
      },
    },
    {
      label: "Edit",
      icon: Edit2,
      description: "Edit testimonial details and content",
      onClick: (testimonial) => {
        setEditingTestimonial(testimonial);
        form.reset({
          name: testimonial.name,
          location: testimonial.location,
          rating: testimonial.rating,
          text: testimonial.text,
          source: testimonial.source,
          date: testimonial.date,
          isActive: testimonial.isActive,
          isFeatured: testimonial.isFeatured,
        });
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      description: "Permanently delete this testimonial",
      onClick: (testimonial) => {
        if (window.confirm(`Are you sure you want to delete the testimonial by ${testimonial.name}?`)) {
          deleteTestimonial(testimonial.id);
        }
      },
    },
  ];

  const handleCreateTestimonial = (data: TestimonialFormData) => {
    const createData: CreateTestimonialData = {
      ...data,
      location: data.location || "",
      date: data.date || new Date().toISOString().split("T")[0],
    };

    createTestimonial(createData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        form.reset();
      },
    });
  };

  const handleUpdateTestimonial = (data: TestimonialFormData) => {
    if (!editingTestimonial) return;

    updateTestimonial({
      id: editingTestimonial.id,
      ...data,
      location: data.location || "",
      date: data.date || editingTestimonial.date,
    }, {
      onSuccess: () => {
        setEditingTestimonial(null);
        form.reset();
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedTestimonials.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedTestimonials.length} testimonial(s)? This action cannot be undone.`
    );

    if (confirmed) {
      const ids = selectedTestimonials.map(t => t.id);
      bulkDeleteTestimonials(ids, {
        onSuccess: () => {
          setSelectedTestimonials([]);
        },
      });
    }
  };

  const stats = [
    {
      title: "Total Testimonials",
      value: testimonials.length,
      description: "All customer reviews",
    },
    {
      title: "Featured",
      value: testimonials.filter(t => t.isFeatured).length,
      description: "Highlighted reviews",
    },
    {
      title: "Average Rating",
      value: testimonials.length > 0 
        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
        : "0",
      description: "Customer satisfaction",
    },
  ];

  return (
    <AdminLayout 
      title="Testimonials Manager" 
      subtitle="Manage customer reviews and testimonials"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedTestimonials.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedTestimonials.length} testimonial(s) selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Choose an action to apply to all selected testimonials
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={isBulkDeleting}
                    data-testid="button-bulk-delete"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isBulkDeleting ? "Deleting..." : "Delete Selected"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <DataTable
          data={testimonials}
          columns={columns}
          actions={actions}
          loading={isLoading}
          selectable
          onSelectionChange={setSelectedTestimonials}
          onCreate={() => setIsCreateDialogOpen(true)}
          createLabel="Add Testimonial"
          emptyMessage="No testimonials found. Add your first customer review!"
          title="Customer Testimonials"
          description="Manage and showcase customer feedback"
          caption="Customer testimonials with ratings, reviews, and management actions"
          ariaLabel="Customer testimonials data table with sorting and selection capabilities"
        />

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateDialogOpen || !!editingTestimonial}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingTestimonial(null);
              form.reset();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
              <DialogDescription>
                {editingTestimonial 
                  ? "Update the customer testimonial details"
                  : "Add a new customer review to showcase on your website"
                }
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  editingTestimonial ? handleUpdateTestimonial : handleCreateTestimonial
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Auckland, NZ" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating *</FormLabel>
                        <Select 
                          value={field.value.toString()} 
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-rating">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {Array.from({ length: rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-source">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Google">Google Reviews</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testimonial Text *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="The team at FairFence did an excellent job..."
                          rows={4}
                          {...field}
                          data-testid="textarea-text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-active"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Display this testimonial on the website
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-featured"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Highlight this testimonial prominently
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingTestimonial(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editingTestimonial ? isUpdating : isCreating}
                    data-testid="button-save-testimonial"
                  >
                    {editingTestimonial ? (
                      isUpdating ? "Updating..." : "Update Testimonial"
                    ) : (
                      isCreating ? "Creating..." : "Create Testimonial"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}