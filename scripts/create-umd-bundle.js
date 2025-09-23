import {promises as fs} from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {minify} from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createUMDBundle() {
  const distDir = path.resolve(__dirname, "../dist");
  const outputDir = path.resolve(__dirname, "../cdn-dist");

  console.log("Creating UMD bundle...");
  console.log("Dist directory:", distDir);
  console.log("Output directory:", outputDir);

  // Ensure output directory exists
  await fs.mkdir(outputDir, {recursive: true});

  // Read the main app file from rollup output
  const appPath = path.join(distDir, "../temp/app.js");
  let appCode = "";

  try {
    appCode = await fs.readFile(appPath, "utf8");
  } catch (error) {
    console.error("Error reading app.js from temp directory:", error);
    // Fallback to dist/src/app.js if temp doesn't exist
    const fallbackPath = path.join(distDir, "src/app.js");
    try {
      appCode = await fs.readFile(fallbackPath, "utf8");
    } catch (fallbackError) {
      console.error("Error reading app.js from dist directory:", fallbackError);
      return;
    }
  }

  // Clean up the app code
  let cleanedAppCode = appCode;

  // Remove 'use strict' from the beginning if it exists
  cleanedAppCode = cleanedAppCode.replace(/^['"]use strict['"];\s*/, "");

  // Check if ModoChat is properly defined and exported
  const hasModoChat = cleanedAppCode.includes("class ModoChat") || cleanedAppCode.includes("function ModoChat");
  const hasWindowExport = cleanedAppCode.includes("window.ModoChat");

  if (!hasModoChat) {
    console.error("ModoChat class not found in the bundle!");
    return;
  }

  // Create UMD wrapper
  const umdCode = `(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.ModoWebComponent = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  
  ${cleanedAppCode}
  
  // Return the ModoChat class for UMD usage
  return typeof ModoChat !== 'undefined' ? ModoChat : (typeof window !== 'undefined' && window.ModoChat ? window.ModoChat : null);
});`;

  // Write UMD bundle
  const umdPath = path.join(outputDir, "modo-web-component.js");
  await fs.writeFile(umdPath, umdCode);
  console.log("Created UMD bundle:", umdPath);

  // Create minified version using Terser
  console.log("Minifying UMD bundle...");
  try {
    const result = await minify(umdCode, {
      sourceMap: false,
      mangle: true,
      compress: true,
      keep_classnames: false,
      keep_fnames: false
    });

    if (result.error) {
      throw result.error;
    }

    if (result.code) {
      const minPath = path.join(outputDir, "modo-web-component.min.js");
      await fs.writeFile(minPath, result.code);
      console.log("Created minified bundle:", minPath);
    } else {
      console.warn("No minified code generated. Using original code.");
      const minPath = path.join(outputDir, "modo-web-component.min.js");
      await fs.writeFile(minPath, umdCode);
    }
  } catch (error) {
    console.error("Error during minification:", error);
    console.log("Falling back to original code for minified version...");
    const minPath = path.join(outputDir, "modo-web-component.min.js");
    await fs.writeFile(minPath, umdCode);
  }

  // Copy dist folder
  await copyDirectory(distDir, path.join(outputDir, "dist"));

  // Create package.json for CDN
  const packageJson = {
    name: "modo-web-component",
    version: "1.0.0",
    description: "Modo Web Component - A lightweight web component library",
    main: "modo-web-component.js",
    files: ["modo-web-component.js", "modo-web-component.min.js", "dist/"],
    keywords: ["web-component", "modo", "javascript", "umd"],
    author: "",
    license: "ISC",
    repository: {
      type: "git",
      url: "https://github.com/your-username/modo-web-component.git"
    },
    homepage: "https://github.com/your-username/modo-web-component#readme",
    bugs: {
      url: "https://github.com/your-username/modo-web-component/issues"
    }
  };

  await fs.writeFile(path.join(outputDir, "package.json"), JSON.stringify(packageJson, null, 2));

  // Create README for CDN
  const readmeContent = `# Modo Web Component

A lightweight web component library.

## CDN Usage

### jsDelivr
\`\`\`html
<script src="https://cdn.jsdelivr.net/gh/your-username/modo-web-component@main/cdn-dist/modo-web-component.min.js"></script>
\`\`\`

### GitHub Raw
\`\`\`html
<script src="https://raw.githubusercontent.com/your-username/modo-web-component/main/cdn-dist/modo-web-component.min.js"></script>
\`\`\`

## Usage

\`\`\`javascript
// Initialize the chat widget
const chat = new ModoChat('your-public-key', {
  position: 'right', // 'left' or 'right'
  theme: 'dark', // 'dark' or 'light'
  primaryColor: '#667eea',
  title: 'پشتیبانی چت'
});
\`\`\`

## Features

- 🌙 Dark/Light theme support
- 🌐 RTL (Persian/Farsi) language support
- 📱 Mobile responsive design
- 💬 Real-time chat functionality
- 🔗 WebSocket connection status
- 📝 Markdown message support

## Files

- \`modo-web-component.js\` - Development version
- \`modo-web-component.min.js\` - Production version (minified)
- \`dist/\` - Full distribution files
`;

  await fs.writeFile(path.join(outputDir, "README.md"), readmeContent);

  console.log("UMD bundle created successfully!");
  console.log("Files created:");
  console.log("- modo-web-component.js");
  console.log("- modo-web-component.min.js");
  console.log("- dist/ (copied from build)");
  console.log("- package.json");
  console.log("- README.md");
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, {recursive: true});

  const entries = await fs.readdir(src, {withFileTypes: true});

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

createUMDBundle().catch(console.error);
