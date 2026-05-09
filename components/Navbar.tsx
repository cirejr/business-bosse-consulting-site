"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { Banner } from "./banner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type NavItem = {
  title: string;
  href?: string;
  description: string;
};

type NavLink = {
  name: string;
  href?: string;
  items?: NavItem[];
};

const navLinks: NavLink[] = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  {
    name: "Nos Conseils",
    href: "/advices",
    items: [
      {
        title: "Conseils en stratégie",
        href: "/advices#conseils-strategie",
        description: "",
      },
      {
        title: "Conseils en Ressources Humaines",
        href: "/advices#conseils-rh",
        description: "",
      },
      {
        title: "Conseils en management",
        href: "/advices#conseils-management",
        description: "",
      },
      {
        title: "Conseils en finance",
        href: "/advices#conseils-finance",
        description: "",
      },
      {
        title: "Conseils en marketing et communication",
        href: "/advices#conseils-marketing",
        description: "",
      },
      {
        title: "Conseils en création d'entreprise",
        href: "/advices#conseils-creation",
        description: "",
      },
    ],
  },
  { name: "Nos services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Nos références et services faits", href: "/refs" },
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <Banner />
      <div className="max-w-7xl mx-auto flex items-center justify-between pt-8">
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
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link: NavLink) => (
                <NavigationMenuItem key={link.href ?? link.name}>
                  {link.items && link.items.length > 0 ? (
                    <>
                      <NavigationMenuTrigger
                        className={`${isScrolled && "text-primary"}`}
                      >
                        {link.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="bg-white">
                        <ul className="w-96">
                          {link.items.map((item: NavItem, index: number) => (
                            <ListItem
                              {...item}
                              key={`${item.href ?? item.title}-${index}`}
                            />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        `${isScrolled && "text-primary"}`,
                      )}
                    >
                      <Link href={link.href!}>{link.name}</Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
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
                  href={link.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-primary py-2 border-b border-gray-100"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex space-x-4 py-4 border-b border-gray-100">
                <Link
                  href="https://www.facebook.com/businessbosseconsulting/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-primary/30 hover:border-accent hover:text-accent transition-colors"
                  aria-label="Facebook"
                >
                  <IconBrandFacebook className="h-5 w-5" />
                </Link>
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
                <Button className="w-full rounded-none mt-4">Contact</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  description,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & NavItem) {
  return (
    <NavigationMenuLink
      className={cn(
        "w-full flex flex-row gap-x-2 data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm p-2",
        className,
      )}
      {...props}
      asChild
    >
      <a href={href}>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium">{title}</span>
          <span className="text-muted-foreground text-xs">{description}</span>
        </div>
      </a>
    </NavigationMenuLink>
  );
}
