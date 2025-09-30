import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getLeadDetails, updateLeadDetails } from "@/api/dashboardService";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { clearSession, isSessionValid } from "@/utils/sessionManager";
import moment from "moment";

// Validation schema for lead editing - only name, phone, email
const leadEditSchema = z.object({
    name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    phone_number: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    email: z.string().email("Invalid email address").max(50, "Email must be less than 50 characters"),
});

type LeadEditFormData = z.infer<typeof leadEditSchema>;

interface LeadDetailsData {
    lead_id: number;
    name: string;
    phone_number: string;
    email: string;
    created_at: string;
    status: string;
    preview_Image: string;
    total_price: number;
}

const EditLeadComponent = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [values, setValues] = useState<LeadDetailsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setError,
    } = useForm<LeadEditFormData>({
        resolver: zodResolver(leadEditSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            phone_number: "",
            email: "",
        },
    });

    useEffect(() => {
        if (!isSessionValid()) {
            clearSession();
            toast.error("Session expired due to inactivity. Please login again.");
            navigate("/");
            return;
        }
        if (leadId) {
            getLeadById();
        }
    }, [leadId, navigate]);

    // Like Frontend's getUpdateById function
    const getLeadById = async () => {
        setIsLoading(true);
        try {
            const response = await getLeadDetails(leadId!);
            
            if (response.data.status === "true") {
                const details = response.data.result;
                setValues(details);
                
                // Reset form with fetched data (prefill)
                reset({
                    name: details.name || "",
                    phone_number: details.phone_number || "",
                    email: details.email || "",
                });
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

    // Like Frontend's cancelEditing function
    const cancelSubmitDetails = () => {
        navigate("/dashboard");
    };

    // Like Frontend's handleSubmit pattern
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Get current form values
        const currentValues = watch();
        
        // Basic validation like Frontend
        if (!currentValues.name) {
            toast.error("Name is required");
            return;
        }
        if (!currentValues.email) {
            toast.error("Email is required");
            return;
        }
        if (!currentValues.phone_number || currentValues.phone_number.length !== 10) {
            toast.error("Phone number must be 10 digits");
            return;
        }

        // Append form data like Frontend
        formData.append("name", currentValues.name);
        formData.append("phone_number", currentValues.phone_number);
        formData.append("email", currentValues.email);

        setIsSaving(true);

        updateLeadDetails(leadId!, formData).then((res) => {
            if (res.data.status === "true") {
                toast.success(res?.data?.message || "Lead updated successfully!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                toast.error(res?.data?.message || "Failed to update lead");
            }
            setIsSaving(false);
        }).catch((error) => {
            console.log("error", error);
            
            // Handle validation errors from server
            if (error?.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((field) => {
                    if (field in errors) {
                        setError(field as keyof LeadEditFormData, {
                            message: serverErrors[field][0]
                        });
                    }
                });
            } else {
                toast.error("Error updating lead. Please try again.");
            }
            setIsSaving(false);
        });
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

    if (!values) {
        return (
            <div className="min-h-screen bg-background">
                <DashboardNavbar />
                <div className="flex items-center justify-center min-h-[400px] pt-16">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Lead not found</p>
                        <Button onClick={() => navigate("/dashboard")} variant="outline">
                            Back to Dashboard
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
                <div className="w-full mx-auto px-6 m-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" onClick={cancelSubmitDetails} className="p-2">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                Edit Lead
                            </h1>
                        </div>
                    </div>

                    {/* Lead Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Lead Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Lead Image */}
                            <div className="w-full max-w-sm mx-auto">
                                <img
                                    src={values.preview_Image}
                                    alt="Lead Preview"
                                    className="w-full h-auto rounded-lg border"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                    }}
                                />
                            </div>

                            {/* Edit Form - Only name, phone, email */}
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Customer Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter customer name"
                                        maxLength={50}
                                        {...register("name")}
                                        className={errors.name ? "border-red-500" : ""}
                                        disabled={isSaving}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number *</Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        placeholder="Enter 10-digit phone number"
                                        maxLength={10}
                                        {...register("phone_number")}
                                        className={errors.phone_number ? "border-red-500" : ""}
                                        disabled={isSaving}
                                    />
                                    {errors.phone_number && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone_number.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        maxLength={50}
                                        {...register("email")}
                                        className={errors.email ? "border-red-500" : ""}
                                        disabled={isSaving}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Total Price</Label>
                                    <Input
                                        value={`₹${values.total_price}`}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Created On</Label>
                                    <Input
                                        value={moment(values.created_at).format('DD/MM/YYYY HH:mm A')}
                                        disabled
                                    />
                                </div>

                                {/* Action Buttons like Frontend */}
                                <div className="flex gap-3 pt-4 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelSubmitDetails}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className=" bg-green-600 hover:bg-green-700 "
                                    >
                                        {isSaving ? "Saving..." : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default EditLeadComponent;