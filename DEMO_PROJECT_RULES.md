# Demo-repository development contract

**Scope: THIS repository only** — `lukesimpson01/clyra-agent-ui-demo`.

This contract covers development, verification and publishing of this standalone Clyra Agent UI demonstration. **It must not be copied into or imposed on any application that imports these UI components.** See `AGENTS.md` for integration boundaries.

## Required end state after every change

1. Push all intended updates to this repository's `main` branch (unless the user explicitly requests another branch).
2. Verify that the latest source is committed and available remotely.
3. Ensure an existing clone whose local `main` branch is correctly tracking `origin/main` can run exactly:

   ```bash
   git pull
   npm run dev
   ```

   No `npm install`, build, environment secrets, or extra setup should be necessary to view this standalone demonstration **once the Git checkout is correctly configured**. **Node.js and npm must already be installed.** Git remote configuration is stored in each user's private `.git/config` and cannot be changed by committing files to GitHub.
4. Keep the entry point `npm run dev` working, serving `http://localhost:5173/` unless the user expressly changes it. Do not silently change ports, startup behaviour, or requirements.
5. Do not introduce runtime dependencies without explicitly updating this contract and warning the user before making the change.

## Critical: fix `git pull` when the local main branch has no upstream

**This is local Git metadata, not an npm/server bug. A GitHub commit cannot remotely fix another person's `.git/config`.** A normal `git clone` sets upstream automatically. A manually created folder (or `git init` followed by a download) may not.

When Terminal says **"There is no tracking information for the current branch"**, use this **once in the project's existing local folder**:

```bash
git remote -v
git fetch origin main
git branch --set-upstream-to=origin/main main
git pull
npm run dev
```

Before fetching, confirm `origin` points to this repository: `https://github.com/lukesimpson01/clyra-agent-ui-demo.git` (an equivalent SSH URL is fine). If `git remote -v` prints no `origin`, add it **only if you have confirmed this is the Clyra demo checkout**, then run the commands above:

```bash
git remote add origin https://github.com/lukesimpson01/clyra-agent-ui-demo.git
```

**`git pull main` is not a solution:** `main` is a branch, not a remote. `git pull origin main` can fetch/merge one time but does not reliably establish future upstream tracking. The `git branch --set-upstream-to` command is the lasting fix.

If you already have the helper from an updated checkout, `npm run setup:git` safely checks the checkout root, current branch and remote, fetches `origin/main`, and configures upstream. It **does not** overwrite `origin` if it points elsewhere; it does not reset, merge, delete or overwrite any working-tree files. The one-time Terminal instructions above are still needed for older checkouts that cannot pull the helper yet.

If `git pull` then reports divergent/unrelated history, or conflicts with uncommitted local files, **stop rather than using `git reset --hard`, force-push, or `--allow-unrelated-histories` blindly**. Inspect `git status`, `git branch -vv`, and `git remote -v`, then reconcile local work. A separate fresh `git clone` is often safest, after backing up the original folder.

After the upstream is fixed, subsequent updates require only:

```bash
git pull
npm run dev
```

This entire workflow and its repair script belong to **this demo repository only**, not to Clyra or other applications importing its UI.

## Checks required on changes

- Run `node --check main.js`, `node --check scripts/setup-git.mjs`, and validate package JSON.
- Validate the one-time Git repair helper's help mode and guard against changing an unrelated repository.
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
