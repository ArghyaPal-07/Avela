# Avela — In tune with you

A responsive cycle wellness app with an ivory, forest-green, sage, and terracotta design.

## Run locally

Requires Node.js 20.9+ and npm. From this project directory:

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For a production server:

```sh
npm run build
npm start
```

```sh
npm test
npm run typecheck
```

## What works

- Empty dashboard on first use, with no generated personal records or estimates.
- Start a personal tracker with your name, last period, cycle length, and period length. Only your saved details and check-ins populate the dashboard.
- One editable check-in per date, including flow, mood, multiple symptoms, notes, and an explicit new-period marker.
- Period starts—not subsequent flow days—anchor cycle estimates. An overdue period is displayed as overdue rather than silently inventing a new cycle.
- Monthly calendar with recorded flow, today, check-ins, and estimated upcoming period days.
- Journal search, category filters, newest-first ordering, pagination, editing, and confirmed deletion.
- Mood counts, recent mood chart, symptom counts, streak, and cycle intervals based on recorded period starts. No invented diagnosis, AI analysis, or causal claims.
- Browser-local persistence, CSV export with formula-injection protection, JSON backup, and confirmed journal clearing.
- Firebase email/password sign-up, sign-in, sign-out, password-reset requests, and live private Firestore journal synchronization. Project configuration is required to activate the integration.
- Responsive mobile menu, semantic controls, native modal focus containment, Escape dismissal, skip link, focus indicators, and reduced-motion support.
- About/features/privacy pages and feedback file download. No pretend message delivery or simulated server success.

## Routes and files

- `/` and `/dashboard`: wellness overview.
- `/calendar`, `/journal`, `/insights`, `/settings`: tracking tools.
- `/welcome`, `/features`, `/about`, `/privacy`, `/contact`: explanation and feedback.
- `/flow`, `/mood`, `/body`: direct entry to daily check-in.
- `/login`, `/signup`: account dialog (local-mode explanation if cloud is absent).
- `app/layout.tsx`: app metadata and bundled fonts.
- `app/[[...route]]/page.tsx`: App Router entry. Client route rendering is centralized in `components/wellness-app.tsx`.
- `components/primitives.tsx`: dialogs, brand, empty states, and original botanical vector artwork.
- `components/forms.tsx`: validated profile/check-in forms and optional cloud account controls.
- `components/tracking-views.tsx`: calendar, charts, journal, insights, settings, and informational views.
- `lib/download.ts`: browser file export utility.
- `app/globals.css`: design tokens, layout, responsive styles, animations, and motion preference.
- `lib/model.ts`: data model, validation, date arithmetic, estimates, empty-state creation, CSV encoding.
- `lib/cloud.ts`: optional Firebase initialization.
- `tests/model.test.ts`: calculation, validation, and export regression tests.
- `firestore.rules`: owner-scoped cloud access.
- `package.json` / `package-lock.json`: reproducible npm dependencies; a gRPC override fixes the audited Firebase transitive vulnerability.
- `ANALYSIS.md`: application architecture and implementation decisions.


