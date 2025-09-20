import {ModoChatOptions} from "./types/app.js";
import {ModoPublicData} from "./models/modo-public-data.js";
import {fetchModoPublicData} from "./utils/fetch.js";
import {checkIfHostIsAllowed, checkIfUserHasConversation} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {UserData} from "./models/user-data.js";
import {Conversation} from "./models/conversation.js";
import {Socket} from "./services/socket/socket.js";
import {loadStarters} from "./services/ui/fn.js";

class ModoChat {
  container?: HTMLDivElement;
  publicKey: string;
  publicData?: ModoPublicData;
  userData: UserData;
  conversation?: Conversation;
  socket?: Socket;

  constructor(publicKey: string, options?: ModoChatOptions) {
    this.publicKey = publicKey;
    this.userData = new UserData(this);
  }
  async init() {
    try {
      const publicDataRes = await fetchModoPublicData(this.publicKey);
      this.publicData = new ModoPublicData(publicDataRes);
      if (checkIfHostIsAllowed(this)) {
        createChatContainer(this);
        window.modoChatInstance = () => this;
        checkIfUserHasConversation(this);
        loadStarters();
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
