import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Values } from "@/components/Values";
import { Leadership } from "@/components/Leadership";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Business & Bosse Consulting (B&BC)",
  description:
    "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire. Expertise locale, APPROCHE AFRICAINE.",
  openGraph: {
    title: "Business & Bosse Consulting (B&BC)",
    description:
      "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
    url: "https://bbcons.net",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net",
  },
};

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <About />
            <Services />
            <Values />
            <Leadership />
            <Footer />
        </main>
    );
}
