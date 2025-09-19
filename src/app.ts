import {loadTailwindCss} from "./services/styles.js";
import {registerListeners} from "./services/listener.js";
import {ModoChatOptions} from "./types/app.js";
import {ModoPublicData} from "./models/modo-public-data.js";
import {fetchModoPublicData} from "./utils/fetch.js";
import {checkIfHostIsAllowed} from "./services/auth.js";

class ModoChat {
  container?: HTMLDivElement;
  publicKey: string;
  publicData?: ModoPublicData;

  constructor(publicKey: string, options?: ModoChatOptions) {
    this.publicKey = publicKey;

    // this.container = document.createElement("div");
    // this.container.textContent = "Start Chat";
    // document.body.appendChild(this.container);

    // let conBody = document.createElement("div");
    // this.container.appendChild(conBody);

    // this.container.innerHTML = `
    // <div class="chat-inner relative">
    // <div class="chat-body bg-white border w-[250px] h-[400px] bottom-[60px] right-8 hidden absolute rounded-xl" >${conBody.textContent}</div>
    // <span>
    // Start Chat
    // </span>
    // </div>
    // `;
    // loadTailwindCss();
    // registerListeners(this.container);
  }
  async init() {
    try {
      const publicDataRes = await fetchModoPublicData(this.publicKey);
      this.publicData = new ModoPublicData(publicDataRes);
      if (checkIfHostIsAllowed(this)) {
      } else {
        console.error("Domain not allowed");
      }
    } catch {
      console.error("Failed to initialize ModoChat");
    }
  }
}

// @ts-ignore
window.ModoChat = ModoChat;

export type {ModoChat};
