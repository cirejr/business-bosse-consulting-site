"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ServicesCTA() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-primary relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
            Vous avez un projet ou un besoin spécifique ?
          </h2>
          <p className="text-white/70 font-sans font-light text-lg mb-10 max-w-2xl mx-auto">
            Discutons ensemble de la meilleure stratégie pour accompagner votre croissance et sécuriser vos opérations.
          </p>
          <Button size="lg" className="rounded-none px-12 h-16 text-lg bg-accent text-primary hover:bg-white transition-all">
            Parlons de votre projet
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
