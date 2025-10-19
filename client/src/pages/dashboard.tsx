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
        {/* Welcome Header */}
        <div className="px-8 pt-8 pb-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-heading font-bold mb-2">
              Welcome back, <span className="text-gradient">{user?.first_name || 'there'}</span>!
            </h1>
            <p className="text-muted-foreground">
              Your immigration assistant dashboard
            </p>
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
