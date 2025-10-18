import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Shield,
  Palette,
  Bell
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Form validation schemas
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone number is required"),
  address: z.string().optional(),
  timezone: z.string().default("Pacific/Auckland"),
});

const emailSettingsSchema = z.object({
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email().optional(),
  fromName: z.string().optional(),
});

const securitySettingsSchema = z.object({
  enableRegistration: z.boolean().default(false),
  requireEmailVerification: z.boolean().default(true),
  sessionTimeout: z.number().min(1).max(168).default(24), // 1-168 hours
  maxLoginAttempts: z.number().min(1).max(10).default(5),
});

type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
type EmailSettingsData = z.infer<typeof emailSettingsSchema>;
type SecuritySettingsData = z.infer<typeof securitySettingsSchema>;

export default function SettingsManager() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const generalForm = useForm<GeneralSettingsData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: "FairFence Contracting Waikato",
      siteDescription: "Professional fencing services in Hamilton and Waikato",
      contactEmail: "admin@fairfence.co.nz",
      contactPhone: "021 0835 8914",
      address: "Ohaupo, Waikato",
      timezone: "Pacific/Auckland",
    },
  });

  const emailForm = useForm<EmailSettingsData>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "admin@fairfence.co.nz",
      fromName: "FairFence Contracting",
    },
  });

  const securityForm = useForm<SecuritySettingsData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      enableRegistration: false,
      requireEmailVerification: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    },
  });

  const handleSaveGeneral = async (data: GeneralSettingsData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "General settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save general settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async (data: EmailSettingsData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Email settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecurity = async (data: SecuritySettingsData) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Security settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout 
      title="Settings Manager" 
      subtitle="Configure system settings and preferences"
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic site configuration and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={generalForm.handleSubmit(handleSaveGeneral)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        {...generalForm.register("siteName")}
                        data-testid="input-site-name"
                      />
                      {generalForm.formState.errors.siteName && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.siteName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        {...generalForm.register("timezone")}
                        data-testid="input-timezone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      {...generalForm.register("siteDescription")}
                      rows={3}
                      data-testid="textarea-site-description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        {...generalForm.register("contactEmail")}
                        data-testid="input-contact-email"
                      />
                      {generalForm.formState.errors.contactEmail && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.contactEmail.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        {...generalForm.register("contactPhone")}
                        data-testid="input-contact-phone"
                      />
                      {generalForm.formState.errors.contactPhone && (
                        <p className="text-sm text-destructive">
                          {generalForm.formState.errors.contactPhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      {...generalForm.register("address")}
                      data-testid="input-address"
                    />
                  </div>

                  <Button type="submit" disabled={isSaving} data-testid="button-save-general">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save General Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={emailForm.handleSubmit(handleSaveEmail)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        {...emailForm.register("smtpHost")}
                        placeholder="smtp.gmail.com"
                        data-testid="input-smtp-host"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        {...emailForm.register("smtpPort", { valueAsNumber: true })}
                        placeholder="587"
                        data-testid="input-smtp-port"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        {...emailForm.register("smtpUser")}
                        placeholder="your-email@gmail.com"
                        data-testid="input-smtp-user"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        {...emailForm.register("smtpPassword")}
                        placeholder="App password or SMTP password"
                        data-testid="input-smtp-password"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromEmail">From Email</Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        {...emailForm.register("fromEmail")}
                        data-testid="input-from-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fromName">From Name</Label>
                      <Input
                        id="fromName"
                        {...emailForm.register("fromName")}
                        data-testid="input-from-name"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} data-testid="button-save-email">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Email Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and security options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={securityForm.handleSubmit(handleSaveSecurity)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable User Registration</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow new users to create accounts
                        </p>
                      </div>
                      <Switch
                        {...securityForm.register("enableRegistration")}
                        data-testid="switch-enable-registration"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Email Verification</Label>
                        <p className="text-sm text-muted-foreground">
                          Users must verify their email before accessing the system
                        </p>
                      </div>
                      <Switch
                        {...securityForm.register("requireEmailVerification")}
                        data-testid="switch-email-verification"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="1"
                        max="168"
                        {...securityForm.register("sessionTimeout", { valueAsNumber: true })}
                        data-testid="input-session-timeout"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min="1"
                        max="10"
                        {...securityForm.register("maxLoginAttempts", { valueAsNumber: true })}
                        data-testid="input-max-login-attempts"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} data-testid="button-save-security">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Security Settings"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Use dark theme for the admin interface
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-dark-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact Layout</Label>
                      <p className="text-sm text-muted-foreground">
                        Use a more compact layout to show more content
                      </p>
                    </div>
                    <Switch data-testid="switch-compact-layout" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Tooltips</Label>
                      <p className="text-sm text-muted-foreground">
                        Display helpful tooltips throughout the interface
                      </p>
                    </div>
                    <Switch defaultChecked data-testid="switch-show-tooltips" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded border" />
                    <span className="text-sm text-muted-foreground">Orange (#FF6B00)</span>
                  </div>
                </div>

                <Button disabled={isSaving} data-testid="button-save-appearance">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Appearance Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}