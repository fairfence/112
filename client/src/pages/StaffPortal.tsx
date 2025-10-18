import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Shield, LogOut, Edit3, MessageCircle, HelpCircle, Save, Plus, Trash2, Database, Star, Upload, Image } from "lucide-react";
import DatabaseSetup from "@/components/DatabaseSetup";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function StaffPortal() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // State for editing
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});
  const [editingTestimonials, setEditingTestimonials] = useState<Record<string, any>>({});
  const [editingFaqs, setEditingFaqs] = useState<Record<string, any>>({});
  const [newTestimonial, setNewTestimonial] = useState({
    name: '', location: '', rating: 5, text: '', source: 'Google', date: ''
  });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', orderIndex: 1 });

  // Data queries
  const { data: siteContent } = useQuery<{data: any[]}>({
    queryKey: ['/api/admin/content'],
    enabled: !!user
  });

  const { data: testimonials } = useQuery<{data: any[]}>({
    queryKey: ['/api/admin/testimonials'],
    enabled: !!user
  });

  const { data: faqItems } = useQuery<{data: any[]}>({
    queryKey: ['/api/admin/faq'],
    enabled: !!user
  });

  const { data: images } = useQuery<{data: any[]}>({
    queryKey: ['/api/admin/images'],
    enabled: !!user
  });

  // Mutations
  const updateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/content', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/content'] });
    }
  });

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/testimonials', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      setNewTestimonial({ name: '', location: '', rating: 5, text: '', source: 'Google', date: '' });
    }
  });

  const createFaqMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/admin/faq', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
      setNewFaq({ question: '', answer: '', orderIndex: 1 });
    }
  });

  // Update mutations
  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/testimonials/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
    }
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PUT', `/api/admin/faq/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
    }
  });

  // Delete mutations
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/testimonials/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
    }
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/faq/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
    }
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (imageData: any) => {
      const res = await apiRequest('POST', '/api/admin/images', imageData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/images'] });
    }
  });

  const handleContentUpdate = (section: string, key: string, value: string) => {
    updateContentMutation.mutate({ section, key, value });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Main Site
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm">Welcome, {user?.email || 'Admin'}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">FairFence Admin</CardTitle>
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                Content Management
              </Badge>
            </div>
            <CardDescription>
              Manage your website content, testimonials, and frequently asked questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content" data-testid="tab-content">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Site Content
                </TabsTrigger>
                <TabsTrigger value="testimonials" data-testid="tab-testimonials">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Testimonials
                </TabsTrigger>
                <TabsTrigger value="faq" data-testid="tab-faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="images" data-testid="tab-images">
                  <Image className="h-4 w-4 mr-2" />
                  Images
                </TabsTrigger>
                <TabsTrigger value="database" data-testid="tab-database">
                  <Database className="h-4 w-4 mr-2" />
                  Database
                </TabsTrigger>
              </TabsList>

              {/* Site Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <div className="grid gap-4">
                  {siteContent?.data?.map((content: any) => (
                    <Card key={content.id} className="p-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {content.section}.{content.key}
                        </Label>
                        <Input
                          value={editingContent[content.id] !== undefined ? editingContent[content.id] : content.value}
                          onChange={(e) => setEditingContent((prev: Record<string, string>) => ({ ...prev, [content.id]: e.target.value }))}
                          data-testid={`input-content-${content.section}-${content.key}`}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleContentUpdate(content.section, content.key, editingContent[content.id] || content.value)}
                          disabled={updateContentMutation.isPending}
                          data-testid={`button-save-${content.section}-${content.key}`}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-4">
                {/* Add new testimonial */}
                <Card className="p-4">
                  <CardTitle className="text-lg mb-4">Add New Testimonial</CardTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                        data-testid="input-new-testimonial-name"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={newTestimonial.location}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, location: e.target.value }))}
                        data-testid="input-new-testimonial-location"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Testimonial Text</Label>
                      <Textarea
                        value={newTestimonial.text}
                        onChange={(e) => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))}
                        data-testid="textarea-new-testimonial-text"
                      />
                    </div>
                    <Button
                      onClick={() => createTestimonialMutation.mutate(newTestimonial)}
                      disabled={createTestimonialMutation.isPending || !newTestimonial.name || !newTestimonial.text}
                      data-testid="button-add-testimonial"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Testimonial
                    </Button>
                  </div>
                </Card>

                {/* Existing testimonials */}
                <div className="grid gap-4">
                  {testimonials?.data?.map((testimonial: any) => {
                    const isEditing = editingTestimonials[testimonial.id];
                    return (
                      <Card key={testimonial.id} className="p-4">
                        <div className="space-y-4">
                          {isEditing ? (
                            // Edit mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    value={isEditing.name}
                                    onChange={(e) => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...prev[testimonial.id], name: e.target.value } 
                                    }))}
                                    data-testid={`input-edit-testimonial-name-${testimonial.id}`}
                                  />
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input
                                    value={isEditing.location}
                                    onChange={(e) => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...prev[testimonial.id], location: e.target.value } 
                                    }))}
                                    data-testid={`input-edit-testimonial-location-${testimonial.id}`}
                                  />
                                </div>
                                <div>
                                  <Label>Rating</Label>
                                  <Select
                                    value={isEditing.rating.toString()}
                                    onValueChange={(value) => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...prev[testimonial.id], rating: parseInt(value) } 
                                    }))}
                                  >
                                    <SelectTrigger data-testid={`select-edit-testimonial-rating-${testimonial.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {[1, 2, 3, 4, 5].map(rating => (
                                        <SelectItem key={rating} value={rating.toString()}>
                                          {Array.from({ length: rating }, (_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-current inline" />
                                          ))}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Source</Label>
                                  <Input
                                    value={isEditing.source}
                                    onChange={(e) => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...prev[testimonial.id], source: e.target.value } 
                                    }))}
                                    data-testid={`input-edit-testimonial-source-${testimonial.id}`}
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label>Testimonial Text</Label>
                                  <Textarea
                                    value={isEditing.text}
                                    onChange={(e) => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...prev[testimonial.id], text: e.target.value } 
                                    }))}
                                    data-testid={`textarea-edit-testimonial-text-${testimonial.id}`}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateTestimonialMutation.mutate({
                                      id: testimonial.id,
                                      data: isEditing
                                    });
                                    setEditingTestimonials((prev: Record<string, any>) => {
                                      const updated = { ...prev };
                                      delete updated[testimonial.id];
                                      return updated;
                                    });
                                  }}
                                  disabled={updateTestimonialMutation.isPending}
                                  data-testid={`button-save-testimonial-${testimonial.id}`}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingTestimonials((prev: Record<string, any>) => {
                                    const updated = { ...prev };
                                    delete updated[testimonial.id];
                                    return updated;
                                  })}
                                  data-testid={`button-cancel-testimonial-${testimonial.id}`}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <p className="font-medium">{testimonial.name}</p>
                                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {Array.from({ length: testimonial.rating }, (_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-current text-yellow-500" />
                                    ))}
                                    <span className="text-xs text-muted-foreground ml-1">({testimonial.source})</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingTestimonials((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [testimonial.id]: { ...testimonial } 
                                    }))}
                                    data-testid={`button-edit-testimonial-${testimonial.id}`}
                                  >
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this testimonial?')) {
                                        deleteTestimonialMutation.mutate(testimonial.id);
                                      }
                                    }}
                                    disabled={deleteTestimonialMutation.isPending}
                                    data-testid={`button-delete-testimonial-${testimonial.id}`}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm">{testimonial.text}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-4">
                {/* Add new FAQ */}
                <Card className="p-4">
                  <CardTitle className="text-lg mb-4">Add New FAQ</CardTitle>
                  <div className="space-y-4">
                    <div>
                      <Label>Question</Label>
                      <Input
                        value={newFaq.question}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                        data-testid="input-new-faq-question"
                      />
                    </div>
                    <div>
                      <Label>Answer</Label>
                      <Textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                        data-testid="textarea-new-faq-answer"
                      />
                    </div>
                    <Button
                      onClick={() => createFaqMutation.mutate(newFaq)}
                      disabled={createFaqMutation.isPending || !newFaq.question || !newFaq.answer}
                      data-testid="button-add-faq"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </Card>

                {/* Existing FAQ items */}
                <div className="grid gap-4">
                  {faqItems?.data?.map((faq: any) => {
                    const isEditing = editingFaqs[faq.id];
                    return (
                      <Card key={faq.id} className="p-4">
                        <div className="space-y-4">
                          {isEditing ? (
                            // Edit mode
                            <div className="space-y-4">
                              <div>
                                <Label>Question</Label>
                                <Input
                                  value={isEditing.question}
                                  onChange={(e) => setEditingFaqs((prev: Record<string, any>) => ({ 
                                    ...prev, 
                                    [faq.id]: { ...prev[faq.id], question: e.target.value } 
                                  }))}
                                  data-testid={`input-edit-faq-question-${faq.id}`}
                                />
                              </div>
                              <div>
                                <Label>Answer</Label>
                                <Textarea
                                  value={isEditing.answer}
                                  onChange={(e) => setEditingFaqs((prev: Record<string, any>) => ({ 
                                    ...prev, 
                                    [faq.id]: { ...prev[faq.id], answer: e.target.value } 
                                  }))}
                                  data-testid={`textarea-edit-faq-answer-${faq.id}`}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateFaqMutation.mutate({
                                      id: faq.id,
                                      data: isEditing
                                    });
                                    setEditingFaqs((prev: Record<string, any>) => {
                                      const updated = { ...prev };
                                      delete updated[faq.id];
                                      return updated;
                                    });
                                  }}
                                  disabled={updateFaqMutation.isPending}
                                  data-testid={`button-save-faq-${faq.id}`}
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingFaqs((prev: Record<string, any>) => {
                                    const updated = { ...prev };
                                    delete updated[faq.id];
                                    return updated;
                                  })}
                                  data-testid={`button-cancel-faq-${faq.id}`}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // View mode
                            <div>
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="font-medium">{faq.question}</h4>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingFaqs((prev: Record<string, any>) => ({ 
                                      ...prev, 
                                      [faq.id]: { ...faq } 
                                    }))}
                                    data-testid={`button-edit-faq-${faq.id}`}
                                  >
                                    <Edit3 className="h-3 w-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      if (window.confirm('Are you sure you want to delete this FAQ?')) {
                                        deleteFaqMutation.mutate(faq.id);
                                      }
                                    }}
                                    disabled={deleteFaqMutation.isPending}
                                    data-testid={`button-delete-faq-${faq.id}`}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <p className="text-muted-foreground">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-4">
                <Card className="p-4">
                  <CardTitle className="text-lg mb-4">Image Management</CardTitle>
                  <div className="space-y-4">
                    <ObjectUploader
                      maxNumberOfFiles={10}
                      maxFileSize={5242880} // 5MB
                      onGetUploadParameters={async () => {
                        const response = await apiRequest('POST', '/api/upload');
                        const { uploadUrl } = await response.json();
                        return {
                          method: 'PUT' as const,
                          url: uploadUrl
                        };
                      }}
                      onComplete={(result) => {
                        if (result.successful && result.successful.length > 0) {
                          // Handle successful uploads
                          result.successful.forEach((file) => {
                            const imageData = {
                              filename: file.name,
                              url: file.uploadURL,
                              category: 'portfolio',
                              alt: file.name
                            };
                            uploadImageMutation.mutate(imageData);
                          });
                        }
                      }}
                      buttonClassName="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </ObjectUploader>
                    
                    {/* Display existing images */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                      {images?.data?.map((image: any) => (
                        <Card key={image.id} className="p-2">
                          <div className="space-y-2">
                            <img 
                              src={image.url} 
                              alt={image.alt || image.filename}
                              className="w-full h-32 object-cover rounded"
                              loading="lazy"
                            />
                            <div className="space-y-1">
                              <p className="text-xs font-medium truncate">{image.filename}</p>
                              <Badge variant="secondary" className="text-xs">
                                {image.category || 'uncategorized'}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-full"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this image?')) {
                                  // Delete image functionality would go here
                                  console.log('Delete image:', image.id);
                                }
                              }}
                              data-testid={`button-delete-image-${image.id}`}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    {(!images?.data || images.data.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No images uploaded yet</p>
                        <p className="text-sm">Use the upload button above to add images</p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Database Setup Tab */}
              <TabsContent value="database" className="space-y-4">
                <DatabaseSetup />
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}