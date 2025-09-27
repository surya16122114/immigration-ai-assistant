import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: "fas fa-home",
    },
    {
      title: "Visa Guide",
      href: "/visa-guide", 
      icon: "fas fa-passport",
    },
    {
      title: "Chat Assistant",
      href: "/chat",
      icon: "fas fa-robot",
    },
    {
      title: "My Cases",
      href: "/cases",
      icon: "fas fa-tasks",
    },
    {
      title: "Alerts",
      href: "/alerts",
      icon: "fas fa-bell",
    },
    {
      title: "Documents",
      href: "/documents",
      icon: "fas fa-file-alt",
    },
    {
      title: "Updates",
      href: "/updates",
      icon: "fas fa-bullhorn",
    },
  ];

  const quickLinks = [
    {
      title: "USCIS Case Status",
      href: "https://egov.uscis.gov/casestatus/landing.do",
      icon: "fas fa-external-link-alt",
      external: true,
    },
    {
      title: "Visa Bulletin",
      href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
      icon: "fas fa-calendar-alt",
      external: true,
    },
    {
      title: "Processing Times",
      href: "https://egov.uscis.gov/processing-times/",
      icon: "fas fa-clock",
      external: true,
    },
    {
      title: "Fee Schedule",
      href: "https://www.uscis.gov/forms/filing-fees",
      icon: "fas fa-dollar-sign",
      external: true,
    },
  ];

  return (
    <div className={cn("flex flex-col w-64 bg-sidebar border-r border-sidebar-border", className)}>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <i className="fas fa-passport text-sidebar-primary text-xl"></i>
            <span className="font-bold text-sidebar-foreground">Immigration AI</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="mb-6">
          <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Navigation
          </h3>
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left",
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                data-testid={`sidebar-nav-${item.title.toLowerCase().replace(" ", "-")}`}
              >
                <i className={cn(item.icon, "mr-3 text-sm")}></i>
                {item.title}
              </Button>
            </Link>
          ))}
        </div>

        <div>
          <h3 className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Quick Links
          </h3>
          {quickLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              className="w-full justify-start text-left text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              asChild
              data-testid={`sidebar-quick-${link.title.toLowerCase().replace(" ", "-")}`}
            >
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <i className={cn(link.icon, "mr-3 text-sm")}></i>
                  {link.title}
                </a>
              ) : (
                <Link href={link.href}>
                  <div className="flex items-center">
                    <i className={cn(link.icon, "mr-3 text-sm")}></i>
                    {link.title}
                  </div>
                </Link>
              )}
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <i className="fas fa-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-sm mt-0.5"></i>
            <div>
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Legal Notice
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Not legal advice. Consult an attorney for your specific situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
