import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import CaseProgress from "@/components/dashboard/CaseProgress";
import SavedQueries from "@/components/dashboard/SavedQueries";
import AlertSubscriptions from "@/components/dashboard/AlertSubscriptions";
import PolicyUpdates from "@/components/dashboard/PolicyUpdates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("chat");

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
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area - offset by sidebar width */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-8 py-4 sticky top-0 z-40 backdrop-blur-sm bg-card/95">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Welcome back, <span data-testid="text-user-name">{user?.firstName || 'User'}</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered immigration guidance at your fingertips
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground">AI Status</p>
                <p className="text-sm font-semibold text-primary flex items-center mt-0.5">
                  <span className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Tabs for different sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted p-1">
              <TabsTrigger value="chat" className="px-6">
                <i className="fas fa-comments mr-2"></i>
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="cases" className="px-6">
                <i className="fas fa-briefcase mr-2"></i>
                My Cases
              </TabsTrigger>
              <TabsTrigger value="updates" className="px-6">
                <i className="fas fa-newspaper mr-2"></i>
                Updates
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab - Full Width */}
            <TabsContent value="chat" className="space-y-6">
              {/* Full Width Chat Interface */}
              <div className="max-w-5xl mx-auto">
                <ChatInterface />
              </div>

              {/* Saved Queries Below Chat */}
              <div className="max-w-5xl mx-auto">
                <SavedQueries />
              </div>
            </TabsContent>

            {/* Cases Tab - Asymmetric Grid */}
            <TabsContent value="cases" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Case Progress - Takes 2 columns */}
                <div className="xl:col-span-2">
                  <CaseProgress />
                </div>

                {/* Alert Subscriptions - Takes 1 column */}
                <div>
                  <AlertSubscriptions />

                  {/* Quick Resources */}
                  <div className="bg-card border border-border rounded-xl p-6 mt-6">
                    <h3 className="font-heading font-bold text-lg mb-4 flex items-center">
                      <i className="fas fa-link text-primary mr-2"></i>
                      Quick Links
                    </h3>
                    <div className="space-y-3">
                      <a 
                        href="https://egov.uscis.gov/casestatus/landing.do" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                        data-testid="link-case-status"
                      >
                        <span className="text-sm font-medium">USCIS Case Status</span>
                        <i className="fas fa-external-link-alt text-xs text-muted-foreground group-hover:text-primary"></i>
                      </a>
                      <a 
                        href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                        data-testid="link-visa-bulletin"
                      >
                        <span className="text-sm font-medium">Visa Bulletin</span>
                        <i className="fas fa-external-link-alt text-xs text-muted-foreground group-hover:text-primary"></i>
                      </a>
                      <a 
                        href="https://egov.uscis.gov/processing-times/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                        data-testid="link-processing-times"
                      >
                        <span className="text-sm font-medium">Processing Times</span>
                        <i className="fas fa-external-link-alt text-xs text-muted-foreground group-hover:text-primary"></i>
                      </a>
                      <a 
                        href="https://www.uscis.gov/forms/filing-fees" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                        data-testid="link-fee-schedule"
                      >
                        <span className="text-sm font-medium">Fee Schedule</span>
                        <i className="fas fa-external-link-alt text-xs text-muted-foreground group-hover:text-primary"></i>
                      </a>
                      <a 
                        href="https://www.aila.org/advo-media/tools/lawyer-referral" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                        data-testid="link-attorney-finder"
                      >
                        <span className="text-sm font-medium">Find Attorney</span>
                        <i className="fas fa-external-link-alt text-xs text-muted-foreground group-hover:text-primary"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Updates Tab */}
            <TabsContent value="updates" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <PolicyUpdates />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
