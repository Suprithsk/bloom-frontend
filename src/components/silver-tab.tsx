/* eslint-disable */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SilverTab = ({ plans, loading, onSelectPlan }) => {
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
                <p className="text-muted-foreground">No Silver plans available</p>
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
                <Card key={plan.plan_id} className="relative border-2 hover:border-green-500 transition-colors">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg">{plan.duration} SILVER</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Model Count: {plan.model_count}
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Benefits</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• This is benefit 1</li>
                                <li>• This is benefit 2</li>
                                <li>• This is benefit 3</li>
                            </ul>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                ₹{plan.price}
                            </p>
                        </div>
                        
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => onSelectPlan(plan)}
                        >
                            SELECT
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default SilverTab;