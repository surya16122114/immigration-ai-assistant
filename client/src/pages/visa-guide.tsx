import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VisaGuide() {
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
          <p className="mt-4 text-muted-foreground">Loading visa guide...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const visaCategories = {
    nonimmigrant: [
      {
        type: "H-1B",
        title: "H-1B Specialty Occupation",
        description: "For workers in specialty occupations requiring a bachelor's degree or higher",
        requirements: ["Bachelor's degree or equivalent", "Job offer from US employer", "Specialty occupation position"],
        duration: "Up to 3 years, extendable to 6 years total",
        annualCap: "65,000 + 20,000 (US Master's)",
        icon: "fas fa-briefcase"
      },
      {
        type: "F-1",
        title: "F-1 Student Visa",
        description: "For academic studies at accredited US institutions",
        requirements: ["Acceptance at SEVP-approved school", "Financial support proof", "Intent to return home"],
        duration: "Duration of studies plus grace period",
        annualCap: "No cap",
        icon: "fas fa-graduation-cap"
      },
      {
        type: "OPT",
        title: "Optional Practical Training",
        description: "Work authorization for F-1 students in their field of study",
        requirements: ["Valid F-1 status", "Enrolled full-time for one year", "Job related to major"],
        duration: "12 months, 24 months STEM extension",
        annualCap: "No cap",
        icon: "fas fa-laptop-code"
      },
      {
        type: "L-1",
        title: "L-1 Intracompany Transfer",
        description: "For employees transferred to US office of same company",
        requirements: ["1 year employment abroad", "Managerial/executive/specialized role", "Related US entity"],
        duration: "L-1A: 7 years, L-1B: 5 years",
        annualCap: "No cap",
        icon: "fas fa-building"
      }
    ],
    immigrant: [
      {
        type: "EB-1",
        title: "EB-1 Priority Workers",
        description: "For individuals with extraordinary ability, outstanding professors/researchers, or multinational executives",
        requirements: ["Extraordinary ability or", "Outstanding professor/researcher or", "Multinational executive/manager"],
        duration: "Permanent residence",
        annualCap: "40,040 per year",
        icon: "fas fa-star"
      },
      {
        type: "EB-2",
        title: "EB-2 Advanced Degree",
        description: "For professionals with advanced degrees or exceptional ability",
        requirements: ["Advanced degree or", "Exceptional ability", "Labor certification (usually required)"],
        duration: "Permanent residence",
        annualCap: "40,040 per year",
        icon: "fas fa-certificate"
      },
      {
        type: "EB-3",
        title: "EB-3 Skilled Workers",
        description: "For skilled workers, professionals, and other workers",
        requirements: ["Bachelor's degree or", "2+ years work experience or", "Less than 2 years experience"],
        duration: "Permanent residence",
        annualCap: "40,040 per year",
        icon: "fas fa-tools"
      },
      {
        type: "EB-5",
        title: "EB-5 Investor Visa",
        description: "For investors making qualifying investments in US businesses",
        requirements: ["$1.8M investment or", "$900K in targeted area", "Create 10 full-time jobs"],
        duration: "Permanent residence",
        annualCap: "10,000 per year",
        icon: "fas fa-dollar-sign"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Visa Guide</h1>
          <p className="text-muted-foreground">
            Comprehensive guide to US immigration visa categories, requirements, and processes
          </p>
        </div>

        <Tabs defaultValue="nonimmigrant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nonimmigrant" data-testid="tab-nonimmigrant">
              Nonimmigrant Visas
            </TabsTrigger>
            <TabsTrigger value="immigrant" data-testid="tab-immigrant">
              Immigrant Visas (Green Cards)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nonimmigrant" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {visaCategories.nonimmigrant.map((visa, index) => (
                <Card key={visa.type} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className={`${visa.icon} text-primary`}></i>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{visa.title}</CardTitle>
                          <Badge variant="secondary">{visa.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{visa.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {visa.requirements.map((req, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p className="text-muted-foreground">{visa.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium">Annual Cap:</span>
                        <p className="text-muted-foreground">{visa.annualCap}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      data-testid={`button-learn-more-${visa.type.toLowerCase()}`}
                    >
                      Learn More About {visa.type}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="immigrant" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {visaCategories.immigrant.map((visa, index) => (
                <Card key={visa.type} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <i className={`${visa.icon} text-accent`}></i>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{visa.title}</CardTitle>
                          <Badge variant="outline" className="border-accent text-accent">{visa.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{visa.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {visa.requirements.map((req, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Status:</span>
                        <p className="text-muted-foreground">{visa.duration}</p>
                      </div>
                      <div>
                        <span className="font-medium">Annual Limit:</span>
                        <p className="text-muted-foreground">{visa.annualCap}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      data-testid={`button-learn-more-${visa.type.toLowerCase()}`}
                    >
                      Learn More About {visa.type}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Processing Information */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
              <i className="fas fa-info-circle mr-2"></i>
              Important Processing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
            <p>
              • Processing times vary significantly by case type, service center, and current USCIS workload
            </p>
            <p>
              • Priority dates for employment-based green cards may have substantial waiting periods for applicants from India and China
            </p>
            <p>
              • Premium processing is available for certain petition types for an additional fee
            </p>
            <p>
              • Always consult the most current USCIS instructions and forms before filing
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
