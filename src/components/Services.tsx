"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Monitor, Users } from "lucide-react";

const services = [
  {
    title: "Conseil en management",
    description: "Optimisez vos structures et vos processus pour une efficacité maximale.",
    icon: Briefcase,
  },
  {
    title: "Structuration financière",
    description: "Sécurisez vos investissements et optimisez votre gestion de trésorerie.",
    icon: TrendingUp,
  },
  {
    title: "Solutions informatiques",
    description: "Accélérez votre transformation numérique avec des outils de pointe.",
    icon: Monitor,
  },
  {
    title: "Formation et accompagnement",
    description: "Développez le capital humain de votre organisation.",
    icon: Users,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
            Nos Services
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight">
            Des expertises pointues pour vos défis stratégiques.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 border border-gray-100 hover:border-accent transition-elegant hover:shadow-xl hover:-translate-y-1 bg-white relative overflow-hidden"
            >
              {/* Subtle underline accent on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-accent transition-all duration-500 group-hover:w-full" />
              
              <div className="mb-6 p-3 rounded-full bg-primary/5 w-fit text-primary transition-colors group-hover:bg-accent group-hover:text-primary">
                <service.icon className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-serif text-primary mb-4 group-hover:text-accent transition-colors">
                {service.title}
              </h4>
              <p className="text-primary/70 text-sm leading-relaxed font-sans font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
