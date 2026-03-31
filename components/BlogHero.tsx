"use client";

import { motion } from "framer-motion";

export function BlogHero() {
  return (
    <section className="relative pt-40 pb-24 px-6 md:px-12 lg:px-24 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="inline-block text-accent uppercase tracking-[0.3em] text-xs font-semibold mb-6">
            Actualités & Insights
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
            Perspectives et <span className="italic text-accent">analyses</span> 
            <br />sur l'Afrique
          </h1>
          <p className="text-xl text-white/60 font-sans font-light leading-relaxed">
            Découvrez nos réflexions sur la gestion d'entreprise, les opportunités 
            de marché et les enjeux économiques en Afrique de l'Ouest.
          </p>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <div className="absolute inset-0 bg-gradient-to-l from-accent/20 to-transparent" />
        <svg
          className="w-full h-full text-white/5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="blog-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#blog-grid)" />
        </svg>
      </div>
    </section>
  );
}
