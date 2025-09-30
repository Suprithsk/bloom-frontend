import { Button } from "./ui/button";
import { ChevronRight, FileText, Plus } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { Model } from "@/types/dashboard";



const ModelsTab = ({ models }: { models: Model[] }) => {

    const navigate=useNavigate();
    
    return (
        <div className="border p-4 rounded-lg  bg-gray-50">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Models</h1>
                <Button variant="subtle">
                    View All
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {models.map((model) => (
                    <Card
                        key={model.model_id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                        <div className="relative">
                            <div className="absolute top-3 left-3 z-10">
                                <Badge
                                    className={`${
                                        model.status === "APPROVED"
                                            ? "bg-green-500 text-white"
                                            : model.status === "PENDING"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    } text-xs font-medium`}
                                >
                                    {model.status}
                                </Badge>
                            </div>
                            <div className="aspect-[4/2] bg-muted/30 flex items-center justify-center">
                                <img
                                    src={model.images[0]}
                                    alt={model.model_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <CardContent className="p-4">
                            <h3 className="font-medium text-foreground mb-1">
                                {model.model_title}
                            </h3>
                            <div className="text-sm text-muted-foreground mb-2">
                                Category: {model.category}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {models.length === 0 && (
                <Card className="p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        No Models Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Start by creating your first 3D model to see it here.
                    </p>
                    <Button onClick={() => navigate("/configurator")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Model
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default ModelsTab;
