"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, Zap } from "lucide-react";

const values = [
  {
    title: "Innovation",
    description: "Nous repoussons les limites pour créer des solutions d'avant-garde adaptées au contexte africain.",
    icon: Lightbulb,
  },
  {
    title: "Efficacité",
    description: "Notre engagement se mesure à la qualité des résultats tangibles que nous apportons à nos partenaires.",
    icon: Target,
  },
  {
    title: "Efficience",
    description: "Nous optimisons chaque ressource pour maximiser l'impact de nos interventions stratégiques.",
    icon: Zap,
  },
];

export function Values() {
  return (
    <section id="vision" className="py-24 px-6 md:px-12 lg:px-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
            Vision & Valeurs
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif leading-tight">
            Les piliers de notre excellence.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="mb-8 mx-auto p-6 rounded-none border border-white/10 w-fit text-accent transition-elegant group-hover:bg-accent group-hover:text-primary">
                <value.icon className="h-10 w-10" />
              </div>
              <h4 className="text-2xl font-serif mb-4">
                {value.title}
              </h4>
              <p className="text-white/60 text-sm leading-relaxed font-sans font-light max-w-xs mx-auto">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
