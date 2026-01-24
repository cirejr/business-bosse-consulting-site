"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Leadership() {
  return (
    <section id="leadership" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                alt="Franck Bossé"
                className="w-full h-full object-cover"
              />
              {/* Decorative Frame */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />
            </div>
            {/* Background Accent */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent -z-10 pointer-events-none hidden md:block" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
              Notre Leadership
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight mb-8">
              L'expertise au service de votre ambition.
            </h3>
            
            <div className="space-y-6 mb-10">
              <p className="text-xl font-serif text-primary">
                Franck Bossé, Fondateur & CEO
              </p>
              <div className="h-1 w-20 bg-accent" />
              <p className="text-lg text-primary/70 leading-relaxed font-sans font-light">
                Fort d'une expérience significative dans le conseil stratégique et les technologies de l'information, 
                Franck Bossé a fondé B&BC avec une vision claire : doter les entreprises africaines des outils 
                et des stratégies nécessaires pour exceller dans un environnement globalisé. 
              </p>
              <p className="text-lg text-primary/70 leading-relaxed font-sans font-light">
                Son approche allie rigueur méthodologique internationale et pragmatisme local, faisant de lui 
                un conseiller privilégié pour les dirigeants du Sénégal et de la Côte d'Ivoire.
              </p>
            </div>

            <Button className="rounded-none px-8 py-6 text-lg">
              En savoir plus sur notre fondateur
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
