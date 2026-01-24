"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Accompagner la transformation des entreprises africaines",
    description: "Nous façonnons l'avenir du business en Afrique avec des solutions innovantes et durables.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    cta: "Découvrir nos services",
  },
  {
    id: 2,
    title: "Structurer, optimiser, performer",
    description: "Une approche méthodique pour propulser votre croissance et sécuriser vos opérations.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    cta: "Nos expertises",
  },
  {
    id: 3,
    title: "Une expertise locale, une vision régionale",
    description: "Présents au Sénégal et en Côte d'Ivoire pour servir l'ensemble du marché ouest-africain.",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
    cta: "Nous contacter",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-100 animate-slow-zoom"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-[1.1]">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl font-sans font-light">
                  {slides[currentSlide].description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="rounded-none px-8 py-6 text-lg bg-accent hover:bg-accent/90 text-primary border-none">
                    {slides[currentSlide].cta}
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-none px-8 py-6 text-lg text-white border-white hover:bg-white hover:text-primary">
                    Nous contacter <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 transition-all duration-500 ${
              currentSlide === index ? "w-12 bg-accent" : "w-6 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
