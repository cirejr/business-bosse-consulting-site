import { Navbar } from "@/components/Navbar";
import { ServicesHero } from "@/components/ServicesHero";
import { OperationalServices } from "@/components/OperationalServices";
import { ExpertConsulting } from "@/components/ExpertConsulting";
import { FinancialConsulting } from "@/components/FinancialConsulting";
import { ServicesCTA } from "@/components/ServicesCTA";
import { Footer } from "@/components/Footer";

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ServicesHero />
      <OperationalServices />
      <ExpertConsulting />
      <FinancialConsulting />
      <ServicesCTA />
      <Footer />
    </main>
  );
}
