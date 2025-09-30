import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { toast } from 'sonner';

export function DashboardNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Get user info from localStorage
      const email = localStorage.getItem("email") || "user@example.com";
      const username = localStorage.getItem("username") || email.split('@')[0];
      setUserInfo({ name: username, email });
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("phone_number");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    
    // Update state
    setIsLoggedIn(false);
    setIsAccountOpen(false);
    
    // Show success message
    toast.success("Logged out successfully!");
    
    // Navigate to home page
    navigate("/");
  };

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  const isActiveLink = (path: string) => {
    return location.pathname.includes(path) && path !== "/" ? true : location.pathname === path;
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/replaci-vision", label: "Replaci Vision" },
    { href: "/models", label: "My Models" },
    { href: "/subscriptions", label: "Subscriptions" },
    { href: "/manage-leads", label: "Manage Leads" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/lovable-uploads/024e0f4a-ad0b-49e0-b49c-5a3678ea979a.png" 
            alt="REPLACI Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold text-foreground">REPLACI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActiveLink(link.href)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Account Dropdown */}
          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-10 px-3"
                onClick={toggleAccountDropdown}
              >
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {/* Dropdown Menu */}
              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{userInfo.name}</p>
                        {/* <p className="text-xs text-muted-foreground">{userInfo.email}</p> */}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <div className="flex flex-col h-full">
                {/* User Info in Mobile */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 p-4 border-b border-border">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{userInfo.name}</p>
                      <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 py-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActiveLink(link.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Account Actions */}
                {isLoggedIn && (
                  <div className="mt-auto border-t border-border pt-4">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors rounded-md"
                    >
                      <User className="h-4 w-4" />
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors text-red-600 rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}