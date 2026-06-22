# AGENTS.md — Modo Widget

Guide for AI agents working in this repository.

## Project overview

**Modo Widget** (`@modochats/widget`) is a browser-embeddable customer-support chat widget. It ships as:

- An **NPM package** (ESM + TypeScript declarations)
- A **CDN UMD bundle** for `<script>` tag usage (`ModoWidget` / `ModoChat` globals)

The widget connects to the ModoChats backend via REST and WebSocket, supports text chat, voice chat, markdown messages, RTL (Persian), theming, and host allowlisting.

| Doc | Purpose |
| --- | --- |
| [README.md](README.md) | User-facing install, config, and API reference |
| [CHANGELOG.md](CHANGELOG.md) | Release history (semantic-release) |
| [cdn-dist/README.md](cdn-dist/README.md) | CDN bundle usage |

## Tech stack

- **Language:** TypeScript (strict, ES2022, NodeNext modules)
- **Build:** `tsc` → Terser minify → Rollup (CJS bundle) → UMD script for CDN
- **Runtime deps:** `@modochats/chat-client`, `@modochats/voice-client`, `i18next`, `marked`, `ofetch`, `tldts`
- **Package manager:** Yarn 4 (`packageManager` field in `package.json`)

## Architecture

```
Host page
  └── Widget (src/app.ts)           ← public entry, orchestrates lifecycle
        ├── Chatbot                 ← config from API (theme, starters, allowed hosts)
        ├── CustomerData            ← user identity / phone / updateUserData()
        ├── Chat                    ← wraps @modochats/chat-client
        │     └── Conversation      ← DOM messages, scroll, status
        ├── VoiceChat (optional)    ← wraps @modochats/voice-client
        └── UI layer                ← html.ts creates DOM, fn.ts styles/behavior
```

**Initialization flow** (`Widget.init()`):

1. Fetch chatbot config by public key (`utils/fetch.ts`)
2. Validate host against `allowedHosts` (`services/checker.ts`)
3. Apply i18n, inject CSS, build chat DOM (`services/ui/`)
4. Initialize chat client and optionally open in fullscreen

**Global accessors** (browser):

- `window.ModoWidget` / `window.ModoChat` — constructor
- `window.getMWidget()` — current widget instance (set after init)

## Directory structure

```
webcomponent/
├── src/                          # TypeScript source
│   ├── app.ts                    # Widget class — main entry for CDN bundle
│   ├── index.ts                  # NPM package exports
│   ├── constants/
│   │   ├── index.ts              # API URLs, env detection, audio URLs
│   │   ├── regex.ts              # Phone number validation
│   │   └── version.ts            # Package version string
│   ├── models/                   # Plain data shapes (legacy / shared types)
│   │   ├── conversation.ts
│   │   ├── customer-data.ts
│   │   ├── modo-public-data.ts
│   │   └── user-data.ts
│   ├── services/
│   │   ├── chat/
│   │   │   ├── model.ts          # ChatClient wrapper, socket events
│   │   │   ├── conversation.ts   # Message list UI + state
│   │   │   └── message-utils.ts  # Render markdown, files, replies, feedback
│   │   ├── chatbot/
│   │   │   └── chatbot.ts        # Chatbot config model + tooltip
│   │   ├── listeners/
│   │   │   ├── adders.ts         # DOM event registration
│   │   │   └── fn.ts             # sendMessage, phone form submit
│   │   ├── socket/
│   │   │   └── utils.ts          # Connection status indicator
│   │   ├── ui/
│   │   │   ├── html.ts           # createChatContainer — widget markup
│   │   │   └── fn.ts             # CSS load, theme, starters, toggle image
│   │   ├── user/
│   │   │   └── customer-data.ts  # CustomerData class
│   │   ├── voice-agent/
│   │   │   ├── model.ts
│   │   │   └── utils.ts
│   │   ├── voice-chat/
│   │   │   ├── model.ts          # VoiceChat class
│   │   │   └── utils.ts
│   │   └── checker.ts            # Host allowlist check
│   ├── tools/
│   │   └── fetch.ts              # Configured ofetch instance ($fetch)
│   ├── types/
│   │   ├── app.ts                # WidgetOptions, FetchPaginationRes
│   │   ├── conversation.ts       # ConversationStatus, MessageType
│   │   ├── socket.ts             # SocketMessage
│   │   └── window.ts             # Window global augmentations
│   └── utils/
│       ├── audio.ts              # Notification sounds
│       ├── browser.ts
│       ├── fetch.ts              # fetchChatbot, pagination helpers
│       ├── i18n.ts               # applyLanguage wrapper
│       └── uuid.ts
├── i18n/
│   └── config.ts                 # i18next resources (fa / en)
├── live/                         # Local dev playground
│   ├── dev.html                  # Dev page (live-server entry)
│   ├── index.html
│   ├── app.js                    # Rollup output (generated)
│   └── assets/css/index.css      # Widget styles
├── scripts/
│   ├── create-umd-bundle.js      # Builds cdn-dist/*.js UMD bundles
│   ├── tersser-minify.js         # Minifies dist/src/**/*.js
│   └── update-version.js         # Version bump helper
├── cdn-dist/                     # Committed CDN artifacts (CI updates)
│   ├── modo-widget.js            # UMD bundle
│   ├── modo-widget.min.js
│   ├── modo-web-component.js     # Legacy names (kept for compatibility)
│   ├── modo-web-component.min.js
│   └── dist/                     # Full compiled output copy
├── dist/                         # tsc output (gitignored in dev, in cdn-dist)
├── rollup.config.js              # Production Rollup → live/app.js
├── rollup.dev.config.js          # Dev Rollup watch config
├── tsconfig.json
├── .releaserc                    # semantic-release config
└── .github/workflows/
    └── build-and-publish.yml     # Build + commit cdn-dist on main push
```

## Key files

| File | Role |
| --- | --- |
| `src/app.ts` | `Widget` class; CDN global `ModoWidget` |
| `src/index.ts` | NPM `exports` surface |
| `src/services/ui/html.ts` | All widget HTML structure (class prefix `mw-`) |
| `src/services/ui/fn.ts` | Theme, position, CSS injection, starters |
| `src/services/chat/model.ts` | ChatClient lifecycle and event wiring |
| `src/constants/index.ts` | `BASE_API_URL`, `BASE_WEBSOCKET_URL`, env via `window.ENVIRONMENT` |
| `i18n/config.ts` | Translation keys under `chat.*` namespace |
| `live/assets/css/index.css` | Widget stylesheet (loaded at runtime) |

## Development

```bash
yarn install
yarn dev          # tsc watch + rollup watch + live-server on :3000
```

Open `http://localhost:3000/dev.html`. Uncomment `window.ENVIRONMENT = "DEV"` in `live/dev.html` to hit the dev API.

| Script | Description |
| --- | --- |
| `yarn dev` | Full dev stack (alias for concurrent tsc/rollup/server) |
| `yarn compile` | One-shot TypeScript compile → `dist/` |
| `yarn build` | compile + minify + rollup |
| `yarn build:cdn` | build + UMD bundles → `cdn-dist/` |
| `yarn build:types` | Declaration files → `dist/types/` |

**Build pipeline:** `src/**/*.ts` → `dist/src/` → minify → Rollup bundles `dist/src/app.js` → `live/app.js` → `scripts/create-umd-bundle.js` → `cdn-dist/modo-widget*.js`.

## Conventions for agents

### Code style

- Use **existing patterns**: class-based services, `.js` extensions in imports (NodeNext), `#src/*` path aliases resolve to compiled `dist/`.
- DOM classes use the **`mw-`** prefix (e.g. `mw-chat-body`, `mw-hidden`).
- Keep changes **minimal and scoped** — do not refactor unrelated code.
- Prefer extending existing modules over adding parallel abstractions.
- Comments only for non-obvious logic; avoid narrating obvious code.

### Imports

```typescript
import {WidgetOptions} from "./types/app.js";   // relative + .js extension
import {VERSION} from "./constants/index.js";
```

### Environment

- **Production API:** `https://api.modochats.com`
- **Dev API:** set `window.ENVIRONMENT = "DEV"` before widget load
- Version lives in `src/constants/version.ts` (also synced by release tooling)

### i18n

- Add or edit strings in `i18n/config.ts` for both `fa` and `en`.
- Keys follow `chat.<section>.<key>` (e.g. `chat.input.placeholder`).
- Default language is `"fa"`.

### UI changes

- Markup: `src/services/ui/html.ts`
- Behavior / styling hooks: `src/services/ui/fn.ts`
- Styles: `live/assets/css/index.css` (and `temp/css/` if present)

### External packages

- **`@modochats/chat-client`** — do not reimplement socket/message logic; extend via `Chat` in `services/chat/model.ts`.
- **`@modochats/voice-client`** — voice flows live under `services/voice-chat/` and `services/voice-agent/`.

### Testing locally

There is no automated test suite. Verify changes via `yarn dev` and `live/dev.html`. For CDN output, run `yarn build:cdn` and test the generated script.

### What not to change without asking

- Legacy CDN filenames (`modo-web-component.*`) — kept for backward compatibility.
- CI workflow and semantic-release config unless explicitly requested.
- Older modules in `src/models/` may overlap with `src/services/` — prefer editing the service layer unless migrating.

### Git / releases

- `cdn-dist/` is updated by CI on pushes to `main`.
- Do not commit unless the user asks.
- Changelog is managed by semantic-release.

## Public API summary

**Constructor:**

```typescript
new Widget(publicKey: string, options?: Partial<WidgetOptions>)
```

**Options:** `position`, `theme`, `primaryColor`, `title`, `foregroundColor`, `userData`, `autoInit`, `fullScreen`, `language` (`"fa" | "en"`).

**Methods:**

- `init()` — initialize widget (throws if already initialized or host not allowed)
- `updateUserData(data)` — merge and sync user data to server
- `onOpen()` / `onClose()` — chat panel lifecycle (also triggered by UI)

**NPM import:**

```typescript
import {Widget, Chat, Conversation, CustomerData} from "@modochats/widget";
```

## Related repositories

- GitHub: [modochats/webcomponent](https://github.com/modochats/webcomponent)
- Published as `@modochats/widget` on npm
