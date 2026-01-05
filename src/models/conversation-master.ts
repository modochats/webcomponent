import {Conversation, ConversationMessage} from "./conversation.js";

class ConversationMaster {
  conversation?: Conversation;
  fileMaster: CMFileMaster;
  replyMaster: CMReplyMaster;
  constructor() {
    this.fileMaster = new CMFileMaster();
    this.replyMaster = new CMReplyMaster();
  }
  get replyingTo() {
    return this.replyMaster.replyingTo;
  }
}
class CMFileMaster {
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
      uploadIcon.classList.add("mc-hidden");
      removeIcon.classList.remove("mc-hidden");
      fileUploadBtn.classList.add("mc-file-uploaded");
    } else {
      fileInput.value = "";
      uploadIcon.classList.remove("mc-hidden");
      removeIcon.classList.add("mc-hidden");
      fileUploadBtn.classList.remove("mc-file-uploaded");
    }
  }
}

class CMReplyMaster {
  replyingTo?: ConversationMessage;

  setReply(message: ConversationMessage) {
    this.replyingTo = message;
    this.updateReplyUI();
  }

  clearReply() {
    this.replyingTo = undefined;
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
        replyPreview.classList.remove("mc-hidden");

        // Add reply active class to messages container
        if (chatMessagesContainer) {
          chatMessagesContainer.classList.add("mc-reply-active");
        }
      }
    } else {
      // Hide reply preview
      if (replyPreview) {
        replyPreview.classList.add("mc-hidden");

        // Remove reply active class from messages container
        if (chatMessagesContainer) {
          chatMessagesContainer.classList.remove("mc-reply-active");
        }
      }
    }
  }
}
export {ConversationMaster};
