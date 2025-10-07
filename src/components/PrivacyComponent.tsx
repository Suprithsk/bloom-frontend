import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Lock } from "lucide-react";

const PrivacyComponent = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-16 mt-6">
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header Section - Same as Terms.tsx */}
        <div className="text-center mb-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-600">Privacy Policy</span>
            </div>
          </nav>

          {/* Badge - Same style as Terms.tsx */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-full px-6 py-3 mb-12 shadow-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Privacy & Security</span>
          </div>

          {/* Headline - Same style as Terms.tsx */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                PRIVACY
              </span>
              <span className="block text-slate-800 mt-2">
                POLICY
              </span>
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-slate-600 mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
            Your privacy is important to us. Learn how we protect your information.
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

        {/* Privacy Content - Clean structure with Tailwind only */}
        <div className="bg-white/90 backdrop-blur-sm border border-emerald-200/60 rounded-2xl p-8 md:p-12 shadow-lg text-left">
          
          {/* Introduction */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                <strong className="text-slate-800">Thank you for choosing SSR Replaci solutions Private Limited (REPLACI)</strong>
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mt-4">
                We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our free collection software.
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Our Privacy Policy was last updated on <strong>21/02/2025</strong>
              </p>
            </div>
          </div>

          {/* 1. Information We Collect */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              1. INFORMATION WE COLLECT
            </h2>
            
            {/* 1.1 Personal Information */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">1.1 Personal Information</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                When you register to our app based software, we may collect personal information such as your name, contact details, E-mail and billing information.
              </p>
            </div>

            {/* 1.2 Transaction Information */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">1.2 Transaction Information</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We collect information related to transactions conducted through our software, including payment details and transaction history.
              </p>
            </div>

            {/* 1.3 Usage Data */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">1.3 Usage Data</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We automatically collect information about your use of our software, including log files, IP addresses, referring URLs, operating system, device information, and browsing history.
              </p>
            </div>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              2. HOW WE USE YOUR INFORMATION
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We process the information to provide, improve, and administer our services, communicate with you, for security and fraud prevention, and to comply with law. We may also process the information for other purposes with consent.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">2.1 Providing Services</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We use your personal information to provide the 3D imagination software services, process transactions, and manage your account.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">2.2 Improving our Services</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We analyse usage data to enhance the functionality and performance of our software, providing you with a better user experience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">2.3 Communication</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We may use your contact information to send you important updates, notifications, and promotional material related to our software. You can opt-out of promotional communications at any time.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Information Sharing */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              3. INFORMATION SHARING
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We only process the information when we believe it is necessary and we have a valid legal reason to do so under applicable law, like with consent, to comply with laws, to provide you with services to enter into fulfill contractual obligations, to protect the rights, or to fulfill our legitimate business interest.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">3.1 Third-Party Service Providers</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We may share your information with third-party service providers who assist us in delivering our services, processing transactions, and improving our software.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">3.2 Legal Compliance</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We may disclose your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose the information as evidence in litigation in which we are involved.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Security Measures */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              4. SECURITY MEASURES
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">4.1 Data Security</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">4.2 Encryption</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  All sensitive information, such as payment details, is transmitted securely using encryption protocols.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Data Protection Act Compliance */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              5. ADHERANCE TO THE EXISTING LAWS OF DATA PROTECTION
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              REPLACI is committed to ensuring the protection and privacy of your personal data. In accordance with the Digital Personal Data Protection Act 2023, we have implemented measures to safeguard the collection, processing, and storage of your personal information. REPLACI ensures adherence to the key principles and requirements of the Act:
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
                <div>
                  <strong className="text-slate-800">5.1 Lawful Processing:</strong>
                  <span className="text-slate-600"> We only collect and process personal data for lawful and specified purposes as defined by the Digital Personal Data Protection Act 2023.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
                <div>
                  <strong className="text-slate-800">5.2 Consent:</strong>
                  <span className="text-slate-600"> Your explicit consent will be obtained to the present Privacy Policy before collecting or processing any sensitive personal information, as required by the Act.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</span>
                <div>
                  <strong className="text-slate-800">5.3 Data Minimization:</strong>
                  <span className="text-slate-600"> We adhere to the principle of data minimization, ensuring that we only collect and process personal data that is necessary for the purposes outlined in our privacy policy.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">4</span>
                <div>
                  <strong className="text-slate-800">5.4 Data Breach Notification:</strong>
                  <span className="text-slate-600"> In the event of a data breach that may compromise your personal information, we will promptly notify the relevant authorities and affected individuals in accordance with the Digital Personal Data Protection Act 2023.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Your Choices */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              6. YOUR CHOICES
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">6.1 Access and Correction</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  You have the right to access and correct your personal information. You can update your account information through the software or by contacting us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">6.2 Opt-out</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  You can opt-out of receiving promotional communications by following the instructions provided in the communication or by contacting us directly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">6.3 Data Portability</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Upon your request, we will make efforts to furnish you with a comprehensive copy of your Personal Information that is either held or processed by us in a format that is structured, widely accepted, and machine-readable. This provision is an integral part of our service, allowing customers to download necessary information at their convenience.
                </p>
              </div>
            </div>
          </div>

          {/* 8. Your Consent */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              8. YOUR CONSENT
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</span>
                <div>
                  <strong className="text-slate-800">8.1</strong>
                  <span className="text-slate-600 ml-2">All Personal Information is provided to us on a voluntary basis or as part of your employment with us. By agreeing to this Privacy Policy, you are granting consent for us to use, collect, and disclose your Personal Information in alignment with the terms outlined herein.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</span>
                <div>
                  <strong className="text-slate-800">8.2</strong>
                  <span className="text-slate-600 ml-2">REPLACI is committed to upholding and respecting intellectual property rights in accordance with the Trade-Related Aspects of Intellectual Property Rights (TRIPS) agreement.</span>
                </div>
              </div>
            </div>
          </div>

          {/* 10. Contact Us */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-800 mb-6 pb-3 border-b-2 border-emerald-500">
              10. CONTACT US
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              If there are any questions regarding this privacy policy, the practices of our website or your dealings with our website or grievances in relation to your SPDI, you may contact our Grievance Officer using the information below:
            </p>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 space-y-3">
              <p className="text-lg text-slate-700">
                <strong className="text-slate-800">Email:</strong> 
                <a href="mailto:hello@replaci.com" className="text-emerald-600 hover:text-emerald-700 font-semibold ml-2">
                  hello@replaci.com
                </a>
              </p>
            </div>
          </div>

          {/* Agreement Statement */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-lg font-semibold text-amber-800 mb-2">
              <strong>NOTE:</strong> By using our App based software, you agree to the terms outlined in this Privacy Policy as well as the Terms and Conditions laid down by REPLACI.
            </p>
            <p className="text-lg font-semibold text-amber-800">
              Thank you for choosing REPLACI.
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

export default PrivacyComponent;