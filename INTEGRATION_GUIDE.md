# Clyra response & activity UI — integration contract

**Use this project as a component styling and animation reference, not a replacement chat application.** It is a self-contained, interactive, dependency-free visual fixture.

## DO NOT import these host-owned features

- The sample three-phase task/agent flow or its simulated timing (`runDemo`, `sleep`, `streamParagraph` word loop).
- The demo `index.html` workspace shell, `.c-workspace`, `.conversation-content` and `.c-lane` placement.
- Any sample user message bubbles, message-entry animations, input composer, attachment bar, model selection, header, navigation or routing.
- The demo scroll-follow algorithm; keep your app's existing scroll anchoring, scroll restoration, and take-over behaviour.
- Tool API implementation, artificial data, command strings, query text, mocked results, mocked search/citations or file edits.
- The right-side plan layout unless your existing product specifically has a plan sidebar; reuse only the plan *card's* design.

**The host owns the entire chat's user-facing shell.** Preserve its message bubbles, composer/input bar, sizes, positioning, behavior, spacing, animation curves, state management and existing agent harness. This kit replaces **only the inside of an AI assistant response** and **individual rendered tool/activity states**. Never restyle other app areas by applying global demo CSS.

## Reuse these specific components by event type

| Actual host event or state | Source function / DOM | Transfer visually (not logically) |
|---|---|---|
| assistant thinking starts | `addThinking()` | Thin brain icon, neutral traveling dots, line height, movement |
| thinking ends | `finishThinking()` | `Thought 2s` style and icon; elapsed duration from host clock |
| assistant text streams | `.c-stream-block`, `.c-stream-word` | System font, readable width inherited from host, quiet word reveal. Render host's real tokens directly. |
| tool started/progress/completed | `addActivity()` / `completed()` | Appropriate icon, shimmer, small past-tense label, disclosure |
| web search starts/reads/done | search activity + `c-web-favicons` | Inline source circles that slide in progressively. No large search dropdown. |
| browser is active | `createBrowserPreview()` | 16:9 neutral viewport shimmer and action rows; collapse on finish |
| file edit completed | `createEditReview()` | Pencil icon, rolling `+/-`, collapsible diff viewer, optional approval |
| command running/completed | `createCommandView()` | Show real running command and terminal lines, collapse on end |
| document generated/edited | `addWritingCard()` | White rounded Writing artifact, stable floating-format toolbar, copy/edit/expand |
| slide deck generated | `createPresentationCard()` | Editable slides, font/align controls, fullscreen and soft transitions |
| music playback state | `createMusicCard()` | Compact light music capsule, playback and optional controls |
| arbitrary connector/tool | `createUniversalToolCard()` | Single status and optional details; no repeated nested 3-stage plan |
| real sources returned | `addSourcesFooter()` | White sources control and disclosure, using live source data |
| response completed | `addFooter()` | Copy, feedback, regenerate icons; wire to host handlers |
| optional task plan | `createTodo()` | Rounded task-list disclosure and animated progress markers; render in existing plan sidebar, not in messages |

## Design tokens & motion

- Font: native system stack, 15–16px normal weight; body around 1.65 line height.
- Status labels: ~12.5–13px, 400 weight; headers generally 450–560, **never heavy**.
- Border: nearly invisible neutral gray; primary cards 18–30px rounded, interactive icon buttons 10–13px.
- Text reveal: ~420ms opacity/very small blur; row entrances ~570ms/7px; expandable regions ~530–560ms easing `cubic-bezier(.22,1,.36,1)`.
- Shimmer: readable neutral color pass, only while a tool is active; stop after completion.
- Favicons: circular and sequential, moving left-to-right beside web search status.
- Preserve keyboard focus rings, aria-expanded and prefers-reduced-motion.

## Architecture and application wiring

1. Keep the host's existing response renderer and render individual components **inside** the host's assistant message body. Do not replace its outer message DOM or recreate chat messages.
2. Match each host event (`thinking_start`, `thinking_end`, `tool_start`, `tool_progress`, `tool_complete`, `artifact_created`, `response_complete`) to the *presentation* above. Use the host event's IDs, tool label, timestamp, output and errors.
3. Host event streaming and state transitions are authoritative; **no hardcoded delay**, fake timers, `runDemo` invocation, or fixed three-stage loop in production. The three phases in the demo merely show groups of components.
4. Mount source cards and artifacts as children of the existing AI message; preserve current scroll behavior and composer/bubble layout. Avoid `body` or global typography rules from the demo, and namespace component CSS.
5. After each event, update only that action's component. On success, change the gerund to a past-tense label without adding a success tick. On error, show a real error icon and reason. For file edits, only display line counts and diffs returned by your actual edit tool.
6. Use your host-side command runner, OAuth connectors, browser, document/presentation skills, Spotify integration and plan model; this demo does **not** connect to those services.
7. Test at desktop and mobile widths, with reduced-motion enabled, slow streaming, tool cancellation, user manual scrolling and simultaneous actions.

## Why the demo uses exactly three phases

The three illustrated phases — **Understand & research**, **Create & refine**, and **Execute & verify** — keep the example understandable. They are not a harness. Your actual agent may use any number of actions or loops, and must choose its own plan. The separation lines are a visual device for this tour, *not* a command to add a divider for every tool or every user request.

## Host styling and motion guardrails (important)

- **Never replace the host’s message bubbles or input composer.** Their DOM, typography, bounds, animations, position, focus behaviour and scrolling continue to come from the existing application. The demo deliberately renders no user bubbles or composer.
- **Never copy the agent narrative, three phases or plan sequencing.** Those are sample scenes to exercise every UI state. The real agent harness supplies tool IDs, events, messages, text, timing, success/error and plan.
- **Only replace activity-specific presentation:** brain/thought status; source favicon movement; active shimmer; code diff dropdown; real command rows; document, presentation, browser and music previews; collapsible activity results; assistant response text typography if it does not override the existing message wrapper.
- **Do not apply `styles.css` globally.** Re-home component rules into your own assistant-content scope, after extracting only the selectors for each particular tool. Do not import `.c-workspace`, `.conversation-content`, `.c-lane` or any body/html rules.
- **Prioritise surfaces and restraint.** Default to white, fine neutral borders, natural 400-weight text, modest 500-weight titles, 16–30px rounded artifacts, translucent hover-only backgrounds, and no decorative tinted panels. Exceptions: the intentionally grey browser loading preview, green/red diff rows, and representative media art.
- **Animation lifecycle:** use actual `start`, `progress`, `completed`, `failed`, `cancelled` events. When completed, remove the active shimmer, change the label to past tense, and collapse any verbose preview via height/opacity. Preserve expanded state if the user has explicitly opened it. Use one shared 220–560ms ease-out motion language, never per-event layout-jumping scale transforms.
- **Host scroll ownership is absolute.** Do not copy `paint`, `glideToLatest`, `runDemo`, the scroll listener, the timer delays, or the fixed reconnect cadence. Those only animate the isolated fixture.

## Design changes in V8

- Remove the top-of-response divider and retain a normal opening thought row. The two later separators are **demo grouping only**.
- Hide scrollbars only in this isolated fixture. Do not change scrolling or message behavior in the real application.
- Reproduce the supplied TodoList component's compact header, count, status ring, strike-through and auto-collapse states. This project uses vanilla JS by design; a React/TypeScript/Tailwind host may integrate the supplied React component via its own component architecture.
- Documents open from a closed white rounded card and reveal body text progressively. Do not copy demo text. Connect to actual document streams and preserve host data.
- Slides allow editing the currently selected slide and full-screen presentation. Hook changes into the actual slide model.
- Reconnection displays real curved Wi-Fi arcs and crossfading `1/5`–`5/5` labels **only where progress is truly measurable**.
- Suppress generic connector result rows unless backed by real tool output.


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


## v11 visuals to import selectively

Replace only the visual **file-edit pencil, terminal disclosure, document toolbar design, and code-block chrome**. The table picker and code block in this repository are demos: **prefer the existing user project's table component and code-block component**, even if its implementation differs. Keep all real editor state, text selection, permissions, keyboard shortcuts, code execution flow, composer and message renderers.
