# Demo-repository development contract

**Scope: THIS repository only** — `lukesimpson01/clyra-agent-ui-demo`.

This contract covers development, verification and publishing of this standalone Clyra Agent UI demonstration. **It must not be copied into or imposed on any application that imports these UI components.** See `AGENTS.md` for integration boundaries.

## Required end state after every change

1. Push all intended updates to this repository's `main` branch (unless the user explicitly requests another branch).
2. Verify that the latest source is committed and available remotely.
3. Ensure a user who already cloned this repository can run exactly:

   ```bash
   git pull
   npm run dev
   ```

   No `npm install`, build, environment secrets, or extra setup should be necessary to view this standalone demonstration. **Node.js and npm must already be installed.**
4. Keep the entry point `npm run dev` working, serving `http://localhost:5173/` unless the user expressly changes it. Do not silently change ports, startup behaviour, or requirements.
5. Do not introduce runtime dependencies without explicitly updating this contract and warning the user before making the change.

## Checks required on changes

- Run `node --check main.js` and validate package JSON.
- Run `node scripts/smoke-test.mjs` to start the actual dev server and request HTML, CSS and JavaScript. All checks must pass.
- Run `node scripts/browser-test.mjs` in an environment with Playwright/Chromium. Verify the composer submission, response states, plan disclosure, sources interaction, writing editor, slide editor, mobile sizing and absence of uncaught browser exceptions. This is a **development/CI-only dependency**, never necessary for `npm run dev`.
- Inspect relevant browser screenshots when any visual layout or motion is changed.
- Confirm all expected files were pushed and check the CI result. If browser/CI tests are unavailable, **state the limitation accurately**, do not claim every interaction was tested.
- If a check fails, fix and rerun before claiming success. Never bypass failed checks silently.

## Separation from production integration

- The app's composer, message bubbles, chat flow, event orchestration and storage belong to the host project. Preserve them when reusing components.
- The mock tools, data, document and slide preview are examples; use real host tool handlers and existing editor components for production.
- No demo-only timing, development contract, server or npm scripts transfer to the host application.

## How to test locally

```bash
npm run dev
```

And in a separate terminal for automated verification:

```bash
node scripts/smoke-test.mjs
```

Browser tests are also available in CI and can be run locally *only when Playwright and Chromium are already present*.
