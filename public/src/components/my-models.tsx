import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Model } from "@/types/dashboard";
import ModelDetailModal from "./model-modal";
import { DashboardContext } from "@/context/DasboardContext";
import { fetchModels } from "@/api/dashboardService";

interface MyModelsPageProps {
    models: Model[];
}

const MyModelsPage = ({ models }: MyModelsPageProps) => {
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [sortBy, setSortBy] = useState("All");
    const [filteredModels, setFilteredModels] = useState<Model[]>([]);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Filter options
    const filterOptions = ["All", "Approved", "Rejected", "Draft"];

    // Apply filtering and sorting using useEffect
    useEffect(() => {
        // First filter by status
        const filteredWithStatus = [
            "ALL",
            "APPROVED",
            "REJECTED",
            "DRAFT",
        ].includes(selectedFilter.toUpperCase())
            ? [...models]
                  .filter((model) => {
                      return (
                          selectedFilter === "All" ||
                          model.status === selectedFilter.toUpperCase()
                      );
                  })
                  .sort(
                      (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                  )
            : models.filter((model) => {
                  return model.status === selectedFilter.toUpperCase();
              });

        // Then apply sorting based on selectedItem (sortBy)
        const filteredWithSelectedItem =
            sortBy === "All"
                ? filteredWithStatus
                : sortBy === "newest"
                ? [...filteredWithStatus].sort(
                      (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                  )
                : sortBy === "oldest"
                ? [...filteredWithStatus].sort(
                      (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                  )
                : filteredWithStatus;

        setFilteredModels(filteredWithSelectedItem);
        const selectedModelValue= filteredWithSelectedItem.find(m => m.model_id === selectedModel?.model_id);
        setSelectedModel(selectedModelValue || null);
    }, [selectedFilter, sortBy, models, selectedModel?.model_id]);

    const handleModelClick = (model: Model) => {
        setSelectedModel(model);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedModel(null);
    };

    const handleEditModel = async  () => {
        // Navigate to edit page or open edit modal
        // console.log("3. Edit model:", selectedModel);
        // if (selectedModel) {
        //     const models= await fetchModels()
        //     setModelsState(models.data.data || []);
        //     const model = models.data.data.find(m => m.model_id === selectedModel.model_id);
        //     console.log(model, selectedModel);
        //     setSelectedModel(model);
        // }
    };

    const handleDeleteModel = (modelId: number) => {
        // Implement delete logic
        console.log("Delete model:", modelId);
        handleCloseModal();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div className="">
                {/* Header */}
                <div className="border-b bg-white rounded-md">
                    <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">My Models</h1>
                        <Button
                            onClick={() => navigate("/create-model")}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Create New Model
                        </Button>
                    </div>
                

                <div className="container mx-auto px-4 py-6">
                    {/* Filter Bar */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            {filterOptions.map((filter) => (
                                <Button
                                    key={filter}
                                    variant={
                                        selectedFilter === filter
                                            ? "default"
                                            : "outline"
                                    }
                                    className={`rounded-full px-4 py-2 text-sm ${
                                        selectedFilter === filter
                                            ? "bg-green-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                                    onClick={() => setSelectedFilter(filter)}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Sort By</span>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-background border border-border rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="All">All</option>
                                    <option value="newest">Most Recent</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Models Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredModels.map((model) => (
                            <Card
                                key={model.model_id}
                                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                                onClick={() => handleModelClick(model)}
                            >
                                <div className="relative">
                                    <div className="absolute top-3 left-3 z-10">
                                        <Badge
                                            className={`${
                                                model.status === "APPROVED"
                                                    ? "bg-green-500 text-white"
                                                    : model.status === "PENDING"
                                                    ? "bg-yellow-500 text-white"
                                                    : model.status === "REJECTED"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-muted text-muted-foreground"
                                            } text-xs font-medium`}
                                        >
                                            {model.status}
                                        </Badge>
                                    </div>
                                    <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center">
                                        <img
                                            src={
                                                model.images[0] ||
                                                "/placeholder.png"
                                            }
                                            alt={model.model_title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/placeholder.png";
                                            }}
                                        />
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <h3 className="font-medium text-foreground mb-1 text-sm">
                                        {model.model_title}
                                    </h3>
                                    <div className="text-xs text-muted-foreground mb-2">
                                        Category: {model.category}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Created at: {formatDate(model.created_at)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredModels.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                No models found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {selectedFilter === "All"
                                    ? "You haven't created any 3D models yet."
                                    : `No ${selectedFilter.toLowerCase()} models found.`}
                            </p>
                            <Button
                                onClick={() => navigate("/configurator")}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                Create Your First Model
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            </div>

            {/* Model Detail Modal */}
            {selectedModel && (
                <ModelDetailModal
                    model={selectedModel}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onEdit={handleEditModel}
                    onDelete={handleDeleteModel}
                />
            )}
        </>
    );
};

export default MyModelsPage;