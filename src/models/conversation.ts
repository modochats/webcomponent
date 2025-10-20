import { NEW_MESSAGE_AUDIO_URL } from "#src/constants/index.js";
import {setConversationType, switchToConversationLayout, switchToStarterLayout} from "#src/services/ui/fn.js";
import {ConversationStatus, MessageType} from "#src/types/conversation.js";
import {playAudio, preloadAudio} from "#src/utils/audio.js";
import {fetchConversationMessages, fetchMarkConversationAsRead, fetchMessageFeedback, fetchReadMessage} from "#src/utils/fetch.js";
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
    this.unreadCount = init.unread_count;
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
        playAudio(NEW_MESSAGE_AUDIO_URL).catch(console.warn);
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
  hasFeedback: boolean = false;
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
      <div class="mc-message-footer">
      ${
        this.type !== "USER"
          ? `
        <div class="mc-message-feedback">
        <button class="mc-feedback-btn mc-feedback-dislike" data-message-id="${this.id}" title="مفید نبود">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 14l-.986.164A1 1 0 0 1 15 13zM4 14v1a1 1 0 0 1-1-1zm16.522-2.392l.98-.196zM6 3h11.36v2H6zm12.56 12H15v-2h3.56zm-2.573-1.164l.805 4.835L14.82 19l-.806-4.836zM14.82 21h-.214v-2h.214zm-3.543-1.781l-2.515-3.774l1.664-1.11l2.516 3.774zM7.93 15H4v-2h3.93zM3 14V6h2v8zm17.302-8.588l1.2 6l-1.96.392l-1.2-6zM8.762 15.445A1 1 0 0 0 7.93 15v-2a3 3 0 0 1 2.496 1.336zm8.03 3.226A2 2 0 0 1 14.82 21v-2zM18.56 13a1 1 0 0 0 .981-1.196l1.961-.392A3 3 0 0 1 18.561 15zm-1.2-10a3 3 0 0 1 2.942 2.412l-1.96.392A1 1 0 0 0 17.36 5zm-2.754 18a4 4 0 0 1-3.328-1.781l1.664-1.11a2 2 0 0 0 1.664.891zM6 5a1 1 0 0 0-1 1H3a3 3 0 0 1 3-3z"/><path stroke="currentColor" stroke-width="2" d="M8 14V4"/></g></svg>
          </button>
        <button class="mc-feedback-btn mc-feedback-like" data-message-id="${this.id}" title="مفید بود">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 10l-.74-.123a.75.75 0 0 0 .74.873zM4 10v-.75a.75.75 0 0 0-.75.75zm16.522 2.392l.735.147zM6 20.75h11.36v-1.5H6zm12.56-11.5H15v1.5h3.56zm-2.82.873l.806-4.835l-1.48-.247l-.806 4.836zm-.92-6.873h-.214v1.5h.213zm-3.335 1.67L8.97 8.693l1.248.832l2.515-3.773zM7.93 9.25H4v1.5h3.93zM3.25 10v8h1.5v-8zm16.807 8.54l1.2-6l-1.47-.295l-1.2 6zM8.97 8.692a1.25 1.25 0 0 1-1.04.557v1.5c.92 0 1.778-.46 2.288-1.225zm7.576-3.405A1.75 1.75 0 0 0 14.82 3.25v1.5a.25.25 0 0 1 .246.291zm2.014 5.462c.79 0 1.38.722 1.226 1.495l1.471.294A2.75 2.75 0 0 0 18.56 9.25zm-1.2 10a2.75 2.75 0 0 0 2.697-2.21l-1.47-.295a1.25 1.25 0 0 1-1.227 1.005zm-2.754-17.5a3.75 3.75 0 0 0-3.12 1.67l1.247.832a2.25 2.25 0 0 1 1.873-1.002zM6 19.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 6 20.75z"/><path stroke="currentColor" stroke-width="1.5" d="M8 10v10"/></g></svg>
        </button>
        </div>
      `
          : ""
      }
    <div class="mc-message-time">${timeString}</div>
      </div>
    `;

    this.element.className = `mc-message-wrapper ${this.type === "USER" ? "mc-message-wrapper-user" : "mc-message-wrapper-supporter"}`;
    this.containerElement?.appendChild(this.element);

    // Add feedback event listeners for non-user messages
    if (this.type !== "USER") {
      this.addFeedbackListeners();
    }
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

  addFeedbackListeners() {
    const likeBtn = this.element?.querySelector(".mc-feedback-like") as HTMLButtonElement;
    const dislikeBtn = this.element?.querySelector(".mc-feedback-dislike") as HTMLButtonElement;

    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        this.sendFeedBack(true);
      });
    }

    if (dislikeBtn) {
      dislikeBtn.addEventListener("click", () => {
        this.sendFeedBack(false);
      });
    }
  }

  sendFeedBack(liked: boolean) {
    const modoInstance = window.modoChatInstance?.();
    if (this.hasFeedback) return; // Prevent multiple feedback submissions

    this.hasFeedback = true;
    this.disableFeedbackButtons();

    fetchMessageFeedback(this.id, modoInstance?.customerData.uniqueId as string, modoInstance?.conversation?.uuid as string, liked)
      .then(() => {
        // Mark the selected button as active
        const likeBtn = this.element?.querySelector(".mc-feedback-like") as HTMLButtonElement;
        const dislikeBtn = this.element?.querySelector(".mc-feedback-dislike") as HTMLButtonElement;

        if (liked && likeBtn) {
          likeBtn.classList.add("mc-feedback-active");
        } else if (!liked && dislikeBtn) {
          dislikeBtn.classList.add("mc-feedback-active");
        }
      })
      .catch(() => {
        // Reset feedback state on error
        this.hasFeedback = false;
        this.enableFeedbackButtons();
      });
  }

  disableFeedbackButtons() {
    const likeBtn = this.element?.querySelector(".mc-feedback-like") as HTMLButtonElement;
    const dislikeBtn = this.element?.querySelector(".mc-feedback-dislike") as HTMLButtonElement;

    if (likeBtn) {
      likeBtn.disabled = true;
      likeBtn.classList.add("mc-feedback-disabled");
    }

    if (dislikeBtn) {
      dislikeBtn.disabled = true;
      dislikeBtn.classList.add("mc-feedback-disabled");
    }
  }

  enableFeedbackButtons() {
    const likeBtn = this.element?.querySelector(".mc-feedback-like") as HTMLButtonElement;
    const dislikeBtn = this.element?.querySelector(".mc-feedback-dislike") as HTMLButtonElement;

    if (likeBtn) {
      likeBtn.disabled = false;
      likeBtn.classList.remove("mc-feedback-disabled");
    }

    if (dislikeBtn) {
      dislikeBtn.disabled = false;
      dislikeBtn.classList.remove("mc-feedback-disabled");
    }
  }
}
export {Conversation, ConversationMessage};
