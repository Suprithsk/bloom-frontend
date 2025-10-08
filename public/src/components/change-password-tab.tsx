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
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { changePassword, contactAdmin } from "@/api/settingsService";
import { clearSession, isSessionValid } from "@/utils/sessionManager";
import { useNavigate } from "react-router-dom";
import ContactAdminTab from "./contact-admin-tab";

// Validation schemas
const changePasswordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required"),
        new_password: z
            .string()
            .min(8, "At least 8 characters")
            .regex(/[A-Z]/, "At least 1 upper case letter (A-Z)")
            .regex(/[a-z]/, "At least 1 lower case letter (a-z)")
            .regex(/[0-9]/, "At least 1 number (0-9)")
            .regex(/[^A-Za-z0-9]/, "At least 1 special character"),
        confirm_password: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"],
    });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordTab = () => {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Change Password Form
    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    

    // Handle Change Password Submit (following Frontend pattern)
    const handleChangePassword = async (data: ChangePasswordFormData) => {
        setIsSubmitting(true);
        try {
            const response = await changePassword({
                current_password: data.current_password,
                new_password: data.new_password,
                confirm_password: data.confirm_password,
            });

            if (response.data.status === "true") {
                toast.success(
                    response.data.message || "Password changed successfully!"
                );
                passwordForm.reset();
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
            } else {
                toast.error(
                    response.data.message || "Failed to change password"
                );
            }
        } catch (error) {
            console.error("Error changing password:", error);

            // Handle validation errors from server
            if (error?.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.keys(serverErrors).forEach((field) => {
                    if (field in passwordForm.formState.errors) {
                        passwordForm.setError(
                            field as keyof ChangePasswordFormData,
                            {
                                message: serverErrors[field][0],
                            }
                        );
                    }
                });
            } else {
                toast.error(
                    error?.response?.data?.message || "Error changing password"
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle image upload like Frontend
    

    // Concern options like Frontend
   

    return (
        <div className="w-full mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={passwordForm.handleSubmit(
                            handleChangePassword
                        )}
                        className="space-y-6"
                    >
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="current_password">
                                Current Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="current_password"
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Current Password"
                                    {...passwordForm.register(
                                        "current_password"
                                    )}
                                    className={
                                        passwordForm.formState.errors
                                            .current_password
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {passwordForm.formState.errors.current_password && (
                                <p className="text-sm text-red-500">
                                    {
                                        passwordForm.formState.errors
                                            .current_password.message
                                    }
                                </p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="new_password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new_password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    {...passwordForm.register("new_password")}
                                    className={
                                        passwordForm.formState.errors
                                            .new_password
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {passwordForm.formState.errors.new_password && (
                                <p className="text-sm text-red-500">
                                    {
                                        passwordForm.formState.errors
                                            .new_password.message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirm_password">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm_password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm New Password"
                                    {...passwordForm.register(
                                        "confirm_password"
                                    )}
                                    className={
                                        passwordForm.formState.errors
                                            .confirm_password
                                            ? "border-red-500"
                                            : ""
                                    }
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {passwordForm.formState.errors.confirm_password && (
                                <p className="text-sm text-red-500">
                                    {
                                        passwordForm.formState.errors
                                            .confirm_password.message
                                    }
                                </p>
                            )}
                        </div>

                        {/* Password Instructions */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Instructions:</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• At least 8 characters</li>
                                <li>• At least 1 upper case letter (A-Z)</li>
                                <li>• At least 1 lower case letter (a-z)</li>
                                <li>• At least 1 number (0-9)</li>
                                <li>• At least 1 special character</li>
                            </ul>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-4 items-end-reverse justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    navigate(-1);
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
                                    ? "Updating..."
                                    : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePasswordTab;
