import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { submitContactForm } from "@/api/dashboardService";
import { Link } from "react-router-dom";

const ContactComponent = () => {
  const { toast } = useToast();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState("");
  
  // Error states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [requirementError, setRequirementError] = useState("");
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    if (value.trim() === "") {
      setFirstNameError("First Name is Required");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    if (value.trim() === "") {
      setLastNameError("Last Name is Required");
    } else {
      setLastNameError("");
    }
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const regex = /^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+\.)+[a-z]{2,5}$/;
    setEmail(emailValue);
    if (emailValue.trim() === "") {
      setEmailError("Email is required");
    } else if (!regex.test(emailValue)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleRequirement = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRequirement(value);
    if (value.trim() === "") {
      setRequirementError("Requirement is Required");
    } else {
      setRequirementError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let hasErrors = false;

    if (firstName?.trim() === "") {
      setFirstNameError("First Name is Required");
      hasErrors = true;
    }

    if (lastName?.trim() === "") {
      setLastNameError("Last Name is Required");
      hasErrors = true;
    }

    if (email?.trim() === "") {
      setEmailError("Email is required");
      hasErrors = true;
    }

    if (requirement?.trim() === "") {
      setRequirementError("Requirement is Required");
      hasErrors = true;
    }

    // Check for validation errors
    if (hasErrors || firstNameError || lastNameError || emailError || requirementError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("business_email", email);
      formData.append("requirement", requirement);

      const response = await submitContactForm(formData);
      
      if (response?.data?.status === "true") {
        toast({
          title: "Message Sent Successfully! 🎉",
          description: response?.data?.message || "Thank you for contacting us. We'll get back to you soon!",
        });
        
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setRequirement("");
      } else if (response?.data?.status === "false") {
        toast({
          title: "Error",
          description: response?.data?.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Simple Page Header */}
      <section className="py-16 text-center">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-emerald-600">Contact</span>
          </div>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-6">
          <span className="text-sm font-medium text-emerald-700">Contact Us</span>
        </div>

        {/* Simple headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Ready to Transform Your Business?
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Get in touch with REPLACI and discover how our AI-powered platform can revolutionize your furniture retail experience.
        </p>
      </section>

      {/* Contact Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
                  Get in Touch
                </h2>
                
                {/* Contact Details */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                      <Phone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Phone:</p>
                      <p className="text-slate-600">+91 9582829782</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                      <Mail className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Email:</p>
                      <p className="text-slate-600">hello@replaci.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Address:</p>
                      <p className="text-slate-600">LGF, 82, Sector 44, Gurgaon-122003, Haryana, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/40 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Why Choose REPLACI?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Join thousands of furniture retailers who are already using REPLACI to increase sales, 
                  reduce returns, and provide exceptional customer experiences with AI-powered visualization.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Send Us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* First Name */}
                  <div>
                    <Input
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      onChange={handleFirstName}
                      className={`h-12 ${firstNameError ? "border-red-500" : ""}`}
                    />
                    {firstNameError && (
                      <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <Input
                      type="text"
                      value={lastName}
                      placeholder="Last Name"
                      onChange={handleLastName}
                      className={`h-12 ${lastNameError ? "border-red-500" : ""}`}
                    />
                    {lastNameError && (
                      <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      type="email"
                      value={email}
                      placeholder="Business Email"
                      onChange={handleEmail}
                      className={`h-12 ${emailError ? "border-red-500" : ""}`}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>

                  {/* Requirement */}
                  <div>
                    <textarea
                      value={requirement}
                      placeholder="Tell us about your requirements..."
                      onChange={handleRequirement}
                      className={`w-full h-32 px-3 py-2 border bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                        requirementError ? "border-red-500" : "border-input"
                      }`}
                    />
                    {requirementError && (
                      <p className="text-red-500 text-sm mt-1">{requirementError}</p>
                    )}
                  </div>

                  {/* Privacy Policy */}
                  <p className="text-sm text-slate-600">
                    By submitting this form, you agree to REPLACI's{" "}
                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactComponent;