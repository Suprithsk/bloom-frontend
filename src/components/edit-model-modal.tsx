import { useState, useRef, useEffect, useContext } from "react";
import { X, Save, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Model } from "@/types/dashboard";
import { toast } from "sonner";
import { getAllCategories } from "@/api/dashboardService";
import { DashboardContext } from "@/context/DasboardContext";

interface EditModelModalProps {
    model: Model;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (updatedModel: Partial<Model>) => void;
    onEdit?:()=>void;   
}

interface Category {
    id: number;
    category: string;
}

const EditModelModal = ({
    model,
    isOpen,
    onClose,
    onSave,
    onEdit
}: EditModelModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {editModelMutation,isEditing}=useContext(DashboardContext)!;
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            fetchCategories();
            setModelDetails();
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen, model]);

    const setModelDetails = () => {
        setTitle(model?.model_title || "");
        setDescription(model?.description || "");
    };

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            console.log(response)
            if (response?.data?.status) {
                setCategoryList(response.data.category_list || []);
            }
            const categoryId =
            model?.category === "SOFA"
                ? "2"
                : model?.category === "TABLE"
                ? "3"
                : "1";
            setSelectedCategory(categoryId);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        }
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && modalRef.current === e.target) {
            onClose();
        }
    };

    const handleCancel = () => {
        setModelDetails(); // Reset to original values
        onClose();
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Model title is required");
            return;
        }

        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        setIsLoading(true);

        try {
            const updateData = {
                model_title: title,
                category_id: parseInt(selectedCategory),
                description: description,
            };
            console.log("Update Data:", updateData);
            await editModelMutation({modelId:model.model_id, modelData:updateData});
            onEdit();
            setTimeout(() => {
                onClose();
            }, 2000);
            // Replace with your actual API call
            // const response = await axiosInstance.put(`/model/${model.model_id}/`, updateData);
            // if (response.data.status) {
            //     toast.success(response?.data?.message || "Model updated successfully");
            //     if (onSave) {
            //         onSave(updateData);
            //     }
            //     setTimeout(() => {
            //         onClose();
            //     }, 1000);
            // } else {
            //     toast.error(response?.data?.message || "Failed to update model");
            // }

            // Mock success for now
            
        } catch (error) {
            console.error("Error updating model:", error);
            toast.error("Failed to update model");
        } finally {
            setIsLoading(false);
        }
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

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
        >
            <Card className="bg-card max-w-md w-full max-h-[90vh] overflow-y-auto">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-lg font-semibold">Edit Model</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="hover:bg-muted"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="p-6">
                        {/* Model Preview */}
                        <div className="flex items-center gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                            <div className="relative">
                                <Badge
                                    className={`${
                                        model.status === "APPROVED"
                                            ? "bg-green-500 text-white"
                                            : model.status === "PENDING"
                                            ? "bg-yellow-500 text-white"
                                            : model.status === "REJECTED"
                                            ? "bg-red-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    } text-xs font-medium absolute -top-2 -left-2 z-10`}
                                >
                                    {model.status}
                                </Badge>
                                <img
                                    src={
                                        model.images?.[0] || "/placeholder.png"
                                    }
                                    alt={model.model_title}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-sm">
                                    {model.model_title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Current Category: {model.category}
                                </p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Model Title */}
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Model Title
                                </label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Blue Sofa For Living Room"
                                    className="w-full"
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Category
                                </label>
                                <div className="relative w-full">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) =>
                                            setSelectedCategory(e.target.value)
                                        }
                                        className=" w-full appearance-none bg-background border border-border rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        {categoryList.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}
                                            >
                                                {cat.category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                                </div>
                            </div>

                            {/* Created Date (Read-only) */}
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Created Date
                                </label>
                                <Input
                                    type="text"
                                    value={formatDate(model.created_at)}
                                    disabled
                                    className="w-full bg-muted/50"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-medium text-foreground block mb-2">
                                    Description
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Enter model description..."
                                    className="w-full min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={isEditing}
                            >
                                {isEditing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditModelModal;
