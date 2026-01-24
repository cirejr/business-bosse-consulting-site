"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const financialSteps = [
  "Formulation des idées de projets et préalables",
  "Études de faisabilité",
  "Élaboration de business plans",
  "Mise en route des projets",
  "Suivi et évaluation des projets",
];

export function FinancialConsulting() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
              Conseil financier & accompagnement
            </h2>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-8">
              Accompagnement financier <br />
              <span className="italic text-accent">& projets</span>
            </h3>
            <p className="text-lg text-white/70 font-sans font-light leading-relaxed mb-8">
              Un accompagnement complet, de l’idée à la réalisation du projet. Nous structurons vos ambitions pour garantir leur viabilité et leur succès sur le long terme.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-accent/30 hidden md:block" />
            
            <div className="space-y-8 relative">
              {financialSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-6 group"
                >
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-accent text-primary rounded-full shrink-0 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="bg-white/5 p-6 border border-white/10 hover:border-accent/50 transition-elegant flex-1 group-hover:bg-white/10">
                    <p className="text-lg font-serif">{step}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
