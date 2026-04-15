"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4 mb-8",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span
            className={cn(
              "text-2xl font-serif font-bold tracking-tighter transition-colors duration-300",
              isScrolled ? "text-primary" : "text-white",
            )}
          >
            B&BC
          </span>
          <div
            className={cn(
              "h-6 w-px mx-2",
              isScrolled ? "bg-primary/20" : "bg-white/20",
            )}
          />
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.2em] font-sans transition-colors duration-300",
              isScrolled ? "text-primary/70" : "text-white/70",
            )}
          >
            Consulting
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                isScrolled ? "text-primary/80" : "text-white/80",
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact">
            <Button
              variant={isScrolled ? "default" : "outline"}
              className={cn(
                "rounded-none px-6",
                !isScrolled && "border-white hover:bg-white hover:text-primary",
              )}
            >
              Parlons-en
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X
              className={cn(
                "h-6 w-6",
                isScrolled ? "text-primary" : "text-white",
              )}
            />
          ) : (
            <Menu
              className={cn(
                "h-6 w-6",
                isScrolled ? "text-primary" : "text-white",
              )}
            />
          )}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col space-y-4 md:hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-primary py-2 border-b border-gray-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-4 py-4 border-b border-gray-100">
                <Link
                  href="https://www.linkedin.com/company/business-and-bosse-consulting-sarl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-primary/30 hover:border-accent hover:text-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <IconBrandLinkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/b.and.bc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-primary/30 hover:border-accent hover:text-accent transition-colors"
                  aria-label="Instagram"
                >
                  <IconBrandInstagram className="h-5 w-5" />
                </Link>
              </div>
              <Link href="/contact" className="w-full">
                <Button className="w-full rounded-none mt-4">Parlons-en</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
