import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, Lightbulb, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section with same styling as hero-section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8">
          {/* Simple background matching hero section */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-emerald-600">About</span>
              </div>
            </nav>

            {/* Badge matching hero section */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-full px-6 py-3 mb-12 shadow-sm">
              <span className="text-sm font-medium text-slate-700">About REPLACI</span>
            </div>

            {/* Main headline matching hero section style */}
            <div className="mb-10">
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Transforming Furniture Retail
                </span>
                <span className="block text-slate-800 mt-2">
                  with Visual Confidence
                </span>
              </h1>
            </div>

            {/* Subtitle matching hero section */}
            <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
              Designed for furniture brands ready to upgrade the buying experience — from static showrooms to interactive selling.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          {/* Background matching hero section */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-slate-800">
                  Our Story
                </h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    REPLACI is a patent-pending AI-powered visualization platform built specifically for furniture retailers.
                    With REPLACI, you can show your customers exactly how a product from your catalog would look in their own 
                    home — in under 60 seconds, using just a 2D photo. Our smart tool detects and replaces existing furniture 
                    in the image with your products, helping customers visualize clearly before they buy.
                  </p>
                  <p>
                    There's no app to download, no complex setup, and no technical skills needed. REPLACI works right from your
                    showroom, and website — making it incredibly simple to use.
                    By eliminating guesswork, REPLACI helps increase sales, reduce returns, and deliver a more confident, 
                    modern shopping experience.
                  </p>
                  <p>
                    Whether you're a boutique studio or a large retail chain, REPLACI is designed to help you sell smarter.
                  </p>
                </div>
              </div>
              
              {/* Founded Box placeholder - you can replace with actual FoundBox component */}
              
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          {/* Background matching hero section */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-800">
                Our Values
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                The principles that guide everything we do
              </p>
            </div>

            {/* Values grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl border border-emerald-200/40 shadow-sm mb-4 text-2xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Mission-Driven</h3>
                <p className="text-slate-600 leading-relaxed">
                  We're here to help furniture retailers sell smarter — using tech that complements their expertise, not replaces it.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl border border-emerald-200/40 shadow-sm mb-4 text-2xl">
                  💡
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Innovation First</h3>
                <p className="text-slate-600 leading-relaxed">
                  We build what retailers really need — fast, intuitive tools that make the shopping experience better for everyone.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl border border-emerald-200/40 shadow-sm mb-4 text-2xl">
                  👥
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Community Focused</h3>
                <p className="text-slate-600 leading-relaxed">
                  We partner closely with retailers — learning from their challenges and evolving REPLACI with their success in mind.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-xl border border-emerald-200/40 shadow-sm mb-4 text-2xl">
                  🏅
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Excellence</h3>
                <p className="text-slate-600 leading-relaxed">
                  We deliver excellence by blending cutting-edge AI with flawless visual execution — helping retailers present their 
                  products in the best possible light, every time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Section / CTA */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          {/* Background matching hero section */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
            <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-3xl p-12 md:p-16 shadow-lg">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-800">
                Give Them Clarity. Win the Sale.
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                REPLACI helps retailers turn uncertainty into confident buying with AI-powered visualization.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;