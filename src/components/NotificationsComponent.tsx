import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { toast } from "sonner";
import apiClient from "@/api/apiService";
import { Bell, Check, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

const NotificationsComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [showReadOnly, setShowReadOnly] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/notifications/`);
            if (response?.data?.status === "true") {
                setNotifications(response.data.result);
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
            
            toast.success("Notification marked as read");
        } catch (error) {
            console.error("Error marking notification as read:", error);
            toast.error("Failed to mark notification as read");
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.is_read);
            
            // Mark all unread notifications as read
            await Promise.all(
                unreadNotifications.map(notification =>
                    apiClient.put(`${import.meta.env.VITE_API_BASE_URL}/notifications/${notification.id}/mark-read/`)
                )
            );

            // Update local state
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, is_read: true }))
            );

            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            toast.error("Failed to mark all notifications as read");
        }
    };

    // Filter notifications based on read status
    const filteredNotifications = showReadOnly
        ? notifications.filter(n => n.is_read)
        : notifications;

    // Pagination logic
    const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const readCount = notifications.filter(n => n.is_read).length;

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />

            <main className="pt-16">
                {/* Notifications Header */}
                <section className="relative py-8 border-b bg-muted/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                                    <Bell className="h-8 w-8" />
                                    Notifications
                                </h1>
                                <p className="text-muted-foreground">
                                    Stay updated with your account activity and system updates
                                </p>
                            </div>

                            {/* Filter and Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        variant={!showReadOnly ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            setShowReadOnly(false);
                                            setCurrentPage(1);
                                        }}
                                        className="text-xs"
                                    >
                                        All ({notifications.length})
                                    </Button>
                                    <Button
                                        variant={showReadOnly ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                            setShowReadOnly(true);
                                            setCurrentPage(1);
                                        }}
                                        className="text-xs"
                                    >
                                        Read ({readCount})
                                    </Button>
                                </div>
                                
                                {unreadCount > 0 && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={markAllAsRead}
                                        className="text-xs"
                                    >
                                        <Check className="h-4 w-4 mr-1" />
                                        Mark All Read
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Content */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <Card className="border-sage/20 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span>
                                        {showReadOnly ? "Read Notifications" : "All Notifications"}
                                    </span>
                                    {!showReadOnly && unreadCount > 0 && (
                                        <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-red-200">
                                            {unreadCount} unread
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">Loading notifications...</p>
                                        </div>
                                    </div>
                                ) : currentNotifications.length > 0 ? (
                                    <div className="divide-y divide-border">
                                        {currentNotifications.map((notification, index) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "p-6 hover:bg-muted/50 transition-colors cursor-pointer group",
                                                    !notification.is_read && "bg-blue-50/30 border-l-4 border-l-primary"
                                                )}
                                                onClick={() => !notification.is_read && markNotificationAsRead(notification.id)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Notification Icon */}
                                                    <div className={cn(
                                                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                                                        notification.is_read 
                                                            ? "bg-muted text-muted-foreground"
                                                            : "bg-primary/10 text-primary"
                                                    )}>
                                                        {notification.is_read ? (
                                                            <Check className="h-5 w-5" />
                                                        ) : (
                                                            <Bell className="h-5 w-5" />
                                                        )}
                                                    </div>

                                                    {/* Notification Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={cn(
                                                                "font-semibold text-sm",
                                                                notification.is_read 
                                                                    ? "text-muted-foreground" 
                                                                    : "text-foreground"
                                                            )}>
                                                                #{notification.id} {notification.title}
                                                            </p>
                                                            {!notification.is_read && (
                                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                            )}
                                                        </div>
                                                        
                                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{moment(notification.created_at).fromNow()}</span>
                                                            <span>•</span>
                                                            <span>{moment(notification.created_at).format('MMM DD, YYYY h:mm A')}</span>
                                                        </div>
                                                    </div>

                                                    {/* Mark as Read Button (for unread notifications) */}
                                                    {!notification.is_read && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markNotificationAsRead(notification.id);
                                                            }}
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                            <Bell className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {showReadOnly ? "No read notifications" : "No notifications"}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {showReadOnly 
                                                ? "You haven't read any notifications yet."
                                                : "You're all caught up! No new notifications to show."
                                            }
                                        </p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length} notifications
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                            
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page)}
                                                        className="w-8 h-8 p-0"
                                                    >
                                                        {page}
                                                    </Button>
                                                ))}
                                            </div>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default NotificationsComponent;