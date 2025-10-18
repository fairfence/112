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
import { Checkbox } from "@/components/ui/checkbox";
import { CircleHelp as HelpCircle, CreditCard as Edit2, Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const faqFormSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  answer: z.string().min(10, "Answer must be at least 10 characters"),
  orderIndex: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FAQFormData = z.infer<typeof faqFormSchema>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
}

export default function FAQManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [selectedFAQs, setSelectedFAQs] = useState<FAQItem[]>([]);

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      orderIndex: 0,
      isActive: true,
    },
  });

  // Fetch FAQ data
  const { data: faqData, isLoading } = useQuery<{data: FAQItem[]}>({
    queryKey: ['/api/admin/faq'],
    enabled: !!user
  });

  // Mutations
  const createFAQMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      const res = await apiRequest('POST', '/api/admin/faq', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create FAQ",
        variant: "destructive",
      });
    }
  });

  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, ...data }: FAQFormData & { id: string }) => {
      const res = await apiRequest('PUT', `/api/admin/faq/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      setEditingFAQ(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    }
  });

  const deleteFAQMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/faq/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/faq'] });
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  });

  const faqItems = faqData?.data || [];

  // Data table columns
  const columns: DataTableColumn<FAQItem>[] = [
    {
      key: "orderIndex",
      label: "Order",
      sortable: true,
      width: "16",
      description: "Display order of FAQ items on the website",
      render: (orderIndex) => (
        <Badge variant="outline" className="text-xs">
          #{orderIndex}
        </Badge>
      ),
    },
    {
      key: "question",
      label: "Question",
      sortable: true,
      description: "FAQ question text",
      render: (question) => (
        <div className="max-w-md">
          <p className="font-medium line-clamp-2">{question}</p>
        </div>
      ),
    },
    {
      key: "answer",
      label: "Answer",
      description: "FAQ answer and explanation",
      render: (answer) => (
        <div className="max-w-md">
          <p className="text-sm text-muted-foreground line-clamp-2">{answer}</p>
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      description: "Whether this FAQ is visible on the website",
      render: (isActive) => (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ];

  // Data table actions
  const actions: DataTableAction<FAQItem>[] = [
    {
      label: "Move Up",
      icon: ArrowUp,
      description: "Move this FAQ item higher in the display order",
      onClick: (faq) => {
        updateFAQMutation.mutate({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          orderIndex: Math.max(0, faq.orderIndex - 1),
          isActive: faq.isActive,
        });
      },
    },
    {
      label: "Move Down",
      icon: ArrowDown,
      description: "Move this FAQ item lower in the display order",
      onClick: (faq) => {
        updateFAQMutation.mutate({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          orderIndex: faq.orderIndex + 1,
          isActive: faq.isActive,
        });
      },
    },
    {
      label: "Edit",
      icon: Edit2,
      description: "Edit FAQ question and answer",
      onClick: (faq) => {
        setEditingFAQ(faq);
        form.reset({
          question: faq.question,
          answer: faq.answer,
          orderIndex: faq.orderIndex,
          isActive: faq.isActive,
        });
      },
    },
    {
      label: "Delete",
      icon: Trash2,
      variant: "destructive",
      description: "Permanently delete this FAQ item",
      onClick: (faq) => {
        if (window.confirm(`Are you sure you want to delete this FAQ: "${faq.question}"?`)) {
          deleteFAQMutation.mutate(faq.id);
        }
      },
    },
  ];

  const handleCreateFAQ = (data: FAQFormData) => {
    createFAQMutation.mutate(data);
  };

  const handleUpdateFAQ = (data: FAQFormData) => {
    if (!editingFAQ) return;
    updateFAQMutation.mutate({ id: editingFAQ.id, ...data });
  };

  const stats = [
    {
      title: "Total FAQs",
      value: faqItems.length,
      description: "All FAQ items",
    },
    {
      title: "Active FAQs",
      value: faqItems.filter(f => f.isActive).length,
      description: "Visible on website",
    },
    {
      title: "Average Length",
      value: faqItems.length > 0 
        ? Math.round(faqItems.reduce((sum, f) => sum + f.answer.length, 0) / faqItems.length)
        : 0,
      description: "Characters per answer",
    },
  ];

  return (
    <AdminLayout 
      title="FAQ Manager" 
      subtitle="Manage frequently asked questions"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
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
          data={faqItems}
          columns={columns}
          actions={actions}
          loading={isLoading}
          selectable
          onSelectionChange={setSelectedFAQs}
          onCreate={() => setIsCreateDialogOpen(true)}
          createLabel="Add FAQ"
          emptyMessage="No FAQ items found. Add your first question!"
          title="FAQ Items"
          description="Manage frequently asked questions for your website"
          caption="Frequently asked questions with ordering and management capabilities"
          ariaLabel="FAQ items data table with sorting, reordering, and editing functions"
        />

        {/* Create/Edit Dialog */}
        <Dialog
          open={isCreateDialogOpen || !!editingFAQ}
          onOpenChange={(open) => {
            if (!open) {
              setIsCreateDialogOpen(false);
              setEditingFAQ(null);
              form.reset();
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
              </DialogTitle>
              <DialogDescription>
                {editingFAQ 
                  ? "Update the FAQ item details"
                  : "Add a new frequently asked question"
                }
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  editingFAQ ? handleUpdateFAQ : handleCreateFAQ
                )}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is your question?" 
                          {...field} 
                          data-testid="input-question" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed answer..."
                          rows={4}
                          {...field}
                          data-testid="textarea-answer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orderIndex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
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
                            Display this FAQ on the website
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
                      setEditingFAQ(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editingFAQ ? updateFAQMutation.isPending : createFAQMutation.isPending}
                    data-testid="button-save-faq"
                  >
                    {editingFAQ ? (
                      updateFAQMutation.isPending ? "Updating..." : "Update FAQ"
                    ) : (
                      createFAQMutation.isPending ? "Creating..." : "Create FAQ"
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