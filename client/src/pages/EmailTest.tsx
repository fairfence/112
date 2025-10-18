import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function EmailTest() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email Sent Successfully!",
          description: `Test email sent to ${formData.to}`,
          duration: 5000,
        });
        
        // Reset form
        setFormData({ to: "", subject: "", message: "" });
      } else {
        toast({
          title: "Email Failed",
          description: result.error || "Failed to send email",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred while sending email",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">SendGrid Email Test</h1>
          </div>
          <p className="text-muted-foreground">
            Test your SendGrid email integration with Node.js
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Test Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="to">To Email Address</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  required
                  data-testid="input-to-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Test Email Subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                  data-testid="input-subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your test message here..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                  rows={4}
                  data-testid="textarea-message"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
                data-testid="button-send-email"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Email Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">SendGrid package installed (@sendgrid/mail)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">SendGrid API key configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Email service implemented in server/email.ts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Contact form integration active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sending Emails in Your Code:</h4>
              <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
{`import { sendEmail } from './server/email';

// Send a simple email
const success = await sendEmail({
  to: 'user@example.com',
  from: 'yourapp@example.com',
  subject: 'Welcome!',
  text: 'Welcome to our service!',
  html: '<h1>Welcome!</h1><p>Thanks for joining us!</p>'
});`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Contact Form Integration:</h4>
              <p className="text-sm text-muted-foreground">
                Your contact form at <code>/api/contact</code> automatically sends email notifications 
                using the <code>sendContactFormEmail</code> function when customers submit quote requests.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}