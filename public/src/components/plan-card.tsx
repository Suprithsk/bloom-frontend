import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface DashboardPlanCardProps {
    planName?: string;
    expiry?: string;
    creditsLeft?: number;
    onCancelAutopay?: () => void;
    onManage?: () => void;
}

export const DashboardPlanCard: React.FC<DashboardPlanCardProps> = ({
    planName = "Platinum",
    expiry = "2026-06-15",
    creditsLeft = 99,
    onCancelAutopay,
    onManage,
}) => {
    const date= new Date(expiry);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return (
        <Card className="bg-gradient-to-br from-[#0f3c2b] to-[#153f2d] text-white rounded-lg shadow-md overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        {/* Plan pill */}
                        <div className="inline-flex items-center rounded-lg bg-[#2f8b45] px-4 py-2 mb-3 font-heading">
                            <span className="text-md font-medium tracking-tight">
                                {planName}
                            </span>
                        </div>

                        <div className="text-xs text-white/80 mb-3">
                            Expires on {formattedDate}
                        </div>

                        <div className="mb-2">
                            <Button
                                variant="outline"
                                className="bg-[#9fd07a]/10 border-[#9fd07a] text-[#d7f3c9] !px-3 !py-2 hover:bg-[#9fd07a]/20 hover:text-[#d7f3c9] text-xs"
                                onClick={onCancelAutopay}
                            >
                                Cancel Autopay
                            </Button>
                        </div>
                    </div>

                    {/* Ribbon / emblem */}
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#1f6b3a] rounded-md flex items-center justify-center ml-3">
                            {/* decorative center mark */}
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-[#9fd07a]"
                            >
                                <path
                                    d="M12 2L14.9 8.5L21.8 9.3L16.6 13.8L18.1 20.7L12 17.4L5.9 20.7L7.4 13.8L2.2 9.3L9.1 8.5L12 2Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-white/80">
                            Model Credit Left:
                        </div>
                        <div className="text-lg font-bold">{creditsLeft}</div>
                    </div>

                    <div>
                        <Button
                            variant="ghost"
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20"
                            onClick={onManage}
                            aria-label="Manage credits"
                        >
                            <ChevronRight className="w-4 h-4 text-white" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardPlanCard;
