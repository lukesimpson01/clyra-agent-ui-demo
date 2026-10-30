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

## v18: rich response and visual browser mapping

The **demo-specific browser** runs a fixed 10-second illustrated sequence: grey shimmer for the first 3 seconds, blue working glow and pointer until 10 seconds, then fade/collapse. It does not open a web page. In production, bind `loading`, `working`, `cursor-position`, `completed`, `error`, `takeover` and `cancelled` to the real browser-agent event stream; do not transplant the scripted 3s/10s timers or dummy cursor route.

The **rich response showcase** is a compact example, not a full Markdown parser. Use the host's existing renderer for headings, emphasis, linked sources, task lists, tables, quotes, accessible charts, MathML/LaTeX equations, syntax-highlighted code, file edits, terminal output and interactive artifacts. Demo equations use actual browser-native MathML offline. User-requested TeX rendering can lazily load KaTeX 0.19.1 from jsDelivr; production should bundle and pin the renderer, fonts and CSP if it requires reliable offline arbitrary TeX. Sanitize untrusted Markdown/HTML and keep KaTeX `trust:false`.

The **welcome composer** in the demo begins centred (565px maximum) and settles into a 600px bottom dock upon sending, while assistant text retains a 760px reading lane. This is only a visual fixture: keep the host's own composer, message wrappers, scroll ownership, keyboard shortcuts and route; integrate only the requested appearance/interactions through the host's existing components. The closed plan is a horizontal progress pill with a visible title and count, expanding the checklist vertically; update it from actual task events, not demo timers.

Every imported component must match the host's current design tokens, typography, icon weights, motion language and accessible interaction patterns. Do not copy any UI that looks off-theme simply because this demo contains it. Test real mobile/desktop layouts and tool-event transitions.

## V19 — conditional agent UI, real music, dynamic steps, weather and maps

**Production integration is not a copy of the demo flow.** Treat each UI component as an isolated presenter subscribed to the real host's typed tool/result events. Never display an unrelated widget simply because the demo includes one. Preserve host Clyra composer, chat positions, networking, authentication, storage and agents.

### 1. Dynamic multi-step plan and section dividers (not 3 hard-coded steps)

- The planning/orchestration layer supplies `steps: Array<{id, title, status, progress?, actions?}>` and controls transitions using actual event IDs.
- **Only render todo and section dividers when the task genuinely contains multiple distinct steps** (usually 2+). For simple requests, render the response and action rows without either.
- Title each todo row with the **actual user's task step** (for example `Find three local venues`, `Compare accessibility`, `Prepare final itinerary`). It can have 2, 3, 5, 10 or more steps; never hard-code `Research/Create/Verify` or truncate the plan to three.
- Divider label matches its step's actual, current name; don't display generic “Execute & verify” when the agent is doing something else. Each divider owns the activities/results for **that step only**. When the next step starts, add the next divider and its actions. A single step can have many tools, nested status rows and results; don't force a divider between every tool call.
- Advance a row and animate tick/strikethrough only after a real completed event. Keep the spinner and status text synchronized with running/cancelled/failed states. A failed step is not marked complete.
- Todo collapsed is a horizontal pill with a left **active spinner**, readable title, `N/M` counter and chevron. Hover temporarily expands for pointer users; click pins open, click again or click outside closes; keyboard and touch users have full click/tap access. Never trap focus.
- Real agents can revise the plan. Preserve stable IDs, reorder gracefully and announce changes accessibly. Hide/divider-less layout when the workflow becomes one-step without losing already produced content.

### 2. Real music notch (no fake actions or synthetic artwork in Clyra)

The **demo alone** uses synthetic artwork, track names and a local time counter to exercise UI. **Production must not fake playback, metadata, cover thumbnails, queues or successful transport actions.**

- Identify the user's connected provider/player, active device and actual permissions. Fetch current track, artwork URL, artist/title, real duration and playback position, queue (where offered) and playback state. Use the **song's real cover art as the notch thumbnail**, not a generic music-note icon.
- Previous: restart current track when position is beyond the configured threshold (3s in demo) only if supported; otherwise request the provider's native previous-track action. Next: actual next-track action. Play/Pause: send authenticated provider commands and update UI only on acknowledged state or subsequent authoritative playback updates.
- **Hold previous/next:** UI may show slowly rewinding/fast-forwarding position while held. If provider supports seeking, debounce and commit the final position on release (or use a low-frequency, rate-limit-aware strategy). Do **not** hammer a remote seek endpoint at animation-frame rates. If the provider does not support scrubbing, disable hold feedback gracefully; do not pretend playback moved.
- Scrubber reflects actual position/duration and the successful seek result; handle unknown duration, unavailable device, ads, live streams, authentication failures, request errors, 403/429 and network reconnect.
- Song queue dropdown must show the **real next tracks** if provider exposes them, each selectable only if the provider allows playback of that track. If queue lookup is unsupported, show “Queue unavailable” and omit fake entries. Small album-art covers, lightweight scroll, 1px border, correct keyboard/focus/escape behaviour; no huge floating menu.
- For Spotify Web API specifically: <https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-next-track>, <https://developer.spotify.com/documentation/web-api/reference/skip-users-playback-to-previous-track> and <https://developer.spotify.com/documentation/web-api/reference/seek-to-position-in-currently-playing-track> require OAuth `user-modify-playback-state`, an active playback device and **Spotify Premium**. Queue availability and playback permissions also vary. Spotify's platform policies constrain commercial streaming integrations. Obtain legal/commercial approval; **do not assume Spotify can power a commercial Clyra music streamer**. Prefer the host OS player/connected provider's supported control API for compliant remote control.
- Playback UI may render as a small status card if no device is connected. Never invent a "playing" state because the user requested it.

### 3. Weather only when relevant (worldwide location)

- Render the weather card when the user asks about weather, travel/clothing/outdoor conditions or another task whose answer materially depends on the forecast; don't force weather into every chat response.
- **Default to the user's current location when the task implies it**, unless the user supplied another location. Obtain precise coordinates through an authorized, permission-aware device location source **only after permission**. On browser, call `navigator.geolocation.getCurrentPosition` on HTTPS/localhost; browsers may prompt. If unavailable/denied, use a clearly labelled coarse city context **only if already provided/authorized**, or ask for a place. Never invent the user's street or coordinates.
- Free non-commercial prototype: Open-Meteo `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`.
- City search: `https://geocoding-api.open-meteo.com/v1/search?name=<URL-encoded-name>&count=5&language=en&format=json`; display disambiguating admin1/country, never assume a same-named city.
- Report actual model/data update time, units, timezone, confidence/limitations and provider attribution. Forecasts are modeled estimates, not guaranteed measured ground truth. Show loading/error/permission-denied states with retry; cache appropriately, debounce city queries and cancel outdated fetches.
- **Commercial caveat:** Open-Meteo's no-key hosted tier is free for non-commercial use up to its published limits. Clyra commercial use needs a commercial provider arrangement, contracted allowance, or permitted self-hosting; do not quietly rely on a free personal endpoint at scale. Source: <https://open-meteo.com/> and <https://open-meteo.com/en/docs>.

### 4. Locations/maps only when relevant, and with real place data

- Render a small map/place card for geographic tasks: travel, nearby places, businesses, routes, geolocated events or a requested map. The user should be able to interact with the map, zoom, inspect a place, search and open a full-screen version. **Do not show a map for unrelated tasks.**
- Map card's user-driven demo uses an actual OpenStreetMap interactive embed: `https://www.openstreetmap.org/export/embed.html?bbox=...&layer=mapnik&marker=...` (with user-selected/authorized coordinates). A full-screen light Apple Maps-*inspired* shell can have discreet floating zoom/location controls, top search, a bottom place-information sheet and an explicit Close X. It must retain the actual OSM data and attribution, not falsely imply Apple MapKit data or hide credits. Do not scrape/reuse Apple Maps assets.
- For global city search, the prototype uses Open-Meteo/GeoNames geocoding. For businesses/POIs or reverse geocoding in production, choose a service with explicit commercial usage allowance and coverage. If testing the public `nominatim.openstreetmap.org`, read <https://operations.osmfoundation.org/policies/nominatim/>: **aggregate maximum 1 request/second** across the app, clear attribution, valid identifying User-Agent/Referer, caching, no client-side search-as-you-type autocomplete/heavy use. Do not send confidential coordinates.
- Public raster OSM tiles `https://tile.openstreetmap.org/{z}/{x}/{y}.png` have best-effort service and **usage restrictions**: HTTPS, attribution, identifying app headers/referrer, caching, no bulk downloads/offline tile scraping and no SLA. Follow <https://operations.osmfoundation.org/policies/tiles/>. For a public commercial desktop product use self-hosted or properly licensed tiles/vector tiles/hosting. OpenStreetMap **data** is open, but public tile servers are not unlimited free infrastructure.
- Real directions/navigation/traffic, satellite imagery, place hours, photos and route ETAs require suitable live provider APIs; do not simulate them or label static data as current traffic. Display unsupported features as unavailable rather than pretend functionality.
- Respect coordinate privacy, explicit permission, map keyboard navigation, responsive map-sheet spacing and visible provider licence attribution.

### 5. Other tool-specific response surfaces — render contextually

- **Code/terminal/file:** only on actual code/terminal/edit operations; show real command, authentic stdout/stderr and file diff with success/error states, not synthetic counters in production.
- **Research:** search/read activity, citations, source icons and concise summaries; URLs must be the actual retrieved links. The source rail must have stable hover targets.
- **Math:** render correct fractions, matrices, integrals and formulas through the host renderer, with accessible MathML/LaTeX and code-copy where appropriate; do not treat a math answer as a picture.
- **Docs/slides/artifacts:** only when a document or presentation is created or edited; use the host's real rich editor and persistence, not the demo-only mock file engine. Presentation Edit should enter full-screen with a Close X, top menus and grouped Slides/Insert/Text/Arrange controls.
- **Browser/computer use:** show real tool frames, status, cursor coordinates and pause/takeover only when actual tool events supply them. The demo's shimmering/blue 10-second animation is a reference, not a timer for production operations.
- **Calendar/reminders/maps/weather/music:** use real authorized data/actions from connected providers; on denied access, report the unavailable capability. Do not show generic, fake success cards.

Maintain this project's restrained white/graphite design language (fine hairlines, consistent spacing, unobtrusive blue active state), but apply these styles through **host tokens and existing components**. The mock editor, demo composer, simulated media queue, weather fallback, fixed 10-second browser sequence, timers, and demo-only npm/GitHub rules must not migrate into production Clyra.
