"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const contactDetails = [
  {
    country: "Sénégal",
    address: "Dakar, Plateau, Rue Carnot",
    phone: "+221 33 000 00 00",
    email: "contact.sn@bbc.com",
  },
  {
    country: "Côte d'Ivoire",
    address: "Abidjan, Cocody Ambassades",
    phone: "+225 27 00 00 00 00",
    email: "contact.ci@bbc.com",
  },
];

export function ContactFormSection() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif mb-12">Nos Bureaux</h2>
            <div className="space-y-16">
              {contactDetails.map((detail, index) => (
                <div key={index} className="space-y-6">
                  <h3 className="text-accent uppercase tracking-widest text-sm font-semibold">
                    {detail.country}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/5 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">Adresse</p>
                        <p className="font-medium font-sans">{detail.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/5 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">Téléphone</p>
                        <p className="font-medium font-sans">{detail.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/5 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">Email</p>
                        <p className="font-medium font-sans">{detail.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary/5 p-8 md:p-12"
          >
            <h2 className="text-3xl font-serif mb-8 text-primary">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Prénom</Label>
                  <Input id="firstname" placeholder="Jean" className="rounded-none border-primary/10 bg-white focus:border-accent" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Nom</Label>
                  <Input id="lastname" placeholder="Dupont" className="rounded-none border-primary/10 bg-white focus:border-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Email professionnel</Label>
                <Input id="email" type="email" placeholder="jean.dupont@entreprise.com" className="rounded-none border-primary/10 bg-white focus:border-accent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Entreprise</Label>
                <Input id="company" placeholder="Nom de votre entreprise" className="rounded-none border-primary/10 bg-white focus:border-accent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Sujet</Label>
                <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" className="rounded-none border-primary/10 bg-white focus:border-accent" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Message</Label>
                <Textarea id="message" placeholder="Détails de votre demande..." className="min-h-[150px] rounded-none border-primary/10 bg-white focus:border-accent" />
              </div>
              <Button className="w-full rounded-none h-14 bg-primary hover:bg-primary/90 text-white font-sans uppercase tracking-[0.2em] text-xs">
                Envoyer le message <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
