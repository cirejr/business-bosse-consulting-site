import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Business & Bosse Consulting",
  description:
    "Politique de confidentialité et de protection des données personnelles de Business & Bosse Consulting (B&BC).",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen">
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-primary pt-40 sm:pt-16 mb-12">
            Politique de Confidentialité
          </h1>

          <div className="prose prose-lg max-w-none text-primary/80 font-sans">
            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">
              1. Introduction
            </h2>
            <p>
              La présente politique de confidentialité décrit comment Business &
              Bosse Consulting SARL ("nous", "notre") collecte, utilise et
              protège vos données personnelles conformément à la réglementation
              en vigueur.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              2. Données collectées
            </h2>
            <p>Nous collectons les données personnelles suivantes :</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Entreprise / Organisation</li>
              <li>Message ou demande de devis</li>
            </ul>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              3. Utilisation des données
            </h2>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Répondre à vos demandes de contact</li>
              <li>Vous envoyer des informations sur nos services</li>
              <li>Établir des devis et propositions commerciales</li>
              <li>Améliorer notre site et nos services</li>
            </ul>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              4. Conservation des données
            </h2>
            <p>
              Les données personnelles sont conservées pour une durée de 3 ans
              maximum à compter de notre dernier contact, sauf obligation légale
              contraire.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              5. Vos droits
            </h2>
            <p>
              Conformément à la réglementation sur la protection des données,
              vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : commercial@bbcons.net
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              6. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles
              appropriées pour protéger vos données contre tout accès non
              autorisé, modification, divulgation ou destruction.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              7. Cookies
            </h2>
            <p>
              Ce site n'utilise pas de cookies de tracking ou de publicité. Nous
              utilisons uniquement des cookies essentiels au fonctionnement du
              site.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
              8. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité,
              vous pouvez nous contacter à :
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email : commercial@bbcons.net</li>
              <li>Téléphone : +221 33 815 78 88</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
