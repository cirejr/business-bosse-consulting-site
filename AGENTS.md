## Project Summary
A modern, premium consulting website for Business and Bosse Consulting (B&BC), an African management consulting and IT solutions firm operating in Senegal and Côte d’Ivoire. The site focuses on a sleek, minimalist professional aesthetic with a strong emphasis on trust and local expertise.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Manrope (Sans), Playfair Display (Serif)
- **Components**: Shadcn/UI (Radix UI)

## Architecture
- `src/app/`: Page routes and layouts
- `src/components/`: Modular UI components (Navbar, Hero, About, Services, Values, Leadership, Footer)
- `src/components/ui/`: Reusable primitive components (Shadcn)
- `src/lib/`: Utility functions

## User Preferences
- **Style**: Sleek, minimalist, professional, premium consulting aesthetic.
- **Theme**: Light theme (off-white background) with Deep Navy/Charcoal primary and Muted Gold accent.
- **Typography**: Serif for headings, Sans-serif for body.
- **Interactions**: Subtle animations, smooth transitions, slow hero carousel.

## Project Guidelines
- Avoid generic corporate stock photos; prefer authentic African business contexts.
- Maintain a high-contrast, spacious layout.
- Use sharp or very subtle border radius (currently set to 0rem for a modern, sharp look).
- No excessive or fast-paced animations.

## Common Patterns
- Framer Motion `AnimatePresence` for section transitions.
- `useInView` or `whileInView` for scroll-triggered reveals.
- Transparent navbar that becomes solid/blurred on scroll.
