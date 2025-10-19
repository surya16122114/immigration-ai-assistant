import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SavedQuery {
  id: string;
  title: string;
  query: string;
  response?: string;
  tags?: string[];
  createdAt: string;
}

export default function SavedQueries() {
  const { toast } = useToast();

  const { data: savedQueries, isLoading, error } = useQuery({
    queryKey: ["/api/saved-queries"],
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

  const createSampleQueryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/saved-queries", {
        title: "H-1B to Green Card Timeline",
        query: "What are the steps to transition from H-1B to Green Card and how long does it typically take?",
        response: "The transition from H-1B to Green Card typically involves: 1) Labor Certification (PERM) - 6-18 months, 2) I-140 petition - 4-8 months, 3) I-485 adjustment of status or consular processing - 8-20 months. Total timeline varies by country and category.",
        tags: ["h1b", "green-card", "timeline"]
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-queries"] });
      toast({
        title: "Success",
        description: "Sample query added",
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
        description: "Failed to add sample query",
        variant: "destructive",
      });
    },
  });

  const deleteQueryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/saved-queries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-queries"] });
      toast({
        title: "Success",
        description: "Query deleted",
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
        description: "Failed to delete query",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="card-premium">
        <div className="p-4 border-b border-border/50">
          <h3 className="font-heading font-semibold text-lg flex items-center">
            <i className="fas fa-bookmark text-primary mr-2"></i>
            Saved Queries
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-heading font-semibold text-lg flex items-center">
          <i className="fas fa-bookmark text-primary mr-2"></i>
          Saved Queries
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {savedQueries && savedQueries.length > 0 ? (
            savedQueries.map((query: SavedQuery) => (
              <div 
                key={query.id} 
                className="border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors group"
                data-testid={`saved-query-${query.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1 truncate">{query.title}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {query.query.length > 60 ? `${query.query.substring(0, 60)}...` : query.query}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatDate(query.createdAt)}</span>
                      <i className="fas fa-chevron-right text-xs text-muted-foreground"></i>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQueryMutation.mutate(query.id);
                    }}
                    data-testid={`button-delete-query-${query.id}`}
                  >
                    <i className="fas fa-trash text-destructive text-xs"></i>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-bookmark text-muted-foreground text-3xl mb-4"></i>
              <p className="text-sm text-muted-foreground mb-4">No saved queries yet</p>
              <Button 
                onClick={() => createSampleQueryMutation.mutate()}
                variant="outline" 
                size="sm"
                disabled={createSampleQueryMutation.isPending}
                data-testid="button-add-sample-query"
              >
                Add Sample Query
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
