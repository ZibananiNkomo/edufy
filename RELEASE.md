# First production release review

Reviewed 26 October 2026. No deployment or remote hosting changes performed.

## Findings

- All 6 automated tests pass, including completion, selection validation, scoring, review, cleared retry sessions, topic switching and leave confirmation.
- Standalone TypeScript check and production build pass. Strict mode remains enabled.
- Compiled production preview served HTML, JavaScript and CSS with HTTP 200 and the correct asset content types at `http://127.0.0.1:4173/`.
- No critical application error or broken in-app navigation found in code inspection and DOM journey tests. The learner's manual core-journey checks also passed.
- Responsive rules cover mobile (up to 600px), tablet (up to 900px), and desktop. Question options are at least 62px tall; primary actions are at least 50px. Keyboard focus and reduced-motion rules are present.
- This review could not perform rendered browser/device checks: no browser connection is available. Before publishing, check the production preview on a real Android phone at 320–412px widths and desktop, including all screens, answer wrapping, fraction glyphs, keyboard focus, and horizontal scrolling. DOM tests do not verify visual layout.
- Session progress remains memory-only. Refresh resets the app, and browser Back is not an in-app navigation mechanism. Use the provided Home, Learn and back buttons. These are existing Phase 1 limitations.
- No API, authentication, injected HTML, external font/image request or client-side secrets found in the application source.

## Content verification

All 12 questions have correct answer keys, unambiguous choices, appropriate units and mathematically correct explanations:

| ID | Verified result |
| --- | --- |
| n1 | 348 + 275 = 623 |
| n2 | 24 × 6 = 144 pencils |
| n3 | 72 ÷ 8 + 5 = 14 |
| n4 | The digit 6 in 46,215 represents 6,000 |
| f1 | 1/2 + 1/4 = 3/4 |
| f2 | 0.6 = 6/10 = 3/5 |
| f3 | 1/4 of 36 = 9 |
| f4 | 2.75 + 1.50 = 4.25 |
| g1 | Rectangle perimeter: 2 × (8 + 5) = 26 cm |
| g2 | Square area: 7 × 7 = 49 cm² |
| g3 | Third triangle angle: 180 − 50 − 60 = 70° |
| g4 | 2.5 km = 2,500 m |

**All questions (n1–n4, f1–f4, g1–g4) still require Zimbabwe Grade 7 curriculum verification**, including objective mapping, expected difficulty, terminology and coverage. Every record retains `curriculum: null`; `example-verified` means checked example mathematics only. The app visibly discloses this. It may be released as example practice, but must not be advertised as officially aligned or as a complete syllabus until qualified review against verified sources is done.

## Production output and dependencies

Current build (decimal KB; gzip sizes measured by Vite):

| Asset | Raw | Gzip |
| --- | ---: | ---: |
| JavaScript | 237.31 KB | 74.42 KB |
| CSS | 13.85 KB | 3.84 KB |
| HTML | 0.62 KB | 0.37 KB |
| Total | 251.78 KB | 78.63 KB |

Only React and React DOM are direct runtime dependencies (plus their scheduler dependency). jsdom, tsx, TypeScript, type declarations and Vite are development-only and are not shipped. No oversized media, source maps or unnecessary runtime package found. npm audit reported zero known vulnerabilities at review time. Actual transfer sizes depend on hosting compression.

## Changes made during review

- Added a `typecheck` npm script for a standalone compiler check.
- Extended `.gitignore` to exclude common secrets, private keys, local npm credentials, AWS credentials and logs. Existing node_modules, dist and environment exclusions remain. `.env.example` is intentionally permitted and must contain placeholders only. Ignore patterns cannot detect every possible secret filename; review files before each commit.
- Added this report and linked it from the README. No application behavior or design changed.

## Release gates

No confirmed code/build/content-arithmetic blocker found. Complete the rendered mobile/desktop production-preview check before publishing. Curriculum verification blocks claims of curriculum alignment, not a clearly labelled example-practice release. Live DNS, account document root, TLS, compression and permissions require verification in the actual Hostinger account during an approved deployment; they have not been inspected or changed.

## GitHub preparation

Git already exists locally. The branch is now `main`, and the reviewed source, lockfile, tests and documentation are staged for the initial commit; no commit or remote has been created. Staged whitespace checks pass. Verified that node_modules, dist, environment files and representative credential filenames are ignored, while `.env.example` remains permitted. Keep `package-lock.json` in version control for reproducible installs. Review `git status` and `git diff --cached` before committing or pushing. Do not commit build output, credentials or node_modules.

If the initial commit has not yet been created:

```powershell
git add .gitignore README.md RELEASE.md index.html package.json package-lock.json tsconfig.json src tests
git commit -m "Prepare Edufy Grade 7 revision release"
```

Use your own existing Git identity; never invent one. When ready to publish source, create an empty GitHub repository without an initial README or license, then run (replace OWNER with your GitHub account):

```powershell
git branch -M main
git remote add origin https://github.com/OWNER/edufy.git
git push -u origin main
```

These commands are instructions, not authorization to push. A GitHub push does not deploy to Hostinger.

## Exact deployment steps — only after approval

1. From a clean checkout on Node 22.12+ (or Node 24), run:

   ```powershell
   npm.cmd ci
   npm.cmd test
   npm.cmd run typecheck
   npm.cmd run build
   npm.cmd run preview
   ```

2. Open the preview URL printed by Vite (normally `http://127.0.0.1:4173/`). Complete the mobile/desktop check above and the quiz/review/retry journey. Stop preview with Ctrl+C. Neither Vite dev nor preview is a production server.
3. In Hostinger hPanel, select the website for **edufy.co.zw** under Websites. Use a custom HTML/static website, not Website Builder. If the site is not set up, add an empty custom HTML website associated with the domain. Verify the selected domain before uploading.
4. Confirm domain DNS points to the hosting account using the values provided by Hostinger. Record existing DNS before changing it and preserve mail-related records. No guessed IPs or nameservers are needed.
5. Open that website's File Manager and its **public_html** document root. Download a backup of any existing site and preserve existing configuration. Resolve any conflicting default index.php/index.html only after confirming it belongs to the site being replaced.
6. Upload the **contents** of local `dist/` so that `public_html/index.html` and `public_html/assets/...` exist. Do not upload a wrapping dist folder, source, node_modules, .git, tests or environment files. Upload assets before index.html when replacing a previous release. Keep old hashed assets during the transition to avoid breaking already-open sessions.
7. No Node process, npm install, database, backend configuration or SPA rewrite is required on Hostinger. The default Vite base `/` is correct for `https://edufy.co.zw/`; do not use this build unchanged under a subfolder. Asset names are hashed; HTML should revalidate rather than be cached indefinitely.
8. Verify the domain's SSL certificate is active in hPanel and HTTPS works, then enable/check HTTPS redirection. Purge any Hostinger/CDN cache for updated HTML as applicable.
9. Visit `https://edufy.co.zw/` in a fresh browser session and on Android. Confirm HTML, JS and CSS return successfully with appropriate content types, no console errors or missing assets, no horizontal scrolling, and a complete quiz → results → review → retry flow. Reload the homepage to confirm static serving. Verify HTTP redirects to HTTPS and check the chosen www/non-www domain behavior.
10. If verification fails, restore the backed-up index and matching assets/configuration. Keep the previous release until the new release is confirmed working.

Hostinger documentation supporting the static-file procedure:

- [Add a custom HTML/static website](https://www.hostinger.com/support/1583214-how-to-add-a-website-in-hostinger/)
- [Upload website files into public_html](https://www.hostinger.com/tutorials/how-to-upload-your-website/)
- [SSL included with hosting](https://www.hostinger.com/support/1575761-how-to-claim-a-free-ssl-that-comes-with-a-hostinger-hosting-plan/)
