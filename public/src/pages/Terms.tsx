import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Scale } from "lucide-react";

const Terms = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-16 mt-6">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header Section - Same as hero-section.tsx */}
        <div className="text-center mb-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-600">Terms of Service</span>
            </div>
          </nav>

          {/* Badge - Same style as hero-section.tsx */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-full px-6 py-3 mb-12 shadow-sm">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Legal Terms</span>
          </div>

          {/* Headline - Same style as hero-section.tsx */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                TERMS &
              </span>
              <span className="block text-slate-800 mt-2">
                CONDITIONS
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            Please read these terms carefully before using REPLACI's services
          </p>

          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Terms Content - Clean structure with Tailwind only */}
        <div className="bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-8 md:p-12 shadow-lg text-left">
          
          {/* 1. Introduction */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              1. Introduction
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Welcome to Replaci.com ("Website"). These Terms and Conditions ("Terms") govern your access to and use of our Website and services. By accessing or using the Website, you agree to comply with and be bound by these Terms. If you do not agree with any part of these Terms, you must discontinue using the Website.
            </p>
          </div>

          {/* 2. Definitions */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              2. Definitions
            </h2>
            <ul className="space-y-3 text-lg text-slate-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></span>
                <span><strong className="text-slate-800">"We," "Us," "Our"</strong> refers to Replaci.com and its legal entity.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></span>
                <span><strong className="text-slate-800">"User," "You," "Your"</strong> refers to any person accessing or using the Website.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></span>
                <span><strong className="text-slate-800">"Services"</strong> refers to the functionalities and features provided by Replaci.com through the Website.</span>
              </li>
            </ul>
          </div>

          {/* 3. Eligibility */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              3. Eligibility
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              By using this Website, you represent and warrant that you:
            </p>
            <ol className="space-y-3 text-lg text-slate-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
                <span>Are at least 18 years old or of legal age to form a binding contract under Indian law.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
                <span>Have not been previously suspended or removed from the Website.</span>
              </li>
            </ol>
          </div>

          {/* 4. Use of the Website */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              4. Use of the Website
            </h2>
            <ol className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
                <span>You agree to use the Website solely for lawful purposes and in compliance with Indian law.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
                <div>
                  <span className="block mb-2">You must not:</span>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Misrepresent your identity or affiliation with any entity.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Engage in any activity that disrupts the Website's functionality.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Introduce any viruses, malware, or harmful code.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Attempt to gain unauthorized access to any part of the Website.</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

          {/* 5. Account Registration */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              5. Account Registration
            </h2>
            <ol className="space-y-3 text-lg text-slate-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
                <span>To access certain features, you may need to create an account.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
                <span>You agree to provide accurate and complete information during registration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</span>
                <span>Notify us immediately of any unauthorized use of your account.</span>
              </li>
            </ol>
          </div>

          {/* Continue with remaining sections using same pattern... */}
          
          {/* 15. Contact Us */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              15. Contact Us
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 space-y-3">
              <p className="text-lg text-slate-700">
                <strong className="text-slate-800">Email:</strong> 
                <a href="mailto:hello@replaci.com" className="text-emerald-600 hover:text-emerald-700 font-semibold ml-2">
                  hello@replaci.com
                </a>
              </p>
              <p className="text-lg text-slate-700">
                <strong className="text-slate-800">Address:</strong> LGF, 82, Sector 44, Gurgaon-122003, Haryana, India
              </p>
            </div>
          </div>

          {/* Agreement Statement */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-amber-800">
              By using the Website, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-full px-6 py-3 shadow-sm">
            <span className="text-sm font-medium text-slate-700">
              Questions? Contact us at 
              <a href="mailto:hello@replaci.com" className="text-emerald-600 hover:text-emerald-700 font-semibold ml-1">
                hello@replaci.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;