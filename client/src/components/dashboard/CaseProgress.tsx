import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Case {
  id: string;
  caseType: string;
  receiptNumber?: string;
  status: string;
  progress: number;
  expectedCompletion?: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CaseProgress() {
  const { toast } = useToast();

  const { data: cases, isLoading } = useQuery({
    queryKey: ["/api/cases"],
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
    },
  });

  const createCaseMutation = useMutation({
    mutationFn: async (caseData: Partial<Case>) => {
      const response = await apiRequest("POST", "/api/cases", caseData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/cases"]);
      toast({
        title: "Success",
        description: "Case added successfully",
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
        description: "Failed to add case",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'in-progress':
      case 'pending':
        return 'bg-blue-500';
      case 'denied':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddSampleCase = () => {
    createCaseMutation.mutate({
      caseType: "H-1B",
      title: "H-1B Extension",
      status: "in-progress",
      progress: 60,
      receiptNumber: "MSC2490123456",
      expectedCompletion: "April 2024",
      description: "H-1B extension application filed with premium processing"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-tasks text-primary mr-2"></i>
            My Immigration Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-sm">
          <i className="fas fa-tasks text-primary mr-2"></i>
          My Immigration Cases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases && cases.length > 0 ? (
            cases.map((caseItem: Case) => (
              <div key={caseItem.id} className="border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{caseItem.title}</span>
                  <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status}
                  </Badge>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex-1 bg-muted rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(caseItem.status)}`}
                      style={{ width: `${caseItem.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{caseItem.progress}%</span>
                </div>
                
                {caseItem.receiptNumber && (
                  <p className="text-xs text-muted-foreground">
                    Receipt Number: <span className="font-mono">{caseItem.receiptNumber}</span>
                  </p>
                )}
                
                {caseItem.expectedCompletion && (
                  <p className="text-xs text-muted-foreground">
                    Expected completion: {caseItem.expectedCompletion}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-inbox text-muted-foreground text-3xl mb-4"></i>
              <p className="text-sm text-muted-foreground mb-4">No cases tracked yet</p>
              <Button 
                onClick={handleAddSampleCase}
                variant="outline" 
                size="sm"
                disabled={createCaseMutation.isPending}
                data-testid="button-add-sample-case"
              >
                Add Sample Case
              </Button>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-primary text-sm font-medium hover:underline"
          data-testid="button-track-new-case"
        >
          + Track new case
        </Button>
      </CardContent>
    </Card>
  );
}
