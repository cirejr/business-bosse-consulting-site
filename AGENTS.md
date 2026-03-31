## 📚 Mandatory Files to Read First

Agents MUST read these files before planning or coding:

1. `docs/prd.md`
2. `tasks/kanban.md`
3. `README.md`

Reason: AGENTS.md complements README/PRD and should focus on actionable agent instructions, not duplicated project prose.

## 🧭 Workflow Rules (STRICT)

### 0. Kanban Check (CRITICAL)

* Before starting ANY work, read `tasks/kanban.md`.
* Ensure the task exists in BACKLOG (create if missing).

### 0.1 Implementation Plan & Approval (MANDATORY)

* Create `implementation.md` describing:
  * technical approach
  * affected files/modules
  * verification commands
* Obtain explicit user approval BEFORE writing code.

### 1. Task Selection

* Pick ONE task from BACKLOG.
* If large, split into subtasks.
* Move task to IN PROGRESS.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Typography**: Manrope (Sans), Playfair Display (Serif)
- **Components**: Shadcn/UI (Radix UI)

## Architecture
- `app/`: Page routes and layouts
- `app/(site)/*` : Public routes and layouts
- `app/(admin)/*`: Admin routes and layouts
- `app/(auth)/`: Auth route
- `components/`: Modular UI components (Navbar, Hero, About, Services, Values, Leadership, Footer)
- `components/ui/`: Reusable primitive components (Shadcn)
- `lib/`: Utility functions

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

## Prefered package manager
Bun, use bun to install and manage packages
