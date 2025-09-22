# Modo Chat Widget

A responsive Persian/Farsi chat widget web component for customer support.

## Features

- 🌙 Dark/Light theme support
- 🌐 RTL (Persian/Farsi) language support
- 📱 Mobile responsive design
- 💬 Real-time chat functionality
- 🔗 WebSocket connection status
- 📝 Markdown message support
- ⚡ TypeScript + Modern JavaScript

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
├── temp/                   # Development files
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
<script src="bundle.js"></script>
<script>
  // Initialize the chat widget
  const chat = new ModoChat({
    publicKey: "your-public-key"
    // other options...
  });
</script>
```

## Requirements

- Node.js 16+
- Yarn package manager

## License

ISC
