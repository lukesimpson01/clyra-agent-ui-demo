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
4. Keep `npm run dev` working with **port 5173 as the preferred default**. If 5173 is occupied (`EADDRINUSE`), the server must automatically try the next free port (5174, 5175, etc., up to 20 alternatives), **print the actual working URL** and remain running instead of throwing an unhandled error. Never silently change ports: always explain the fallback. If all attempts fail, show a readable error with recovery advice. An explicit `PORT` environment override must also handle collisions. Do not terminate the other process to free its port.
5. Do not introduce runtime dependencies without explicitly updating this contract and warning the user before making the change.

## Busy-port behaviour (macOS and other platforms)

When another process already listens on `localhost:5173`, do **not** crash with `EADDRINUSE`. A new `npm run dev` should report something like:

```text
Port 5173 is already in use. Trying another available port…
Clyra UI Demo → http://localhost:5174/
(Port 5173 was busy; using 5174 instead.)
```

The displayed URL is authoritative: open the new URL rather than assuming the demo is always on 5173. Stop an old server with **Ctrl+C** in its own terminal only if you specifically want to reuse 5173. Never automatically kill a listening process; it may be another application. The server may try up to 20 fallback ports. The normal two-command flow remains unchanged:

```bash
git pull
npm run dev
```

No dependency installation is needed. The occupied-port regression must remain covered by `npm test` and the repository's GitHub Actions workflow. These rules belong **only to the standalone demo repository**; do not copy its server, port policy, workflow or test harness into the user's main Clyra project.

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
- **Before pushing any change, actually execute `npm run dev` in the working project folder** and confirm it starts and serves the demo over HTTP. A syntax check or GitHub source inspection alone does not count as a startup test.
- **Before pushing, run `npm test`**, which includes both the existing smoke test and `node scripts/port-test.mjs`: a real occupied-port regression which must prove automatic port fallback, real HTTP 200 responses for HTML/CSS/JS, and correct 404 behaviour.
- For changes to the server or startup settings, explicitly reproduce the user's reported case: **make 5173 unavailable, execute the exact `npm run dev` command, and verify it starts on an available fallback port without an uncaught `EADDRINUSE` exception**. Confirm the URL shown is the URL actually serving content.
- Run these checks in a local checkout or equivalent complete local project BEFORE GitHub changes are committed/pushed. If test execution is unavailable, don't claim that the change was tested, and don't silently bypass the contract.
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

## UI layout & interaction regression contract (this demo only)

When changing the demo UI, **review both the actual rendered appearance and behaviour**, not only syntax/HTTP 200. Capture and inspect desktop (approximately 1440–1536px) and phone (approximately 390px) layouts after triggering the fixture, and inspect the relevant mid-flow and finished states. Add or update repeatable browser assertions for changed interactions.

Required behaviours after this update:
- The demo todo and composer must be inside **one shared bottom dock**, horizontally centred together. The todo panel expands directly above the composer. Composer hint and send button must be fully inside its rounded border at desktop and mobile sizes; there must be no page-wide horizontal overflow.
- Reconnecting/Wi-Fi simulation is **absent from the demo flow**. Do not reintroduce it without an explicit request.
- The browser tool’s action list shows no more than three full rows; on the fourth and later actions the list scrolls *inside itself* to follow new items, without enlarging the browser preview.
- Documents and presentation previews remain **inline and visible**, never collapsed into a document/slide dropdown. Formatting tools can enter an edit state without collapsing the artifact.
- The sources strip expands only into a **short, fixed-position icon row**. The site name appears in a small floating pill on hover/focus. **Neighbouring icon positions must not move when a site is hovered**; hovering another icon must remain possible. Actual site links only open on click.
- Correctly preserve all other existing agent presentation components unless removal is expressly requested. Retain lightweight, reduced-motion-safe transitions.
- If visual inspection is blocked by the runtime, use `page.set_content()` with a representative fixture for layout review and clearly label it as a *layout-only preview*; don't claim it proves the full app works. Keep CI Chromium browser tests for the full product.

The standalone demo can rely on `git pull` and `npm run dev` without installing runtime dependencies. **None of these fixture-specific layout rules, sample pacing, startup instructions or mocked controls transfer to the host Clyra app.** Preserve the host's own composer, message layout, scroll and editor engine.



## Additional fixture regression rules

- Collapsed todo **must not compress sideways**. The todo card's alignment slot remains the same width in both states; only a centred circular progress indicator is visible when collapsed. Assert equal bounding-box widths before/after collapse in the browser regression test.
- Presentation Builder status keeps shimmer but has **no disclosure**. The separate resulting slide artifact opens directly without a tool-detail dropdown.
- Player must expose working Previous / Pause-Play / Next and scrub, with **no hover title boxes**. Check track navigation and absence of `title`/`data-tooltip` on those controls in the browser test.
- Source disclosure rotates a visible chevron and slides site icons horizontally on open/close. Icons must not shift on hover; site labels float in their own pills and click opens correct links.
- Presentation Edit mode should follow a professional header/menu/toolbar/filmstrip/canvas arrangement. Use real handlers for visible commands. Check File menu opening, insertion of shapes/tables, layout switching, zoom, notes and menu dismissal. Document unsupported professional parity rather than claiming Google Slides feature equivalence.
- Use official Google Slides help for reference; the REA repository explicitly says to skip reverse-engineering tooling for ordinary source-repository analysis. If there is no supplied app artifact/allowed live runtime, do not install REA or invent inspection evidence.
- The **demo-only** startup and safety rules do not transfer to a Clyra host project.

