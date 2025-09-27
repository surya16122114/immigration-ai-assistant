import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import ChatInterface from "@/components/chat/ChatInterface";
import CaseProgress from "@/components/dashboard/CaseProgress";
import SavedQueries from "@/components/dashboard/SavedQueries";
import AlertSubscriptions from "@/components/dashboard/AlertSubscriptions";
import PolicyUpdates from "@/components/dashboard/PolicyUpdates";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, <span data-testid="text-user-name">{user?.firstName || 'User'}</span>!
              </h1>
              <p className="text-blue-100 mb-4">Get accurate, up-to-date immigration guidance powered by AI</p>
              <div className="flex items-center text-blue-100 text-sm">
                <i className="fas fa-shield-alt mr-2"></i>
                <span>All information sourced from official USCIS and Department of State documents</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:shadow-md transition-shadow"
                data-testid="button-h1b-status"
              >
                <i className="fas fa-passport text-primary text-2xl"></i>
                <div className="text-sm font-medium">H-1B Status</div>
                <div className="text-xs text-muted-foreground">Check lottery results</div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:shadow-md transition-shadow"
                data-testid="button-opt-guide"
              >
                <i className="fas fa-graduation-cap text-primary text-2xl"></i>
                <div className="text-sm font-medium">OPT Guide</div>
                <div className="text-xs text-muted-foreground">Application process</div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:shadow-md transition-shadow"
                data-testid="button-form-i485"
              >
                <i className="fas fa-file-alt text-primary text-2xl"></i>
                <div className="text-sm font-medium">Form I-485</div>
                <div className="text-xs text-muted-foreground">Green card application</div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 border-border hover:shadow-md transition-shadow"
                data-testid="button-visa-bulletin"
              >
                <i className="fas fa-calendar-alt text-primary text-2xl"></i>
                <div className="text-sm font-medium">Visa Bulletin</div>
                <div className="text-xs text-muted-foreground">Current dates</div>
              </Button>
            </div>

            {/* AI Chat Interface */}
            <ChatInterface />

            {/* Recent Policy Updates */}
            <PolicyUpdates />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CaseProgress />
            <SavedQueries />
            <AlertSubscriptions />

            {/* Quick Resources */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-4 flex items-center">
                <i className="fas fa-external-link-alt text-primary mr-2"></i>
                Quick Resources
              </h3>
              <div className="space-y-2">
                <a 
                  href="https://egov.uscis.gov/casestatus/landing.do" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                  data-testid="link-case-status"
                >
                  USCIS Case Status Tool
                </a>
                <a 
                  href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                  data-testid="link-visa-bulletin"
                >
                  Current Visa Bulletin
                </a>
                <a 
                  href="https://egov.uscis.gov/processing-times/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                  data-testid="link-processing-times"
                >
                  Processing Times
                </a>
                <a 
                  href="https://www.uscis.gov/forms/filing-fees" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                  data-testid="link-fee-schedule"
                >
                  Fee Schedule
                </a>
                <a 
                  href="https://www.aila.org/advo-media/tools/lawyer-referral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-primary hover:underline"
                  data-testid="link-attorney-finder"
                >
                  Find Immigration Attorney
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
