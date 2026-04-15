import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions Légales - Business & Bosse Consulting",
  description:
    "Mentions légales du site Business & Bosse Consulting (B&BC), cabinet de conseil en gestion et solutions informatiques au Sénégal et en Côte d'Ivoire.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-12">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg max-w-none text-primary/80 font-sans">
            <h2 className="text-2xl font-serif text-primary mt-8 mb-4">1. Éditeur du site</h2>
            <p>
              Le site bbcons.net est édité par Business & Bosse Consulting SARL, 
              société à responsabilité limitée enregistrée au Sénégal.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Dénomination sociale : Business & Bosse Consulting SARL</li>
              <li>Forme juridique : Société à responsabilité limitée (SARL)</li>
              <li>Capital social : En cours de constitution</li>
              <li>Siège social : Cite Radieuse Rufisque Dakar, Lot N°11, Sénégal</li>
              <li>Numéro d'enregistrement : En cours</li>
              <li>Téléphone : +221 77 181 78 78</li>
              <li>Email : contact.sen@bbcons.net</li>
            </ul>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication est le gérant de Business & Bosse Consulting SARL.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">3. Hébergement</h2>
            <p>
              Le site est hébergé sur des serveurs sécurisés.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, graphismes, 
              vidéos, sons, logiciels) est protégé par les droits de propriété intellectuelle 
              appartenant à Business & Bosse Consulting SARL ou à ses partenaires.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification, publication ou 
              transmission de tout ou partie du contenu, sans autorisation écrite 
              préalable, est interdite.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">5. Responsabilité</h2>
            <p>
              Les informations fournies sur ce site sont données à titre purement 
              informatif et n'ont aucune valeur contractuelle. Business & Bosse Consulting 
              SARL s'efforce d'assurer l'exactitude des informations, mais ne peut 
              garantir l'absence d'erreurs ou d'omissions.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">6. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers d'autres sites. Business & Bosse 
              Consulting SARL n'exerce aucun contrôle sur ces sites et décline toute 
              responsabilité quant à leur contenu.
            </p>

            <h2 className="text-2xl font-serif text-primary mt-12 mb-4">7. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit sénégalais. 
              En cas de litige, les tribunaux sénégalais seront seuls compétents.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}