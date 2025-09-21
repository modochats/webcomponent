import {switchToConversationLayout, switchToStarterLayout} from "#src/services/ui/fn.js";

class Conversation {
  id: number;
  uuid: string;
  chatbot: number;
  unreadMessageCount: number;
  messages: ConversationMessage[] = [];
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadMessageCount = init.unread_messages_count;
    this.onInit();
  }
  addMessage(init: Record<string, any>) {
    this.messages.push(new ConversationMessage(init));
    const chatMessagesContainer = document.querySelector(".chat-messages-con");
    if (chatMessagesContainer) {
      const messageElement = document.createElement("div");
      const latestMessage = this.messages[this.messages.length - 1];
      messageElement.textContent = init.content;

      messageElement.className = `chat-message ${latestMessage.type === "USER" ? "chat-message-user" : "chat-message-supporter"}`;
      chatMessagesContainer.appendChild(messageElement);

      // Scroll to bottom of the container
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
}
class ConversationMessage {
  id: number;
  content: string;
  type: "USER" | "SUPPORTER";
  createdAt: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.content = init.content;
    if (init.message_type === 0) this.type = "USER";
    else this.type = "SUPPORTER";
    this.createdAt = init.created_at;
  }
}
export {Conversation, ConversationMessage};
