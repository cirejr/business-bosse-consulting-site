"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const contactDetails = [
  {
    country: "Sénégal",
    address: "Dakar, Rufisque, Cité radieuse lot N° 11",
    phone: "+221 33 815 78 88",
    email: "commercial@bbcons.net",
  },
  {
    country: "Côte d'Ivoire",
    address: "Cote d'Ivoire, Cocody, Cité Presse Riviera palmeraie villa N°316",
    phone: "+225 07 13 59 55 27",
    email: "commercial@bbcons.net",
  },
];

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    company: "",
    country: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.country ||
      !formData.subject ||
      !formData.message
    ) {
      setSubmitStatus({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "Votre message a été envoyé avec succès !",
        });
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          company: "",
          country: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif mb-12">Nos Bureaux</h2>
            <div className="space-y-16">
              {contactDetails.map((detail, index) => (
                <div key={index} className="space-y-6">
                  <h3 className="text-accent uppercase tracking-widest text-sm font-semibold">
                    {detail.country}
                  </h3>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          country: detail.country,
                        }))
                      }
                      className="flex items-start space-x-4 text-left w-full hover:bg-primary/5 py-1 hover:cursor-pointer transition-colors rounded-none"
                    >
                      <div className="p-3 bg-primary/5 text-primary shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">
                          Adresse
                        </p>
                        <p className="font-medium font-sans">
                          {detail.address}
                        </p>
                      </div>
                    </button>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/5 text-primary shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">
                          Téléphone
                        </p>
                        <p className="font-medium font-sans">{detail.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/5 text-primary shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary/60 mb-1 font-sans">
                          Email
                        </p>
                        <p className="font-medium font-sans">{detail.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-primary/5 p-8 md:p-12"
          >
            <h2 className="text-3xl font-serif mb-8 text-primary">
              Envoyez-nous un message
            </h2>

            {/* Status Message */}
            {submitStatus.type && (
              <div
                className={`mb-6 p-4 rounded-none ${
                  submitStatus.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstname"
                    className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                  >
                    Prénom
                  </Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    placeholder="Jean"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="rounded-none border-primary/10 bg-white focus:border-accent"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastname"
                    className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                  >
                    Nom
                  </Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    placeholder="Dupont"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="rounded-none border-primary/10 bg-white focus:border-accent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                >
                  Email professionnel
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean.dupont@entreprise.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-none border-primary/10 bg-white focus:border-accent"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                >
                  Entreprise
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Nom de votre entreprise"
                  value={formData.company}
                  onChange={handleChange}
                  className="rounded-none border-primary/10 bg-white focus:border-accent"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                >
                  Pays
                </Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, country: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {contactDetails.map((detail) => (
                      <SelectItem key={detail.country} value={detail.country}>
                        {detail.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                >
                  Sujet
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="rounded-none border-primary/10 bg-white focus:border-accent"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs uppercase tracking-widest text-primary/60 font-semibold"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Détails de votre demande..."
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[150px] rounded-none border-primary/10 bg-white focus:border-accent"
                  disabled={isSubmitting}
                />
              </div>
              <Button
                className="w-full rounded-none h-14 bg-primary hover:bg-primary/90 text-white font-sans uppercase tracking-[0.2em] text-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
