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
3. **Search:** site favicons reveal left-to-right in staggered circular stack next to the row; no automatically expanded search panel. Web-source disclosure beneath the answer stays small, white and rounded.
4. **Assistant response:** copy readable font weight/line height/word appearance, but inherit the host's assistant message width and padding; never relocate the whole message.
5. **File editing:** pencil icon, filename and precise additions/removals returned from the host; completed edit can expand to a line-numbered green/red diff with Accept/Reject when permission requires it.
6. **Commands:** show the exact command currently running and actual output; animate disclosure collapse on completion.
7. **Browser/computer use:** 16:9 rounded neutral loading viewport during execution; shimmer and real action labels, collapse into a short row when done.
8. **Artifactual results:** white rounded writing card with functional formatting toolbar, editable/full-screen presentation preview, compact now-playing capsule, genuine tool results. Wire controls to the host's actual handlers.
9. **Task plans:** reuse the plan card design only if the host already supports a plan panel. Keep plan OUTSIDE chat messages; do not force a new sidebar into the host.
10. **Footer actions:** visually reuse icons but invoke real host Copy, Regenerate and feedback callbacks.

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
