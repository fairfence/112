import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/admin/DataTable";
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
import { CreditCard as Edit2, Trash2, Plus, FileText, Globe, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";

// Form validation schema
const contentFormSchema = z.object({
  section: z.string().min(1, "Section is required"),
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  updated_by: string | null;
  updated_at: string;
}

export default function ContentManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const form = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      section: "",
      key: "",
      value: "",
    },
  });

  // Fetch content data
  const { data: contentData, isLoading } = useQuery<{data: SiteContent[]}>({
    queryKey: ['/api/admin/content'],
    enabled: !!user
  });

  // Mutations
  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const res = await apiRequest('POST', '/api/admin/content', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      setIsCreateDialogOpen(false);
      form.reset();
      setSelectedSection("");
      setSelectedKey("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content",
        variant: "destructive",
      });
    }
  });

  const updateContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const res = await apiRequest('POST', '/api/admin/content', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      setEditingContent(null);
      form.reset();
      setSelectedSection("");
      setSelectedKey("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/content/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    }
  });

  // Data table columns
  const columns: DataTableColumn<SiteContent>[] = [
    {
      key: "section",
      label: "Section",
      sortable: true,
      description: "Content section category (hero, about, business, etc.)",
      render: (section) => (
        <Badge variant="secondary">
          {section}
        </Badge>
      ),
    },
    {
      key: "key",
      label: "Key",
      sortable: true,
      description: "Content identifier key within the section",
      render: (key) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {key}
        </code>
      ),
    },
    {
      key: "value",
      label: "Value",
      description: "Content text or data value",
      render: (value) => (
        <div className="max-w-md">
          <p className="text-sm line-clamp-2">{value}</p>
        </div>
      ),
    },
    {
      key: "updated_at",
      label: "Last Updated",
      sortable: true,
      description: "Date when this content was last modified",
      render: (updated_at) => (
        <span className="text-sm text-muted-foreground">
          {new Date(updated_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Data table actions
  const actions: DataTableAction<SiteContent>[] = [
    {
      label: "Edit",
      icon: Edit2,
      description: "Edit content section, key, and value",
      onClick: (content) => {
        setEditingContent(content);
        setSelectedSection(content.section);
        setSelectedKey(content.key);
        form.reset({
          section: content.section,
          key: content.key,
          value: content.value,
        });
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      description: "Permanently delete this content item",
      onClick: (content) => {
        if (window.confirm(`Are you sure you want to delete ${content.section}.${content.key}?`)) {
          deleteContentMutation.mutate(content.id);
        }
      },
    },
  ];

  const handleCreateContent = (data: ContentFormData) => {
    createContentMutation.mutate(data);
  };

  const handleUpdateContent = (data: ContentFormData) => {
    updateContentMutation.mutate(data);
  };

  const contentSections = [
    { value: "hero", label: "Hero Section" },
    { value: "contact", label: "Contact Section" },
    { value: "business", label: "Business Info" },
    { value: "about", label: "About Section" },
    { value: "services", label: "Services" },
  ];

  // Get content keys based on selected section
  const getContentKeys = (section: string) => {
    switch (section) {
      case "hero":
        return [
          { value: "title", label: "Main Title", description: "Large headline on homepage" },
          { value: "description", label: "Main Description", description: "Paragraph below main title" },
          { value: "tagline", label: "Bottom Tagline", description: "Text at bottom of hero section" },
          { value: "info_title", label: "Info Box Title", description: "Title in right-side info box" },
          { value: "feature_1", label: "Feature 1", description: "First bullet point in info box" },
          { value: "feature_2", label: "Feature 2", description: "Second bullet point in info box" },
          { value: "feature_3", label: "Feature 3", description: "Third bullet point in info box" },
          { value: "feature_4", label: "Feature 4", description: "Fourth bullet point in info box" },
        ];
      case "contact":
        return [
          { value: "title", label: "Section Title", description: "Main contact section heading" },
          { value: "description", label: "Section Description", description: "Text below contact title" },
          { value: "form_title", label: "Form Title", description: "Contact form heading" },
          { value: "form_description", label: "Form Description", description: "Text below form title" },
          { value: "phone_title", label: "Phone Section Title", description: "Phone contact card title" },
          { value: "phone_subtitle", label: "Phone Subtitle", description: "Text below phone number" },
          { value: "phone_note", label: "Phone Note", description: "Small note about phone contact" },
          { value: "email_title", label: "Email Title", description: "Email contact card title" },
          { value: "location_title", label: "Location Title", description: "Location card title" },
          { value: "response_title", label: "Response Time Title", description: "Response time card title" },
          { value: "response_text", label: "Response Text", description: "Response time details" },
          { value: "response_quotes", label: "Response Quotes", description: "Quote response time" },
          { value: "response_badge", label: "Response Badge", description: "Response time badge text" },
        ];
      case "business":
        return [
          { value: "company_name", label: "Company Name", description: "Main company name" },
          { value: "company_subtitle", label: "Company Subtitle", description: "Text below company name" },
          { value: "company_full_name", label: "Full Company Name", description: "Complete business name" },
          { value: "phone_number", label: "Phone Number", description: "Contact phone number" },
          { value: "phone_display", label: "Phone Display", description: "How phone appears on site" },
          { value: "email", label: "Email Address", description: "Business email address" },
          { value: "location", label: "Location", description: "Business location" },
          { value: "service_area", label: "Service Area", description: "Areas you serve" },
          { value: "description", label: "Business Description", description: "About your business" },
          { value: "footer_tagline", label: "Footer Tagline", description: "Text in website footer" },
        ];
      case "about":
        return [
          { value: "title", label: "About Title", description: "About section heading" },
          { value: "description", label: "About Description", description: "About section content" },
        ];
      case "services":
        return [
          { value: "title", label: "Services Title", description: "Services section heading" },
          { value: "description", label: "Services Description", description: "Services section content" },
        ];
      default:
        return [];
    }
  };

  // Get current content value for preview
  const getCurrentValue = (section: string, key: string) => {
    if (!section || !key || !contentData?.data) return "";
    const item = contentData.data.find(c => c.section === section && c.key === key);
    return item?.value || "";
  };

  // Get default content value for preview
  const getDefaultValue = (section: string, key: string) => {
    const defaultValues: Record<string, Record<string, string>> = {
      hero: {
        title: "Fair, Reliable Residential Fencing Team",
        description: "Small, dedicated team providing quality fencing at fair prices. We're with you from initial site visit through to the finished fence - no subcontractors, just us.",
        tagline: "Trusted by homeowners across Hamilton, Cambridge, Te Awamutu & wider Waikato",
        info_title: "Why Choose Our Small Team?",
        feature_1: "Fair pricing on quality fencing",
        feature_2: "Same team from quote to completion",
        feature_3: "No subcontractors - we build it all",
        feature_4: "Personal service, honest quotes",
      },
      contact: {
        title: "Get Your Free Quote Today",
        description: "Fill out the form below or text us for the fastest response",
        form_title: "Request a Quote",
        form_description: "Tell us about your fencing project and we'll provide a free, no-obligation quote",
        phone_title: "Text Us First",
        phone_subtitle: "Text for fastest response",
        phone_note: "We'll call back if time arranged",
        email_title: "Email",
        location_title: "Location",
        response_title: "Response Time",
        response_text: "Text messages: Quick reply",
        response_quotes: "Quotes: Same day response",
        response_badge: "Quick Response",
      },
      business: {
        company_name: "FairFence",
        company_subtitle: "Contracting Waikato",
        company_full_name: "FairFence Contracting Waikato",
        phone_number: "02108358914",
        phone_display: "021 0835 8914",
        email: "Admin@fairfence.co.nz",
        location: "Ohaupo, New Zealand",
        service_area: "Serving greater New Zealand",
        description: "Quality fencing at fair prices. Serving Ohaupo and greater New Zealand since 2019.",
        footer_tagline: "Website designed for mobile-first experience • Proudly serving New Zealand",
      },
      about: {
        title: "About Us",
        description: "Learn more about our company and values",
      },
      services: {
        title: "Our Services",
        description: "Professional fencing solutions for your property",
      },
    };

    return defaultValues[section]?.[key] || "No default value set";
  };
  const getKeyDescription = (section: string, key: string) => {
    const keys = getContentKeys(section);
    return keys.find(k => k.value === key)?.description || "";
  };
  const stats = [
    {
      title: "Total Content Items",
      value: contentData?.data?.length || 0,
      description: "Active content sections",
    },
    {
      title: "Sections",
      value: new Set(contentData?.data?.map(c => c.section) || []).size,
      description: "Unique sections",
    },
    {
      title: "Last Updated",
      value: contentData?.data?.length ? "Today" : "Never",
      description: "Most recent change",
    },
  ];

  return (
    <AdminLayout 
      title="Content Manager" 
      subtitle="Manage website content and settings"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table */}
        <DataTable
          data={contentData?.data || []}
          columns={columns}
          actions={actions}
          loading={isLoading}
          onCreate={() => setIsCreateDialogOpen(true)}
          createLabel="Add Content"
          emptyMessage="No content found. Add your first content item!"
          title="Site Content"
          description="Manage website content sections and values"
          caption="Website content management with sections, keys, and values"
          ariaLabel="Site content data table for managing website text and settings"
        />

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateDialogOpen || !!editingContent}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingContent(null);
              form.reset();
              setSelectedSection("");
              setSelectedKey("");
            }
          }}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Edit Content" : "Add New Content"}
              </DialogTitle>
              <DialogDescription>
                {editingContent 
                  ? "Update the content item details"
                  : "Add a new content item to your website"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="col-span-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(
                      editingContent ? handleUpdateContent : handleCreateContent
                    )}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Section *</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedSection(value);
                                setSelectedKey("");
                                form.setValue("key", "");
                                form.setValue("value", "");
                              }}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-section">
                                  <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {contentSections.map((section) => (
                                  <SelectItem key={section.value} value={section.value}>
                                    {section.label}
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
                        name="key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Key *</FormLabel>
                            <Select 
                              value={field.value} 
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedKey(value);
                                // Pre-fill with current value if it exists, otherwise use default
                                if (!editingContent) {
                                  const currentValue = getCurrentValue(selectedSection, value);
                                  const defaultValue = getDefaultValue(selectedSection, value);
                                  form.setValue("value", currentValue || defaultValue);
                                }
                              }}
                              disabled={!selectedSection}
                            >
                              <FormControl>
                                <SelectTrigger data-testid="select-key">
                                  <SelectValue placeholder={selectedSection ? "Select content key" : "Select section first"} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {getContentKeys(selectedSection).map((key) => (
                                  <SelectItem key={key.value} value={key.value}>
                                    <div className="flex flex-col">
                                      <span>{key.label}</span>
                                      <span className="text-xs text-muted-foreground">{key.description}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content Value *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the content value..."
                              rows={4}
                              {...field}
                              data-testid="textarea-value"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          setEditingContent(null);
                          form.reset();
                          setSelectedSection("");
                          setSelectedKey("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={editingContent ? updateContentMutation.isPending : createContentMutation.isPending}
                        data-testid="button-save-content"
                      >
                        {editingContent ? (
                          updateContentMutation.isPending ? "Updating..." : "Update Content"
                        ) : (
                          createContentMutation.isPending ? "Creating..." : "Create Content"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </div>

              {/* Preview Section */}
              <div className="col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4" />
                      Current Content Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedSection && selectedKey ? (
                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground">
                          <code>{selectedSection}.{selectedKey}</code>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg border">
                          <p className="text-sm font-medium mb-2">Current Value:</p>
                          <div className="text-sm">
                            {getCurrentValue(selectedSection, selectedKey) ? (
                              <p className="text-foreground bg-background p-2 rounded border">
                                {getCurrentValue(selectedSection, selectedKey)}
                              </p>
                            ) : (
                              <span className="italic">No content set - will use default</span>
                            )}
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">Default Value:</p>
                          <div className="text-sm">
                            <p className="text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 p-2 rounded border">
                              {getDefaultValue(selectedSection, selectedKey)}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <strong>What this changes:</strong><br />
                          {getKeyDescription(selectedSection, selectedKey)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select section and key to see current content</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}