# Avela architecture

Avela is a Next.js App Router and React application written in TypeScript. Its design uses ivory, forest green, sage, and terracotta, with bundled fonts and original SVG illustrations.

## Application structure

- The App Router layout owns the shared application shell and metadata.
- components/wellness-app.tsx manages route views, local journal state, and Firebase subscriptions.
- components/forms.tsx contains profile/check-in validation UI and Firebase account flows.
- components/tracking-views.tsx renders calendars, journal history, charts, insights, settings, and information pages.
- lib/model.ts owns date arithmetic, validation, cycle estimates, empty-state data, and CSV generation.
- lib/cloud.ts initializes Firebase from the installation's environment configuration.

## Data behavior

A new installation has an empty profile and journal. Default values in the setup form are suggestions, and are not shown as recorded measurements before setup. Calendar estimates need an actual period start. Only recorded check-ins populate charts, counts, and insights. No seeded records are included.

Local journals remain in the browser. Firebase Authentication supports email/password accounts and password-reset emails when configured. Firestore journals use users/{uid}/wellness/data and owner-scoped rules. Local data is not silently uploaded on sign-in.

## Deployment configuration

The six Firebase web configuration values belong in .env.local for development and deployment environment settings for production. firebase.json points to firestore.rules for deployment with Firebase CLI. No admin credentials belong in the client bundle.
