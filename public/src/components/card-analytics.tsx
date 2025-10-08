import { FileText,BarChart3,Users,Calendar } from "lucide-react";
import { useContext } from "react";
import { DashboardContext } from "@/context/DasboardContext";
import { Card,CardHeader,CardTitle,CardContent } from "./ui/card";

const CardAnalytics = () => {
    const { dashboardData } = useContext(DashboardContext) || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Models Requested
                        </CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                        {dashboardData?.total_model_created || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Approved Models
                        </CardTitle>
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                        {dashboardData?.try_on_models || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Leads
                        </CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{dashboardData?.total_customer || 0}</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CardAnalytics;
