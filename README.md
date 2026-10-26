# Avela

**In tune with you.** Avela is a gentle, responsive cycle and wellness tracker for recording period flow, mood, symptoms, and personal notes. It turns your own entries into a calendar and simple summaries—without seeded records, diagnosis, or AI-generated health claims.

## Get started

### Requirements

- Node.js 20.9 or newer
- npm

### Run locally

```sh
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

Run the production build locally with:

```sh
npm run build
npm start
```

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production app |
| `npm start` | Serve the production build |
| `npm test` | Run the model and export tests |
| `npm run typecheck` | Check TypeScript types |

## What Avela does

- Starts with an empty tracker; setup-form suggestions are not saved until you choose to set up your profile.
- Records daily flow, mood, symptoms, notes, and period starts. Entries can be edited, and journal entries can be searched, filtered, and deleted.
- Shows a monthly calendar and cycle estimates based on your profile and recorded period starts. If a period is overdue, Avela shows that status instead of silently creating a new period.
- Summarizes recorded moods, symptoms, streaks, and cycle intervals. Summaries are based on your own saved entries.
- Stores data in your browser by default. Settings lets you download a JSON backup or export a CSV; clearing a journal requires confirmation.
- Optionally supports Firebase email/password accounts, password-reset requests, and live Firestore journal sync. Local journal data is not automatically uploaded when you sign in.
- Includes responsive navigation, keyboard-accessible controls, reduced-motion support, and informational pages.

Cycle dates are estimates, not medical advice or a substitute for professional care.

## Data and privacy

In local mode, your tracker data is stored in this browser and is not sent to a server by Avela. It is not automatically transferred to a Firebase account. Use the JSON or CSV export in Settings if you want a copy.

When Firebase is configured and you sign in, the account uses Firebase Authentication and its journal is stored in Firestore at `users/{uid}/wellness/data`. The rules in [`firestore.rules`](./firestore.rules) restrict access to the authenticated account owner. Clearing the journal does not delete the Firebase Authentication account.

Firebase web configuration is exposed to the browser by design. Access control must come from Firebase Authentication and Firestore Security Rules; **never put Firebase Admin credentials or other server secrets in `NEXT_PUBLIC_*` variables.**

## Optional Firebase setup

The app works without Firebase. To enable cloud accounts:

1. Create a Firebase project and register a web app.
2. Enable **Email/Password** under Firebase Authentication sign-in providers.
3. Create a Firestore database.
4. Copy [`.env.example`](./.env.example) to `.env.local` and fill in the Firebase web app values:

   ```dotenv
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

5. Deploy the included Firestore rules with the Firebase CLI:

   ```sh
   firebase deploy --only firestore:rules
   ```

Restart the development server after changing `.env.local`. For production, set the same variables in your hosting provider's environment configuration.

## App routes

| Route | Page |
| --- | --- |
| `/` and `/dashboard` | Overview |
| `/calendar` | Cycle calendar |
| `/journal` | Daily journal |
| `/insights` | Personal summaries |
| `/settings` | Data export and journal settings |
| `/flow`, `/mood`, `/body` | Direct check-in entry points |
| `/login`, `/signup` | Account dialog |
| `/welcome`, `/features`, `/about`, `/privacy`, `/contact` | Getting started, app information, privacy, and feedback |

## Project structure

- [`app/layout.tsx`](./app/layout.tsx) — shared layout, metadata, and bundled fonts.
- [`app/[[...route]]/page.tsx`](./app/[[...route]]/page.tsx) — App Router entry point.
- [`components/wellness-app.tsx`](./components/wellness-app.tsx) — route views, journal state, persistence, and Firebase subscriptions.
- [`components/forms.tsx`](./components/forms.tsx) — profile, check-in, and optional account forms.
- [`components/tracking-views.tsx`](./components/tracking-views.tsx) — calendar, journal, insights, settings, and information views.
- [`components/primitives.tsx`](./components/primitives.tsx) — shared UI primitives and illustrations.
- [`lib/model.ts`](./lib/model.ts) — data types, validation, date calculations, cycle estimates, and CSV encoding.
- [`lib/cloud.ts`](./lib/cloud.ts) — optional Firebase initialization.
- [`lib/download.ts`](./lib/download.ts) — browser file downloads.
- [`tests/model.test.ts`](./tests/model.test.ts) — model, validation, and export regression tests.

## Built with

Next.js App Router, React, TypeScript, Firebase Authentication and Firestore (optional), and bundled DM Sans and Fraunces fonts.

## License

This project is distributed under the [MIT License](./LICENSE).
