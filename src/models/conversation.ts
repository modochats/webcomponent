import {setConversationType, switchToConversationLayout, switchToStarterLayout} from "#src/services/ui/fn.js";
import {ConversationStatus, MessageType} from "#src/types/conversation.js";
import {playAudio, preloadAudio} from "#src/utils/audio.js";
import {fetchConversationMessages, fetchMarkConversationAsRead, fetchReadMessage} from "#src/utils/fetch.js";
import {marked} from "marked";

class Conversation {
  id: number;
  uuid: string;
  chatbot: number;
  unreadCount: number;
  messages: ConversationMessage[] = [];
  status?: keyof typeof ConversationStatus;
  uniqueId?: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadCount = init.unread_messages_count;
    this.uniqueId = init.unique_id;
    this.setStatus(init.status);
    this.onInit();
  }
  addMessage(init: Record<string, any>, options?: {incoming: boolean}) {
    const modoInstance = window.modoChatInstance?.();
    const message = new ConversationMessage(init);
    message.initElement();
    this.messages.push(message);
    if (options?.incoming) {
      this.unreadCount++;
      if (modoInstance?.isOpen) this.markAsRead();
      else {
        this.addBadge();
        message.showTooltip();
        playAudio("./audio/new-message.mp3").catch(console.warn);
      }
    }
    this.scrollToBottom();
  }

  addSystemMessage(message: string) {
    const chatMessagesContainer = document.querySelector(".mc-chat-messages-con");
    if (chatMessagesContainer) {
      const systemMessageElement = document.createElement("div");
      systemMessageElement.className = "mc-system-message";
      systemMessageElement.innerHTML = `
        <div class="mc-system-message-content">
          ${message}
        </div>
      `;
      chatMessagesContainer.appendChild(systemMessageElement);
      this.scrollToBottom();
    }
  }
  scrollToBottom() {
    const chatMessagesContainer = document.querySelector(".mc-chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }

  clear() {
    this.messages = [];
    const modoInstance = window.modoChatInstance?.();
    localStorage.removeItem(`modo-chat:${modoInstance?.publicKey}-conversation-uuid`);
    const chatMessagesContainer = document.querySelector(".mc-chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.innerHTML = "";
    }
    switchToStarterLayout();
  }
  onInit() {
    switchToConversationLayout();
    preloadAudio("./audio/new-message.mp3").catch(console.warn);
    if (this.status) setConversationType(this.status);
  }
  setStatus(status: string) {
    switch (status) {
      case "ai_chat":
        this.status = "AI_CHAT";
        setConversationType("AI_CHAT");
        break;
      case "supporter_chat":
        this.status = "SUPPORTER_CHAT";
        setConversationType("SUPPORTER_CHAT");
        break;
      case "resolved":
        this.status = "RESOLVED";
        break;
      default:
        this.status = "UNKNOWN";
    }
  }
  async loadMessages() {
    const modoInstance = window.modoChatInstance?.();
    const res = await fetchConversationMessages(this.uuid, modoInstance?.publicKey as string);
    this.messages = [];
    const chatMessagesContainer = modoInstance?.container?.querySelector(".mc-chat-messages-con");
    if (chatMessagesContainer) chatMessagesContainer.innerHTML = "";
    for (const message of res.results) this.addMessage(message);
  }

  addBadge() {
    const modoInstance = window.modoChatInstance?.();
    if (!modoInstance?.isOpen && this.unreadCount > 0 && modoInstance) {
      const badge = modoInstance.container?.querySelector(".mc-badge");
      const badgeText = modoInstance.container?.querySelector(".mc-badge-text");

      if (badge && badgeText) {
        // Show the badge
        badge.classList.remove("mc-hidden");

        // Update badge text
        const displayCount = this.unreadCount > 99 ? "99+" : this.unreadCount.toString();
        badgeText.textContent = displayCount;

        // Add plus class for 99+ counts
        if (this.unreadCount > 99) {
          badge.classList.add("mc-badge-plus");
        } else {
          badge.classList.remove("mc-badge-plus");
        }
      }
    }
  }

  hideBadge() {
    const modoInstance = window.modoChatInstance?.();
    const badge = modoInstance?.container?.querySelector(".mc-badge");
    if (badge) {
      badge.classList.add("mc-hidden");
    }
  }

  hideTooltip() {
    const modoInstance = window.modoChatInstance?.();
    const tooltip = modoInstance?.container?.querySelector(".mc-toggle-tooltip");
    if (tooltip) {
      tooltip.classList.add("mc-hidden");
    }
  }

  markAsRead() {
    const modoInstance = window.modoChatInstance?.();
    fetchMarkConversationAsRead(this.uuid, modoInstance?.customerData.uniqueId as string).then(() => {
      this.unreadCount = 0;
      this.hideBadge();
    });
  }
}
class ConversationMessage {
  id: number;
  content: string;
  type: keyof typeof MessageType;
  createdAt: string;
  isRead: boolean = false;
  element?: HTMLDivElement;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.content = init.content;
    this.isRead = init.is_read || false;
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

  fetchRead() {
    if (this.isRead === false && this.type !== "USER") {
      this.isRead = true;
      fetchReadMessage(this.id);
    }
  }
  get containerElement(): HTMLDivElement | null {
    return document.querySelector(".mc-chat-messages-con");
  }

  initElement() {
    this.element = document.createElement("div");

    // Format time from createdAt
    const messageTime = new Date(this.createdAt);
    const timeString = messageTime.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    this.element.innerHTML = `
      <div class="mc-chat-message ${this.type === "USER" ? "mc-chat-message-user" : "mc-chat-message-supporter"}">
        <div class="mc-message-content">${marked.parse(this.content) as string}</div>
      </div>
      <div class="mc-message-time">${timeString}</div>
    `;

    this.element.className = `mc-message-wrapper ${this.type === "USER" ? "mc-message-wrapper-user" : "mc-message-wrapper-supporter"}`;
    this.containerElement?.appendChild(this.element);
  }
  showTooltip() {
    const modoInstance = window.modoChatInstance?.();
    const tooltip = modoInstance?.container?.querySelector(".mc-toggle-tooltip");
    const tooltipText = modoInstance?.container?.querySelector(".mc-toggle-tooltip-text");
    console.log(tooltip, tooltipText);
    if (tooltip && tooltipText) {
      // Show the tooltip
      tooltip.classList.remove("mc-hidden");

      // Update tooltip text with message preview
      const preview = this.content.length > 50 ? this.content.substring(0, 50) + "..." : this.content;
      tooltipText.textContent = preview;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        tooltip.classList.add("mc-hidden");
      }, 3000);
    }
  }
}
export {Conversation, ConversationMessage};
