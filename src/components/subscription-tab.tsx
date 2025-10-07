/* eslint-disable */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

const FeaturePassTab = ({ plans, loading, onSelectPlan }) => {
    const [quantities, setQuantities] = useState({});

    const increaseQuantity = (planId) => {
        setQuantities(prev => ({
            ...prev,
            [planId]: (prev[planId] || 1) + 1
        }));
    };

    const decreaseQuantity = (planId) => {
        setQuantities(prev => ({
            ...prev,
            [planId]: Math.max(1, (prev[planId] || 1) - 1)
        }));
    };

    const getQuantity = (planId) => {
        return quantities[planId] || 1;
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading plans...</p>
            </div>
        );
    }

    if (!plans || plans.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No Feature Pass plans available</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
                <Card key={plan.plan_id} className="relative border-2 hover:border-green-500 transition-colors">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg">{plan.duration}</CardTitle>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Model Credit: {plan.model_count}
                            </p>
                            {plan.qty && (
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-sm">Select Qty</span>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                            onClick={() => decreaseQuantity(plan.plan_id)}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="w-8 text-center">{getQuantity(plan.plan_id)}</span>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="w-8 h-8 p-0"
                                            onClick={() => increaseQuantity(plan.plan_id)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Benefits</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Can create 3D models</li>
                                <li>• Save and view the models</li>
                                <li>• No customization</li>
                            </ul>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                ₹{plan.price * getQuantity(plan.plan_id)}
                            </p>
                        </div>
                        
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => onSelectPlan({
                                ...plan,
                                quantity: getQuantity(plan.plan_id),
                                total_price: plan.price * getQuantity(plan.plan_id)
                            })}
                        >
                            SELECT
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default FeaturePassTab;