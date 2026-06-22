# Modo Widget

A responsive web chat widget for customer support.

## Installation

### NPM

Install the package via npm:

```bash
npm install @modochats/widget
```

Then, import and use in your JavaScript/TypeScript code:

```javascript
import {Widget} from "@modochats/widget";

const widget = new Widget("your-public-key", {
  // options
});
```

### CDN

Alternatively, include the script directly from CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/modochats/webcomponent@main/cdn-dist/modo-web-component.min.js"></script>
```

## Features

- 🌙 Dark/Light theme support with customizable colors
- 🌐 RTL (Persian/Farsi) language support
- 📱 Mobile responsive design
- 💬 Real-time chat functionality with WebSocket connections
- 🔗 WebSocket connection status indicator
- 📝 Markdown message support
- 🎤 Voice chat capabilities
- 🖥️ Fullscreen mode option
- 🎨 Customizable position (left/right), primary and foreground colors
- 👤 User data management and updates
- ⚡ TypeScript + Modern JavaScript
- 🔄 Auto-initialization support

## Configuration Options

The widget can be customized with the following options:

| Option            | Type                  | Default     | Description                                    |
| ----------------- | --------------------- | ----------- | ---------------------------------------------- |
| `position`        | `"left" \| "right"`   | `"right"`   | Position of the chat widget on the screen      |
| `theme`           | `"dark" \| "light"`   | `"dark"`    | Theme mode (dark or light)                     |
| `primaryColor`    | `string`              | `"#667eea"` | Primary color for the widget                   |
| `title`           | `string`              | `""`        | Title displayed in the chat header             |
| `foregroundColor` | `string`              | `"#fff"`    | Foreground text color                          |
| `userData`        | `Record<string, any>` | `undefined` | Custom user data object                        |
| `autoInit`        | `boolean`             | `false`     | Whether to automatically initialize the widget |
| `fullScreen`      | `boolean`             | `false`     | Enable fullscreen mode                         |
| `language`        | `"fa" \| "en"`        | `"fa"`      | Default language for the widget (i18n)         |
| `collectPhoneNumber` | `boolean`          | `true`      | Prompt for phone number before the first message |

## Quick Start

### Development

1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Start development server**

   ```bash
   yarn dev:full
   ```

   This runs TypeScript compiler, Rollup bundler, and live server concurrently.

3. **Open browser** Navigate to `http://localhost:3000`

### Production Build

```bash
yarn build
```

This will:

- Compile TypeScript to JavaScript
- Minify the code
- Bundle with Rollup
- Output to `bundle.js`

## Project Structure

```
├── src/                    # Source code
│   ├── app.ts             # Main application entry
│   ├── models/            # Data models
│   ├── services/          # UI and business logic
│   ├── utils/             # Helper utilities
│   └── types/             # TypeScript types
├── live/                   # Development files
│   ├── css/               # Compiled styles
│   └── dev.html           # Development HTML
├── scripts/               # Build scripts
└── bundle.js              # Production bundle
```

## Available Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `yarn dev:full`   | Full development environment   |
| `yarn dev:ts`     | TypeScript compiler watch mode |
| `yarn dev:rollup` | Rollup bundler watch mode      |
| `yarn dev:server` | Live development server        |
| `yarn build`      | Production build               |
| `yarn compile`    | Compile TypeScript             |
| `yarn minify`     | Minify JavaScript              |

## Usage

Include the widget in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Your Website</title>
  </head>
  <body>
    <!-- Your website content -->

    <script src="https://cdn.jsdelivr.net/gh/modochats/webcomponent@main/cdn-dist/modo-web-component.min.js"></script>
    <script>
      // Initialize the chat widget
      const widget = new ModoWidget("your-public-key", {
        position: "right",
        theme: "dark",
        language: "fa",
        primaryColor: "#667eea",
        title: "Chat with Us",
        foregroundColor: "#ffffff",
        userData: {name: "John Doe", email: "john@example.com"},
        autoInit: true,
        fullScreen: false,
        collectPhoneNumber: true
      });
    </script>
  </body>
</html>
```

### Initialization Options

Pass configuration options as the second parameter to the `ModoWidget` constructor. All options are optional except the public key.

Example with minimal options:

```javascript
const widget = new ModoWidget("your-public-key");
widget.init(); // Manual initialization if autoInit is false
```

To skip the phone number prompt before the first message:

```javascript
const widget = new ModoWidget("your-public-key", {
  collectPhoneNumber: false,
  autoInit: true
});
```

## API Methods

**Internationalization (i18n)**

- **Supported languages**: `fa` (Persian), `en` (English).
- **Default**: `fa`.
- **Set initial language**: pass the `language` option (`"fa" | "en"`) to the `ModoWidget` constructor.
- **Translations location**: the built-in translation resources live in [i18n/config.ts](i18n/config.ts#L1-L50). Edit or extend this file to add or override translations.
- **Runtime language change**: The widget applies the chosen language during initialization. To customize runtime behavior or load additional languages dynamically, initialize or configure `i18next` before creating the widget (see `i18n/config.ts`).

Once initialized, you can interact with the widget instance:

### Update User Data

Update or add custom user data dynamically:

```javascript
await widget.updateUserData({
  name: "Jane Doe",
  email: "jane@example.com"
});
```

This method merges the new data with existing user data and updates it on the server.

## Requirements

- Node.js 16+
- Yarn package manager

## License

ISC
