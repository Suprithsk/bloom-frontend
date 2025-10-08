import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Eye, EyeOff, Upload, X } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { changePassword, contactAdmin } from "@/api/settingsService";
import { clearSession, isSessionValid } from "@/utils/sessionManager";
import { useNavigate } from "react-router-dom";

// Validation schemas

const contactAdminSchema = z.object({
    phone: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be a 10-digit number"),
    email: z.string().email("Invalid email address"),
    concern: z.string().min(1, "Please select a concern type"),
    concern_details: z
        .string()
        .min(10, "Please provide detailed information (minimum 10 characters)"),
});

type ContactAdminFormData = z.infer<typeof contactAdminSchema>;

const ContactAdminTab = () => {
    const navigate = useNavigate();
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Contact Admin Form
    const contactForm = useForm<ContactAdminFormData>({
        resolver: zodResolver(contactAdminSchema),
        mode: "onChange",
        defaultValues: {
            phone: "",
            email: "",
            concern: "",
            concern_details: "",
        },
    });

    useEffect(() => {
        if (!isSessionValid()) {
            clearSession();
            toast.error("Session expired. Please login again.");
            navigate("/");
            return;
        }

        // Pre-fill email from localStorage like Frontend does
        const email = localStorage.getItem("email");
        if (email) {
            contactForm.setValue("email", email);
        }
    }, [navigate, contactForm]);

    // Handle Change Password Submit (following Frontend pattern)

    // Handle Contact Admin Submit (following Frontend pattern)
    const handleContactAdmin = async (data: ContactAdminFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("phone", data.phone);
            formData.append("email", data.email);
            formData.append("concern", data.concern);
            formData.append("concern_details", data.concern_details);

            // Append images like Frontend does
            uploadedImages.forEach((image, index) => {
                formData.append("images", image);
            });

            const response = await contactAdmin(formData);

            if (response.data.status === "true") {
                toast.success(
                    response.data.message ||
                        "Your message has been sent successfully!"
                );
                contactForm.reset();
                setUploadedImages([]);
            } else {
                toast.error(response.data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error contacting admin:", error);

            // Handle validation errors from server
            if (error?.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((field) => {
                    if (field in contactForm.formState.errors) {
                        contactForm.setError(
                            field as keyof ContactAdminFormData,
                            {
                                message: serverErrors[field][0],
                            }
                        );
                    }
                });
            } else {
                toast.error(
                    error?.response?.data?.message || "Error sending message"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image upload like Frontend
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const validFiles = files.filter((file) => {
            const isValidType = [
                "image/jpeg",
                "image/jpg",
                "image/png",
            ].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                toast.error(
                    `${file.name}: Only JPG, JPEG, and PNG formats are allowed`
                );
                return false;
            }
            if (!isValidSize) {
                toast.error(`${file.name}: File size must be less than 5MB`);
                return false;
            }
            return true;
        });

        setUploadedImages((prev) => [...prev, ...validFiles].slice(0, 5)); // Max 5 images
    };

    const removeImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Concern options like Frontend
    const concernOptions = [
        "Technical Support",
        "Billing Issue",
        "General Inquiry",
        "Other",
    ];

    return (
        <div className="">
            <div className="w-full">
                <Card className="space-y-2.5">
                    <CardHeader className="space-y-4">
                        <CardTitle>Contact Admin</CardTitle>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 font-medium">
                                You can fill the form below or write us at Email
                                :
                            </p>
                            <a
                                href="mailto:hello@replaci.com"
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                hello@replaci.com
                            </a>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-6">
                            Reach Out to Us
                        </h3>

                        <form
                            onSubmit={contactForm.handleSubmit(
                                handleContactAdmin
                            )}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+9999999999"
                                        maxLength={10}
                                        {...contactForm.register("phone")}
                                        className={
                                            contactForm.formState.errors.phone
                                                ? "border-red-500"
                                                : ""
                                        }
                                        disabled={isSubmitting}
                                    />
                                    {contactForm.formState.errors.phone && (
                                        <p className="text-sm text-red-500">
                                            {
                                                contactForm.formState.errors
                                                    .phone.message
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        {...contactForm.register("email")}
                                        className={
                                            contactForm.formState.errors.email
                                                ? "border-red-500"
                                                : ""
                                        }
                                        disabled={isSubmitting}
                                    />
                                    {contactForm.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {
                                                contactForm.formState.errors
                                                    .email.message
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Type of Concern */}
                            {/* Type of Concern */}
                            <div className="space-y-2">
                                <Label htmlFor="concern">Type of concern</Label>
                                <div className="relative">
                                    <select
                                        id="concern"
                                        value={contactForm.watch("concern")}
                                        onChange={(e) =>
                                            contactForm.setValue(
                                                "concern",
                                                e.target.value
                                            )
                                        }
                                        className={`appearance-none bg-background border rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full ${
                                            contactForm.formState.errors.concern
                                                ? "border-red-500"
                                                : "border-border"
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        <option value="" disabled>
                                            Type of concern
                                        </option>
                                        {concernOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-muted-foreground" />
                                </div>
                                {contactForm.formState.errors.concern && (
                                    <p className="text-sm text-red-500">
                                        {
                                            contactForm.formState.errors.concern
                                                .message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Concern Details */}
                            <div className="space-y-2">
                                <Label htmlFor="concern_details">
                                    Please add your concern in detail
                                </Label>
                                <Textarea
                                    id="concern_details"
                                    placeholder="Please add your concern in detail"
                                    rows={6}
                                    {...contactForm.register("concern_details")}
                                    className={
                                        contactForm.formState.errors
                                            .concern_details
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isSubmitting}
                                />
                                {contactForm.formState.errors
                                    .concern_details && (
                                    <p className="text-sm text-red-500">
                                        {
                                            contactForm.formState.errors
                                                .concern_details.message
                                        }
                                    </p>
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <Label>Attach Images (Optional)</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            Click to upload images (Max 5 files,
                                            5MB each)
                                        </span>
                                    </label>
                                </div>

                                {/* Uploaded Images Preview */}
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {uploadedImages.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={`Upload ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                                    disabled={isSubmitting}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        contactForm.reset();
                                        setUploadedImages([]);
                                        navigate(-1)
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className=" bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting
                                        ? "Sending..."
                                        : "Send Message"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ContactAdminTab;
