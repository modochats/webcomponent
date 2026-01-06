import {NEW_MESSAGE_AUDIO_URL} from "#src/constants/index.js";
import {setConversationType, switchToConversationLayout, switchToStarterLayout} from "#src/services/ui/fn.js";
import {playAudio, preloadAudio} from "#src/utils/audio.js";
import {initMessageElement, showMessageTooltip} from "./message-utils.js";
import {ConversationMessage} from "@modochats/chat-client";

class Conversation {
  constructor() {
    this.setStatus();
    this.onInit();
  }
  // d = data
  get d() {
    return window.getMWidget?.().chat.instance?.conversation;
  }
  addMessage(message: ConversationMessage, options?: {incoming: boolean}) {
    const widget = window.getMWidget?.();
    initMessageElement(message);
    if (options?.incoming) {
      this.d!.unreadCount++;
      if (widget?.isOpen) this.markAsRead();
      else {
        this.addBadge();
        showMessageTooltip(message);
        playAudio(NEW_MESSAGE_AUDIO_URL).catch(console.warn);
      }
    }
    this.scrollToBottom();
  }

  addSystemMessage(message: string) {
    const chatMessagesContainer = document.querySelector(".mw-chat-messages-con");
    if (chatMessagesContainer) {
      const systemMessageElement = document.createElement("div");
      systemMessageElement.className = "mw-system-message";
      systemMessageElement.innerHTML = `
        <div class="mw-system-message-content">
          ${message}
        </div>
      `;
      chatMessagesContainer.appendChild(systemMessageElement);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const chatMessagesContainer = document.querySelector(".mw-chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }

  clear() {
    this.d?.clear();
    this.d!.messages = [];
    const widget = window.getMWidget?.();
    localStorage.removeItem(`modo-chat:${widget?.publicKey}-conversation-uuid`);
    const chatMessagesContainer = document.querySelector(".mw-chat-messages-con");
    if (chatMessagesContainer) {
      chatMessagesContainer.innerHTML = "";
    }
    switchToStarterLayout();
  }

  onInit() {
    switchToConversationLayout();
    preloadAudio("./audio/new-message.mp3").catch(console.warn);
    if (this?.d?.status) setConversationType(this.d?.status!);
  }

  setStatus() {
    setConversationType(this.d?.status!);
  }

  async loadMessages() {
    const widget = window.getMWidget?.();
    const messages = await this.d?.loadMessages();
    const chatMessagesContainer = widget?.container?.querySelector(".mw-chat-messages-con");
    if (chatMessagesContainer) chatMessagesContainer.innerHTML = "";
    for (const message of messages || []) this.addMessage(message);
  }

  addBadge() {
    const widget = window.getMWidget?.();
    if (!widget?.isOpen && this.unreadCount > 0 && widget) {
      const badge = widget.container?.querySelector(".mw-badge");
      const badgeText = widget.container?.querySelector(".mw-badge-text");

      if (badge && badgeText) {
        // Show the badge
        badge.classList.remove("mw-hidden");

        // Update badge text
        const displayCount = this.unreadCount > 99 ? "99+" : this.unreadCount.toString();
        badgeText.textContent = displayCount;

        // Add plus class for 99+ counts
        if (this.unreadCount > 99) {
          badge.classList.add("mw-badge-plus");
        } else {
          badge.classList.remove("mw-badge-plus");
        }
      }
    }
  }

  get unreadCount() {
    return this.d?.unreadCount || 0;
  }

  hideBadge() {
    const widget = window.getMWidget?.();
    const badge = widget?.container?.querySelector(".mw-badge");
    if (badge) {
      badge.classList.add("mw-hidden");
    }
  }

  hideTooltip() {
    const widget = window.getMWidget?.();
    const tooltip = widget?.container?.querySelector(".mw-toggle-tooltip");
    if (tooltip) {
      tooltip.classList.add("mw-hidden");
    }
  }

  async markAsRead() {
    const widget = window.getMWidget?.();
    await this.d?.markAsRead();
    this.hideBadge();
  }

  get containerElement(): HTMLDivElement | null {
    return document.querySelector(".mw-chat-messages-con");
  }
}
export {Conversation};
