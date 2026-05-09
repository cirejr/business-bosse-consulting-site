import { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { RefsHero } from "@/components/RefsHero";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nos références et services faits - Business & Bosse Consulting",
  description:
    "Découvrez les entreprises qui nous font confiance : ASTONE SENEGAL, KELMANE ENTREPRISE, CDE, SESAG, BECEAO, OLAM, SARMATI, MTS, ANRAC.",
  openGraph: {
    title: "Nos références et services faits - Business & Bosse Consulting",
    description:
      "Découvrez les entreprises qui nous font confiance au Sénégal et en Côte d'Ivoire.",
    url: "https://bbcons.net/refs",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net/refs",
  },
};

const customers = [
  { name: "ASTONE SENEGAL", logo: "/customers/astone-senegal.jpg" },
  { name: "KELMANE ENTREPRISE", logo: "/customers/kelimane_300x293.png" },
  { name: "CDE", logo: "/customers/cde_logo.png" },
  { name: "SESAG", logo: "/customers/SESAG_logo.png" },
  { name: "BECEAO", logo: "/customers/BCEAO_logo_fr.png" },
  { name: "OLAM", logo: "/customers/olam-logo-new.png" },
  { name: "SARMATI", logo: null },
  { name: "MTS", logo: "/customers/MTS.webp" },
  { name: "ANRAC", logo: null },
];

export default function RefsPage() {
  return (
    <main className="min-h-screen">
      <RefsHero />
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {customers.map((customer) => (
              <div
                key={customer.name}
                className="bg-white border border-primary/10 p-8 flex items-center justify-center aspect-square hover:border-accent transition-colors group"
              >
                {customer.logo ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={customer.logo}
                      alt={customer.name}
                      fill
                      className="object-contain p-2 grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-16 h-16 bg-primary/5 flex items-center justify-center">
                      <span className="text-2xl font-serif font-bold text-primary/30">
                        {customer.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wider text-primary/40 font-sans">
                      {customer.name}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
