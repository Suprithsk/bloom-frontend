import { Twitter, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRedirect = () => {
    // Add your redirect logic here - check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/tryon";
    } else {
      window.location.href = "/landing?login=true";
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/lovable-uploads/024e0f4a-ad0b-49e0-b49c-5a3678ea979a.png" 
              alt="REPLACI Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              REPLACI
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Our Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Our Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  What We Offer
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Why Choose Replaci
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/create-model" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Create 3D Model
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleRedirect}
                  className="text-sm text-gray-600 hover:text-emerald-600 transition-colors text-left"
                >
                  Replace Now →
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Support & Policies</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Terms of Services
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                  Give us your feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to={localStorage.getItem("token") ? "/profile" : "/"} 
                  className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to={localStorage.getItem("token") ? "/dashboard" : "/"}
                  className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Retailer Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Follow us:</h4>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://www.instagram.com/replaci_?igsh=MWNzbml4MHNtOGtzbg%3D%3D&utm_source=qr" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/replaci?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            {/* Country */}
            <div className="flex items-center gap-2">
              <span className="text-lg">🇮🇳</span>
              <span>IND</span>
            </div>

            {/* Copyright */}
            <div className="text-center">
              Copyright © 2025 Replaci. All rights reserved.
            </div>

            {/* Scroll to top button */}
            <button 
              onClick={scrollToTop}
              className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-600 rounded-lg transition-colors"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}