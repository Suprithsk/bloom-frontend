import { Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-sage/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/024e0f4a-ad0b-49e0-b49c-5a3678ea979a.png" 
              alt="REPLACI Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-foreground">REPLACI</span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-birch transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-birch transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          
        </div>
        <div className="text-sm text-muted-foreground mt-3 text-center">
            © 2024 REPLACI. Early access launching soon.
        </div>
      </div>
    </footer>
  );
}