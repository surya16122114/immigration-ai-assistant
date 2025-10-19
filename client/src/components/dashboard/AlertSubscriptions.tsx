import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

interface AlertSubscription {
  id: string;
  alertType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AlertSubscriptions() {
  const { toast } = useToast();

  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ["/api/alert-subscriptions"],
  });

  // Handle query errors (replaces deprecated onError)
  if (error && isUnauthorizedError(error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  }

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/alert-subscriptions/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alert-subscriptions"] });
      toast({
        title: "Success",
        description: "Alert subscription updated",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (alertType: string) => {
      const response = await apiRequest("POST", "/api/alert-subscriptions", {
        alertType,
        isActive: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alert-subscriptions"] });
      toast({
        title: "Success",
        description: "Alert subscription created",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  const alertTypes = [
    {
      type: "visa_bulletin",
      title: "Visa Bulletin Updates",
      description: "Monthly priority date changes",
    },
    {
      type: "h1b_lottery",
      title: "H-1B Lottery Results",
      description: "Notification when results are announced",
    },
    {
      type: "policy_changes",
      title: "Policy Changes",
      description: "USCIS and DOS policy updates",
    },
  ];

  const handleToggleAlert = (alertType: string, currentState: boolean) => {
    const subscription = subscriptions?.find((sub: AlertSubscription) => sub.alertType === alertType);
    
    if (subscription) {
      updateSubscriptionMutation.mutate({
        id: subscription.id,
        isActive: !currentState,
      });
    } else {
      createSubscriptionMutation.mutate(alertType);
    }
  };

  const isAlertActive = (alertType: string) => {
    const subscription = subscriptions?.find((sub: AlertSubscription) => sub.alertType === alertType);
    return subscription?.isActive || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-sm">
            <i className="fas fa-bell text-primary mr-2"></i>
            Alert Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <i className="fas fa-bell text-primary mr-2"></i>
          Alert Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertTypes.map((alertType) => {
            const isActive = isAlertActive(alertType.type);
            return (
              <div
                key={alertType.type}
                className="flex items-center justify-between p-2 border border-border rounded"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{alertType.title}</p>
                  <p className="text-xs text-muted-foreground">{alertType.description}</p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => handleToggleAlert(alertType.type, isActive)}
                  disabled={updateSubscriptionMutation.isPending || createSubscriptionMutation.isPending}
                  data-testid={`switch-alert-${alertType.type}`}
                />
              </div>
            );
          })}
        </div>
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary text-sm font-medium hover:underline"
          data-testid="button-manage-alerts"
        >
          Manage all alerts
        </Button>
      </CardContent>
    </Card>
  );
}
