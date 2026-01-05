import {WidgetOptions} from "./types/app.js";
import {Chatbot} from "./models/chatbot.js";
import {fetchChatbot} from "./utils/fetch.js";
import {checkIfHostIsAllowed, loadConversation} from "./services/checker.js";
import {createChatContainer} from "./services/ui/html.js";
import {CustomerData} from "./models/customer-data.js";
import {Conversation} from "./models/conversation.js";
import {initSocket, Socket} from "./services/socket/socket.js";
import {loadStarters, updateChatToggleImage, updateChatTitle, applyModoOptions, loadCss} from "./services/ui/fn.js";
import {VERSION} from "./constants/index.js";
import {VoiceChat} from "./services/voice-chat/model.js";
import {ConversationMaster} from "./models/conversation-master.js";

class Widget {
  container?: HTMLDivElement;
  publicKey: string;
  chatbot?: Chatbot;
  customerData: CustomerData;

  conversationMaster: ConversationMaster;
  socket?: Socket;
  options: Partial<WidgetOptions> = {};
  openedCount: number = 0;
  version: string;
  isInitialized: boolean = false;
  isOpen: boolean = false;
  voiceChat?: VoiceChat;

  constructor(publicKey: string, options?: Partial<WidgetOptions>) {
    this.publicKey = publicKey;
    this.customerData = new CustomerData(this, options?.userData);
    this.conversationMaster = new ConversationMaster();
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

      // In fullscreen mode, automatically open the chat
      if (this.options.fullScreen) {
        // Ensure chat body is visible in fullscreen mode
        const chatBody = this.container?.querySelector(".mw-chat-body");
        if (chatBody) {
          chatBody.classList.remove("mw-hidden");
          chatBody.classList.add("mw-active");
        }
        try {
          await loadConversation(this);
        } finally {
          this.onOpen();
        }
      } else loadConversation(this);
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
      if (this.conversation) {
        await this.conversation?.loadMessages();
        await initSocket();
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
    return this.conversationMaster.conversation;
  }
  set conversation(conversation: Conversation | undefined) {
    this.conversationMaster.conversation = conversation;
  }
}

window.ModoChat = Widget;
window.ModoWidget = Widget;

export type {Widget};
