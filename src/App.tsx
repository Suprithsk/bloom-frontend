import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Configurator from "./pages/Configurator";
import ThreeD2 from "./pages/3D2";
import NotFound from "./pages/NotFound";
import { DashboardProvider } from "./context/DasboardContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import Models from "./pages/Models";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import LeadComponent from "./pages/LeadDetails";
import EditLead from "./pages/EditLead";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Sonner />

            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route
                    path="/dashboard"
                    element={
                        <DashboardProvider>
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        </DashboardProvider>
                    }
                />
                <Route
                    path="/models"
                    element={
                        <DashboardProvider>
                            <ProtectedRoute>
                                <Models />
                            </ProtectedRoute>
                        </DashboardProvider>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lead/:leadId"
                    element={
                        <ProtectedRoute>
                            <LeadComponent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-lead/:leadId"
                    element={
                        <ProtectedRoute>
                            <EditLead />
                        </ProtectedRoute>
                    }
                />
                <Route path="/configurator" element={<Configurator />} />
                <Route path="/3d2" element={<ThreeD2 />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
