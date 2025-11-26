# NGOTACK | AI Learning Insight

Landing, authentication, dashboard, and courses UI built with Next.js (App Router) and Tailwind v4 (via `@import "tailwindcss";`). Assets live in `public/assets`.

## Quick Start
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Key Screens
- Landing: hero with logo and CTA.
- Auth: `/auth/login`, `/auth/register` (Playfair/Quicksand/Montserrat fonts).
- Dashboard: welcome banner, explore prompt, progress overview cards, shared header/footer.
- Courses: `/courses` and `/dashboard/courses` grids with hoverable course cards.
- 404: custom not-found page using `public/assets/404.png`.

## Shared Components
- `components/Header.jsx` – logo, nav, profile dropdown (logout).
- `components/Footer.jsx` – shared footer; adjustable container width.
- `components/ExplorePrompt.jsx` – prompt shown before user explores.
- `components/ProgressOverview.jsx` – AI insights, activity list, completed classes.

## Fonts & Styling
- Google fonts via `next/font`: Playfair Display, Quicksand, Montserrat.
- Color accents: green `#36D7B7` (buttons/banners), darker green `#0ba14f` for CTAs.
- Containers: typically `max-w-[1400px]` with `px-6 lg:px-10`.

## Assets
- Logo/hero/course/404 images in `public/assets`. Use leading slashes (e.g., `/assets/hero.png`) with `next/image`.

## Notes
- Profile dropdown is opt-in: pass `profileMenu` to `Header`.
- Course cards support hover scale and pointer for discoverability.
