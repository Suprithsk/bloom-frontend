import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, Edit3, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { getProfileInfo } from "@/api/dashboardService";
import { DashboardNavbar } from "./dashboard-navbar";
import { clearSession, isSessionValid } from "@/utils/sessionManager";

interface UserProfileData {
    user: string;
    brand_name: string;
    email: string;
    phone_number: string;
    address: string;
    zip_code: string;
    profile_pic?: string;
}

const ProfileComponent = () => {
    console.log("Rendering ProfileComponent");
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<UserProfileData | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isSessionValid()) {
                clearSession();
                toast.error("Session expired due to inactivity. Please login again.");
                navigate("/");
                return;
        }
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await getProfileInfo();
            console.log("Profile data fetched:", response.data);
            setProfileData(response.data.result);
        } catch (error) {
            
            console.error("Error fetching profile:", error);
            toast.error("Error loading profile data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        navigate("/edit-profile");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                        Failed to load profile data
                    </p>
                    <Button onClick={fetchProfileData} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background ">
        <DashboardNavbar />
        <main className="pt-16 mb-10 ">
            <div className="flex items-center gap-4 m-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            className="p-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Profile Details</h1>
            </div>
            <Card className="m-8 p-0">
                <CardContent className="p-8">
                    
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center justify-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                                {profileData.profile_pic ? (
                                    <img
                                        src={profileData.profile_pic}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground mb-1">
                                    {profileData.user || "User Name"}
                                </h1>
                                <p className="text-muted-foreground">
                                    {profileData.brand_name || "Brand Name"}
                                </p>
                            </div>
                        </div>
                        <Button onClick={handleEdit} variant="outline">
                            <Edit3 className="mr-2" />
                            Edit
                        </Button>
                    </div>

                    {/* Personal Information */}
                    <div className="py-8 border-b border-border">
                        <h2 className="text-xl font-semibold text-foreground mb-6">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Name
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.user || "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Brand Name
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.brand_name || "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.email || "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Phone Number
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.phone_number ||
                                        "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="py-8">
                        <h2 className="text-xl font-semibold text-foreground mb-6">
                            Address
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    City
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.address || "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Zip Code
                                </p>
                                <p className="text-base font-medium text-foreground">
                                    {profileData.zip_code || "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Button */}
                    <div className="flex justify-start pt-4">
                        <Button
                            onClick={handleEdit}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
        </div>
    );
};

export default ProfileComponent;
