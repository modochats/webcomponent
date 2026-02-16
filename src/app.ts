import {WidgetOptions} from "./types/app.js";
import {Chatbot} from "./services/chatbot/chatbot.js";
import {fetchChatbot} from "./utils/fetch.js";
import {checkIfHostIsAllowed} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {CustomerData} from "./services/user/customer-data.js";
import {loadStarters, updateChatToggleImage, updateChatTitle, applyModoOptions, loadCss} from "./services/ui/fn.js";
import {VERSION} from "./constants/index.js";
import {VoiceChat} from "./services/voice-chat/model.js";
import {Chat} from "./services/chat/model.js";

class Widget {
  container?: HTMLDivElement;
  publicKey: string;
  chatbot?: Chatbot;
  customerData: CustomerData;
  chat: Chat;

  options: Partial<WidgetOptions> = {};
  openedCount: number = 0;
  version: string;
  isInitialized: boolean = false;
  isOpen: boolean = false;
  voiceChat?: VoiceChat;

  constructor(publicKey: string, options?: Partial<WidgetOptions>) {
    this.publicKey = publicKey;
    this.customerData = new CustomerData(this, options?.userData);
    this.chat = new Chat();
    this.version = VERSION;
    this.options = {
      position: options?.position || "right",
      theme: options?.theme,
      primaryColor: options?.primaryColor,
      title: options?.title || "",
      userData: options?.userData,
      foregroundColor: options?.foregroundColor,
      fullScreen: typeof options?.fullScreen === "boolean" ? options?.fullScreen : false
    };
    if (options?.autoInit) this.init();
  }
  async init() {
    if (this.isInitialized) throw new Error("Widget already initialized");
    const chatbotRes = await fetchChatbot(this.publicKey);
    this.chatbot = new Chatbot(chatbotRes);
    this.options = {
      ...this.options,
      theme: this.options?.theme || this.chatbot?.uiConfig?.theme || "dark",
      primaryColor: this.options?.primaryColor || this.chatbot?.uiConfig?.primaryColor || "#667eea",
      foregroundColor: this.options?.foregroundColor || this.chatbot?.uiConfig?.foregroundColor || "#fff"
    };
    if (checkIfHostIsAllowed(this)) {
      await loadCss();
      window.getMWidget = () => this;
      createChatContainer(this);
      applyModoOptions();
      loadStarters();
      updateChatToggleImage();
      updateChatTitle();

      this.isInitialized = true;
      this.chatbot.showTooltip();
      try {
        await this.chat.initInstance();
      } catch (e) {}
      // In fullscreen mode, automatically open the chat
      if (this.options.fullScreen) {
        // Ensure chat body is visible in fullscreen mode
        const chatBody = this.container?.querySelector(".mw-chat-body");
        if (chatBody) {
          chatBody.classList.remove("mw-hidden");
          chatBody.classList.add("mw-active");
        }
        this.onOpen();
      }
    } else throw new Error("host not allowed");
  }
  async onOpen() {
    this.isOpen = true;
    this.openedCount++;

    // Hide tooltip when chat is opened
    this.conversation?.hideTooltip();
    this.chatbot?.hideTooltip();
    this.conversation?.markAsRead();
    this.conversation?.scrollToBottom();
    if (this.openedCount === 1) {
      // console.log("conversationD", this.chat.conversationD);
      if (this.chat.conversationD) {
        await this.conversation?.loadMessages();
        await this.chat?.socket?.connect();
      }
      if (this.chatbot?.voiceChat) this.voiceChat = new VoiceChat();
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
  get conversation() {
    return this.chat.conversation;
  }
}

window.ModoChat = Widget;
window.ModoWidget = Widget;

export type {Widget};
