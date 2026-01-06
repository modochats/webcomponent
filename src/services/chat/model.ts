import {Conversation} from "#src/models/conversation.js";
import {ChatClient, ConversationMessage, EventType} from "@modochats/chat-client";
import {onSocketConnectionUpdate} from "../socket/utils.js";

class Chat {
  instance?: ChatClient;
  fileMaster: CFileMaster;
  replyMaster: CReplyMaster;
  conversation: Conversation;
  constructor() {
    this.fileMaster = new CFileMaster();
    this.replyMaster = new CReplyMaster();
    this.conversation = new Conversation();
  }
  initInstance() {
    const widget = window.getMWidget?.();
    const savedUUid = localStorage.getItem(`widget-chat:${widget?.chatbot?.uuid}-conversation-uuid`);

    this.instance = new ChatClient({
      chatbotUuid: widget?.chatbot?.uuid as string,
      userUniqueId: widget?.customerData.uniqueId as string,
      conversationUUid: savedUUid
    });
    this.instance.on(EventType.CONVERSATION_SYSTEM_MESSAGE, ev => {
      this.conversation.addSystemMessage(ev.message);
    });
    this.instance.on(EventType.CONVERSATION_MESSAGE, ev => {
      this.conversation.addMessage(ev.message, {incoming: ev.incoming});
    });
    this.instance.on(EventType.SOCKET_CONNECTED, ev => {
      onSocketConnectionUpdate(true);
    });
    this.instance.on(EventType.SOCKET_DISCONNECTED, ev => {
      onSocketConnectionUpdate(false);
    });
    this.instance.on(EventType.CONVERSATION_LOAD, ev => {
      localStorage.setItem(`modo-chat:${widget?.chatbot?.uuid}-conversation-uuid`, this.instance?.conversation?.uuid as string);
    });
  }
}
class CFileMaster {
  file?: File;

  clearFile() {
    this.file = undefined;
    this.toggleUiState();
  }
  setFile(file: File) {
    this.file = file;
    this.toggleUiState();
  }
  toggleUiState() {
    const container = window.getMWidget?.().container;
    const fileUploadBtn = container?.querySelector(".mw-file-upload-btn") as HTMLButtonElement;
    const fileInput = container?.querySelector(".mw-file-input") as HTMLInputElement;
    const uploadIcon = container?.querySelector(".mw-file-upload-icon") as SVGElement;
    const removeIcon = container?.querySelector(".mw-file-remove-icon") as SVGElement;

    if (this.file) {
      uploadIcon.classList.add("mw-hidden");
      removeIcon.classList.remove("mw-hidden");
      fileUploadBtn.classList.add("mw-file-uploaded");
    } else {
      fileInput.value = "";
      uploadIcon.classList.remove("mw-hidden");
      removeIcon.classList.add("mw-hidden");
      fileUploadBtn.classList.remove("mw-file-uploaded");
    }
  }
}

class CReplyMaster {
  get instance() {
    return window.getMWidget?.().chat.instance;
  }
  get replyingTo() {
    return this.instance!.chat!.replyingTo;
  }
  setReply(message: ConversationMessage) {
    this.instance!.chat!.replyMaster.setReply(message);
    this.updateReplyUI();
  }

  clearReply() {
    this.instance!.chat!.replyMaster.clearReply();

    this.updateReplyUI();
  }

  private updateReplyUI() {
    const container = window.getMWidget?.().container;
    const replyPreview = container?.querySelector(".mw-reply-preview") as HTMLDivElement;
    const replyText = container?.querySelector(".mw-reply-preview-text") as HTMLElement;
    const chatMessagesContainer = container?.querySelector(".mw-chat-messages-con") as HTMLDivElement;

    if (this.replyingTo) {
      // Show reply preview
      if (replyPreview && replyText) {
        // Truncate content to 50 chars
        const content = this.replyingTo.content.length > 50 ? this.replyingTo.content.substring(0, 50) + "..." : this.replyingTo.content;
        replyText.textContent = content;
        replyPreview.classList.remove("mw-hidden");

        // Add reply active class to messages container
        if (chatMessagesContainer) {
          chatMessagesContainer.classList.add("mw-reply-active");
        }
      }
    } else {
      // Hide reply preview
      if (replyPreview) {
        replyPreview.classList.add("mw-hidden");

        // Remove reply active class from messages container
        if (chatMessagesContainer) {
          chatMessagesContainer.classList.remove("mw-reply-active");
        }
      }
    }
  }
}
export {Chat};
