#!/usr/bin/env node
import {promises as fs} from "fs";
import path from "path";

const version = packageJson.version;

const constantsPath = path.join(__dirname, "../src/constants/version.ts");
const constantsContent = `const VERSION = "${version}";\nexport {VERSION};\n`;

fs.writeFileSync(constantsPath, constantsContent);
console.log(`Updated VERSION to ${version} in version.ts`);
