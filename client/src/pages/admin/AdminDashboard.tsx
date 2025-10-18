import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Database, 
  MessageCircle, 
  HelpCircle, 
  Image, 
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch dashboard stats
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

  const stats = [
    {
      title: "Site Content Items",
      value: siteContent?.data?.length || 0,
      description: "Active content sections",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Testimonials",
      value: testimonials?.data?.length || 0,
      description: "Customer reviews",
      icon: MessageCircle,
      color: "text-green-600"
    },
    {
      title: "FAQ Items",
      value: faqItems?.data?.length || 0,
      description: "Frequently asked questions",
      icon: HelpCircle,
      color: "text-yellow-600"
    },
    {
      title: "System Status",
      value: "Healthy",
      description: "All systems operational",
      icon: TrendingUp,
      color: "text-emerald-600"
    }
  ];

  const recentActivity = [
    {
      action: "Content updated",
      item: "Hero section title",
      time: "2 minutes ago",
      type: "content"
    },
    {
      action: "New testimonial",
      item: "Sarah Johnson review",
      time: "1 hour ago",
      type: "testimonial"
    },
    {
      action: "FAQ updated",
      item: "Pricing question",
      time: "3 hours ago",
      type: "faq"
    }
  ];

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle="Welcome back! Here's what's happening with your website."
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href="/admin/testimonials" 
                className="flex items-center gap-3 p-3 rounded-lg hover-elevate border transition-colors"
                data-testid="quick-action-testimonials"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Manage Testimonials</p>
                  <p className="text-sm text-muted-foreground">Add or edit reviews</p>
                </div>
              </a>
              
              <a 
                href="/admin/content" 
                className="flex items-center gap-3 p-3 rounded-lg hover-elevate border transition-colors"
                data-testid="quick-action-content"
              >
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Update Content</p>
                  <p className="text-sm text-muted-foreground">Edit site content</p>
                </div>
              </a>
              
              <a 
                href="/admin/media" 
                className="flex items-center gap-3 p-3 rounded-lg hover-elevate border transition-colors"
                data-testid="quick-action-media"
              >
                <Image className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">Media Library</p>
                  <p className="text-sm text-muted-foreground">Upload images</p>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest changes to your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'content' ? 'bg-blue-500' :
                    activity.type === 'testimonial' ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.item}</p>
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>
                Current system health
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="secondary" className="text-green-600">
                  <Database className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge variant="secondary" className="text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="secondary" className="text-green-600">
                  <Image className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}