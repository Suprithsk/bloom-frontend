import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { useNavigate } from "react-router-dom";
import MyModelsPage from "@/components/my-models"
import LeadsTab from "@/components/leads-tab";
import CardAnalytics from "@/components/card-analytics";
import { DashboardContext } from "@/context/DasboardContext";
import { useContext } from "react";
import { clearSession } from "@/utils/sessionManager";

const DashboardComponent = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const { dashboardData, models, leads, userProfile, isLoading, error, modelsDataList } =
        useContext(DashboardContext) || {};

    useEffect(() => {
        // Only handle username setting here since withAuth handles auth logic
        const username = localStorage.getItem("username");
        setUsername(username || "User");
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardNavbar />
                <main className="pt-16">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <h3 className="text-lg font-medium">
                                Loading Dashboard...
                            </h3>
                            <p className="text-muted-foreground">
                                Please wait while we fetch your data
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Error state - only show for non-401 errors since withAuth handles 401s
    if (error ) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardNavbar />
                <main className="pt-16">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <Card className="p-8 text-center max-w-md">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                                Something went wrong
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                We couldn't load your dashboard data. Please try
                                again.
                            </p>
                            <Button onClick={() => {
                                clearSession();
                                window.location.href='/'
                            }}>
                                Login Again
                            </Button>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />

            <main className="pt-16">
                {/* Dashboard Header */}
                <section className="relative py-8 border-b bg-muted/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                    Welcome back, {username}
                                </h1>
                                <p className="text-muted-foreground">
                                    Here's what's happening with your projects
                                    today.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Dashboard Content */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Stats Overview */}
                        <CardAnalytics />

                        <Tabs defaultValue="models" >
                            <TabsList className="grid grid-cols-2 w-[300px]">
                                <TabsTrigger value="models">Models</TabsTrigger>
                                <TabsTrigger value="leads">Leads</TabsTrigger>
                            </TabsList>

                            <TabsContent value="models" >
                                <MyModelsPage models={modelsDataList} />
                            </TabsContent>

                            <TabsContent value="leads" >
                                <LeadsTab leads={leads} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardComponent;
