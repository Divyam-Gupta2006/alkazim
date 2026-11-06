# Endloops website — first draft

A responsive Next.js App Router + Tailwind CSS website concept for Endloops.

## Included
- Five routes: Home, Solutions, Tools, About, Contact.
- Shared responsive navigation and footer.
- Persona wheel in the hero with synced copy.
- Persona selector and pain-point / human-in-the-loop messaging.
- Interactive End-to-End vs Standalone product selector using the supplied balance-scale image.
- Five-step capability explorer with an interactive product-window mock-up.
- Demo modal and validated front-end contact form states.
- Framer Motion fade/reveal transitions and reduced-motion support.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Build
```bash
npm run build
npm start
```

## Important launch notes
- The supplied image is the balance-scale illustration and is used in the product comparison section.
- Static logo placeholders are reserved in the navbar and footer. Add the official asset as `public/images/endloops-logo.png` when ready.
- The supplied `infinity_loop_component.html` was used as the reference for a React infinity-loop mark. It appears in the hero CTA and performs one arrow lap only after the first downward scroll, then docks at the top-right. Scrolling upward does not trigger or replay the motion.
- The contact and demo forms currently show front-end confirmation only. Connect them to a CRM, email service, or API route before production.
- The phone number was not supplied, so it has intentionally been omitted.
- The product interface contains illustrative sample data, not live customer or financial information.
