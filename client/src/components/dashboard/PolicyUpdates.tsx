import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PolicyUpdate {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  sourceUrl?: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

export default function PolicyUpdates() {
  const { data: updates, isLoading } = useQuery({
    queryKey: ["/api/policy-updates"],
    retry: false,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUpdateStatus = (publishedAt: string) => {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return { label: "New", variant: "default" as const };
    if (diffDays <= 30) return { label: "Updated", variant: "secondary" as const };
    return null;
  };

  if (isLoading) {
    return (
      <div className="card-premium">
        <div className="p-6 border-b border-border/50">
          <h3 className="font-heading font-bold text-xl flex items-center">
            <i className="fas fa-bullhorn text-primary mr-2"></i>
            Recent Policy Updates
          </h3>
        </div>
        <div className="divide-y divide-border/30">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Default sample updates if no data is available
  const defaultUpdates: PolicyUpdate[] = [
    {
      id: "1",
      title: "USCIS Extends Comment Period for H-1B Modernization Rule",
      summary: "Extended deadline for public comments on proposed changes to H-1B specialty occupation definition and criteria.",
      source: "USCIS",
      sourceUrl: "https://www.uscis.gov",
      category: "h1b",
      publishedAt: "2024-03-15T00:00:00Z",
      createdAt: "2024-03-15T00:00:00Z",
    },
    {
      id: "2",
      title: "April 2024 Visa Bulletin Released",
      summary: "Final action dates advance for EB-2 India and China. EB-3 dates remain current for most countries.",
      source: "Department of State",
      sourceUrl: "https://travel.state.gov",
      category: "visa_bulletin",
      publishedAt: "2024-03-12T00:00:00Z",
      createdAt: "2024-03-12T00:00:00Z",
    },
  ];

  const displayUpdates = updates && updates.length > 0 ? updates : defaultUpdates;

  return (
    <div className="card-premium">
      <div className="p-6 border-b border-border/50">
        <h3 className="font-heading font-bold text-xl flex items-center">
          <i className="fas fa-bullhorn text-primary mr-2"></i>
          Recent Policy Updates
        </h3>
      </div>
      <div className="divide-y divide-border/30">
        {displayUpdates.map((update: PolicyUpdate) => {
          const statusBadge = getUpdateStatus(update.publishedAt);
          return (
            <div
              key={update.id}
              className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              data-testid={`policy-update-${update.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">{update.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{update.summary}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <i className="fas fa-calendar mr-1"></i>
                    <span>{formatDate(update.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <i className="fas fa-building mr-1"></i>
                    <span>{update.source}</span>
                    {update.sourceUrl && (
                      <>
                        <span className="mx-2">•</span>
                        <a
                          href={update.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          Source
                        </a>
                      </>
                    )}
                  </div>
                </div>
                {statusBadge && (
                  <Badge variant={statusBadge.variant} className="ml-2">
                    {statusBadge.label}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="text-primary text-sm font-medium hover:underline"
          data-testid="button-view-all-updates"
        >
          View all updates
        </Button>
      </div>
    </div>
  );
}
