import { 
  Calendar, 
  Database, 
  Edit3, 
  HelpCircle, 
  Image, 
  MessageCircle, 
  Settings, 
  BarChart3,
  Users,
  FileText
} from "lucide-react";
import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

// Admin navigation items
const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    description: "Overview and analytics"
  },
  {
    title: "Site Content",
    url: "/admin/content",
    icon: Edit3,
    description: "Manage website content"
  },
  {
    title: "Testimonials",
    url: "/admin/testimonials",
    icon: MessageCircle,
    description: "Customer reviews"
  },
  {
    title: "FAQ",
    url: "/admin/faq",
    icon: HelpCircle,
    description: "Frequently asked questions"
  },
  {
    title: "Media Library",
    url: "/admin/media",
    icon: Image,
    description: "Images and files"
  },
  {
    title: "Database",
    url: "/admin/database",
    icon: Database,
    description: "Database management"
  }
];

const systemNavItems = [
  {
    title: "Settings",
    url: "/admin/settings", 
    icon: Settings,
    description: "System configuration"
  }
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Edit3 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">FairFence</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    tooltip={item.description}
                  >
                    <a 
                      href={item.url}
                      data-testid={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location === item.url}
                    tooltip={item.description}
                  >
                    <a 
                      href={item.url}
                      data-testid={`sidebar-link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-full justify-center">
            <Calendar className="h-3 w-3 mr-1" />
            Online
          </Badge>
          <p className="text-xs text-center text-muted-foreground">
            FairFence Admin v1.0
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}