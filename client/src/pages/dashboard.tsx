import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import CaseProgress from "@/components/dashboard/CaseProgress";
import SavedQueries from "@/components/dashboard/SavedQueries";
import AlertSubscriptions from "@/components/dashboard/AlertSubscriptions";
import PolicyUpdates from "@/components/dashboard/PolicyUpdates";

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
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden px-8 pt-12 pb-8">
          {/* Background Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <h1 className="text-5xl font-heading font-bold mb-4">
              Get Expert Help to{" "}
              <span className="text-gradient">Secure Your U.S Visa</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              AI tools and expert lawyers guide you to the right visa and help you apply with confidence.
            </p>
            <button className="btn-premium" data-testid="button-free-evaluation">
              Free Visa Evaluation
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="px-8 pb-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Chat Interface - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <ChatInterface />
              <SavedQueries />
            </div>

            {/* Right Sidebar - Takes 1 column */}
            <div className="space-y-6">
              {/* Success Rate Card */}
              <div className="card-premium p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Chances of Success</h3>
                <div className="flex items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                    <svg className="progress-ring-glow w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(240, 10%, 20%)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="351.858"
                        strokeDashoffset="87.965"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(160, 60%, 50%)" />
                          <stop offset="100%" stopColor="hsl(160, 60%, 40%)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gradient">83%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Based on your profile and current immigration trends
                </p>
              </div>

              <CaseProgress />
              <AlertSubscriptions />
            </div>
          </div>

          {/* Policy Updates - Full Width */}
          <div className="max-w-6xl mx-auto mt-6">
            <PolicyUpdates />
          </div>
        </div>
      </main>
    </div>
  );
}
