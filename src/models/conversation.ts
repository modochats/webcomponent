import {switchToConversationLayout, switchToStarterLayout} from "#src/services/ui/fn.js";
import {ConversationStatus, MessageType} from "#src/types/conversation.js";
import {fetchConversationMessages} from "#src/utils/fetch.js";
import {marked} from "marked";

class Conversation {
  id: number;
  uuid: string;
  chatbot: number;
  unreadMessageCount: number;
  messages: ConversationMessage[] = [];
  status: keyof typeof ConversationStatus;
  uniqueId?: string;

  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadMessageCount = init.unread_messages_count;
    this.uniqueId = init.unique_id;
    switch (init.status) {
      case "ai_chat":
        this.status = "AI_CHAT";
        break;
      case "supporter_chat":
        this.status = "SUPPORTER_CHAT";
        break;
      case "resolved":
        this.status = "RESOLVED";
        break;
      default:
        this.status = "UNKNOWN";
    }
    this.onInit();
  }
  addMessage(init: Record<string, any>) {
    this.messages.push(new ConversationMessage(init));
    const chatMessagesContainer = document.querySelector(".chat-messages-con");
    if (chatMessagesContainer) {
      const messageElement = document.createElement("div");
      const latestMessage = this.messages[this.messages.length - 1];

      // Format time from createdAt
      const messageTime = new Date(latestMessage.createdAt);
      const timeString = messageTime.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

      messageElement.innerHTML = `
        <div class="chat-message ${latestMessage.type === "USER" ? "chat-message-user" : "chat-message-supporter"}">
          <div class="message-content">${marked.parse(init.content) as string}</div>
        </div>
        <div class="message-time">${timeString}</div>
      `;

      messageElement.className = `message-wrapper ${latestMessage.type === "USER" ? "message-wrapper-user" : "message-wrapper-supporter"}`;
      chatMessagesContainer.appendChild(messageElement);

      // Scroll to bottom of the container
      this.scrollToBottom();
    }
  }
  scrollToBottom() {
    const chatMessagesContainer = document.querySelector(".chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }

  clear() {
    this.messages = [];
    const modoInstance = window.modoChatInstance?.();
    localStorage.removeItem(`modo-chat:${modoInstance?.publicKey}-conversation-uuid`);
    const chatMessagesContainer = document.querySelector(".chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.innerHTML = "";
    }
    switchToStarterLayout();
  }
  onInit() {
    switchToConversationLayout();
  }
  async loadMessages() {
    const modoInstance = window.modoChatInstance?.();
    const res = await fetchConversationMessages(this.uuid, modoInstance?.publicKey as string);
    this.messages = [];
    const chatMessagesContainer = modoInstance?.container?.querySelector(".chat-messages-con");
    if (chatMessagesContainer) chatMessagesContainer.innerHTML = "";
    for (const message of res.results) this.addMessage(message);
  }
}
class ConversationMessage {
  id: number;
  content: string;
  type: keyof typeof MessageType;
  createdAt: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.content = init.content;
    switch (init.message_type) {
      case 0:
        this.type = "USER";
        break;
      case 1:
        this.type = "AI";
        break;
      case 2:
        this.type = "SUPPORTER";
        break;
      case 3:
        this.type = "SYSTEM";
        break;
      default:
        this.type = "UNKNOWN";
    }
    this.createdAt = init.created_at;
  }
}
export {Conversation, ConversationMessage};
