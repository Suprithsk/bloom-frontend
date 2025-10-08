
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { toast } from "sonner";
import apiClient from "@/api/apiService";
import { useNavigate } from "react-router-dom";
import FeaturePassTab from "./subscription-tab";
import SilverTab from "./subscription-tab";
import GoldTab from "./gold-tab";
import PlatinumTab from "./platinum-tab";

const SubscriptionsComponent = () => {
    const navigate = useNavigate();
    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState("Feature pass");
    const [loading, setLoading] = useState(false);
    const [featurePlans, setFeaturePlans] = useState(null);
    const [silverPlans, setSilverPlans] = useState(null);
    const [goldPlans, setGoldPlans] = useState(null);
    const [platinumPlans, setPlatinumPlans] = useState(null);

    useEffect(() => {
        fetchSubscriptionPlans();
    }, []);

    const fetchSubscriptionPlans = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${import.meta.env.VITE_API_BASE_URL}/subscription-plan-list/`);
            console.log(response)
            if (response?.data?.status === "true") {
                const plans = response.data.result;
                setSubscriptionPlans(plans);
                
                // Filter plans by category
                setFeaturePlans(plans.filter(plan => plan.plan_name === "Feature pass"));
                setSilverPlans(plans.filter(plan => plan.plan_name === "Silver"));
                setGoldPlans(plans.filter(plan => plan.plan_name === "Gold"));
                setPlatinumPlans(plans.filter(plan => plan.plan_name === "Platinum"));
            }
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
            toast.error("Failed to load subscription plans");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (subscription, planType) => {
        try {
            const subscriptionData = {
                plan: { ...subscription },
                planType: planType,
                upgrades: null // You can implement upgrade logic here
            };

            // Store subscription data in localStorage
            localStorage.setItem("subscriptionDetails", JSON.stringify(subscriptionData));
            
            // Navigate to payment page (you'll need to create this route)
            toast.success(`${planType} plan selected successfully`);
            // navigate("/subscription-payment");
        } catch (error) {
            console.error("Error selecting plan:", error);
            toast.error("Failed to select plan");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />

            <main className="pt-16">
                {/* Subscription Header */}
                <section className="relative py-8 border-b bg-muted/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">
                                    Subscription Plans
                                </h1>
                                <p className="text-muted-foreground">
                                    Choose the perfect plan for your 3D modeling needs
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Subscription Content */}
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
                            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-8">
                                <TabsTrigger value="Feature pass">Feature Pass</TabsTrigger>
                                <TabsTrigger value="Silver">Silver</TabsTrigger>
                                <TabsTrigger value="Gold">Gold</TabsTrigger>
                                <TabsTrigger value="Platinum">Platinum</TabsTrigger>
                            </TabsList>

                            {/* Feature Pass Tab */}
                            <TabsContent value="Feature pass">
                                <FeaturePassTab 
                                    plans={featurePlans} 
                                    loading={loading}
                                    onSelectPlan={(plan) => handleSelectPlan(plan, "Feature pass")}
                                />
                            </TabsContent>

                            {/* Silver Tab */}
                            <TabsContent value="Silver">
                                <SilverTab 
                                    plans={silverPlans} 
                                    loading={loading}
                                    onSelectPlan={(plan) => handleSelectPlan(plan, "Silver")}
                                />
                            </TabsContent>

                            {/* Gold Tab */}
                            <TabsContent value="Gold">
                                <GoldTab 
                                    plans={goldPlans} 
                                    loading={loading}
                                    onSelectPlan={(plan) => handleSelectPlan(plan, "Gold")}
                                />
                            </TabsContent>

                            {/* Platinum Tab */}
                            <TabsContent value="Platinum">
                                <PlatinumTab 
                                    plans={platinumPlans} 
                                    loading={loading}
                                    onSelectPlan={(plan) => handleSelectPlan(plan, "Platinum")}
                                />
                            </TabsContent>
                        </Tabs>

                        {/* Note */}
                        <div className="mt-8">
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold">Note:</span> You have the option to buy the creation of 3D models separately if you surpass your plan's limit for model creation.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SubscriptionsComponent;