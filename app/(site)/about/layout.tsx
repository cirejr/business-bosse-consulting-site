import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Business & Bosse Consulting",
  description:
    "Découvrez l'histoire, la mission et l'expertise de Business & Bosse Consulting, cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
  openGraph: {
    title: "About - Business & Bosse Consulting",
    description:
      "Apprenez-en plus sur notre approche africaine du conseil, notre expertise locale et notre engagement envers l'excellence.",
    url: "https://bbcons.net/about",
    type: "website",
  },
  alternates: {
    canonical: "https://bbcons.net/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen">{children}</main>;
}
