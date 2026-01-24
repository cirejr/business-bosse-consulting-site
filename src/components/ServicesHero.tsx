"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ServicesHero() {
  return (
    <section className="relative pt-48 pb-24 px-6 md:px-12 lg:px-24 bg-primary text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-sm uppercase tracking-[0.4em] text-accent font-sans font-bold mb-6">
            Nos services
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
            Expertise locale, <br />
            <span className="italic text-accent">Vision régionale</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-sans font-light leading-relaxed mb-10">
            Business and Bosse Consulting accompagne les entreprises et porteurs de projets à travers des services opérationnels, du conseil stratégique et un accompagnement financier adapté aux réalités locales.
          </p>
          <Button size="lg" className="rounded-none px-10 h-14 text-base bg-accent text-primary hover:bg-white transition-all">
            Contactez-nous
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
