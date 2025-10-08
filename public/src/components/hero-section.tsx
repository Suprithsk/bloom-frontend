import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Sparkles, Home, Eye, Clock } from "lucide-react";
import axios from 'axios';

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', 'NA');
      formDataToSend.append('last_name', 'NA');
      formDataToSend.append('business_email', email);
      formDataToSend.append('requirement', 'NA');

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/get-in-touch/`, formDataToSend, {
        headers: {
          'accept': 'application/json, text/plain, */*',
          'content-type': 'multipart/form-data',
        }
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! We\'ll get back to you soon.');
        setEmail('');
        toast({
          title: "Welcome to the waitlist! 🎉",
          description: "We'll notify you as soon as early access is available.",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Something went wrong. Please try again.');
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-16 mt-6">
      

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Simple badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-full px-6 py-3 mb-12 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">Early Access Available Soon</span>
        </div>

        {/* Simpler, smaller headline */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              REPLACING IMAGINATION
            </span>
            <span className="block text-slate-800 mt-2">
              WITH REALITY
            </span>
          </h1>
        </div>

        {/* Simpler subheading */}
        <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
          Showcase your furniture in your customers' home in just 60 seconds with our revolutionary AI platform.
        </p>

        {/* Cleaner form */}
        <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-3 p-1 bg-white rounded-xl shadow-lg border border-emerald-100">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                name="business_email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 text-base bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-slate-400"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
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
          </div>
        </form>

        {/* Success/Error message */}
        {submitMessage && (
          <div className={`mb-8 p-3 rounded-lg text-base font-medium ${
            submitMessage.includes('Thank you') 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}

        {/* Simple social proof */}
        <div className="mb-10">
          <p className="text-base text-slate-600 font-medium">
            Join <span className="font-bold text-emerald-600">2,347</span> furniture retailers already transforming their sales process
          </p>
        </div>

        {/* Simple value proposition */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Virtual Try-On
          </span>
          <span className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Room Visualization
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            60-Second Setup
          </span>
        </div>
      </div>
    </section>
  );
}