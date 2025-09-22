import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createUMDBundle() {
  const distDir = path.resolve(__dirname, '../dist');
  const outputDir = path.resolve(__dirname, '../cdn-dist');
  
  console.log('Creating UMD bundle...');
  console.log('Dist directory:', distDir);
  console.log('Output directory:', outputDir);
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  // Read the main app file from rollup output
  const appPath = path.join(distDir, '../temp/app.js');
  let appCode = '';
  
  try {
    appCode = await fs.readFile(appPath, 'utf8');
  } catch (error) {
    console.error('Error reading app.js from temp directory:', error);
    // Fallback to dist/src/app.js if temp doesn't exist
    const fallbackPath = path.join(distDir, 'src/app.js');
    try {
      appCode = await fs.readFile(fallbackPath, 'utf8');
    } catch (fallbackError) {
      console.error('Error reading app.js from dist directory:', fallbackError);
      return;
    }
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
  
  ${appCode}
  
  return {
    version: '1.0.0',
    init: function() {
      // Initialize the web component
      console.log('Modo Web Component initialized');
    }
  };
});`;

  // Write UMD bundle
  const umdPath = path.join(outputDir, 'modo-web-component.js');
  await fs.writeFile(umdPath, umdCode);
  console.log('Created UMD bundle:', umdPath);
  
  // Create minified version (basic minification)
  const minifiedCode = umdCode
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\s*([{}();,=])\s*/g, '$1') // Remove spaces around operators
    .trim();
    
  const minPath = path.join(outputDir, 'modo-web-component.min.js');
  await fs.writeFile(minPath, minifiedCode);
  console.log('Created minified bundle:', minPath);
  
  // Copy dist folder
  await copyDirectory(distDir, path.join(outputDir, 'dist'));
  
  // Create package.json for CDN
  const packageJson = {
    name: 'modo-web-component',
    version: '1.0.0',
    description: 'Modo Web Component - A lightweight web component library',
    main: 'modo-web-component.js',
    files: [
      'modo-web-component.js',
      'modo-web-component.min.js',
      'dist/'
    ],
    keywords: ['web-component', 'modo', 'javascript', 'umd'],
    author: '',
    license: 'ISC',
    repository: {
      type: 'git',
      url: 'https://github.com/your-username/modo-web-component.git'
    },
    homepage: 'https://github.com/your-username/modo-web-component#readme',
    bugs: {
      url: 'https://github.com/your-username/modo-web-component/issues'
    }
  };
  
  await fs.writeFile(
    path.join(outputDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
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
// Initialize the component
ModoWebComponent.init();
\`\`\`

## Files

- \`modo-web-component.js\` - Development version
- \`modo-web-component.min.js\` - Production version (minified)
- \`dist/\` - Full distribution files
`;

  await fs.writeFile(path.join(outputDir, 'README.md'), readmeContent);
  
  console.log('UMD bundle created successfully!');
  console.log('Files created:');
  console.log('- modo-web-component.js');
  console.log('- modo-web-component.min.js');
  console.log('- dist/ (copied from build)');
  console.log('- package.json');
  console.log('- README.md');
}

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });
  
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
