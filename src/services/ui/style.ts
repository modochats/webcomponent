import {getDocumentHead} from "#src/utils/browser.js";

let loadTailwindCss = () => {
  let scriptTag = document.createElement("script");

  scriptTag.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

  getDocumentHead().appendChild(scriptTag);
};
export {loadTailwindCss};
