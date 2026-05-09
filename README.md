# Business & Bosse Consulting (B&BC) — Site Web

Site vitrine du cabinet de conseil en gestion et solutions informatiques opérant au Sénégal et en Côte d'Ivoire.

## Tech Stack

- **Framework** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS 4
- **Animations** — Framer Motion
- **Icons** — Lucide React, Tabler Icons
- **UI Components** — Shadcn/UI (Radix UI)
- **Formulaires** — Zod, Resend
- **Typographie** — Manrope (Sans), Playfair Display (Serif)
- **Base de données** — PostgreSQL via Drizzle ORM
- **Auth** — Better Auth

## Prérequis

- [Bun](https://bun.sh) (gestionnaire de paquets recommandé)

## Installation

```bash
bun install
```

## Développement

```bash
bun dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build

```bash
bun run build
```

## Variables d'environnement

Copier `.env.example` vers `.env.local` :

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `RESEND_API_KEY` | Clé API Resend pour l'envoi d'emails |
| `CONTACT_FORM_RECIPIENT` | Adresse de réception du formulaire de contact |
| `UPLOADTHING_TOKEN` | Token UploadThing pour les fichiers média |
| `BETTER_AUTH_SECRET` | Secret pour Better Auth |
| `BETTER_AUTH_URL` | URL de base pour Better Auth |

## Architecture

```
app/
├── (site)/          # Pages publiques
│   ├── about/       # À propos
│   ├── advices/     # Nos conseils (8 services en grille 2 colonnes)
│   ├── blog/        # Blog
│   ├── contact/     # Contact avec formulaire & sélecteur de pays
│   ├── refs/        # Références clients
│   └── services/    # Services opérationnels
├── (admin)/         # Dashboard admin
└── api/             # Routes API (contact, auth, uploadthing)

components/          # Composants réutilisables
├── ui/              # Primitives Shadcn/UI
├── Navbar.tsx       # Navigation avec dropdown "Nos Conseils"
├── Footer.tsx       # Pied de page (coordonnées Sénégal & Côte d'Ivoire)
├── ConseilsHero.tsx # Hero de la page conseils
├── ExpertConsulting.tsx  # Grille 2 colonnes des 8 services conseil
├── ContactFormSection.tsx # Formulaire avec champ Pays requis
└── ...

public/
├── customers/       # Logos clients (ASTONE, BECEAO, OLAM, etc.)
└── images/          # Images du site

lib/
├── email.ts         # Envoi d'emails via Resend
└── utils.ts         # Utilitaires
```

## Pages

| Route | Contenu |
|-------|---------|
| `/` | Accueil (Hero, À propos, Services, Valeurs, Leadership) |
| `/about` | Histoire, Mission, Vision |
| `/services` | Services opérationnels, conseil fiscal & financier |
| `/advices` | 8 domaines de conseil en grille 2 colonnes |
| `/refs` | Références clients avec logos |
| `/contact` | Coordonnées des bureaux + formulaire avec pays |
| `/blog` | Articles |
| `/mentions-legales` | Mentions légales |
| `/politique-confidentialite` | Politique de confidentialité |

## Conventions de design

- **Thème** : Clair (off-white) avec Primary Deep Navy et Muted Gold en accent
- **Typographie** : Playfair Display (serif) pour les titres, Manrope (sans-serif) pour le corps
- **Bordure** : `rounded-none` pour un rendu moderne et net
- **Animations** : Framer Motion `whileInView` pour les révélations au scroll
- **Réseaux sociaux** : Facebook, LinkedIn, Instagram (liens dans Footer & Navbar mobile)
