import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow",
    content: "The early access has been incredible. Our team's productivity increased by 40% in just two weeks.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez", 
    role: "Founder",
    company: "StartupLab",
    content: "Finally, a platform that gets it right. The AI features are game-changing for our workflow.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Elena Volkov",
    role: "Engineering Lead",
    company: "InnovateX",
    content: "The scalability and security features give us confidence to grow without limits.",
    rating: 5,
    avatar: "EV"
  }
];

const stats = [
  { number: "2,847", label: "Early Access Users" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "40%", label: "Productivity Increase" },
  { number: "24/7", label: "Support Available" }
];

export function SocialProofSection() {
  return (
    <section className="py-24 px-6 bg-gradient-sage">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-birch mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Trusted by Teams
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Early Adopters{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-sage/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-birch text-birch" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-sage/40" />
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    {testimonial.content}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
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