## Required pre-push verification for this demo

For every subsequent change to this **standalone demo repository**:

1. Run the actual `npm run dev` locally and verify the URL it prints serves the page.
2. Run `npm test` (startup checks and occupied-port regression).
3. When server code changes, deliberately occupy port `5173` and confirm `npm run dev` successfully falls back to another port without an uncaught `EADDRINUSE` exception.
4. Push only after the runnable checks pass, then verify the remote files and check CI; disclose any browser-test limitation. Never claim tests were run if they were not.

An already-running server is not an error: use the fallback URL printed by the console. **Never kill another application's process to make 5173 free.** The above procedure is local to this demo. When integrating components into Clyra, preserve the host's dev scripts, port handling, and project workflows.

> **This repository's local development requirement:** Read [DEMO_PROJECT_RULES.md](./DEMO_PROJECT_RULES.md) before changing or publishing this standalone demo. The requirement to keep `git pull` followed by `npm run dev` working applies **only to this demo repository**, never to projects that import its response/activity UI.

## Local Git-tracking repair (this demo only)

If a user reports `git pull` failing with **"There is no tracking information for the current branch"**, explain that it is **local branch configuration** and cannot be fixed just by pushing a new GitHub commit. See [DEMO_PROJECT_RULES.md](./DEMO_PROJECT_RULES.md).

For this repository's existing `main` branch, first verify the `origin` URL, then guide the user through:

```bash
git fetch origin main
git branch --set-upstream-to=origin/main main
git pull
npm run dev
```

If `origin` is absent, add `https://github.com/lukesimpson01/clyra-agent-ui-demo.git` **only after confirming the folder is this repository**. Never overwrite an unrelated remote, reset local files, or change other projects. Once updated, `npm run setup:git` is an optional guarded one-time convenience command; keep `npm run dev` dependency-free.

**This instruction must NOT be copied into Clyra or another host app** when integrating UI components.

# Agent instructions — Clyra Response UI Kit

You are looking at a **visual fixture**, not a replacement chat application. **DO NOT copy this demonstration's entire page, timeline or harness into the host project.**

## Required implementation boundaries

**Preserve completely:**

- The host application's message bubbles (both user and assistant), shape, position, spacing, animation, styling, layout, timestamps, and menus.
- The original input/composer (text field, keyboard shortcuts, uploads, attachment chips, send/stop controls, focus/blur, transitions).
- The surrounding chat shell and navigation, existing scrolling/restoration/auto-follow, sidebar, responsive breakpoints, and routing.
- Existing orchestration, state model, tools, persistence, permissions, streaming, errors and network reconnect logic.
- The host's decision of **what** actions occur and their sequence. This visual fixture deliberately simulates one example only.

**Replace or update ONLY the presentation inside existing assistant messages and individual activity/tool states:**

1. **Thinking:** small brain and neutral animated dots while thinking; after completion, same brain with elapsed `Thought 2s` text. Measure actual elapsed seconds, not sample timers.
2. **Status/action rows:** matched thin line icons, 13px normal text, visible shimmer only when running, quiet past-tense label at completion; no status checkmarks.
3. **Search:** site favicons reveal left-to-right in staggered circular stack next to the row; no automatically expanded search panel. Web-source control beneath the answer starts collapsed; a click unfolds circular site icons *horizontally*. Each icon expands into a small website-name pill on hover or keyboard focus, and clicking opens its real source URL.
4. **Assistant response:** copy readable font weight/line height/word appearance, but inherit the host's assistant message width and padding; never relocate the whole message.
5. **File editing:** pencil icon, filename and precise additions/removals returned from the host; completed edit can expand to a line-numbered green/red diff with Accept/Reject when permission requires it.
6. **Commands:** show the exact command currently running and actual output; animate disclosure collapse on completion.
7. **Browser/computer use:** 16:9 rounded neutral loading viewport during execution; shimmer and real action labels, collapse into a short row when done.
8. **Artifactual results:** white rounded writing card with functional formatting toolbar, editable/full-screen presentation preview, compact now-playing capsule, genuine tool results. Wire controls to the host's actual handlers.
9. **Task plans:** reuse the plan card design only if the host already supports a plan panel. Keep plan OUTSIDE chat messages; do not force a new sidebar into the host. In the fixture the todo starts as a 44px circular progress indicator next to/above the demo composer and unfolds to a lightweight checklist. In production anchor to the host's existing composer-adjacent slot, not the fixture's coordinates.
10. **Footer actions:** visually reuse Copy and Regenerate icons and invoke real host callbacks; do not re-add thumbs-up/down buttons.

## State-to-view mapping

| Host event | Component representation | Finished state |
|---|---|---|
| `thinking.start`/`.end` | `.c-think` with brain/dots | `Thought {seconds}s` |
| `tool.search.progress` | `.c-activity-row` plus `.c-web-favicons` | `Searched the web` |
| `tool.browser.progress` | `.c-browser-unit` | `Used browser · {n} actions` |
| `tool.file_edit.complete` | `.c-edit-review` | Pencil + `{file}` + `+N / -N` |
| `tool.command.progress` | `.c-command-unit` | `Ran command` |
| `artifact.created` | `.c-writing-card`, `.c-presentation` or `.c-music-card` | Artifact stays available |
| `tool.complete` | `.c-tool-card` | Collapsed past-tense label |
| `response.complete` | `.c-footer-actions` | Actual host callbacks |

These event names are **illustrative adapter names**. Adapt to the project's real schema; do not invent or force new backend event names.

## Design rules (non-negotiable)

- White/transparent resting surfaces; near-invisible borders, natural `400` text weight and `450–540` for rare headings. Do not import grey panel fills, thick heading styles, or ornamental gradients.
- Hover states may add a 3–4% neutral tint. Exceptions: intentionally grey browser-loading viewport, minimal diff highlighting, and **media artwork** inside the music card.
- Comfortable layout spacing. Rounded corners: 10–13px for interactive buttons, 18–30px for preview cards and artifacts.
- Motion uses 220–560ms ease-out, small position changes and opacity. Reveal web icons sequentially. Expand cards with measured height or CSS grid rows; do not abruptly use `display:none` at the start of transitions.
- Respect reduced motion; use `aria-expanded`, keyboard focus and hover-safe tooltips.
- Completed status transitions do not add unnecessary ticks. Tool activity should visually recede, not remain a stack of bulky panels.

## Sample fixture only

`index.html` plus `runDemo()` in `main.js` generates one test-only scene. Its **three broad phases, with only two dividers and none at the beginning,** exist to showcase all activity styles in context and are **not a mandatory agent loop**. Do not take its sample text, commands, sources, 3-phase grouping, or scripted timings into production. Let the host show its naturally occurring tool calls and responses.

## Before declaring integration complete

Test real messages for the thinking → stream → think → search → file edit → command → result lifecycle; ensure search favicons glide in, line counters agree with actual diffs, expandable disclosures preserve scroll, replay isn't used as a fake regenerate, the existing composer and user bubbles remain pixel-identical, and the host route/navigation still works. Test desktop/mobile and `prefers-reduced-motion`.

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for component and event details.

## Reference UI update (light Apple-inspired capsule and plan)

The standalone reference hides its conversation scrollbar, uses a compact disclosure-based task list on the right, omits all generic connector result rows from its sample scene, and includes an Apple-inspired light music capsule. All of these are **presentation examples**, not product requirements to move the host chat's scrollbar or replace its chat shell. In the actual Clyra app, preserve the host's existing scroll owner and scrollbar position unless the product team explicitly requests a change.

- `createMusicCard()` renders the standalone *now-playing* control. Use genuine track and playback events from the host. Do not copy the demo's music timers, mock track names, or auto-start logic; do not reintroduce a playlist or large media card.
- `createUniversalToolCard()` remains available for **real tool events** but is not injected into the demo timeline; do not render generic preview chips below calendar, scheduling or other routine connected-tool actions. Only show rich result cards for actual artifacts with relevant data.
- Plan styling is contained in the demo's `.c-plan-rail` and `.c-todo` styles. When porting, keep the host's existing plan state and panel placement; copy only the visual finish if appropriate.
- Copy the *component* easing curves, hover/focus and reduced-motion rules, but never change the host composer, message bubbles, agent-loop logic, tool dispatch, streaming, routing or underlying layout.

## V8 — Requested presentation rules

- The opening thinking state has **no step divider above it**. The demonstration only divides the later two phases. The host must not enforce those phases.
- The reference scrollbar is hidden, but **do not modify scrolling or scrollbar choices in the host application**.
- Use the supplied compact TodoList visual language: 44px rounded header with count, animated status rings and completed text strike-through; collapse after all items complete. The supplied React implementation can be used directly in a React host; this standalone no-dependency demo has a DOM equivalent, not an installed React stack.
- The document has a collapsed initial card, expanding content and incremental text reveal. In production drive these transitions from actual document creation/stream events; do not replay fake prose or let a demo timer replace a real stream.
- The slide card includes Edit, input fields for the active slide, typography/alignment controls, keyboard-closeable full-screen presentation, and smooth slide changes. Wire them to existing host document state.
- Reconnection uses **curved Wi-Fi arcs**, transitioning from 1/5 through 5/5 in the test scene with a simple in-place label crossfade. Real reconnect progress must be grounded in the host's actual state; do not manufacture percentages or fixed delays.
- No hardcoded Calendar/Maps/Voice/Video/3D/Files/Notes/Memory/Connector completion rows should appear in the response unless genuine tool events exist.


## Composer-adjacent progress and quiet music capsule (v9)

- The demo's compact To-dos disclosure is an overlay above **reserved space for an existing composer**. No input field or message bubble is included. In an actual app, attach the todo to the existing composer-adjacent slot, respecting the host's layout, keyboard avoidance, safe areas, and scroll ownership; **do not copy the demo's absolute/fixed positioning or add an input bar**.
- Keep task counts driven by real events. Todo completion and disclosure expansion change height gradually and should not shift surrounding message elements.
- The music card is a small, white, border-only playback capsule. Supply title, artist, playing state, and duration from the host's real music connector. It does not create a playlist or start playback by itself. Its details animate to their measured height, with an instant fallback under `prefers-reduced-motion`.
- The demo's three groups and scripted animations remain inspection fixtures; migrate only response/tool visuals, not workflow sequencing, message positioning, or composer behavior.


## v10 — Demo composer and integration boundaries

This repository now includes a **demo-only** input bar in `index.html` (`#demoComposer`). Sending a message starts the scripted visual fixture. The host application MUST **keep its own composer** and message bubbles, with their original layout, focus, send behavior, keyboard shortcuts, streaming events, and scroll logic. Do **not** transplant `#demoComposer`, `#demoUserMessage`, the demo lane, or the `runDemo()` simulation into a production chat.

Replace **only** the presentation of existing tool and assistant activities with component patterns demonstrated here: thought activity, reconnecting curved Wi-Fi, web searching with staggered site favicons, inline source chips, code diff reviews, terminal actions, document writing, slide editing, media player, and task progress. Host workflow and backend events remain the sole source of truth.

The todo belongs **above the existing composer**, compact and centred. It starts as a narrow collapsed progress disclosure and expands upwards on user demand; completion ticks and strike-throughs animate. There are no thumbs-up/down actions in the reference footer. Website sources no longer have a dropdown: each icon grows into a named pill on hover and opens its referenced URL when clicked. Reconnecting has no thinking dots. The music capsule offers play/pause and seek only, never an expand button or track skipping.

Writing opens smoothly and enters edit mode when clicked inside; its toolbar reveals only during edit mode and every control has an accessible label and hover tooltip. Selecting text exposes a demo `Ask AI about selection` shortcut, which routes the selection into the demo input; production hosts should wire this into their own AI assistance action instead. The local slide editor supports text content editing, theme/size/alignment, insert, duplicate, delete, undo and fullscreen inside the demo; production data must be driven by real artifacts, not demo slide arrays.

The three scripted phases and sample text exist solely for demonstration. They are **not** agent orchestration instructions.


## v11 — Editor and activity UI component contract

- **File edits:** use the small outlined pencil stroke shown by `svg('edit')` rather than a document-shaped icon. Keep hover fills almost invisible, do not add heavy borders or hover scaling; retain real file paths and actual line counts from the host. The exact proprietary Codex icon path is not embedded or claimed.
- **Terminal:** use the rounded `createCommandView` visual treatment (icon, plain status, exact command text, white expandable terminal, small copy-output control). Connect output to real command events; never run example commands from the demo.
- **Document editor:** the 15-font searchable picker, font size, real text/highlight colour palettes, link, heading, quote, numbered/bulleted list with style choices, alignment, and table grid are **prototypes** in `addWritingCard`. Use the host application's **existing document editor, table component, selection model, undo/redo, and serialization** when integrating. Do NOT transplant `document.execCommand` as a new production editor, or overwrite stored document data. The table example is intentionally only a mock of table insertion.
- **Code blocks:** the standalone `addCodeBlock` is a small **visual mock**. In production reuse the host project's existing code-block renderer, syntax highlighter, copy behavior and execution sandbox. The mock Run button does NOT execute code (it displays sample output). Never evaluate arbitrary code in the browser or pass code to shell without existing permissions/security mechanisms.
- **Controls:** icon buttons have instant accessible hover labels, rounded pale hover states, subtle motion and no bulky fills. Use real tool/event data and preserve host composer, user/assistant bubbles, scroll policy and backend harness.

## Latest fixture interaction details

- The demo composer is intentionally styled as a calm rounded white input for testing. **Never transplant or replace the host's composer**; the host's input surface, message animations, submit behaviour, upload controls and business logic remain authoritative.
- Wi-Fi reconnecting uses nested signal curves that reveal one layer at a time, adapting iOS-style variable-colour symbol progression. Use actual connection state in production, not the fixture's 3-second intervals.
- The slide editor now demonstrates thumbnail filmstrip previews, text editing, inserted objects, themes, alignment, notes, undo/redo, reordering, fullscreen and JSON export. **It is not a replacement for a production presentation editor**. Reuse the host project's existing slide renderer, file format, storage, shapes, collaboration and export services.
- Tooltips are white, anchored to each control, and appear on hover/focus without dark cursor-tracking overlays. On icon buttons, expose an accessible name and do not rely exclusively on a tooltip.
- Source URL links open only after deliberate click; never trigger navigation on hover. Preserve real source domain, title and URL from the host. The fixture uses demonstrative citation data.
- Respect `prefers-reduced-motion` for Wi-Fi, todo expansion, favicon glide and all slide/editor transitions.

## Updated demo UI behaviors (October 2026)

This repository contains a **standalone preview**, not the production chat UI. Changes here include a spacious rounded demo composer, a circular SVG task progress indicator unfolding to the checklist, stationary layered curved Wi-Fi paths that brighten as connection strength improves, anchored white hover/focus labels, compact real slide thumbnails and expanded slide editing controls.

For **production integration**:
- The demo composer MUST NOT replace the actual Clyra composer or its keyboard shortcuts, attachments, layout or input animations.
- The plan is a source-driven task component; animate its SVG progress from real task events rather than using fixture timing.
- Wi-Fi strength is a visual simulation; bind it to real connectivity/retry state. Avoid arbitrary three-second delays in the host.
- The slide editor offers a functional **local subset**: live text, basic styling, text boxes/shapes/images, resize/drag, layer ordering, thumbnail reorder, notes, undo/redo, full-screen and JSON export. It does **not** implement complete Google Slides or PowerPoint parity, collaboration, PPTX fidelity, advanced timelines, professional master slides or cloud storage. Connect the host project's actual slide editor/renderer for those.
- Browser tooltips must have accessible labels and be anchored white disclosures; do not use native `title` on toolbar buttons where it creates a dark browser popup.
- Clicking a source icon opens its source URL; the strip itself expands sideways and hover/focus gently reveals a website-name pill. Supply actual source URLs and favicons from host tool results.

The repository-specific requirements in `DEMO_PROJECT_RULES.md` apply here only. After edits, push to the connected GitHub repository and verify that `git pull` then `npm run dev` still works on a correctly cloned checkout.



## Current demo-only UI contract — attached dock, inline artifacts, no reconnect

- `#demoComposerDock` is the **single shared bottom container** for `#planRail` and `#demoComposer`. Keep the todo aligned and directly above the rounded composer. The hint/send row stays inside the composer border. Do not copy this fixture dock into the production Clyra chat: reuse its host composer.
- The demo intentionally **does not show reconnecting/Wi-Fi activity**. If genuine reconnect events exist in the host, preserve that host's native status rendering instead of copying a fake retry loop.
- The browser actions section keeps a three-row scroll area and follows incoming actions within that area without growing the preview.
- Writing documents render open inline without a collapsed/expanded card; clicking in the document enters edit mode. Slides also stay visible inline, while their editing controls can be activated independently. Do not add artifact dropdowns.
- The collapsed Sources control opens a *short horizontal fixed-width icon rail*. Each icon stays at a stable coordinate; hovering/focusing reveals a small floating site-name pill without pushing other icons away. Clicking opens the real source URL.
- Inspect full-size and mobile screenshots plus functional interactions before claiming a UI change is complete. If only a representative `page.set_content()` layout can be inspected, disclose that the full live browser was not visually tested; retain Chromium CI checks.

These constraints apply **only to this demo repository** and must not change the host app's composer, editor, routing, networking or agent loop.


## Current editor requirements — standalone fixture only

1. Never animate the todo card horizontally from its checklist width to a circle. Keep the centred slot fixed; the *visual content* collapses into the circular progress button without lateral squeezing.
2. The Presentation Builder **status action** is a non-disclosing shimmer row. Its *result*, the separate presentation artifact, remains fully accessible and editable.
3. Music controls must expose Previous / Play-Pause / Next and scrub, but **no native or custom hover-name boxes** on the music capsule. Real hosts invoke their own media connector.
4. Source-icon reveals have a rotating chevron and staggered, reversible slide-in/out; fixed-width icon slots prevent hover shifts. Preserve keyboard focus and real link navigation.
5. In Edit mode, the slide artifact has a restrained Google Slides-like top header, filename, menu strip and contextual toolbar. Implement menu actions against the fixture's local slide model (do not add inert labels masquerading as features). Use the actual host slide engine for full production capabilities, PPTX and persistence.
6. Keep the icon and font weight restrained; no cursor-following black tooltip overlays, bulky borders or jumping subpanels. Every hover control needs a stable focus target and an accessible name.
7. Preserve the same startup contract (`git pull` then `npm run dev`) and validate the source, server, and browser interaction scripts before each push; clearly disclose any unavailable visual browser run.
8. Reverse Engineer Anything (REA): its upstream `SKILL.md` instructs a normal source-analysis route for ordinary repositories. Do not install REA tooling merely for this web-source UI work. Only use REA with a concrete permitted target and real provider/runtime evidence; never represent inferred source patterns as observed production behaviour.

**These are rules for the standalone demo repository only.** Do not migrate its mocked composer, menu harness, fake media tracks, sample server or testing workflow into the host Clyra app.


## v18 — response and design acceptance checks (demo only)

- Keep every new activity/control/formula/panel consistent with the current white/graphite, hairline, restrained-blue visual language, typography, spacing, icon weights and subtle motion. Reject off-theme UI, random colours, bulky rectangles and black tracking hover popups.
- Browser fixture: neutral grey shimmer 3 seconds, then gently animated blue work glow and a small *simulated* Codex-like pointer moving inside its existing 16:9 viewport. Fade at about 10 seconds before collapsing. Reduce motion when requested; never automate the user's real cursor.
- Welcome demo composer begins centred and narrower than the 760px chat lane, then moves to the 600px bottom dock on Enter/click and starts the scripted sample. Do not transplant into the host's composer.
- Closed todo must show a **horizontal** pill with ring, readable To-dos label, counter and chevron. Expanded state opens vertically with aligned icons and satisfying tick/strikethrough progress.
- The response-formatting showcase provides true native MathML expressions (fractions, radicals, integral/summation, matrices), a lazily loaded optional KaTeX editor, restrained tables, chart bars, quotes and lists. Browser offline must still render the native MathML examples; generic TeX on demand requires a network connection.
- This is a representative catalogue of assistant UI patterns, not a claim to reproduce every private ChatGPT/Claude product component. For production reuse the host's Markdown/math renderer, source links, browser agent tools and artifact editors.
- Before GitHub pushes, run the exact npm startup command, dependency-free test suite, and full browser UI tests with screenshots at desktop/mobile, including initial welcome, during browser, completed browser, todo states, rich maths and finished response. Do not claim the full browser was tested if only isolated source/component checks or mock screenshots were available.

These constraints are for the standalone demo repository **only**, not the main Clyra project.
