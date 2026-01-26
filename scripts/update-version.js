#!/usr/bin/env node
import {promises as fs} from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(await fs.readFile(path.join(__dirname, "../package.json"), "utf8"));
const version = packageJson.version;

const constantsPath = path.join(__dirname, "../src/constants/version.ts");
const constantsContent = `const VERSION = "${version}";\nexport {VERSION};\n`;

fs.writeFile(constantsPath, constantsContent);
console.log(`Updated VERSION to ${version} in version.ts`);
