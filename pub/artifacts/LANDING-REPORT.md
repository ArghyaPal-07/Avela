# Avela landing page

Implemented at `/`. The existing tracker overview remains at `/dashboard`, and every Start tracking action points there. The tracker Overview navigation now points to `/dashboard` as well. Explore features and Features scroll to `#features`.

## Source and design

Retained Next.js App Router, TypeScript, plain CSS, Lucide icons, the existing Brand component, bundled Fraunces and DM Sans fonts, and the app's forest palette. No separate supplied logo file was present in the repository. The existing flower-and-wordmark proportions were retained.

The supplied video's opening botanical becomes the page's visual anchor. Ivory, forest, and sage repeat through three feature previews, the setup/check-in/review sequence, a native FAQ disclosure list, and the closing action. All previews are labelled illustrative and are hidden from assistive technology; descriptions carry the equivalent information.

The design-skill draw selected quiet-instrument. The user's explicit composition takes precedence over its narrow single-column hero and text-only sections: the hero has HTML on the left and footage on the right, followed by the requested three cards. The requested subtle borders, ivory surfaces, and cards are preserved. One video plus three HTML interface fragments replaces unrelated decorative pictures. Motion is deliberately limited to the hero entrance, background footage, and control feedback, with no forced scroll scenes. Inspector allowances document those decisions: hairline, outlined-box, icon-cards, still-page. The remaining warnings are intentional ivory branding and the distinct sizes inside the miniature interface previews.

Feature descriptions were checked against `src/lib/model.ts`, `src/components/forms.tsx`, `src/components/tracking-views.tsx`, and `src/components/wellness-app.tsx`: period starts and daily flow; symptoms, moods and notes; calendar/journal history and intervals between recorded period starts. The FAQ explains estimates, editing, exporting, and starting without an account. No testimonials, user counts, health outcomes, or unsupported guarantees were added.

## Media

- Original preserved: `pub/video/hero-desktop.mp4`, 1,276,998 bytes.
- Web copy: `public/pub/video/hero-desktop.mp4`, 681,249 bytes. H.264, yuv420p, no audio, CRF 24, fast-start MP4. Resolution and frame rate retained.
- Desktop poster: `public/pub/video/hero-poster.webp`, 26,570 bytes.
- Mobile poster: `public/pub/video/hero-mobile.webp`, 10,548 bytes.
- Public video URL: `/pub/video/hero-desktop.mp4`.
- Autoplay, muted, loop, playsInline; accessible pause/resume; promise rejection and source/video errors handled.
- Below 900px, with reduced motion, or with browser data saving, no video element/source is mounted. Changing the reduced-motion setting removes active video immediately.
- The poster and an ivory fallback remain independently of video loading. Text and actions are HTML.

## Verification

- Read the installed Next.js page and public-assets documentation before implementation.
- `npm run build`: passed, including the production TypeScript check.
- `npm run typecheck`: passed.
- `npm test`: all 9 tests passed. Corrected the existing script from `tests/*.test.ts` to `src/tests/*.test.ts`; previously it silently ran zero tests.
- `git diff --check`: passed.
- Production browser inspection at 1440, 768, and 390px: no failures with the documented brief-specific allowances. All headings at most two lines, fonts loaded, no text-contrast failures. Screenshots visually reviewed; fixed the tablet botanical crop and the closing action's excessive desktop gap.
- Behavioral checks at 320, 390, 768, 900, and 1440px: no horizontal overflow, poster loads, zero video requests below 900px.
- Real keyboard events checked the skip link, FAQ opening/closing, feature anchor, and video pause/resume. Clicking Start tracking opened `/dashboard` with Overview correctly active.
- Simulated autoplay denial, blocked video, reduced motion, and data saving: static fallback, stable layout, no JavaScript exceptions. Live reduced-motion preference change also passed.

Browser evidence and the repeatable CDP behavior script are stored locally in ignored `.taste-skill/`. These checks used Chromium; Safari/iOS hardware was not available for device-specific testing.

## Preview

The production preview runs at http://127.0.0.1:3001.

For development later, run `npm run dev` and open http://127.0.0.1:3000.
