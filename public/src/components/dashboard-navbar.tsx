import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/api/apiService";
import moment from "moment";

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export function DashboardNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: "", email: "" });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            // Get user info from localStorage
            const email = localStorage.getItem("email") || "user@example.com";
            const username =
                localStorage.getItem("username") || email.split("@")[0];
            setUserInfo({ name: username, email });
            
            // Fetch notifications when component mounts
            getNotifications();
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsAccountOpen(false);
            }
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node)
            ) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getNotifications = async () => {
        if (!isLoggedIn) return;
        
        setLoading(true);
        try {
            const response = await apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/notifications/`);
            console.log(response, "notications response");
            if (response?.data?.status === "true") {
                const notificationsData = response.data.result;
                console.log(notificationsData, "notifications data");
                setNotifications(notificationsData);
                
                // Calculate unread count
                const unreadNotifications = notificationsData.filter(
                    (notification: Notification) => !notification.is_read
                );
                setUnreadCount(unreadNotifications.length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
            // toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId: number) => {
        try {
            await apiClient.put(`${import.meta.env.VITE_API_BASE_URL}/notifications/${notificationId}/mark-read/`);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === notificationId 
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("phone_number");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("subscriptionDetails");

        // Update state
        setIsLoggedIn(false);
        setIsAccountOpen(false);
        setIsNotificationOpen(false);
        setNotifications([]);
        setUnreadCount(0);

        // Show success message
        toast.success("Logged out successfully!");

        // Navigate to home page
        navigate("/");
    };

    const toggleAccountDropdown = () => {
        setIsAccountOpen(!isAccountOpen);
        setIsNotificationOpen(false); // Close notifications when opening account
    };

    const toggleNotificationDropdown = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsAccountOpen(false); // Close account when opening notifications
    };

    const isActiveLink = (path: string) => {
        return location.pathname.includes(path) && path !== "/"
            ? true
            : location.pathname === path;
    };

    const navigationLinks = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/subscriptions", label: "Subscriptions" },
        { href: "/settings", label: "Settings" },
        { href: "/tryon", label: "Replaci Vision" },
    ];

    // Get latest 5 unread notifications for dropdown
    const recentNotifications = notifications
        .slice(0, 5);

    return (
        <nav className="fixed top-0 left-0 right-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <img
                        src="/lovable-uploads/024e0f4a-ad0b-49e0-b49c-5a3678ea979a.png"
                        alt="REPLACI Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="text-xl font-bold text-foreground">
                        REPLACI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-6">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={`text-sm font-medium transition-all duration-300 relative ${
                                link.href === "/tryon"
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 font-semibold pb-2 hover:from-purple-600 hover:via-pink-600 hover:to-red-600"
                                    : isActiveLink(link.href)
                                    ? "text-primary border-b-2 border-primary pb-1 hover:text-primary "
                                    : "text-muted-foreground pb-1"
                            }`}
                        >
                            {link.label}

                            {/* Special gradient underline for tryon link - always visible */}
                            {link.href === "/tryon" && (
                                <>
                                    {/* Main gradient underline */}
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full"></span>

                                    {/* Animated glow effect */}
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full animate-pulse opacity-75"></span>

                                    {/* Active state additional glow */}
                                    {isActiveLink(link.href) && (
                                        <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full blur-sm opacity-60 animate-pulse"></span>
                                    )}
                                </>
                            )}

                            {/* Regular underline for other active links */}
                            {isActiveLink(link.href) &&
                                link.href !== "/tryon" && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                                )}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right Section */}
                <div className="hidden lg:flex items-center gap-4">
                    {/* Notifications */}
                    {isLoggedIn && (
                        <div className="relative" ref={notificationRef}>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="relative"
                                onClick={toggleNotificationDropdown}
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </Button>

                            {/* Notifications Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                                        <h3 className="font-semibold text-sm">Notifications</h3>
                                        <Link 
                                            to="/notifications" 
                                            className="text-xs text-primary hover:underline"
                                            onClick={() => setIsNotificationOpen(false)}
                                        >
                                            View All
                                        </Link>
                                    </div>

                                    {/* Notifications List */}
                                    <div className="max-h-80 overflow-y-auto">
                                        {loading ? (
                                            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                                                Loading notifications...
                                            </div>
                                        ) : recentNotifications.length > 0 ? (
                                            recentNotifications.map((notification) => (
                                                <div 
                                                    key={notification.id}
                                                    className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                                                    onClick={() => markNotificationAsRead(notification.id)}
                                                >
                                                    <p className="text-sm font-medium text-foreground">
                                                        #{notification.id} {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {moment(notification.created_at).fromNow()}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                                                No new notifications
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Account Dropdown */}
                    {isLoggedIn && (
                        <div className="relative z-200" ref={dropdownRef}>
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
                                <div className="absolute right-0 z-20 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg py-2">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {userInfo.name}
                                                </p>
                                                {/* <p className="text-xs text-muted-foreground">{userInfo.email}</p> */}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                                            onClick={() =>
                                                setIsAccountOpen(false)
                                            }
                                        >
                                            <User className="h-4 w-4" />
                                            My Account
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                                            onClick={() =>
                                                setIsAccountOpen(false)
                                            }
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
                                            <p className="font-medium">
                                                {userInfo.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {userInfo.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Notifications */}
                                {isLoggedIn && (
                                    <div className="px-4 py-2 border-b border-border">
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start gap-3"
                                            onClick={() => navigate('/notifications')}
                                        >
                                            <Bell className="h-4 w-4" />
                                            Notifications
                                            {unreadCount > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Button>
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