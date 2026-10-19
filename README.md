# Obsidian — Developer & Trader portfolio

Next.js App Router + React + TypeScript + Three.js. Includes a responsive portfolio, WebGL hero, perspective switcher, project filtering, concept case studies, trading principles and a contact Route Handler.

## Run

```sh
npm install
npm run dev
```

Visit http://localhost:3000. `npm run build` creates the production build; `npm start` serves it. `npm run typecheck` checks TypeScript.

## Personalize

Edit `src/app/page.tsx` for your name, biography, projects and copy. Project descriptions now reflect the BillMate and BoardRealm codebases provided by the owner. Project previews use screenshots captured from the live public websites. The Trading section includes the owner-provided The5ers certificates with their original labels and dates. Styling lives in `src/app/globals.css`; the WebGL scene is in `src/components/Core.tsx`.

## Contact backend

Copy `.env.example` to `.env.local`, then set `CONTACT_WEBHOOK_URL` to your own trusted HTTPS endpoint (for example an automation that delivers email). The POST `/api/contact` route validates fields, rejects cross-origin browser requests and forwards submissions server-side. No secret is exposed to the frontend. Until configured, the form clearly reports that delivery is unavailable; it does not pretend to save a message. Messages are not stored locally. Configure production rate limiting or bot protection at your hosting edge before public launch.

## Deployment

Deploy as a Node.js Next.js app, such as on Vercel. Set `CONTACT_WEBHOOK_URL` in your deployment environment. This project uses server routes and is not a static export. Fonts use Google Fonts with system fallbacks; the rest of the page uses local code-generated visuals.

## Focus navigation

The portfolio is one fixed viewport with five mutually exclusive scenes. Scroll down/up, use ArrowDown/ArrowUp or PageDown/PageUp, swipe vertically, or use the navigation dots and scene buttons. A gesture threshold and transition cooldown prevent accidental rapid changes. Wheel events on form fields and project dialogs keep their native behavior. Reduced motion removes scene animation. Navigation lives in `src/components/useFocusNavigation.ts`.

## Shared-element scene transitions

Modern browsers use the View Transition API to animate independent snapshots of the scene, heading, visual, kicker, description and navigation between layouts. The live document continues to render only one section. Blue ambient lighting persists behind the transition. Menu requests made during a transition queue the most recent destination. Browsers without this API keep the shutter transition. Reduced-motion users switch scenes immediately. Styling lives in `src/app/scene-transitions.css`.
