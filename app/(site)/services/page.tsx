import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ServicesHero } from "@/components/ServicesHero";
import { OperationalServices } from "@/components/OperationalServices";
import { FinancialConsulting } from "@/components/FinancialConsulting";
import { ServicesCTA } from "@/components/ServicesCTA";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services - Business & Bosse Consulting",
  description:
    "Cabinet de conseil en gestion et solutions informatiques au Sénégal et en Côte d'Ivoire. Conseil opérationnel, expertise métier, conseil financier.",
  openGraph: {
    title: "Services - Business & Bosse Consulting",
    description:
      "Cabinet de conseil en gestion et solutions informatiques au Sénégal et en Côte d'Ivoire.",
    url: "https://bbcons.net/services",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net/services",
  },
};

export default function ServicesPage() {
    return (
        <main className="min-h-screen">
            <ServicesHero />
            <OperationalServices />
            <FinancialConsulting />
            <ServicesCTA />
        </main>
    );
}
