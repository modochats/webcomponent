#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const packageJson = require("../package.json");
const version = packageJson.version;

const constantsPath = path.join(__dirname, "../src/constants/version.ts");
const constantsContent = `const VERSION = "${version}";\nexport {VERSION};\n`;

fs.writeFileSync(constantsPath, constantsContent);
console.log(`Updated VERSION to ${version} in version.ts`);
