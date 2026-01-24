import { Navbar } from "@/components/Navbar";
import { ContactHero } from "@/components/ContactHero";
import { ContactFormSection } from "@/components/ContactFormSection";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactHero />
      <ContactFormSection />
      <Footer />
    </main>
  );
}
