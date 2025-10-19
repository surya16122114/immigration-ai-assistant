import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: "fas fa-th-large" },
    { href: "/visa-guide", label: "Visa Guides", icon: "fas fa-passport" },
    { href: "/alerts", label: "Alerts", icon: "fas fa-bell" },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getFullName = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    return "User";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/">
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-teal rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <i className="fas fa-globe-americas text-white text-lg"></i>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground">ImmigrationAI</h1>
              <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`nav-link-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <i className={`${item.icon} text-lg w-5`}></i>
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="button-user-menu"
            >
              <Avatar className="w-9 h-9">
                <AvatarImage
                  src={user?.profileImageUrl}
                  alt={getFullName(user?.firstName, user?.lastName)}
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {getInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">
                  {getFullName(user?.firstName, user?.lastName)}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <i className="fas fa-ellipsis-v text-muted-foreground"></i>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="menu-item-profile">
              <i className="fas fa-user mr-2"></i>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-item-settings">
              <i className="fas fa-cog mr-2"></i>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="menu-item-help">
              <i className="fas fa-question-circle mr-2"></i>
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
              data-testid="menu-item-logout"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
