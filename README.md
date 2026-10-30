# Clyra Response & Agent Activity UI Demo

A standalone, light-theme **visual reference** for AI answer text, thinking, search, file-edit diffs, document/slide/music artifacts, command execution, browser preview and general tool activity. The demo shows **three broad phases**, with only two later dividers; longer narration connects related actions.

**Important:** The HTML demo intentionally has **no chat composer or sample user bubble**. It is **not** the replacement for your application's entire chat, message UI, app layout or agent loop. Keep your own host app's message bubbles, composer/input bar, position, size, animations, scroll behaviour and backend harness untouched. Reuse only the styles and renderers for assistant response *content* and tool/status UI.

Read **[AGENTS.md](./AGENTS.md)** for coding-agent implementation boundaries, then **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** before copying any component into your main app. Detailed comments in `index.html`, `styles.css`, and `main.js` explain the boundaries.

## Run

Extract project. Open its folder and run:

```sh
npm run dev
```

Visit <http://localhost:5173/>. Only Node.js and npm are required, no npm install.

## Demo components

- Thin brain icon + neutral dots and compact `Thought 2s` completion
- Smooth response text and active status shimmer
- Sliding web-source favicon stack, compact sources disclosure
- Rounded browser shimmer preview, collapsible action history
- Pencil file edits with rolling red/green counts and collapsible diff
- Writing card and stable white formatting toolbar with font and size
- Editable/full-screen slide previews, compact music playback, terminal output
- Collapsible 44px To-dos list on a separate right rail; mobile drawer
- Copy, regenerate, feedback and reduced-motion support

All actions and commands are visual samples. No files, music, browser sessions or external services are actually changed.

## Files

- `index.html`: demo shell only; not a host-chat template
- `styles.css`: isolated reference presentation rules and soft-motion tokens
- `main.js`: component prototypes and demonstration event sequence
- `INTEGRATION_GUIDE.md`: explicit instructions to your coding agent
- `server.js`, `package.json`: zero-install local server

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

- The demo's compact To-dos disclosure is an overlay above **reserved space for an existing composer**. No input field or message bubble is included. In an actual app, attach the todo to the existing composer-adjacent slot, respecting the host's layout, keyboard avoidance, safe areas, and scroll ownership; **do not copy the demo's absolute/fixed positioning or add an input bar**.
- Keep task counts driven by real events. Todo completion and disclosure expansion change height gradually and should not shift surrounding message elements.
- The music card is a small, white, border-only playback capsule. Supply title, artist, playing state, and duration from the host's real music connector. It does not create a playlist or start playback by itself. Its details animate to their measured height, with an instant fallback under `prefers-reduced-motion`.
- The demo's three groups and scripted animations remain inspection fixtures; migrate only response/tool visuals, not workflow sequencing, message positioning, or composer behavior.
