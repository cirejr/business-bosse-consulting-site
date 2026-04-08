import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ContactHero } from "@/components/ContactHero";
import { ContactFormSection } from "@/components/ContactFormSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact - Business & Bosse Consulting",
  description:
    "Contactez Business & Bosse Consulting au Sénégal et en Côte d'Ivoire. Demandez un devis ou posez vos questions sur nos services de conseil.",
  openGraph: {
    title: "Contact - Business & Bosse Consulting",
    description:
      "Contactez Business & Bosse Consulting pour vos projets de conseil en gestion et solutions IT en Afrique.",
    url: "https://bbcons.net/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net/contact",
  },
};

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <ContactHero />
            <ContactFormSection />
            <Footer />
        </main>
    );
}
