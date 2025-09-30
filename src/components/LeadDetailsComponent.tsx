import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Edit3, X } from "lucide-react";
import { toast } from "sonner";
import { getLeadDetails, deleteLeadById } from "@/api/dashboardService";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { clearSession, isSessionValid } from "@/utils/sessionManager";
import moment from "moment";
import { useContext } from "react";
import { DashboardContext } from "@/context/DasboardContext";
interface LeadModel {
    model_title: string;
    price: string;
    category: string;
    created_at: string;
    images: string[];
    quantity?: number;
}

interface LeadDetailsData {
    lead_id: number;
    name: string;
    phone_number: string;
    email: string;
    created_at: string;
    status: string;
    preview_Image: string;
    model_ids: string; // JSON string
    total_price: number;
}

const LeadDetailsComponent = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [leadDetails, setLeadDetails] = useState<LeadDetailsData | null>(null);
    const [modelIds, setModelIds] = useState<LeadModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { deleteLeadMutation } = useContext(DashboardContext) || {};
    useEffect(() => {
        if (!isSessionValid()) {
            clearSession();
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        if (leadId) {
            fetchLeadDetails();
        }
    }, [leadId, navigate]);

    // Fetch lead details like Frontend does
    const fetchLeadDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getLeadDetails(leadId!);
            
            if (response.data.status === "true") {
                const details = response.data.result;
                setLeadDetails(details);
                
                // Parse model IDs like Frontend
                const parsedModels = JSON.parse(details.model_ids || '[]');
                setModelIds(parsedModels);
            } else {
                toast.error("Failed to fetch lead details");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error fetching lead details:", error);
            toast.error("Error loading lead details");
            navigate("/dashboard");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle edit navigation
    const handleEdit = () => {
        navigate(`/edit-lead/${leadId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "NEW":
                return "bg-blue-500 text-white";
            case "CONTACTED":
                return "bg-yellow-500 text-white";
            case "COMPLETED":
                return "bg-green-500 text-white";
            case "REJECTED":
                return "bg-red-500 text-white";
            case "DRAFT":
                return "bg-gray-500 text-white";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const handleBack = () => {
        navigate("/dashboard");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardNavbar />
                <div className="flex items-center justify-center min-h-[400px] pt-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </div>
        );
    }

    if (!leadDetails) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardNavbar />
                <div className="flex items-center justify-center min-h-[400px] pt-16">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Lead not found</p>
                        <Button onClick={handleBack} variant="outline">
                            Back to Leads
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />
            
            <main className="pt-16 mb-10">
                <div className="max-w-7xl mx-auto px-6 m-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" onClick={handleBack} className="p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                Lead Details
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Lead Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="flex justify-start gap-3">
                                            <CardTitle>Lead ID: #{leadDetails.lead_id}</CardTitle>
                                            <Badge className={getStatusColor(leadDetails.status)}>
                                                    {leadDetails.status === "REJECTED" ? "DRAFT" : leadDetails.status}
                                            </Badge>
                                        </div>
                                        <Button onClick={handleEdit} variant="outline">
                                            <Edit3 className="mr-2" />
                                            Edit
                                        </Button>
                                    </div>
                                    
                                    
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Lead Image */}
                                    <div className="w-full max-w-sm">
                                        <img
                                            src={leadDetails.preview_Image}
                                            alt="Lead Preview"
                                            className="w-full h-auto rounded-lg border"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                            }}
                                        />
                                    </div>

                                    {/* Form Fields (Read Only) */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Customer Name</Label>
                                            <Input
                                                id="name"
                                                value={leadDetails.name}
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">Phone Number</Label>
                                            <Input
                                                id="phone_number"
                                                type="tel"
                                                value={leadDetails.phone_number}
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={leadDetails.email}
                                                disabled
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Created On</Label>
                                            <Input
                                                value={moment(leadDetails.created_at).format('DD/MM/YYYY HH:mm A')}
                                                disabled
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                onClick={handleBack}
                                                variant="outline"
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleEdit}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Products */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {modelIds.length > 0 ? (
                                            modelIds.map((product, index) => (
                                                <div key={index} className="flex gap-4 p-4 border rounded-lg">
                                                    <div className="w-20 h-20 flex-shrink-0">
                                                        <img
                                                            src={product.images?.[0] || "/placeholder-image.jpg"}
                                                            alt={product.model_title}
                                                            className="w-full h-full object-cover rounded"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-medium">{product.model_title}</h4>
                                                            <span className="text-lg font-bold text-green-600">
                                                                ₹{product.price}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            <p>Category: {product.category}</p>
                                                            <p>Created on: {moment(product.created_at).format('DD/MM/YYYY HH:mm A')}</p>
                                                            {product.quantity && (
                                                                <p>Quantity: {product.quantity}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-muted-foreground py-8">
                                                No products found for this lead
                                            </p>
                                        )}
                                        
                                        {/* Total Price */}
                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span>Total Price:</span>
                                                <span className="text-green-600">₹{leadDetails.total_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md mx-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <X className="w-5 h-5 text-red-500" />
                                Delete Lead
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-6">Are you sure you want to delete this lead? This action cannot be undone.</p>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default LeadDetailsComponent;