import { Metadata } from "next";
import Link from "next/link";
import { MotionWrapper } from "@/components/MotionWrapper";

export const metadata: Metadata = {
  title: "À propos - Business & Bosse Consulting",
  description:
    "Découvrez l'histoire, la mission et l'expertise de Business & Bosse Consulting, cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.",
};

const whyChooseUs = [
  {
    title: "Expertise Locale",
    description: "Une connaissance approfondie des marchés ouest-africains et de leurs spécificités.",
    icon: "🌍",
  },
  {
    title: "Approche Personnalisée",
    description: "Des solutions sur mesure adaptées aux réalités et besoins de chaque client.",
    icon: "🎯",
  },
  {
    title: "Équipe Multidisciplinaire",
    description: "Des experts qualifiés en stratégie, finance et technologies de l'information.",
    icon: "👥",
  },
  {
    title: "Engagement Qualité",
    description: "Un engagement constant vers l'excellence et la satisfaction de nos clients.",
    icon: "⭐",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center bg-primary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop")' }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            À propos de nous
          </h1>
          <p className="text-xl text-white/80 font-sans font-light">
            Votre partenaire de confiance pour la transformation des entreprises en Afrique de l'Ouest
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionWrapper>
              <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-bold mb-4">
                Notre Histoire
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                Une vision née de l'engagement pour l'Afrique
              </h3>
              <div className="space-y-4 text-primary/70 leading-relaxed font-sans font-light">
                <p>
                  Fondé en 2021, Business & Bosse Consulting est né d'une vision simple : 
                  accompagner les entreprises africaines dans leur transformation stratégique 
                  et technologique avec une approche proximité et expertise locale.
                </p>
                <p>
                  Notre fondateur, fort d'une expérience de plus de 15 ans dans le conseil 
                  et la finance au sein des grandes institutions bancaires africaines, a souhaité 
                  créer un cabinet qui combine excellence technique et compréhension des enjeux locaux.
                </p>
                <p>
                  Aujourd'hui, nous intervenons au Sénégal et en Côte d'Ivoire, avec une ambition : 
                  devenir le partenaire de référence pour le développement durable des entreprises 
                  ouest-africaines.
                </p>
              </div>
            </MotionWrapper>
            <div className="relative">
              <div className="aspect-[4/3] bg-primary/5 flex items-center justify-center">
                <div className="text-8xl">🏢</div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-accent p-6 text-primary">
                <div className="text-3xl font-serif font-bold">2021</div>
                <div className="text-sm">Année de création</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <MotionWrapper className="p-8 border-l-4 border-accent bg-primary/5">
              <h3 className="text-2xl font-serif text-primary mb-4">Notre Mission</h3>
              <p className="text-primary/70 leading-relaxed font-sans font-light">
                Accompagner les organisations africaines dans leur transformation 
                stratégique et opérationnelle grâce à des solutions de conseil 
                innovantes et adaptées aux réalités locales, tout en contribuant 
                au développement économique durable du continent.
              </p>
            </MotionWrapper>
            <MotionWrapper className="p-8 border-l-4 border-accent bg-primary/5">
              <h3 className="text-2xl font-serif text-primary mb-4">Notre Vision</h3>
              <p className="text-primary/70 leading-relaxed font-sans font-light">
                Devenir le partenaire de référence pour le développement durable 
                des entreprises en Afrique de l'Ouest, en alliant expertise 
                internationale et connaissance profonde des marchés locaux, tout en 
                formant la prochaine génération de leaders africains.
              </p>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] text-accent font-bold mb-4">
              Pourquoi choisir B&BC
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-primary">
              Nos engagements envers vous
            </h3>
          </MotionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item) => (
              <MotionWrapper 
                key={item.title}
                className="p-6 bg-white border border-primary/10 hover:border-accent transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-lg font-semibold text-primary mb-3">{item.title}</h4>
                <p className="text-primary/60 text-sm leading-relaxed">
                  {item.description}
                </p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}