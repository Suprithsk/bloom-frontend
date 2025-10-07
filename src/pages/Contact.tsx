import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ContactComponent from "@/components/ContactComponent";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <ContactComponent />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;