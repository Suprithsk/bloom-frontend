import { FileText,BarChart3,Users,Calendar } from "lucide-react";
import React from "react";
import { Card,CardHeader,CardTitle,CardContent } from "./ui/card";

const CardAnalytics = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Projects
                        </CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                        24
                    </div>
                    <p className="text-xs text-sage">+2 from last month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Completion Rate
                        </CardTitle>
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                        78%
                    </div>
                    <p className="text-xs text-sage">+5% from last week</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Team Members
                        </CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <p className="text-xs text-sage">+3 this quarter</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Due This Week
                        </CardTitle>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <p className="text-xs text-red-600">1 overdue</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default CardAnalytics;
