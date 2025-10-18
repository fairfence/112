import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Home from "@/pages/Home";
import StaffPortal from "@/pages/StaffPortal";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TestimonialsManager from "@/pages/admin/TestimonialsManager";
import ContentManager from "@/pages/admin/ContentManager";
import MediaManager from "@/pages/admin/MediaManager";
import DatabaseManager from "@/pages/admin/DatabaseManager";
import FAQManager from "@/pages/admin/FAQManager";
import SettingsManager from "@/pages/admin/SettingsManager";
import AdminLogin from "@/pages/AdminLogin";
import EmailTest from "@/pages/EmailTest";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/email-test" component={EmailTest} />
      <Route path="/admin/login" component={AdminLogin} />
      
      {/* New Admin Dashboard Routes */}
      <ProtectedRoute path="/admin/testimonials" component={TestimonialsManager} />
      <ProtectedRoute path="/admin/content" component={ContentManager} />
      <ProtectedRoute path="/admin/media" component={MediaManager} />
      <ProtectedRoute path="/admin/database" component={DatabaseManager} />
      <ProtectedRoute path="/admin/faq" component={FAQManager} />
      <ProtectedRoute path="/admin/settings" component={SettingsManager} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      
      {/* Legacy Admin Route - keep for backwards compatibility */}
      <ProtectedRoute path="/admin/legacy" component={StaffPortal} />
      <Route path="/staff" component={StaffPortal} /> {/* Legacy route */}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
