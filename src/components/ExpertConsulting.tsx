"use client";

import { motion } from "framer-motion";
import { Network, ReceiptText } from "lucide-react";

const expertServices = [
  {
    title: "Conseil en organisation",
    description: "Diagnostic organisationnel et mise en place d’une organisation efficiente et efficace basée sur des procédures structurées.",
    icon: Network,
    includes: [
      "Analyse des processus",
      "Élaboration de procédures",
      "Optimisation de la performance",
    ],
  },
  {
    title: "Conseil fiscal",
    description: "Analyse de la situation fiscale et accompagnement vers une optimisation conforme à la réglementation en vigueur.",
    icon: ReceiptText,
    includes: [
      "Analyse fiscale",
      "Identification des risques",
      "Recommandations d’optimisation",
      "Accompagnement fiscal",
    ],
  },
];

export function ExpertConsulting() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
            Conseil & Expertise
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight max-w-2xl">
            L'excellence stratégique au service de votre structure.
          </h3>
        </div>

        <div className="space-y-12">
          {expertServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-start gap-8 p-8 md:p-12 border border-gray-100 hover:border-accent/30 transition-elegant"
            >
              <div className="p-4 bg-accent/10 text-accent rounded-full shrink-0">
                <service.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h4 className="text-2xl md:text-3xl font-serif text-primary mb-4">{service.title}</h4>
                <p className="text-primary/70 font-sans font-light leading-relaxed mb-8 max-w-2xl">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-center text-primary/80 font-sans">
                      <div className="w-4 h-[1px] bg-accent mr-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
