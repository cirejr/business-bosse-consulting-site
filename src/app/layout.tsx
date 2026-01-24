import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Business & Bosse Consulting (B&BC)",
  description: "African management consulting and IT solutions firm operating in Senegal and Côte d’Ivoire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${manrope.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
      >
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
