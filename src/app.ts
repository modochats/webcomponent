import {ModoChatOptions} from "./types/app.js";
import {ModoPublicData} from "./models/modo-public-data.js";
import {fetchModoPublicData} from "./utils/fetch.js";
import {checkIfHostIsAllowed, loadConversation} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {CustomerData} from "./models/customer-data.js";
import {Conversation} from "./models/conversation.js";
import {initSocket, Socket} from "./services/socket/socket.js";
import {loadStarters, updateChatToggleImage, updateChatTitle, applyModoOptions, loadCss} from "./services/ui/fn.js";
import {preloadAudio} from "./utils/audio.js";
import {VERSION} from "./constants/index.js";

class ModoChat {
  container?: HTMLDivElement;
  publicKey: string;
  publicData?: ModoPublicData;
  customerData: CustomerData;
  conversation?: Conversation;
  socket?: Socket;
  options: ModoChatOptions;
  openedCount: number = 0;
  version: string;
  isInitialized: boolean = false;
  isOpen: boolean = false;
  constructor(publicKey: string, options?: Partial<ModoChatOptions>) {
    this.publicKey = publicKey;
    this.customerData = new CustomerData(this, options?.userData);
    this.version = VERSION;
    this.options = {
      position: options?.position || "right",
      theme: options?.theme || "dark",
      primaryColor: options?.primaryColor || "#667eea",
      title: options?.title || "",
      userData: options?.userData,
      foregroundColor: options?.foregroundColor || "#fff"
    };
    if (options?.autoInit) this.init();
  }
  async init() {
    if (this.isInitialized) throw new Error("ModoChat already initialized");
    const publicDataRes = await fetchModoPublicData(this.publicKey);
    this.publicData = new ModoPublicData(publicDataRes);
    if (checkIfHostIsAllowed(this)) {
      await loadCss();
      window.modoChatInstance = () => this;
      createChatContainer(this);
      applyModoOptions();
      loadStarters();
      updateChatToggleImage();
      updateChatTitle();
      loadConversation(this);

      this.isInitialized = true;
    } else throw new Error("host not allowed");
  }
  async onOpen() {
    this.isOpen = true;
    this.openedCount++;

    // Hide tooltip when chat is opened
    this.conversation?.hideTooltip();
    this.conversation?.markAsRead();
    this.conversation?.scrollToBottom();

    if (this.openedCount === 1) {
      if (this.conversation) {
        await this.conversation?.loadMessages();
        await initSocket();
      }
      await this.customerData.fetchUpdate();
    }
  }
  onClose() {
    this.isOpen = false;
  }

  /**
   * Update user data with new values
   * @param newUserData - Object containing new user data to merge
   */
  async updateUserData(newUserData: Record<string, any>) {
    await this.customerData.updateUserData(newUserData);
  }
}

window.ModoChat = ModoChat;

export type {ModoChat};
