import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, Menu, LogOut, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormData } from "@/types/auth";
import { toast } from "sonner";
import { login } from "@/api/authService";
import { useEffect } from "react";
import { setLoginTime } from "@/utils/sessionManager";
export function Navbar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    // Watch form values
    const username = watch("username");
    const password = watch("password");

    const handleLogout = () => {
        // Clear all stored data
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("phone_number");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        // Update state
        setIsLoggedIn(false);

        // Show success message
        toast.success("Logged out successfully!");

        // Navigate to home page
        navigate("/");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data: LoginFormData) => {
        try {
            // Validate minimum requirements
            if (data.username && data.username.length >= 3 && data.password) {
                const payload = {
                    username: data.username,
                    password: data.password,
                };

                setIsLoading(true);

                // Use your existing API service
                const response = await login(payload);

                if (
                    response.status === "true" &&
                    response.message === "You have been successfully logged in!"
                ) {
                    toast.success(response.message);

                    // Store user data in localStorage
                    localStorage.setItem("phone_number", response.phone_number);
                    localStorage.setItem("email", response.email);
                    localStorage.setItem("token", response.access_token);
                    localStorage.setItem("username", data.username);
                    localStorage.setItem(
                        "refresh_token",
                        response.refresh_token
                    );
                    setLoginTime();
                    
                    setIsLoginOpen(false);
                    setIsLoggedIn(true);
                    reset();
                    setShowPassword(false); // Reset password visibility

                    // Navigate to dashboard after 1 second
                    setTimeout(() => {
                        navigate("/dashboard");
                        setIsLoading(false);
                    }, 1000);
                } else if (
                    response.status === "false" &&
                    response.message ===
                        "Phone number verification is pending. Please complete your OTP verification."
                ) {
                    toast.error(response.message);
                    // Handle OTP verification popup here if needed
                    // setVerifyPhonePopup(true);
                    // setPhoneNumber(response.result);
                    setIsLoading(false);
                } else if (
                    response.status === "false" &&
                    response.message ===
                        "Please enter a valid password. Your verification is also pending."
                ) {
                    toast.error(response.message);
                    setIsLoading(false);
                } else {
                    console.log(response.message);
                    toast.error(response.message);
                    setIsLoading(false);
                }
            } else {
                toast.error(
                    "Please enter valid username (min 3 characters) and password"
                );
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            toast.error(error?.message || "Login failed. Please try again.");
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
    };

    const handleDialogClose = (open: boolean) => {
        setIsLoginOpen(open);
        if (!open) {
            setShowPassword(false); // Reset password visibility when dialog closes
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-sage/20">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <img
                        src="/lovable-uploads/024e0f4a-ad0b-49e0-b49c-5a3678ea979a.png"
                        alt="REPLACI Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="text-xl font-bold text-foreground">
                        REPLACI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-foreground hover:text-birch transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className="text-foreground hover:text-birch transition-colors"
                    >
                        About Us
                    </Link>
                    {isLoggedIn && (
                        <Link
                            to="/dashboard"
                            className="text-foreground hover:text-birch transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}

                    {/* Desktop Login/Logout button */}
                    <div className="hidden md:block">
                        {!isLoggedIn ? (
                            <Dialog
                                open={isLoginOpen}
                                onOpenChange={handleDialogClose}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <LogIn className="w-4 h-4" />
                                        Log In
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Login</DialogTitle>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleLogin}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="username">
                                                Username
                                            </Label>
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="Enter your username"
                                                {...register("username")}
                                                className={
                                                    errors.username
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                                disabled={isLoading}
                                            />
                                            {errors.username && (
                                                <p className="text-sm text-red-500">
                                                    {errors.username.message}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter your password"
                                                    {...register("password")}
                                                    className={`pr-10 ${
                                                        errors.password
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                    disabled={isLoading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    disabled={isLoading}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-sm text-red-500">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Logging in..."
                                                : "Log In"}
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Button
                                variant="ghost"
                                className="gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </Button>
                        )}
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <div className="flex flex-col gap-6 mt-6">
                                <Link
                                    to="/"
                                    className="text-foreground hover:text-birch transition-colors text-lg"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/about"
                                    className="text-foreground hover:text-birch transition-colors text-lg"
                                >
                                    About Us
                                </Link>
                                {isLoggedIn && (
                                    <Link
                                        to="/dashboard"
                                        className="text-foreground hover:text-birch transition-colors text-lg"
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                <div className="pt-4 border-t border-border">
                                    {!isLoggedIn ? (
                                        <Dialog
                                            open={isLoginOpen}
                                            onOpenChange={handleDialogClose}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="default"
                                                    className="w-full gap-2"
                                                >
                                                    <LogIn className="w-4 h-4" />
                                                    Log In
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Login
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <form
                                                    onSubmit={handleLogin}
                                                    className="space-y-4"
                                                >
                                                    <div className="space-y-2">
                                                        <Label htmlFor="mobile-username">
                                                            Username
                                                        </Label>
                                                        <Input
                                                            id="mobile-username"
                                                            type="text"
                                                            placeholder="Enter your username"
                                                            {...register(
                                                                "username"
                                                            )}
                                                            className={
                                                                errors.username
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }
                                                            disabled={isLoading}
                                                        />
                                                        {errors.username && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors
                                                                        .username
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="mobile-password">
                                                            Password
                                                        </Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="mobile-password"
                                                                type={
                                                                    showPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="Enter your password"
                                                                {...register(
                                                                    "password"
                                                                )}
                                                                className={`pr-10 ${
                                                                    errors.password
                                                                        ? "border-red-500"
                                                                        : ""
                                                                }`}
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={
                                                                    togglePasswordVisibility
                                                                }
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {errors.password && (
                                                            <p className="text-sm text-red-500">
                                                                {
                                                                    errors
                                                                        .password
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="submit"
                                                        className="w-full"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading
                                                            ? "Logging in..."
                                                            : "Log In"}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        <Button
                                            variant="default"
                                            className="w-full gap-2"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log Out
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
