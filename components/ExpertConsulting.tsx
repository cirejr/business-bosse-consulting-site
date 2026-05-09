"use client";

import { motion } from "framer-motion";
import {
  Network,
  ReceiptText,
  Target,
  Users,
  Briefcase,
  BarChart3,
  Megaphone,
  Rocket,
} from "lucide-react";

const expertServices = [
  {
    id: "conseils-organisation",
    title: "Conseil en organisation",
    description:
      "Diagnostic organisationnel et mise en place d'une organisation efficiente et efficace basée sur des procédures structurées.",
    icon: Network,
    includes: [
      "Analyse des processus",
      "Élaboration de procédures",
      "Optimisation de la performance",
    ],
  },
  {
    id: "conseils-fiscal",
    title: "Conseil fiscal",
    description:
      "Analyse de la situation fiscale et accompagnement vers une optimisation conforme à la réglementation en vigueur.",
    icon: ReceiptText,
    includes: [
      "Analyse fiscale",
      "Identification des risques",
      "Recommandations d'optimisation",
      "Accompagnement fiscal",
    ],
  },
  {
    id: "conseils-strategie",
    title: "Conseils en stratégie",
    description:
      "Toute entité a besoin d'un conseiller en affaires pour bien développer sa stratégie. B&BC vous met en relation avec un consultant expérimenté.",
    icon: Target,
    includes: [
      "Analyse stratégique",
      "Élaboration de plans d'affaires",
      "Accompagnement à la décision",
    ],
  },
  {
    id: "conseils-rh",
    title: "Conseils en Ressources Humaines",
    description:
      "Pour vous permettre de mieux gérer votre personnel (recrutement, formation, rémunération du personnel, GPEC, gestion des carrières et gestion sociale), B&BC met en votre disposition un conseiller en ressources humaines.",
    icon: Users,
    includes: [
      "Recrutement & sélection",
      "Formation & développement",
      "Gestion des carrières",
      "Gestion sociale & paie",
    ],
  },
  {
    id: "conseils-management",
    title: "Conseils en management",
    description:
      "B&BC se charge de coacher votre top management, les chefs hiérarchiques et votre dirigeant.",
    icon: Briefcase,
    includes: [
      "Coaching de dirigeants",
      "Management des équipes",
      "Leadership & gouvernance",
    ],
  },
  {
    id: "conseils-finance",
    title: "Conseils en finance",
    description:
      "C'est facile pour B&BC de vous assurer des conseils en investissement et en mode de financement en vue de vous faire accéder à une bonne stratégie financière.",
    icon: BarChart3,
    includes: [
      "Conseil en investissement",
      "Accès au financement",
      "Stratégie financière",
    ],
  },
  {
    id: "conseils-marketing",
    title: "Conseils en marketing et communication",
    description:
      "B&BC vous met en relation avec un conseiller en vue de favoriser l'accroissement de votre portefeuille clientèle. Elle vous aide à mettre en place une bonne campagne de communication et à faire la promotion de vos offres commerciales.",
    icon: Megaphone,
    includes: [
      "Développement client",
      "Campagnes de communication",
      "Promotion commerciale",
    ],
  },
  {
    id: "conseils-creation",
    title: "Conseils en création d'entreprise",
    description:
      "B&BC les porteurs de projet à créer leur entreprise. Elle vous accompagne à tous les niveaux de la création de votre société.",
    icon: Rocket,
    includes: [
      "Business plan",
      "Choix de structure",
      "Accompagnement juridique",
      "Mise en route",
    ],
  },
];

export function ExpertConsulting() {
  return (
    <section id="conseils" className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-sans font-bold mb-4">
            Conseil & Expertise
          </h2>
          <h3 className="text-3xl md:text-5xl font-serif text-primary leading-tight max-w-2xl">
            L'excellence stratégique au service de votre structure.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {expertServices.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex flex-col md:flex-row items-start gap-6 p-8 border border-gray-100 hover:border-accent/30 transition-elegant hover:shadow-xl group"
            >
              <div className="p-4 bg-accent/10 text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                <service.icon className="h-8 w-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl md:text-2xl font-serif text-primary mb-3">
                  {service.title}
                </h4>
                <p className="text-primary/70 font-sans font-light leading-relaxed mb-6 text-sm">
                  {service.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.includes.map((item) => (
                    <div
                      key={item}
                      className="flex items-center text-sm text-primary/80 font-sans"
                    >
                      <div className="w-3 h-[1px] bg-accent mr-2 shrink-0" />
                      <span className="truncate">{item}</span>
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
