# Avela redesign and verification

Date: 28 October 2026. Baseline: `53e2e56`. Mode: **PRESERVE**.

**Final status: BLOCKED.** The implementation and local checks pass. Live Firebase authentication, password reset, cloud sync and deployed security rules require verification with a test account and configured deployment. Those checks have not passed by implication. No deployment or push was performed.

## 1. Redesign summary

Refined Avela's existing cycle and wellbeing tracker for people recording daily flow, mood and symptoms. Kept its botanical mark, green and coral palette, Fraunces headings, DM Sans interface, gentle voice and working data model. Replaced accumulated CSS overrides with a consistent responsive system, improved keyboard operation and form feedback, and fixed journal pagination after deletion.

The approved direction was **Editorial greeting**, seed `20261028`, with palette and type preserved. The face is Avela's serif typography and sage ground; its signature object is the cycle-day ring beside the daily check-in. No redraw was needed. The approved planning shorthand was variance 3, motion 2, density 4; these are project shorthand, not numeric settings defined by the installed skill.

## 2. Files modified

| File | Result |
| --- | --- |
| `app/globals.css` | Rebuilt tokens, hierarchy, layouts, controls, calendar sizing, responsive and reduced-motion states |
| `app/layout.tsx` | Analytics uses production mode on Vercel and development mode locally, preventing the local catchall from serving HTML as an analytics script |
| `components/forms.tsx` | Associated guidance/errors, busy state, and focus on invalid submission |
| `components/primitives.tsx` | Reordered section title/caption hierarchy; logo implementation preserved |
| `components/tracking-views.tsx` | Accessible dated mood history, natural-height populated insights, readable labels and stable journal pagination |
| `components/wellness-app.tsx` | Responsive modal navigation, focus management, dashboard alias, selected moods, approved greeting revision |
| `artifacts/REDESIGN-REPORT.md` | This report |

No component files created or removed. Existing component exports remain. No dependencies added; `package.json` and lockfile are byte-identical to baseline. Restored the locked installation with `npm ci --ignore-scripts`. The existing `.agents/` skill installation and `skills-lock.json` appear as untracked files; they are tooling, not new application dependencies.

## 3. Major visual improvements and tokens

Flat panels, neutral active navigation, consistent spacing, fewer ornamental labels, readable section captions, tabular figures and clearer check-in actions replace the earlier tiny typography and overlapping overrides. Mood history now names each recorded mood and date rather than implying an ordered numeric scale between emotions. Existing illustrations remain available; decorative flourishes no longer compete with primary tasks.

Protected tokens are unchanged: forest `#294c3b`, coral accent `#cb8875`, ground `#f8f9f5`, surface `#fffefa`, ink `#253c31`, sage `#e9efe4`; serif `"Fraunces", Georgia, serif`; sans `"DM Sans", sans-serif`.

The consolidated system uses muted ink `#58644f`, controls `#a8b3a3`, chart green `#496e51`, period fill `#f2dfd4` with text `#743f32`, and period mark `#cd8370`. These semantic period colours do not replace the original brand accent. Panel/control/small radii are 12/8/4px; spacing follows a 4px base; normal body/small text is 14/13px, section headings 20px, app titles 30px desktop and 24px phone. Information-page titles are 32/28px. Feedback transitions use 160ms and respect reduced motion.

## 4. Functional improvements

Navigation highlights Overview for `/dashboard`. Mobile navigation takes focus, traps both Tab directions, closes on Escape, restores trigger focus and makes background content inert. Deleting the final entry on the last journal page now shows the remaining history. Forms focus their validation alert and expose password guidance. Quick mood selections expose their selected state. Local check-in storage, calculation logic, export schemas and API integration contracts remain unchanged.

## 5. Responsive improvements

Verified empty and populated states on eight views at 320, 390, 768, 1024, 1440 and 1920px, plus two maximum-length cases: **98 combinations**. No horizontal overflow, missing H1, text below 11px, unloaded brand fonts or runtime exceptions were found by that check. Navigation folds at tablet widths; cycle copy and ring stack on phones. At 320px the calendar uses the available width and measured day targets exceed 44px. The maximum 50-character name remains fully visible in a separate paragraph, while the approved heading occupies one line at 320px.

## 6. Accessibility improvements

Visible focus, 44px main controls, associated errors and guidance, busy states, selected-state semantics, dialog navigation and keyboard restoration were checked in the browser. Reduced motion disables interface travel. Dated mood rows communicate their content without requiring colour or chart interpretation. Contrast and tiny-text checks passed the skill inspector. This is not a screen-reader or comprehensive WCAG certification; those audits remain unperformed.

## 7. SEO preservation results

The 16 existing discoverable routes returned 200: `/`, `/dashboard`, `/calendar`, `/journal`, `/insights`, `/settings`, `/flow`, `/mood`, `/body`, `/login`, `/signup`, `/welcome`, `/features`, `/about`, `/privacy`, `/contact`. Existing aliases, route implementation, metadata, primary destinations and `#main` remain intact. Authentication aliases still open their dialogs.

The existing global `noindex, nofollow`, lack of canonical/structured data/sitemap, and catchall 200 behaviour for unknown paths remain. These are baseline limitations outside the approved preservation scope. No search-ranking improvement is claimed. The only approved H1 wording exception is documented below.

## 8. Em-dash audit

Checked additions in all six modified application files against baseline, including newly written user-facing strings. **PASS: no em dashes introduced.** No protected legal text was edited to satisfy the audit. Existing metadata punctuation and the missing-cycle-value dash remain preserved; no correction to new copy was necessary.

## 9. TasteSkill verification

The installed authority is `.agents/skills/design-taste-frontend/SKILL.md`, identifying itself as tasteskill v2, with `references/app-screens.md` and `references/critique.md`. It does not contain the requested Section 11.B audit, Section 11.D levers or a Section 14 Pre-Flight Check. This mismatch was disclosed during planning. The table below reports its actual app workflow and measured checks; it does not invent a Section 14 certification. The missing named checklist cannot be certified.

| Actual applicable requirement | Result | Evidence |
| --- | --- | --- |
| Inventory product, data, users and jobs before styling | PASS | Repository audit and approved Preserve strategy; daily check-in is the main job |
| Draw app direction and retain approved brand | PASS | Editorial greeting, seed 20261028, keep palette/type; direction JSON in evidence folder |
| Product name, scope, face and signature visible | PASS | Avela shell, account/device status, serif/sage treatment, cycle ring |
| Screen question answered first; frequent job one click away | PASS | Overview cycle/check-in, Log today; calendar date selection; journal search/filter; settings profile controls |
| Real data and computed totals, no invented account history | PASS | Fresh-account and populated browser checks; existing model tests; synthetic fixtures only in isolated QA browser |
| Empty, missing, zero, selected, disabled and validation states | PASS | Empty/populated matrix; future dates disabled; zero streak, Not logged, validation and selected mood checks |
| Responsive shell and usable phone composition | PASS | 98-case matrix; screenshots at 1440/768/390 and targeted 320px |
| Minimum text size and readable contrast | PASS | Inspector 0 FAIL on all eight views; no text under 11px in matrix |
| Flat surfaces, no resting shadows, glows, gradients or tinted icon tiles | PASS | Source lint and rendered inspector; visually reviewed screenshots |
| Controlled radii, numeric alignment, tabular figures | PASS | Consolidated tokens and inspector checks |
| Chart semantics, marks and honest empty states | PASS | Cycle legend preserved; mood names dated; totals checked against saved records |
| Colour used for meaningful data/status and restrained controls | PASS | Populated render reviewed; brand ground and empty-data warnings explained below |
| Folded navigation, focus and keyboard use | PASS | Forward/reverse Tab, Escape, restore, inert background browser tests |
| Feedback motion, reduced-motion support, no entrance sequence | PASS | Source review and browser reduced-motion check |
| Source lint | PASS | 0 FAIL, 3 WARN; date padding only |
| Production inspector and screenshots reviewed | PASS | Eight views, all final 48 listed screenshots opened; populated and maximum-name renders also opened |
| Fix/look loop and written app critique | PASS | Three visual rounds, final critique below |
| Page photography floor, page motion floor, scroll scenes | NOT APPLICABLE | App-screen workflow expressly excludes those page requirements |
| Requested named Section 14 checklist | NOT APPLICABLE | Absent from the installed skill; no fabricated requirements substituted |

Official inspector results at 1440/768/390px:

| View | FAIL | WARN |
| --- | ---: | ---: |
| Overview | 0 | 2 |
| Calendar | 0 | 3 |
| Journal | 0 | 1 |
| Insights | 0 | 1 |
| Settings | 0 | 1 |
| About | 0 | 1 |
| Privacy | 0 | 1 |
| Contact | 0 | 1 |

Warning decisions: `palette-cream` reflects protected `#fffefa`, retained under the approved brand constraint. `no-data-hue` on empty overview/calendar is honest absence of recorded data; populated records receive their semantic marks. Calendar `ragged-row` is the shorter independent explanatory aside; stretching it would create an empty panel. Source `numbering` warnings are three date `padStart` calls, not decorative numbering. A separate populated insights probe also flags its naturally shorter symptom summary and a generic small-title rule; the official app inspector accepts its app title scale. No `--allow` flags hid failures.

Final app critique, answering the seven questions in app-screens.md:

1. Overview answers where the user is in their cycle and offers today's check-in beside it. Calendar, journal, insights and settings place their respective working content first.
2. Shared panel edges and gutters hold across widths. Populated short summaries retain natural height; remaining asymmetry in the calendar explanation is intentional. No clipped or stretched content was seen in reviewed renders.
3. Sage and serif supply Avela's face; coral encodes periods, green marks current data/status. Protected brand surfaces remain the documented palette exception.
4. Insights total matched the seeded eight records in the interaction test; same-day updates remained one record. Cycle day, period estimate and streak share the unchanged model. Displayed mood/symptom counts derive from entries, with dates and units attached.
5. Fresh-account streak shows 0, missing cycle data is explicitly not set, and mood days say Not logged. No generated wellbeing history ships.
6. Calendar swatches match period, estimate and today marks; mood rows name dates and feelings directly. No label collisions were seen.
7. Phone navigation folds away; the cycle ring stacks below its explanation, statistics use two columns, and journal filters wrap. Long names remain visible without widening the page.

ROUND 3

Seen in one second: Avela's cycle summary and today's check-in.

Idea (one sentence): A calm personal rhythm journal organised around the current cycle and the next small check-in.

Live thing: Real local check-ins update calendar marks, history, streak and insights.

Layout words by section: overview=split cycle/check-in / statistics=compact grid / calendar=month / mood=dated list / care=statement / journal=history.

Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 7.6. This is an internal critique, not an external jury score. Picture/motion caps do not apply to this app workflow.

Top three problems and disposition:

1. The maximum-name 320px greeting previously occupied six lines. `approved-heading-320.jpg` now shows the approved one-line heading and complete name below; verified without overflow.
2. Populated insight summaries previously stretched to their taller neighbour. Final populated-insights renders use natural panel height; the resulting unequal endings are accepted rather than filling a short summary with blank space.
3. Empty accounts remain visually sparse relative to populated screens (`final/overview/desktop-page-01.jpg`). The setup prompt and real empty states explain the next action; adding fictional health records would misrepresent the product.

## 10. Preservation audit

**No unauthorised contract changes found.** Automated comparisons produced 43 passing assertions, supplemented by explicit review of the approved dynamic-heading exception. The automated heading assertion compares JSX structure; it does not independently prove variable-generated heading text.

| Contract | Change list |
| --- | --- |
| URLs and route paths | None |
| Primary navigation labels/destinations | None |
| Form field names | None |
| Existing anchor IDs | None removed or renamed; `#main` preserved |
| Added IDs | `#navigation` for menu control; generated form guidance/error IDs for accessibility |
| SEO-critical headings | Approved exception: personalized overview H1 `A little more in tune, {name}.` becomes `A little more in tune.`; full name appears separately as `Your space, {name}.` Wherever the shared overview renders, this expression applies. Unconfigured welcome and other page H1 wording remain |
| Legal/privacy copy | None |
| API contracts, storage schema, integration points | None; model/cloud/download/rules files byte-identical |

User approval for the exception: **“Approve shorter heading”**, responding to the 320px maximum-name issue. Secondary captions now use sentence case; ornamental eyebrows/spark were removed as approved visual treatment. Section title and caption order changed without changing their substantive text. Mood rendering changed presentation while retaining the recorded feelings and dates.

## 11. Brand fidelity audit

**PASS for the checked preservation contracts.** Original coral `#cb8875`, six protected palette values and both font stacks compare exactly with baseline. Brand component is byte-identical, preserving the botanical mark and wordmark treatment. Both brand fonts loaded in the tested browser. Before/after screenshots and baseline source are stored in the evidence directories. The final aesthetic retains Avela's gentle botanical personality; this last judgement is visual, not a numeric test.

## 12. Build and test results

| Verification | Result |
| --- | --- |
| `npm run build` | PASS; production compilation, TypeScript and route generation |
| `npm run typecheck` | PASS; also checked by final build |
| `npm test` | PASS; 9 existing model/export/schema tests |
| TasteSkill source lint | PASS; 0 FAIL, 3 explained WARN |
| `git diff --check` | PASS |
| Browser interaction suite | PASS; 36 assertions, no unexpected runtime exceptions |
| Preservation suite | PASS; 43 assertions, approved dynamic-heading exception reviewed separately |
| Responsive matrix | PASS; 98 combinations, all 16 routes 200 |
| Approved heading regression | PASS; one line at 320px, complete 50-character name, no overflow |
| Eight-view production inspector | PASS measured gates; 0 FAIL, warnings disclosed above |
| Live Firebase end-to-end/deployed rules | BLOCKED; not exercised |

The 36 interaction assertions cover fresh storage, navigation focus, setup, validation, save/update/delete/cancel, pagination/filter/search, insight totals, calendar navigation/future disabling, JSON/CSV exports, feedback download, direct entry/auth dialogs, signup guidance, dashboard alias, reduced motion and clearing local data. They do not submit real auth emails or create real accounts.

CSS source is 37,046 bytes versus 44,083 bytes at baseline, about 16% smaller. This is a source-size observation; no Lighthouse, field performance or bundle-speed improvement is claimed. No general lint script exists in package.json; the actual source lint used is named above.

## 13. Remaining issues and evidence

Required live checks remain: configured Firebase sign-up, sign-in, password reset, cloud save/load/conflict behaviour, sign-out and deployed Firestore permissions. Integration code was preserved, but unchanged code is not proof of end-to-end operation. Vercel production analytics also needs deployment verification. No cross-browser, assistive-technology or performance certification was performed. Existing indexing/catchall limitations remain as described in section 7.

QA data was synthetic and isolated in temporary browser profiles: Mira, `qa@avela.test`, generated October dates and check-ins. No fixtures were added to the shipped tracker or user storage. No account was created and no email was sent.

Local preview: http://127.0.0.1:3017 (while the development session's production server is running).

Evidence root: `C:/Users/arghy/.codex/visualizations/2026/10/28/01a1811e-74c8-7c60-bfff-5c3258f5da53/`.

- `avela-strategy/direction.json`: approved style draw.
- `avela-audit/`: baseline inspection.
- `avela-implementation/before/`: baseline source copies, without secrets.
- `avela-implementation/final/<view>/report.json`: official reports and 48 screenshot sheets/folds for the eight views.
- `avela-implementation/browser-results.json`: 36 browser assertions.
- `avela-implementation/preservation-results.json`: 43 preservation assertions.
- `avela-implementation/matrix-results.json`: 98 layout combinations and route metadata.
- `avela-implementation/heading-results.json`, `approved-heading-320.jpg`: approved maximum-name check.
- `avela-implementation/populated-*.jpg`: populated overview, journal and insights renders, all visually reviewed.
- QA `.mjs` scripts beside these results permit local reruns; they are outside the app repository.

## 14. Final completion status

**BLOCKED: required live integration verification remains incomplete.** All executed local checks pass, with no mandatory measured failure left open. The implemented redesign is ready for review in the local preview. Production readiness and full completion cannot be marked PASS until the remaining live checks are performed. The absent named Section 14 checklist also cannot be represented as having run; the installed skill's actual app workflow results are provided transparently in section 9.
