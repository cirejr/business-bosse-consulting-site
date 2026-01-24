"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Positioning Statement */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
              Qui sommes-nous
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight mb-8">
              Business & Bosse Consulting : Votre partenaire stratégique pour l'émergence africaine.
            </h3>
            <p className="text-lg text-primary/70 leading-relaxed font-sans font-light">
              B&BC est un cabinet de conseil en management et solutions informatiques de premier plan, 
              dédié à l'accompagnement des organisations dans leur transformation. Nous allions expertise 
              technique et connaissance approfondie des marchés locaux pour offrir des solutions sur mesure 
              qui génèrent une valeur durable.
            </p>
          </motion.div>

          {/* Right: Key Facts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 border-l-2 border-accent bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-serif text-primary mb-2">+10 ans</div>
              <p className="text-sm text-primary/60 uppercase tracking-widest font-sans">D'expérience</p>
              <p className="mt-4 text-primary/80 text-sm">Une expertise consolidée au service de la performance.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 border-l-2 border-accent bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl font-serif text-primary mb-2">Conseil & IT</div>
              <p className="text-sm text-primary/60 uppercase tracking-widest font-sans">Solutions Complètes</p>
              <p className="mt-4 text-primary/80 text-sm">L'alliance de la stratégie et de l'innovation technologique.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 border-l-2 border-accent bg-white shadow-sm hover:shadow-md transition-shadow md:col-span-2"
            >
              <div className="text-4xl font-serif text-primary mb-2">Sénégal & Côte d'Ivoire</div>
              <p className="text-sm text-primary/60 uppercase tracking-widest font-sans">Présence Régionale</p>
              <p className="mt-4 text-primary/80 text-sm">Un ancrage local fort pour une vision régionale ambitieuse.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
