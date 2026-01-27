import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/src/app.js",
  output: {
    file: "live/app.js",
    format: "cjs"
  },
  // external: ["ofetch"], // Uncomment this if you want to keep ofetch external
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs()
  ]
};
