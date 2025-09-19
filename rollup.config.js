import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "dist/app.js",
  output: {
    file: "temp/app.js",
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
