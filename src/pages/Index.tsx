import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { SocialProofSection } from "@/components/social-proof-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import ReplaciAction from "@/components/replaci-action";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ReplaciAction />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
