import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import PrivacyComponent from "@/components/PrivacyComponent";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <PrivacyComponent />
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;