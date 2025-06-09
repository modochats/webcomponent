import {colors} from "./constants/index.js";
import {getDocumentHead} from "./utils/tiny.js";

class ModoChat extends HTMLElement {
  async connectedCallback() {
    this.textContent = "Start Chat";
    let body = document.createElement("div");
    this.appendChild(body);

    this.innerHTML = `
    <div class="chat-inner relative">
    <div class="chat-body bg-white border w-[250px] h-[400px] bottom-[60px] right-8 hidden absolute rounded-xl" >${body.textContent}</div>
    <span>
    Start Chat
    </span>
    </div>
    `;
    loadTailwindCss();
    applyClasses(this);
    initEvents(this);
  }
}

let applyClasses = (element: HTMLElement) => {
  element.classList.add(
    "modo-chat-con",
    `!bg-[${colors.primary}]`,
    "bottom-2",
    "size-[100px]",
    "rounded-full",
    "flex",
    "justify-center",
    "items-center",
    "cursor-pointer",
    "fixed",
    "right-2",
    "select-none",
    "font-[Vazirmatn]"
  );
  loadFont();
};

let loadFont = () => {
  for (let i of [
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true},
    {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"}
  ]) {
    let link = document.createElement("link");
    link.rel = i.rel;
    link.href = i.href;
    if (i.crossorigin) {
      link.crossOrigin = "anonymous";
    }
    getDocumentHead().appendChild(link);
  }
};
let initEvents = (element: HTMLElement) => {
  let chatBody = element.querySelector(".chat-body");
  let isBodyOpen = false;

  element.addEventListener(
    "click",
    () => {
      isBodyOpen = !isBodyOpen;

      chatBody?.classList.toggle("hidden");
    },
    {capture: false}
  );
  chatBody?.addEventListener(
    "click",
    e => {
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    {capture: true}
  );
};

let loadTailwindCss = () => {
  let scriptTag = document.createElement("script");

  scriptTag.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

  getDocumentHead().appendChild(scriptTag);
};
customElements.define("modo-chat", ModoChat);
