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
import TryOn from "./pages/Tryon";
import ErrorBoundary from "./pages/ErrorBoundary";
import SubscriptionsComponent from "./components/SubscriptionComponent";
import Subscriptions from "./pages/Subscription";
import Notifications from "./pages/Notifications";
import CreateModel from "./pages/CreateModel";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

const queryClient = new QueryClient();

const App = () => (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Sonner />

                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path='/terms' element={<Terms />} />
                    <Route path='/privacy' element={<Privacy />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/models"
                        element={
                            <ProtectedRoute>
                                <Models />
                            </ProtectedRoute>
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
                    <Route
                        path="/tryon"
                        element={
                            <ProtectedRoute>
                                <TryOn />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/subscriptions"
                        element={
                            <ProtectedRoute>
                                <Subscriptions />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            <ProtectedRoute>
                                <Notifications />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/create-model" element={
                        <ProtectedRoute>
                            <CreateModel />
                        </ProtectedRoute>
                    } />
                    <Route path="/3d2" element={<ThreeD2 />} />
                    <Route path='/contact' element={<Contact />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </TooltipProvider>
        </QueryClientProvider>
    </ErrorBoundary>
);

export default App;
