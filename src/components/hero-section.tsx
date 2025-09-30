import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Sparkles, Smartphone, RotateCcw } from "lucide-react";

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Welcome to the waitlist! 🎉",
      description: "We'll notify you as soon as early access is available.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-background">
      {/* Subtle background curves - much more refined */}
      <div className="absolute inset-0 opacity-40">
        <svg viewBox="0 0 1200 800" className="absolute inset-0 w-full h-full">
          <path 
            d="M0,300 Q400,200 800,250 T1200,280 L1200,800 L0,800 Z" 
            fill="hsl(152, 25%, 88%)"
            opacity="0.3"
          />
          <path 
            d="M0,500 Q600,350 1200,400 L1200,800 L0,800 Z" 
            fill="hsl(152, 35%, 55%)"
            opacity="0.1"
          />
        </svg>
      </div>
      
      {/* Professional decorative elements */}
      <div className="absolute top-1/4 left-1/4 flex items-center justify-center w-20 h-20 rounded-full border-2 border-teal-primary/30 bg-white-pure/80 backdrop-blur-sm">
        <div className="relative">
          <RotateCcw className="w-6 h-6 text-teal-primary/70" />
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-slate-text/60">360°</span>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-1/4 w-12 h-20 rounded-xl bg-white-pure/90 backdrop-blur-sm border border-teal-primary/20 flex items-center justify-center shadow-sm">
        <Smartphone className="w-6 h-6 text-teal-primary/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Refined badge */}
        <div className="inline-flex items-center gap-2 bg-white-pure/95 backdrop-blur-md border border-teal-primary/20 rounded-full px-6 py-3 mb-12 shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-primary" />
          <span className="text-sm font-medium text-slate-text">Early Access Available Soon</span>
        </div>

        {/* Professional headline with sophisticated gradient */}
        <h1 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-tight">
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            The Future
          </span>
          <br />
          <span className="text-navy-deep">Starts Here</span>
        </h1>

        {/* Refined subheading */}
        <p className="text-xl md:text-2xl text-slate-text/80 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
          Join thousands of early adopters who are already transforming their workflow with our revolutionary platform.
        </p>

        {/* Clean, professional form */}
        <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-text/40" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 text-base bg-white-pure border-teal-primary/20 focus:border-teal-primary focus:ring-teal-primary/10 rounded-lg shadow-sm transition-all duration-200 placeholder:text-slate-text/50"
              required
            />
          </div>
          <Button 
            type="submit" 
            size="lg"
            disabled={isSubmitting}
            className="h-12 px-6 bg-teal-primary hover:bg-teal-primary/90 text-white-pure font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isSubmitting ? (
              "Joining..."
            ) : (
              <>
                Join Waitlist
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </form>

        {/* Clean social proof */}
        <p className="text-base text-slate-text/70 font-medium">
          Join <span className="font-bold text-teal-primary">2,347</span> others already on the waitlist
        </p>
      </div>
    </section>
  );
}