"use client";

import { motion } from "framer-motion";
import { HardHat, Droplet, Truck } from "lucide-react";

const operationalServices = [
  {
    title: "Génie civil",
    description: "Réalisation de travaux de génie civil grâce à une équipe d’ingénieurs et techniciens BTP qualifiés et des moyens logistiques adaptés.",
    icon: HardHat,
    points: [
      "Construction de bâtiments",
      "Terrassement",
      "Assainissement",
      "Suivi et coordination de chantiers",
    ],
  },
  {
    title: "Distribution des hydrocarbures raffinés",
    description: "Distribution de produits pétroliers raffinés dans le respect des normes de sécurité et de réglementation.",
    icon: Droplet,
    products: ["Gasoil", "Super", "Pétrole lampant", "Diesel", "Produits pétroliers pour la pêche"],
  },
  {
    title: "Distribution alimentaire",
    description: "Importation et distribution de denrées alimentaires en provenance de l’Occident vers le Sénégal et la Côte d’Ivoire.",
    icon: Truck,
    focus: ["Qualité", "Fiabilité logistique", "Respect des normes sanitaires"],
  },
];

export function OperationalServices() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-offwhite">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
            Activités Opérationnelles
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight max-w-2xl">
            Des solutions concrètes pour vos besoins opérationnels au quotidien.
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {operationalServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-10 border border-gray-100 hover:border-accent transition-elegant hover:shadow-xl group"
            >
              <div className="mb-8 p-4 bg-primary text-white w-fit group-hover:bg-accent transition-colors">
                <service.icon className="h-6 w-6" />
              </div>
              <h4 className="text-2xl font-serif text-primary mb-6">{service.title}</h4>
              <p className="text-primary/70 font-sans font-light leading-relaxed mb-8">
                {service.description}
              </p>
              
              <div className="space-y-3">
                {service.points && service.points.map((point) => (
                  <div key={point} className="flex items-center text-sm text-primary/80 font-sans">
                    <div className="w-1.5 h-1.5 bg-accent mr-3" />
                    {point}
                  </div>
                ))}
                {service.products && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {service.products.map((product) => (
                      <span key={product} className="text-[10px] uppercase tracking-wider px-3 py-1 bg-primary/5 text-primary/60 border border-primary/10">
                        {product}
                      </span>
                    ))}
                  </div>
                )}
                {service.focus && (
                   <div className="flex flex-wrap gap-2 mt-4">
                    {service.focus.map((item) => (
                      <span key={item} className="text-[10px] uppercase tracking-wider px-3 py-1 bg-accent/10 text-accent border border-accent/20">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
