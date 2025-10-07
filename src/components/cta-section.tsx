import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Check } from "lucide-react";
import axios from 'axios';

export function CTASection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Create FormData object for multipart/form-data - matching the Join component API call
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
          title: "You're on the list! 🎉",
          description: "Keep an eye on your inbox for exclusive updates.",
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
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Simple background matching features section */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* CTA Container with clean styling */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-3xl p-12 md:p-16 text-center shadow-lg">
          {/* Main headline matching Join component content */}
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-800">
            READY TO SELL FURNITURE <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              THE 2025 WAY?
            </span>
          </h2>
          
          {/* Subtitle matching Join component */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Be the first to offer AI-powered room previews — and turn interest into confident buyers.
          </p>

          {/* Features list matching Join component content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium">Get early access to REPLACI</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium">Priority access to features</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium">Special early pricing</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-medium">Dedicated onboarding+support</span>
              </div>
            </div>
          </div>

          {/* CTA Form matching Join component functionality */}
          <form onSubmit={handleFormSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3 p-1 bg-white rounded-xl shadow-lg border border-emerald-100">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Your email address"
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
                  "Submitting..."
                ) : (
                  <>
                    Get Early Access
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Success/Error message */}
          {submitMessage && (
            <div className={`p-3 rounded-lg text-base font-medium ${
              submitMessage.includes('Thank you') 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}