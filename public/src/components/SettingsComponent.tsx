import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import ChangePasswordTab from "./change-password-tab";

// Validation schemas
const changePasswordSchema = z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string()
        .min(8, "At least 8 characters")
        .regex(/[A-Z]/, "At least 1 upper case letter (A-Z)")
        .regex(/[a-z]/, "At least 1 lower case letter (a-z)")
        .regex(/[0-9]/, "At least 1 number (0-9)")
        .regex(/[^A-Za-z0-9]/, "At least 1 special character"),
    confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
});



type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const SettingsComponent = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("change-password");

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />

            <main className="pt-16">
                {/* Settings Header */}
                <section className="relative py-8 border-b bg-muted/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                    Settings
                                </h1>
                                <p className="text-muted-foreground">
                                    Manage your account settings and preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Settings Content */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-2 w-[400px] mb-8">
                                <TabsTrigger value="change-password">Change Password</TabsTrigger>
                                <TabsTrigger value="contact-admin">Contact Admin</TabsTrigger>
                            </TabsList>

                            {/* Change Password Tab */}
                            <TabsContent value="change-password">
                                <ChangePasswordTab />
                            </TabsContent>

                            {/* Contact Admin Tab */}
                            <TabsContent value="contact-admin">
                                <ContactAdminTab />
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SettingsComponent;