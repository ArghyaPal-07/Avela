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
- `QA.md`: executed checks, browser test cases, and verification limits. Screenshots are in `artifacts/`.

## Optional Firebase setup

This workspace is now configured for Firebase project `avela-f1ccd` in the ignored `.env.local` file. Its Auth project responds successfully, the intended domain `avela-tracker.vercel.app` is authorized, and Firestore rejects unauthenticated reads. Account sign-in and saving a real check-in still need an end-to-end user check. The instructions below also cover setting up another installation.

Local mode requires **no environment variables or external services**. No passwords are stored locally; local mode has no authentication boundary. Browser localStorage is not encrypted. Anyone with access to the browser profile can potentially read it. Do not treat this prototype as a regulated medical-record system.

To enable cloud accounts:

1. Create your own Firebase project and register a web app.
2. Enable Authentication → Email/Password, and configure authorized deployment domains.
3. Create Cloud Firestore. Deploy this project's `firestore.rules` using Firebase Console or Firebase CLI. These rules use `users/{uid}/wellness/data`.
4. Copy `.env.example` to `.env.local` and populate the six `NEXT_PUBLIC_FIREBASE_*` fields from your own Firebase web-app configuration.
5. Restart the development server or rebuild the deployment.

Firebase web-app configuration is intentionally public client configuration. Security comes from Authentication, deployed Firestore rules, authorized domains, and appropriate project restrictions. Never put a service-account key, admin SDK private key, token, or password in a `NEXT_PUBLIC_*` variable.

Cloud sign-in switches to a separate cloud journal. Local entries are not automatically uploaded or merged. Signing out restores the browser-local journal. Cloud updates use `onSnapshot`; saves report success only after the Firestore write resolves. Cloud document loading failures are visible. Configure App Check, email verification, abuse controls, recovery flows, and appropriate monitoring before a public production launch.

## Deployment

Vercel is a straightforward target for this Next.js app:

1. Push this project to your own Git repository.
2. Import it in Vercel; use the Next.js preset, `npm install`, and `npm run build`.
3. For cloud accounts, add your Firebase web configuration to Vercel environment settings and add the deployed domain to Firebase Authentication's authorized domains.
4. Deploy, then test sign-in, save, sign-out, and a second-account access denial against your own project.

It also runs on any Node hosting service with `npm run build` and `npm start`. The app is not configured as a GitHub Pages static export. This task produces the local implementation; no public deployment or Firebase project was created.

## Limits and next improvements

- Estimates use user-provided cycle settings. They do not confirm ovulation, diagnose conditions, or support contraception decisions. Cycle phase labels are rough educational estimates, not a physiological measurement.
- Firebase configuration and unauthenticated-access checks passed. Authenticated sign-in, persistence, and multi-account isolation remain to be verified. Rules restrict document ownership and basic structure; extend schema validation and test with the Firebase emulator before real health-data use.
- Cloud journals are stored as a single document with a 2,000-entry app limit. Larger journals should migrate to individual documents with paginated queries and server validation.
- Local JSON backup export is provided; importing/restoring backups is a future improvement.
- No push/email reminders or support message delivery are connected. Updates are in-app only; feedback downloads as a text file.
- No account deletion or audit trails, encryption at rest controlled by the app, or cross-tab local conflict resolution. Clearing a journal does not delete a Firebase Auth account.
- Production hardening should include authenticated end-to-end tests, rule-emulator tests, a formal privacy policy for the operator, retention/account deletion processes, and testing with assistive technology.
- Dependency licenses remain those of their respective authors. Fonts are installed through Fontsource; retain their license files when redistributing.
