import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bbcons.net"),
  title: {
    default: "Business & Bosse Consulting (B&BC)",
    template: "%s | Business & Bosse Consulting",
  },
  description:
    "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire. Expertise locale, APPROCHE AFRICAINE.",
  keywords: [
    "conseil en gestion",
    "solutions informatiques",
    "consulting",
    "Afrique",
    "Sénégal",
    "Côte d'Ivoire",
    "transformation digitale",
    "stratégie d'entreprise",
  ],
  authors: [{ name: "Business & Bosse Consulting" }],
  creator: "Business & Bosse Consulting",
  publisher: "Business & Bosse Consulting",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bbcons.net",
    siteName: "Business & Bosse Consulting",
    title: "Business & Bosse Consulting (B&BC)",
    description:
      "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
    images: [
      {
        url: "/images/logo_bbcons-7.png",
        width: 1200,
        height: 630,
        alt: "Business & Bosse Consulting",
      },
    ],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business & Bosse Consulting (B&BC)",
    description:
      "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
    images: ["/images/logo_bbcons-7.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Business & Bosse Consulting",
              alternateName: "B&BC",
              url: "https://bbcons.net",
              logo: "https://bbcons.net/images/logo_bbcons-7.png",
              description:
                "Cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
              areaServed: [
                {
                  "@type": "Country",
                  name: "Sénégal",
                },
                {
                  "@type": "Country",
                  name: "Côte d'Ivoire",
                },
              ],
              serviceType: [
                "Conseil en gestion",
                "Solutions IT",
                "Transformation digitale",
                "Stratégie d'entreprise",
              ],
              sameAs: [
              "https://www.facebook.com/share/1B6DdxE7qX/",
              "https://www.linkedin.com/company/business-and-bosse-consulting-sarl/",
              "https://www.instagram.com/b.and.bc/",
            ],
            }),
          }}
        />
      </head>
      <body
        className={`${manrope.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}