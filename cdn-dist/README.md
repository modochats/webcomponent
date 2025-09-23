# Modo Web Component

A lightweight web component library.

## CDN Usage

### jsDelivr
```html
<script src="https://cdn.jsdelivr.net/gh/your-username/modo-web-component@main/cdn-dist/modo-web-component.min.js"></script>
```

### GitHub Raw
```html
<script src="https://raw.githubusercontent.com/your-username/modo-web-component/main/cdn-dist/modo-web-component.min.js"></script>
```

## Usage

```javascript
// Initialize the chat widget
const chat = new ModoChat('your-public-key', {
  position: 'right', // 'left' or 'right'
  theme: 'dark', // 'dark' or 'light'
  primaryColor: '#667eea',
  title: 'پشتیبانی چت'
});
```

## Features

- 🌙 Dark/Light theme support
- 🌐 RTL (Persian/Farsi) language support
- 📱 Mobile responsive design
- 💬 Real-time chat functionality
- 🔗 WebSocket connection status
- 📝 Markdown message support

## Files

- `modo-web-component.js` - Development version
- `modo-web-component.min.js` - Production version (minified)
- `dist/` - Full distribution files
