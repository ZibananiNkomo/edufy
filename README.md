# Edufy

See [RELEASE.md](RELEASE.md) for the first production release review, outstanding checks, GitHub preparation and exact Hostinger deployment steps.

A mobile-first Grade 7 mathematics revision app, starting in Zimbabwe. React, TypeScript (strict mode), Vite and plain CSS. No backend, accounts, tracking or remote services.

## Local development

Install Node.js 22.12+ (Node 24 is supported) and npm. From this folder:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally http://127.0.0.1:5173. On Windows where PowerShell blocks npm.ps1, use `npm.cmd` in place of `npm` for all commands. Stop the server with Ctrl+C.

```sh
npm test
npm run build
npm run preview
```

`build` checks TypeScript and creates the static production files in `dist/`. `preview` serves that build locally. No deployment has been configured or performed. When approved, the contents of `dist/` can be uploaded to the domain's document root on Hostinger Business Web Hosting. The app uses no server routes or client router, so no rewrite rules are needed. For hosting in a subdirectory, configure Vite's base path first.

## Product flow

Home → subject → topic → one question at a time → results → answer review → retry mistakes. An answer is required before advancing. Results include correct/incorrect counts and a rounded percentage. Review includes every question and flags mistakes. Retrying creates a fresh session containing only missed questions; that result applies to the retry session. Leaving a quiz prompts before discarding it. Refreshing loses session progress; persistence is deliberately deferred.

## Structure

- `src/data/mathematics.ts`: topic catalogue and 12 checked example questions.
- `src/domain/types.ts`: content metadata and answer types.
- `src/domain/quiz.ts`: pure scoring and answer validation functions.
- `src/main.tsx`: application entry point.
- `src/App.tsx`: app flow and screen rendering, with an error boundary.
- `src/components/QuestionChoices.tsx`: reusable accessible multiple-choice field.
- `src/styles.css`: responsive design, touch targets, keyboard focus and reduced-motion support.
- `tests/quiz.test.ts`: scoring, rounding, missing/invalid answers, retry sets, content integrity and independently calculated answer checks.
- `tests/journey.test.ts`: DOM integration test of navigation, selection, completion, review, retry and leave confirmation, using jsdom.

Each question records country, curriculum, grade, subject, topic, learning objective, type, difficulty, answer, explanation and editorial review status. `curriculum: null` explicitly means curriculum alignment is unverified. `example-verified` means the example arithmetic was checked, not approval by a curriculum authority. These questions are illustrative practice, not an official syllabus or examination bank.

Content and scoring are independent of rendering, allowing a later API adapter. The discriminated question type currently supports only multiple choice; add a new type and corresponding renderer/scorer when needed. Authentication, saved attempts, analytics, more curricula and question types are intentionally future work.

All content is bundled locally, so there is no asynchronous content loading state or network dependency after page load. The app has a recovery screen for render errors. No external fonts, images, UI frameworks or runtime dependencies beyond React are used.

## Manual acceptance checks

1. Start from Home, select Mathematics and each topic; verify four questions per topic.
2. Confirm Next is disabled until choosing an answer; use Tab, arrow keys and Space for radio options.
3. Complete a mix of right and wrong answers, verify result counts and explanations.
4. Retry mistakes and confirm only missed questions appear with cleared answers.
5. Complete a perfect session and verify there is no retry-mistakes button.
6. Check 360px mobile and desktop layouts, keyboard focus, and leaving an active quiz.

Initial Git repository is created locally; no remotes or deployment credentials are needed.
