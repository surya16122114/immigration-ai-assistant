import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <i className="fas fa-passport text-primary text-2xl"></i>
              <span className="text-xl font-bold text-foreground">Immigration AI</span>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Trusted Immigration 
            <span className="text-primary"> AI Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get accurate, up-to-date immigration guidance powered by AI. 
            All information sourced from official USCIS and Department of State documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
              data-testid="button-get-started"
            >
              <i className="fas fa-rocket mr-2"></i>
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg border-border hover:bg-muted"
              data-testid="button-learn-more"
            >
              <i className="fas fa-info-circle mr-2"></i>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comprehensive Immigration Assistance
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-passport text-primary text-xl"></i>
                </div>
                <CardTitle>Visa Guidance</CardTitle>
                <CardDescription>
                  Complete guidance for H-1B, F-1, OPT, STEM OPT, L-1, O-1, and Green Card processes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-robot text-primary text-xl"></i>
                </div>
                <CardTitle>AI-Powered Chat</CardTitle>
                <CardDescription>
                  Get instant answers to immigration questions with AI trained on official documents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-file-alt text-primary text-xl"></i>
                </div>
                <CardTitle>Document Assistance</CardTitle>
                <CardDescription>
                  Help with forms, deadlines, fees, and document requirements for all processes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-bell text-primary text-xl"></i>
                </div>
                <CardTitle>Real-time Alerts</CardTitle>
                <CardDescription>
                  Stay updated with Visa Bulletin changes, USCIS policy updates, and deadlines
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-tasks text-primary text-xl"></i>
                </div>
                <CardTitle>Case Tracking</CardTitle>
                <CardDescription>
                  Monitor your immigration case progress and receive status updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-shield-alt text-primary text-xl"></i>
                </div>
                <CardTitle>Official Sources</CardTitle>
                <CardDescription>
                  All information sourced from USCIS, Department of State, and other official sources
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Trusted by Immigration Applicants Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <i className="fas fa-exclamation-triangle text-yellow-600 text-xl mt-1"></i>
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Important Legal Notice
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    This AI assistant provides general information only and is not a substitute for legal advice. 
                    Immigration law is complex and fact-specific. For legal advice regarding your specific situation, 
                    consult with a qualified immigration attorney. We are not a law firm and do not provide legal services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <i className="fas fa-passport text-primary text-xl"></i>
            <span className="text-lg font-bold text-foreground">Immigration AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Immigration AI Assistant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
