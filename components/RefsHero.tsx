"use client";

import { motion } from "framer-motion";

export function RefsHero() {
  return (
    <section className="relative pt-48 pb-24 px-6 md:px-12 lg:px-24 bg-primary text-white overflow-hidden">
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
            Nos Références
          </h1>
          <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
            Ils nous font <br />
            <span className="italic text-accent">confiance</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 font-sans font-light leading-relaxed">
            Nous sommes fiers d&apos;avoir accompagné ces entreprises dans
            leurs projets de transformation et de développement au Sénégal et
            en Côte d&apos;Ivoire.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
