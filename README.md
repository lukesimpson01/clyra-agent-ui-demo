# Clyra Response & Agent Activity UI Demo

A standalone, light-theme **visual reference** for AI answer text, thinking, search, file-edit diffs, document/slide/music artifacts, command execution, browser preview and general tool activity. The demo shows **three broad phases**, with only two later dividers; longer narration connects related actions.

**Important:** This standalone fixture includes a **temporary demo composer and sample message**, strictly for triggering its simulated activities. They must **not** replace the host application's own composer or message bubbles. It is **not** the replacement for your application's entire chat, message UI, app layout or agent loop. Keep your own host app's message bubbles, composer/input bar, position, size, animations, scroll behaviour and backend harness untouched. Reuse only the styles and renderers for assistant response *content* and tool/status UI.

Read **[AGENTS.md](./AGENTS.md)** for coding-agent implementation boundaries, then **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** before copying any component into your main app. Detailed comments in `index.html`, `styles.css`, and `main.js` explain the boundaries.

## Project-only update rule

This standalone GitHub repository has its own [DEMO_PROJECT_RULES.md](./DEMO_PROJECT_RULES.md). Every update must keep this existing-clone workflow working **without any extra installation**:

```bash
git pull
npm run dev
```

The repository must also pass `npm test` (dependency-free startup checks); GitHub Actions additionally runs Chromium browser interaction tests. **These demo rules do not transfer to any project which imports the UI components.**

### One-time repair if `git pull` says "no tracking information"

That error is from your **local** `.git/config`, not this repository's source files. If you are already in the correct Clyra demo folder and `git remote -v` shows `origin` pointing to `lukesimpson01/clyra-agent-ui-demo`, run:

```bash
git fetch origin main
git branch --set-upstream-to=origin/main main
git pull
npm run dev
```

If there is no `origin`, first add `git remote add origin https://github.com/lukesimpson01/clyra-agent-ui-demo.git` **after verifying this is the correct project**. If `origin` points to an unrelated repo, stop instead of overwriting it. The helper `npm run setup:git` is available in updated checkouts, but older copies that cannot yet pull it need the commands above once.

**After this one-time fix, subsequent updates use only:**

```bash
git pull
npm run dev
```

More detail and safety rules: [DEMO_PROJECT_RULES.md](./DEMO_PROJECT_RULES.md).

## Fix for macOS `EADDRINUSE` on port 5173

The dev server now handles occupied ports automatically. If `localhost:5173` is already in use, **`npm run dev` will try `5174`, then `5175`, etc.** and print the actual working URL, for example:

```text
Port 5173 is already in use. Trying another available port…
Clyra UI Demo → http://localhost:5174/
```

Open the **URL actually printed in Terminal**. You do not need to delete folders, reinstall packages, kill another app or change the command. If you want 5173 specifically, stop your earlier dev server by pressing **Ctrl+C** in the terminal where it is running.

After the one-time local Git upstream setup, your update workflow stays:

```bash
git pull
npm run dev
```

The built-in `npm test` command now includes a real busy-port regression and asset-serving checks. **Before future pushes, run the actual npm server and these tests**; details are in `DEMO_PROJECT_RULES.md`. This rule and port fallback belong only to this standalone demo, not Clyra itself.

## Run

Extract project. Open its folder and run:

```sh
npm run dev
```

Visit <http://localhost:5173/>. Only Node.js and npm are required, no npm install.

## Demo components

- Thin brain icon + neutral dots and compact `Thought 2s` completion
- Smooth response text and active status shimmer
- Sliding web-source favicon stack, expandable horizontal source-icon strip
- Rounded browser shimmer preview, collapsible action history
- Pencil file edits with rolling red/green counts and collapsible diff
- Writing card and stable white formatting toolbar with font and size
- Editable/full-screen slide previews, compact music playback, terminal output
- Compact circular progress To-dos above the demo composer, expanding to a checklist
- Copy, regenerate and reduced-motion support

All actions and commands are visual samples. No files, music, browser sessions or external services are actually changed.

## Files

- `index.html`: demo shell only; not a host-chat template
- `styles.css`: isolated reference presentation rules and soft-motion tokens
- `main.js`: component prototypes and demonstration event sequence
- `INTEGRATION_GUIDE.md`: explicit instructions to your coding agent
- `server.js`, `package.json`: zero-install local server
- `scripts/setup-git.mjs`: optional one-time local tracking repair (never used in production integration)
- `DEMO_PROJECT_RULES.md`: demo-only Git/update/testing contract

### Latest UI refinements

- The standalone conversation hides its scrollbar entirely while keeping native scrolling. This is a demo-only choice.
- The plan is a compact rounded disclosure with animated progress circles, completed-task strike-through, count and automatic collapse; on narrow screens, use the Plan button to open its drawer.
- The earlier Spotify playlist demo is now a compact **light music capsule** with playback and optional expandable controls. No playlist interface.
- The unnecessary simulated Scheduling, Maps, Voice, Studio, Clipper, 3D, Files, Notes, Memory and Connector result rows are removed from the sample timeline. The generic tool component remains for real events.

These decisions apply to the reference demo. `AGENTS.md` explains how to reuse only the response/tool UI in a real chat application without replacing its composer, message geometry or backend flow.

### Latest changes

- Removed the first step divider; the demonstration has two separators for its three broad phases.
- Completely hidden the conversation scrollbar (scrolling is still available).
- Implemented a no-dependency version of the supplied compact TodoList design, including status icons, progress animations, strike-through and automatic collapse.
- The document arrives collapsed, expands smoothly and progressively types sample content.
- Slides have a working Edit mode, active-slide title/body fields, title size/alignment controls and a full-screen mode (Escape or Done closes it).
- Curved Wi-Fi arcs replace cellular bars; `1/5` to `5/5` progress text crossfades without rolling upwards.
- Preserved the original Clyra message/component integration boundaries. No React, Tailwind or Motion dependencies were added to the plain-JS demo.


## Composer-adjacent progress and quiet music capsule (v9)

- The demo's compact To-dos disclosure is an overlay above **a temporary fixture composer**; the fixture also displays a sample user message. Do not copy either into the real host. In an actual app, attach the todo to the existing composer-adjacent slot, respecting the host's layout, keyboard avoidance, safe areas, and scroll ownership; **do not copy the demo's absolute/fixed positioning or add an input bar**.
- Keep task counts driven by real events. Todo completion and disclosure expansion change height gradually and should not shift surrounding message elements.
- The music card is a small, white, border-only playback capsule. Supply title, artist, playing state, and duration from the host's real music connector. It does not create a playlist or start playback by itself. Its details animate to their measured height, with an instant fallback under `prefers-reduced-motion`.
- The demo's three groups and scripted animations remain inspection fixtures; migrate only response/tool visuals, not workflow sequencing, message positioning, or composer behavior.


## v10 — Demo composer and integration boundaries

This repository now includes a **demo-only** input bar in `index.html` (`#demoComposer`). Sending a message starts the scripted visual fixture. The host application MUST **keep its own composer** and message bubbles, with their original layout, focus, send behavior, keyboard shortcuts, streaming events, and scroll logic. Do **not** transplant `#demoComposer`, `#demoUserMessage`, the demo lane, or the `runDemo()` simulation into a production chat.

Replace **only** the presentation of existing tool and assistant activities with component patterns demonstrated here: thought activity, reconnecting curved Wi-Fi, web searching with staggered site favicons, inline source chips, code diff reviews, terminal actions, document writing, slide editing, media player, and task progress. Host workflow and backend events remain the sole source of truth.

The todo belongs **above the existing composer**, compact and centred. It starts as a narrow collapsed progress disclosure and expands upwards on user demand; completion ticks and strike-throughs animate. There are no thumbs-up/down actions in the reference footer. Website sources no longer have a dropdown: each icon grows into a named pill on hover and opens its referenced URL when clicked. Reconnecting has no thinking dots. The music capsule offers play/pause and seek only, never an expand button or track skipping.

Writing opens smoothly and enters edit mode when clicked inside; its toolbar reveals only during edit mode and every control has an accessible label and hover tooltip. Selecting text exposes a demo `Ask AI about selection` shortcut, which routes the selection into the demo input; production hosts should wire this into their own AI assistance action instead. The local slide editor supports text content editing, theme/size/alignment, insert, duplicate, delete, undo and fullscreen inside the demo; production data must be driven by real artifacts, not demo slide arrays.

The three scripted phases and sample text exist solely for demonstration. They are **not** agent orchestration instructions.


### v11 additions

Refined pencil and terminal UI; richer white document editing toolbar (15 searchable fonts, two colour palettes, list styles and table grid); demo code block with Copy and simulated Run. These are visual integration references rather than a new backend/editor harness.

## Recent UI refinements (October 2026)

- Composer: quiet rounded white, two-row demo input with Enter to submit and Shift+Enter to insert a line break. This is a demo-only control; integrations must use the host application's existing composer and message behaviour.
- Plan: starts as a small circular progress indicator, unfolds into a checklist when the demo work begins, and collapses when finished.
- Reconnect: iOS-inspired nested Wi-Fi curves reveal strength progressively without a bouncing spinner.
- Citations: clicking Sources glides real site links horizontally; each circular favicon expands to a small site-name pill on hover/focus. Clicking a site navigates to its URL.
- Presentation fixture: miniature left-hand slide previews, text formatting, insertable/draggable/resizable shapes and text boxes, speaker notes, slide order and history controls, fullscreen, and JSON export. This fixture is not Google Slides or PowerPoint file-format parity and is not a production slide editor.
- Toolbar descriptions: lightweight white anchored labels instead of dark cursor-following tooltips.

## Smoke tests

Run `node scripts/smoke-test.mjs` to check HTML IDs, JavaScript parseability, key UI hooks and the actual local development server with no dependency installation. GitHub Actions runs this check on pushes and pull requests. Interactive browser tests are still useful before integrating these demo components into a real application.

## Latest UI implementation

The currently committed demo includes:

- A light, rounded composer with a growing textarea; this input is **fixture-only**, not a replacement for Clyra's real composer.
- A centred circular todo indicator with a smooth SVG progress stroke; it expands to a checklist after the demo starts.
- Five fixed-position, curved Wi-Fi symbol layers using progressive opacity, inspired by Apple's variable-colour SF Symbols guidance.
- Anchored white labels on document, presentation and response toolbar controls, without native dark browser tooltip popups.
- Smaller miniature slide thumbnails with live text previews and drag-and-drop ordering.
- A working standalone **subset** of slide editing: editable text, fonts, sizes, alignment, themes, colour, text boxes, shapes, local image insertion (PNG/JPEG/WebP under 3 MB), dragging, resizing, object duplication/layer order, speaker notes, undo/redo, full-screen view and JSON export.
- Horizontally expanding source favicons; hover or keyboard focus expands each into a website-name pill, and click opens its URL.

**Not included:** complete Google Slides/PowerPoint compatibility, PPTX import/export, shared editing, full animation timelines or production storage. Reuse the host's presentation subsystem for those features. The fixture uses simulated tools and does not change external accounts.



## Current UI behaviour

- **Composer and todo:** both live in one attached bottom dock. The compact task circle expands into a checklist directly above the composer; the hint and send control remain inside its rounded frame.
- **Reconnecting:** intentionally removed from this visual demonstration.
- **Browser actions:** after the third action, additional rows scroll inside a fixed three-row viewport.
- **Writing and slides:** both appear as full inline artifacts, without a collapsed document/slide dropdown. Editing happens inside the cards.
- **Sources:** clicking reveals a short, steady horizontal icon strip. Hovering/focusing a website shows a floating name pill while the other icons stay put; clicking opens the actual website.
- **Verification:** desktop/mobile rendering and behavior should be reviewed alongside `npm test` and the full browser CI suite. A layout-only visual preview is not a substitute for testing the full live app.



## Editor & micro-interaction refinement (October 30, 2026)

- The todo uses a **stable, centred 280px layout slot**. Collapsed appearance is a single 44px circular progress button; the checklist no longer squeezes sideways while closing.
- The **Presentation Builder** tool row retains its active shimmer and finished status without opening a dropdown beneath it.
- The music capsule now has Previous, Play/Pause and Next, with a seek slider. Previous restarts the track if playback is beyond 3 seconds; otherwise it selects the previous track. There are no hover-name/tool-tip popups on music controls. All tracks in this visual fixture are fictional labels; playback is simulated.
- The Sources control has a clear chevron indicating expand/collapse, with a reversible, staggered horizontal reveal. Website icons keep fixed hit targets and labels float without moving neighbours.
- The local presentation editor's **Edit mode** now puts a filename field and nine familiar command menus across the top: File, Edit, View, Insert, Slide, Format, Arrange, Tools, Help. A contextual formatting bar appears **above** the canvas (rather than underneath), beside a thumbnail filmstrip. Actions include slide management, fonts, editable text, tables, lines, shapes, images, alignment, background/theme, title/body layouts, transitions, notes, layer ordering, zoom, JSON import/export and PNG export for the current slide. Most actions operate on local, temporary demo state.
- **Not a literal clone:** no native PPTX fidelity, Google Slides cloud sync, collaboration, embedded media timeline, complex charting or full master-template support. The real Clyra application must reuse its own presentation editor and persistence layer.

The menu structure, themes/layout and shortcuts were informed by Google Workspace's official Slides documentation. The [Reverse Engineer Anything](https://github.com/teonett/Reverse-Engineer-Anything) skill was reviewed, but it advises normal source analysis for regular source repositories and the REA runtime-analysis pathway only for a supplied target/binary or captured runtime evidence. No invasive Google application inspection or REA installation was used.


## v18 — Browser work state, math and richer responses

The demo browser now uses its existing neutral grey loading shimmer for **3 seconds**, then a softly animated blue gradient and a simulated Codex-like white pointer within the 16:9 rectangle. At about **10 seconds** it fades the working state and closes the preview. The cursor is decorative only; no browser or desktop actions are performed.

The demo composer begins centred at up to **565px wide**, then animates to a **600px max-width bottom dock** when Enter/Send starts the flow. The main chat remains a separate **760px reading lane**. Todo is a compact **horizontal collapsed pill** with progress ring, text, count and chevron; expanded checklist uses animated checks and left-to-right strikethrough.

A response-formatting showcase now demonstrates genuine offline native MathML fractions, integrals, matrices and summations, plus a compact table, mini chart, quote and list. The optional **Try LaTeX** editor loads KaTeX from jsDelivr on user request, so arbitrary TeX rendering requires internet. Offline MathML examples work without any npm installation. Existing code, terminal, source, document, slide and file-diff components are preserved.

This is a curated, stylistically consistent demonstration of common assistant response patterns — **not an exhaustive copy of ChatGPT or Claude**. The real Clyra application should reuse its own Markdown/LaTeX renderer and tool events, not this fixture's simulated content or timers.

Before accepting any future UI change, follow [DEMO_PROJECT_RULES.md](./DEMO_PROJECT_RULES.md): test the actual dev server, inspect live desktop/mobile screenshots, verify interactions and visually reject any component that looks off-theme.

## v19 — grouped slides, transport, weather and maps

- **Slide editor:** Edit opens a full-screen workspace with a Close X (and Esc), a tidy **Slides / Insert / Text / Arrange** toolbar, and compact shape/object popovers. Real local editing controls remain in this demo; professional PPTX/cloud parity is not implied.
- **Music:** the notch now has custom cover thumbnails, a smooth Up next queue, Previous/Next, restart after a few seconds, gradual press-and-hold seeking, Play/Pause and position scrubber. Track labels, artwork and timing are **simulated in the demo** and are *not a real streaming service*. The integration guide requires actual authenticated provider actions and album metadata.
- **Todo:** active spinning activity icon beside the count, hover preview, click-to-pin and outside-click dismissal. The count reflects completed steps separately from the spinner.
- **Weather:** prompts for current-location permission, then requests live weather and a three-day forecast via Open-Meteo. If permission is denied, use worldwide city search. Displays actual returned values and error/loading states; no hardcoded temperatures.
- **Map:** interactive OpenStreetMap embed based on the authorised/searched location, small in the response and expandable to a full-screen, Apple-Maps-inspired light layout with zoom, city search, place sheet and proper OpenStreetMap attribution.
- **Context:** the actual Clyra agent should render widgets only when appropriate. Dynamic todo step names/divider titles and real authenticated tool actions are specified in `INTEGRATION_GUIDE.md`.

**Public API limits matter:** Open-Meteo's free hosted API is restricted to non-commercial usage, and public OSM tile services have usage policies. Production Clyra should use a compliant commercial or self-hosted provider; the standalone demo makes no availability guarantees.

As usual, after an already-correctly-cloned setup: `git pull` followed by `npm run dev`.
