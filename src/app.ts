import {color} from "./constants/index.js";
import {ofetch} from "ofetch";
import {getDocumentHead} from "./utils/browser.js";

class ModoChat extends HTMLElement {
  async connectedCallback() {
    ofetch("ssss");
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
    initEvents(this);
  }
}

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
