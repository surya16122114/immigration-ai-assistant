import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import AlertSubscriptions from "@/components/dashboard/AlertSubscriptions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Alerts() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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
          <p className="mt-4 text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const alertTypes = [
    {
      type: "visa_bulletin",
      title: "Visa Bulletin Updates",
      description: "Monthly priority date changes for employment and family-based green cards",
      frequency: "Monthly",
      icon: "fas fa-calendar-alt",
      examples: [
        "EB-2 India advances by 2 weeks",
        "EB-3 dates become current for all countries",
        "Family-based priority dates retrogress"
      ]
    },
    {
      type: "h1b_lottery",
      title: "H-1B Lottery Results",
      description: "Notifications when H-1B lottery results are announced",
      frequency: "Annually",
      icon: "fas fa-dice",
      examples: [
        "FY2025 H-1B lottery results available",
        "Second lottery round announced",
        "Registration period opens"
      ]
    },
    {
      type: "policy_changes",
      title: "Policy Changes",
      description: "USCIS and Department of State policy updates and rule changes",
      frequency: "As needed",
      icon: "fas fa-gavel",
      examples: [
        "New H-1B specialty occupation rules",
        "STEM OPT extension updates",
        "Fee schedule changes"
      ]
    },
    {
      type: "case_updates",
      title: "Case Status Updates",
      description: "Updates on your tracked immigration cases",
      frequency: "Real-time",
      icon: "fas fa-clipboard-check",
      examples: [
        "Case was approved",
        "RFE response received",
        "Interview scheduled"
      ]
    },
    {
      type: "deadlines",
      title: "Important Deadlines",
      description: "Reminders for application deadlines and renewal dates",
      frequency: "As needed",
      icon: "fas fa-clock",
      examples: [
        "OPT application deadline approaching",
        "H-1B extension filing reminder",
        "EAD renewal due soon"
      ]
    },
    {
      type: "processing_times",
      title: "Processing Time Changes",
      description: "Significant changes in USCIS processing times",
      frequency: "Monthly",
      icon: "fas fa-hourglass-half",
      examples: [
        "I-485 processing times increased",
        "Premium processing restored",
        "Service center transfers"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Alert Management</h1>
          <p className="text-muted-foreground">
            Stay informed with real-time immigration updates and never miss important deadlines
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Alert Subscriptions */}
          <div className="lg:col-span-1">
            <AlertSubscriptions />
          </div>

          {/* Available Alert Types */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-bell text-primary mr-2"></i>
                  Available Alert Types
                </CardTitle>
                <CardDescription>
                  Choose which types of immigration updates you'd like to receive
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-6">
              {alertTypes.map((alert) => (
                <Card key={alert.type} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className={`${alert.icon} text-primary`}></i>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{alert.title}</CardTitle>
                          <CardDescription className="mt-1">{alert.description}</CardDescription>
                          <Badge variant="secondary" className="mt-2">{alert.frequency}</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        data-testid={`button-subscribe-${alert.type}`}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Example Alerts:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {alert.examples.map((example, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Email Preferences */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-envelope text-primary mr-2"></i>
              Email Preferences
            </CardTitle>
            <CardDescription>
              Customize how and when you receive alert notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">SMS notifications (coming soon)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm">Dashboard notifications</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Frequency Settings</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="frequency" defaultChecked className="border-border" />
                    <span className="text-sm">Immediate (as they happen)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="frequency" className="border-border" />
                    <span className="text-sm">Daily digest</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="frequency" className="border-border" />
                    <span className="text-sm">Weekly summary</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button data-testid="button-save-preferences">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
