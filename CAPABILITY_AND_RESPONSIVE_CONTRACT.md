# Clyra — capability, adaptive layout and real-execution contract

> **Status:** integration specification and acceptance checklist; not a claim that the standalone demo implements the production capabilities. This file extends `AGENTS.md`, `INTEGRATION_GUIDE.md` and `DEMO_PROJECT_RULES.md`. Preserve their architecture boundaries, existing UI and tool orchestration.

## Non-destructive migration rules

1. Inspect current code, agents, adapters, existing provider connections, events, permissions, components, designs, Git branch and tests. Inventory **existing/working**, **existing/broken**, **missing**, **provider-unsupported** and **not-connected**. Never install a duplicate of a working feature.
2. Keep the full production Clyra chat and assistant/user bubble geometry, real composer, navigation, routing, scroll and agent runtime. Transfer only compatible response/tool UI, motion and event presenters. The demo's scripted `runDemo`, fake searches, tracks, actions, delays, commands and diff data are forbidden in production.
3. Every control must connect to a real capability adapter with authoritative state, permission and return value. If unavailable, visibly disable or explain why, with reconnect/retry where appropriate. No fake success, fake cursor action, fake download, placeholder callback, synthetic progress/measurements, invented API response or dead menu.
4. Each tool owns idle, preparing, running, awaiting permission/input, paused, succeeded, failed/retrying, cancelled and historical/restore states where applicable. Real task IDs and event ordering control every transition. Keep actions interruptible, accessible and recoverable.
5. Render a specialized UI **only when relevant and supported** by the user's request. Avoid automatically showing every tool under an ordinary answer. Prefer the existing single activity timeline with optional contextual right-side panels for browser, code, terminal, documents, slides, spreadsheets and live preview.

## Complete production capability inventory (check actual code before implementation)

| Area | Capabilities and context UI required |
|---|---|
| Chat | Streamed Markdown, headings, tables, lists, code with syntax/Copy, accurate LaTeX/math, citations, reasoning-status summaries (not fabricated internal reasoning), elapsed time, responsive readable line lengths, copy/edit/retry/regenerate/branch/share/export/feedback/read aloud, source and attachment cards |
| Search/research | Queries in flight, favicons, authentic cited sources, reading/summarising, research plan, progress/checklist, findings, final report and source inspector |
| Agent workflow | Plan → act → observe → verify, live subtasks, real tool calls/results, elapsed activity, pause/resume/stop, failed/retry, approvals, human takeover, task dependencies and notifications |
| Interactive answers | Genuine connected buttons, forms, selectors, sliders, data charts, maps, galleries and widgets; state survives resizing; interactions are not illustrative placeholders |
| Voice | Microphone permissions, live dictation/transcription, listening/thinking/speaking, interrupt/barge-in, mute/unmute, device/output selection, voice orb, captions and transcript |
| Images/multimodal | Upload/drag/drop/previews, progress/error, PDF/image references, generated image progress, variations, regional image edits, select/export; do not imply a renderer is connected until it is |
| Files/memory/history | Actual attachments, file citations, read/write/move/delete with permission, search, memory viewer/edit controls, pinned/renamed/grouped/archived chats, projects and branching |
| Computer/browser agent | Actual desktop/browser frames, action list, cursor highlight grounded in real coordinates, navigation/tabs/type/click, visible control overlay, take over/return, scoped permission and failure states |
| Orchestration/integrations | Parallel subagents with delegated tasks/status/results, scheduled automations/triggers/history, authenticated OAuth provider directory, actual scopes and connected/disconnected states |
| Coding | Project explorer, file search, tabs, syntax/autocomplete, inline editing, true hunk diffs with +/- counts, accept/reject applied to real files, terminal stdout/stderr/exit codes, tests, debugging, checkpoints, undo/rewind |
| Advanced coding | Live app preview/reload/element inspect/edit, plan and verify timelines, Git branches/worktrees/commits/PR/review, SSH, environment controls, MCP/skills/hooks, side chats, parallel sessions |
| Writing/docs | Full-screen document editor, proper selection model and undo, comments/revisions, toolbar, tables/links/formatting, genuine document serialization and persistent save/export |
| Slides | Full-screen editor with Close X/Escape, grouped Slides/Insert/Text/Arrange UI, thumbnails, object selection/drag/resize/layers, notes/layout/transitions, history and file export; never advertise PPTX/cloud fidelity the editor lacks |
| Spreadsheets/data | Formula engine, cell edit, selection, formatting, ranges, filtering/sorting, charts, import/export and live data; only real calculations |
| Artifacts/design/apps | Executable sandboxed app preview/code, diagrams/flowcharts/Mermaid/mind maps, dashboards with live datasets, design canvas/layers/components, responsive site/app builder, deploy/publish with actual status |
| Video/studio | Real player/timeline, trim/crop/transitions/render/progress, generated clips, editable elements, local assets and genuine MP4/export results |
| Music | Actual provider track/album art/queue/device, play/pause/skip, previous restart semantics, held seeking only when provider supports seek, acknowledged actions; disable unsupported features |
| Weather | Location permission or explicitly supplied place, true live conditions/forecast/update time/units/attribution, location disambiguation, loading/denied/error/retry, relevance-gated card |
| Locations/maps | Genuine attributed geodata, small interactive map/fullscreen, search/zoom/place details, route/ETA only from real route service, privacy-aware current position, relevance-gated UI |
| Deliverables | Real downloadable files, previews, versions/restore/share where supported, result and error states, no simulated exports |

**Current demo status:** local slide editor subset, editable document subset, presentational browser/tool/coding UI, simulated media; live Open-Meteo requests and OSM embed when reachable. These do **not** establish full production capability. Maintain an actual per-capability acceptance matrix during host integration.

## Multi-step task plan and step dividers

- A **one-step** task shows neither floating to-do nor step dividers. A **multi-step** task (2 or more distinct planner steps) shows the composer-adjacent to-do and an in-response divider for each **actual named** step, with that step's genuine tool/action rows directly beneath.
- Step count is unlimited, not fixed to three. Use stable step IDs, update/reorder with real planner events. A step can have multiple search, browser, edit, command, result and verification actions without extra decorative dividers.
- Collapsed to-do is a centered, stable horizontal pill: active spinner + To-dos + `done/total` + chevron. Spinner is **not** a fraction circle. Hover previews, mouse leave closes only unpinned; click/tap pins open; click again or outside closes. Keep keyboard/focus access; count and check/strike appear only after confirmed step completion. Failed/cancelled steps do not turn into success.
- A completed plan can auto-collapse smoothly; do not lose history or force a 3-step sidebar. Existing host composer remains unchanged.

## Universal adaptive layout and premium interaction QA

**Goal:** everything fits its actual available area at all times — desktop, phone, tablet, short landscape, full screen, resized desktop window, split-view right panes, zoomed/reflowed text, keyboard raised, long titles/URLs and permission/error variants. No clipped menus, overlapping text, awkward holes, inaccessible close buttons, broken alignment, jumpy resizing or off-screen controls.

- Use existing host design tokens and scoped component CSS. Explicit `min-width:0` in flex/grid descendants, `minmax(0,1fr)`, fluid `clamp()` and `overflow-wrap:anywhere` on untrusted text. Give code/terminal panes **their own horizontal scroll** without making the whole page scroll sideways. Avoid arbitrary global `overflow:hidden` that hides necessary controls.
- Apply `container-type:inline-size` to *bounded actual cards/panes* and named `@container` rules for internal reflow; reserve viewport media queries for truly fullscreen shells. Avoid `container-type:size` on unconstrained-height cards and avoid changing production host shell or composer ownership.
- Small card: stack header actions, split toolbar controls into discoverable groups/wrapped rows, choose horizontal scroll for filmstrip and vertical scroll for long activity/actions/queues. Reposition or flip popovers inside the visual viewport; no toolbar panel covering a necessary click target.
- Fullscreen docs/slides/maps use `100dvh` and safe-area-aware padding/insets; independently scroll menu/toolbar/content as needed; stable overlays, Escape/Close X, correct focus return and a11y labels. Resize map/chart/canvas engine on container changes. Do not scale actual document font values to work around a bad layout.
- Animate only meaningful transitions (opacity/transform/limited height). Prefer 200–550ms easy-to-follow ease-out, 60fps-friendly transforms and no long main-thread work. Honor `prefers-reduced-motion`; avoid excessive blur, glassmorphism, shadow or ungrounded blue glows.
- Test real window sizes **280, 320, 360, 375, 390, 430, 600, 768, 1024, 1280, 1440, 1920, 2560 CSS px**; short-landscape heights **320–500px**; narrow split panes **280/360/480px**; reduced motion and 200%/400% zoom when feasible. Include idle, loading, active, hover, pinned, paused, success, failure, modal/fullscreen and long-content states. Check DOM bounding boxes/scroll widths plus screenshot review; syntax checks alone are insufficient.
- Every feature's UI needs idle, prepare, running, waiting, paused, success, failure and history where applicable; no unreachable state or dead control. Prior versions and capabilities must remain intact.

## External providers and commercial licensing

- Open-Meteo free hosted API is for non-commercial use subject to its terms; commercial Clyra needs an authorized plan/provider or permitted self-hosting.
- OpenStreetMap data is open, **not** an unlimited free commercial tile API. Display attribution; use a commercial-appropriate licensed/self-hosted tile service. The public Nominatim service has strict request limits and does not allow heavy client autocomplete; use a compliant geocoder for product search/POIs. Routes, traffic, ETAs and place hours must be real if displayed.
- Music providers require user authorization and provider-allowed transport/seek/queue; do not simulate remote acknowledgments or assume commercial permission.
- All external actions need cancellation, timeout, error display, permissions, quotas, privacy-aware caching and retries.

## GitHub release closure — mandatory for every repository change

1. Read the real repo `AGENTS.md` and `DEMO_PROJECT_RULES.md`; verify exact `origin`, branch, status/upstream and target. Do not overwrite user changes, delete old features or replace newer files with an older ZIP.
2. Check diffs for unintended deletion, duplicate components, credentials or broken event hooks; run `npm run dev`, `npm test`, `npm run test:browser` (when browser tooling exists) and desktop/mobile screenshot/interaction checks. If any test cannot run, report it; do not claim full validation.
3. Stage specific intended files; commit and push to the verified repository using approved branch/PR workflow, never force push. Confirm remote SHA and required CI before declaring complete. For this demo the target repository is **lukesimpson01/clyra-agent-ui-demo** and existing clones must continue to work with `git pull` then `npm run dev`.
4. This demo Git workflow and sample timeline are *not* transplanted into production Clyra. Production obeys its own approved repository rules.

Authoritative references: [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries), [MDN dynamic viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#dynamic_viewport_units), [Open-Meteo](https://open-meteo.com/), [OSM tile usage](https://operations.osmfoundation.org/policies/tiles/), [Nominatim usage](https://operations.osmfoundation.org/policies/nominatim/).
