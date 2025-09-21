import {ModoChatOptions} from "./types/app.js";
import {ModoPublicData} from "./models/modo-public-data.js";
import {fetchModoPublicData} from "./utils/fetch.js";
import {checkIfHostIsAllowed, checkIfUserHasConversation} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {UserData} from "./models/user-data.js";
import {Conversation} from "./models/conversation.js";
import {Socket} from "./services/socket/socket.js";
import {loadStarters, updateChatToggleImage, updateChatTitle, applyModoOptions} from "./services/ui/fn.js";

class ModoChat {
  container?: HTMLDivElement;
  publicKey: string;
  publicData?: ModoPublicData;
  userData: UserData;
  conversation?: Conversation;
  socket?: Socket;
  options: ModoChatOptions;
  constructor(publicKey: string, options?: Partial<ModoChatOptions>) {
    this.publicKey = publicKey;
    this.userData = new UserData(this);

    this.options = {
      position: options?.position || "right",
      theme: options?.theme || "dark",
      primaryColor: options?.primaryColor || "#667eea",
      title: options?.title || "Modo"
    };
    this.init();
  }
  async init() {
    try {
      const publicDataRes = await fetchModoPublicData(this.publicKey);
      this.publicData = new ModoPublicData(publicDataRes);
      if (checkIfHostIsAllowed(this)) {
        createChatContainer(this);
        window.modoChatInstance = () => this;
        applyModoOptions();
        checkIfUserHasConversation(this);
        loadStarters();
        updateChatToggleImage();
        updateChatTitle();
      } else {
        console.error("Domain not allowed");
      }
    } catch (err) {
      console.error("Failed to initialize ModoChat", err);
    }
  }
}

window.ModoChat = ModoChat;

export type {ModoChat};
