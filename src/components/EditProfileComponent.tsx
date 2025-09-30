import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { User, ArrowLeft, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getProfileInfo, updateProfileInfo } from "@/api/dashboardService";
import { DashboardNavbar } from "./dashboard-navbar";
import { clearSession, isSessionValid } from "@/utils/sessionManager";

// Validation schema
const profileSchema = z.object({
    user: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
    brand_name: z.string().min(1, "Brand name is required").max(50, "Brand name must be less than 50 characters"),
    email: z.string().email("Invalid email address").max(20, "Email must be less than 20 characters").optional().or(z.literal("")),
    phone_number: z.string().max(10, "Phone number must be less than 10 digits").optional(),
    address: z.string().max(60, "Address must be less than 60 characters").optional(),
    zip_code: z.string().max(6, "Zip code must be less than 6 digits").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileData extends ProfileFormData {
    profile_pic?: string;
}

const EditProfileComponent = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState<UserProfileData>({
        user: "",
        brand_name: "",
        email: "",
        phone_number: "",
        address: "",
        zip_code: "",
        profile_pic: ""
    });
    const [profileImage, setProfileImage] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        setError,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            user: "",
            brand_name: "",
            email: "",
            phone_number: "",
            address: "",
            zip_code: "",
        },
    });

    useEffect(() => {
        if (!isSessionValid()) {
            clearSession();
            toast.error("Session expired due to inactivity. Please login again.");
            navigate("/");
            return;
        }
        getRetailerDetails();
    }, [navigate]);

    // Update profile picture when values change (like Frontend)
    useEffect(() => {
        if (values.profile_pic) {
            setProfileImage(values.profile_pic);
        }
    }, [values.profile_pic]);

    // Like Frontend's getRetailerDetails function
    const getRetailerDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getProfileInfo();
            if (response?.data?.status === "true") {
                setIsLoading(false);
                const profileData = response.data.result;
                setValues(profileData);
                
                // Reset form with fetched data
                reset({
                    user: profileData.user || "",
                    brand_name: profileData.brand_name || "",
                    email: profileData.email || "",
                    phone_number: profileData.phone_number || "",
                    address: profileData.address || "",
                    zip_code: profileData.zip_code || "",
                });
            }
        } catch (error) {
            console.error("Error", error);
            toast.error("Error loading profile data");
        } finally {
            setIsLoading(false);
        }
    };

    // Like Frontend's handleImageChange
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Only JPG, JPEG, and PNG formats are allowed.");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setProfileImage("");
        setImageFile(null);
    };

    // Following Frontend's handleSubmit pattern exactly
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Get current form values (like Frontend does with values state)
        const currentValues = watch();
        
        // Append all form data like Frontend
        Object.keys(currentValues).forEach(key => {
            const value = currentValues[key as keyof ProfileFormData];
            formData.append(key, value || "");
        });

        if (imageFile) {
            formData.append("profile_pic", imageFile);
        }

        setIsSaving(true);

        updateProfileInfo(formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.status) {
                toast.success(res?.data?.message || "Profile updated successfully!");
                getRetailerDetails(); // Refresh data like Frontend
                setTimeout(() => {
                    navigate('/profile');
                }, 3000); // 3 seconds like Frontend
            } else {
                toast.error(res?.data?.message || "Failed to update profile");
            }
            setIsSaving(false);
        }).catch((error) => {
            console.log("error", error);
            
            // Handle validation errors from server
            if (error?.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((field) => {
                    if (field in errors) {
                        setError(field as keyof ProfileFormData, {
                            message: serverErrors[field][0]
                        });
                    }
                });
            } else {
                toast.error("Error updating profile. Please try again.");
            }
            setIsSaving(false);
        });
    };

    // Like Frontend's cancelSubmitDetails
    const cancelSubmitDetails = () => {
        getRetailerDetails();
        navigate('/profile');
    };

    // Handle icon click like Frontend
    const handleIconClick = () => {
        document.getElementById('profile-upload')?.click();
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

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />
            <main className="pt-16 mb-10">
                <div className="m-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="ghost"
                            onClick={cancelSubmitDetails}
                            className="p-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>

                    <Card>
                        <CardContent className="p-8">
                            {/* Profile Header like Frontend */}
                            <div className="flex items-center gap-6 pb-8 border-b border-border mb-8">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                                        {profileImage ? (
                                            <img 
                                                src={profileImage} 
                                                alt="Profile" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-12 h-12 text-white" />
                                        )}
                                    </div>
                                    <div
                                        onClick={handleIconClick}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4 text-white" />
                                    </div>
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isSaving}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground mb-1">
                                        {values.user || "User Name"}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {values.brand_name || "Brand Name"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="user">Name *</Label>
                                            <Input
                                                id="user"
                                                type="text"
                                                placeholder="name"
                                                maxLength={50}
                                                {...register("user")}
                                                className={errors.user ? "border-red-500" : ""}
                                                disabled={isSaving}
                                            />
                                            {errors.user && (
                                                <p className="text-sm text-red-500">
                                                    {errors.user.message}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="brand_name">Brand Name *</Label>
                                            <Input
                                                id="brand_name"
                                                type="text"
                                                placeholder="brandname"
                                                maxLength={50}
                                                {...register("brand_name")}
                                                className={errors.brand_name ? "border-red-500" : ""}
                                                disabled={isSaving}
                                            />
                                            {errors.brand_name && (
                                                <p className="text-sm text-red-500">
                                                    {errors.brand_name.message}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email"
                                                maxLength={20}
                                                {...register("email")}
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="phone_number">Mobile</Label>
                                            <Input
                                                id="phone_number"
                                                type="tel"
                                                placeholder="mobile"
                                                maxLength={10}
                                                {...register("phone_number")}
                                                className={errors.phone_number ? "border-red-500" : ""}
                                            />
                                            {errors.phone_number && (
                                                <p className="text-sm text-red-500">
                                                    {errors.phone_number.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="address"
                                                maxLength={60}
                                                {...register("address")}
                                                className={errors.address ? "border-red-500" : ""}
                                                disabled={isSaving}
                                            />
                                            {errors.address && (
                                                <p className="text-sm text-red-500">
                                                    {errors.address.message}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="zip_code">Pincode</Label>
                                            <Input
                                                id="zip_code"
                                                type="text"
                                                placeholder="pincode"
                                                maxLength={6}
                                                {...register("zip_code")}
                                                className={errors.zip_code ? "border-red-500" : ""}
                                                disabled={isSaving}
                                            />
                                            {errors.zip_code && (
                                                <p className="text-sm text-red-500">
                                                    {errors.zip_code.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions like Frontend */}
                                <div className="flex gap-4 pt-4 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={cancelSubmitDetails}
                                        disabled={isSaving}
                                        className="px-8 py-2 uppercase"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-green-600 hover:bg-green-700 px-8 py-2 uppercase"
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

export default EditProfileComponent;