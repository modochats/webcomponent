import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/src/app.js", // Use compiled TypeScript output
  output: {
    file: "temp/app.dev.js",
    format: "iife", // Better for browser development
    name: "ModoChat", // Global name for IIFE
    sourcemap: true // Enable source maps for debugging
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs()
  ],
  watch: {
    clearScreen: false
  }
};
