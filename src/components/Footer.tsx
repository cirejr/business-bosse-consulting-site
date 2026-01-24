"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      {/* CTA Section */}
      <div className="py-24 px-6 md:px-12 lg:px-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center md:text-left">
            <h3 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">
              Prêt à transformer votre entreprise ?
            </h3>
            <p className="text-lg text-white/60 font-sans font-light">
              Discutons de vos défis et élaborons ensemble la stratégie de votre succès futur.
            </p>
          </div>
          <Button 
            size="lg" 
            className="rounded-none px-10 py-8 text-xl bg-accent hover:bg-accent/90 text-primary border-none whitespace-nowrap"
          >
            Parlons de votre projet
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold tracking-tighter">B&BC</span>
              <div className="h-6 w-[1px] mx-2 bg-white/20" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-white/70">Consulting</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-sans font-light">
              Conseil en management et solutions IT. Présence au Sénégal et en Côte d'Ivoire.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="p-2 border border-white/10 hover:border-accent hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
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
                { name: "Contact", href: "/contact" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-accent transition-colors font-sans">
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
                <span>Dakar, Plateau, Rue Carnot</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+221 33 000 00 00</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>contact.sn@bbc.com</span>
              </li>
            </ul>
          </div>

          {/* Contact CI */}
          <div>
            <h4 className="text-lg font-serif mb-6">Côte d'Ivoire</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-white/60">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>Abidjan, Cocody Ambassades</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+225 27 00 00 00 00</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-white/60">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>contact.ci@bbc.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40 uppercase tracking-widest font-sans">
          <p>© 2026 Business & Bosse Consulting. Tous droits réservés.</p>
          <div className="flex space-x-6">
            <Link href="#" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
