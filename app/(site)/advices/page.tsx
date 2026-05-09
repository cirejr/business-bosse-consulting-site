import { Metadata } from "next";
import { ConseilsHero } from "@/components/ConseilsHero";
import { ExpertConsulting } from "@/components/ExpertConsulting";

export const metadata: Metadata = {
  title: "Nos Conseils - Business & Bosse Consulting",
  description:
    "Conseils en stratégie, ressources humaines, management, finance, marketing et création d'entreprise par Business & Bosse Consulting au Sénégal et en Côte d'Ivoire.",
  openGraph: {
    title: "Nos Conseils - Business & Bosse Consulting",
    description:
      "Conseils en stratégie, ressources humaines, management, finance, marketing et création d'entreprise.",
    url: "https://bbcons.net/advices",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net/advices",
  },
};

export default function AdvicesPage() {
  return (
    <main className="min-h-screen">
      <ConseilsHero />
      <ExpertConsulting />
    </main>
  );
}
