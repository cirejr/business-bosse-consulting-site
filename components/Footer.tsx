"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share, Mail, Phone, MapPin } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      {/* CTA Section */}

      {/* Main Footer */}
      <div className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold tracking-tighter">
                B&BC
              </span>
              <div className="h-6 w-[1px] mx-2 bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-white/70">
                Consulting
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-sans font-light">
              Conseil en management et solutions IT. Présence au Sénégal et en
              Côte d'Ivoire.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/businessbosseconsulting/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <IconBrandFacebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/business-and-bosse-consulting-sarl/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/b.and.bc/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <IconBrandInstagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif mb-6">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: "Accueil", href: "/" },
                { name: "Services", href: "/services" },
                { name: "À propos", href: "/#about" },
                { name: "Expertise", href: "/#vision" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-accent transition-colors font-sans"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Senegal */}
          <div>
            <h4 className="text-lg font-serif mb-6">Sénégal</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-white/60">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>Dakar, Rufisque, Cité radieuse lot N° 11</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+221 33 815 78 88</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>commercial@bbcons.net</span>
              </li>
            </ul>
          </div>

          {/* Contact CI */}
          <div>
            <h4 className="text-lg font-serif mb-6">Côte d'Ivoire</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-white/60">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>
                  Cote d'Ivoire, Cocody, Cité Presse Riviera palmeraie villa
                  N°316
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+225 07 13 59 55 27</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>commercial@bbcons.net</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest font-sans">
          <p>© 2026 Business & Bosse Consulting. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <Link
              href="/mentions-legales"
              className="hover:text-white transition-colors"
            >
              Mentions Légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-white transition-colors"
            >
              Politique de Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
