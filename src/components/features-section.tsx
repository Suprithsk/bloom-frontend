import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Sparkles, Target, Users, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience blazing-fast performance with our optimized infrastructure.",
    badge: "Performance"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance.",
    badge: "Security"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Intelligent automation that adapts to your workflow patterns.",
    badge: "Innovation"
  },
  {
    icon: Target,
    title: "Precision Tools",
    description: "Purpose-built features designed for maximum productivity.",
    badge: "Efficiency"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamless real-time collaboration with advanced permission controls.",
    badge: "Teamwork"
  },
  {
    icon: Rocket,
    title: "Scalable Growth",
    description: "Scale from startup to enterprise without missing a beat.",
    badge: "Scalability"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Why Choose REPLACI
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for the{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Modern Workflow
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is crafted with intention, designed to eliminate friction 
            and amplify your team's potential.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-sage/20 hover:border-birch/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-gradient-sage rounded-xl flex items-center justify-center group-hover:bg-gradient-hero transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-birch group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs border-sage/40 text-muted-foreground">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}