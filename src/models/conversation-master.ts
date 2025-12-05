import {Conversation, ConversationMessage} from "./conversation.js";

class ConversationMaster {
  conversation?: Conversation;
  fileMaster: CMFileMaster;
  replyingTo?: ConversationMessage;
  constructor() {
    this.fileMaster = new CMFileMaster();
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
    const modoContainer = window.modoChatInstance?.().container;
    const fileUploadBtn = modoContainer?.querySelector(".mc-file-upload-btn") as HTMLButtonElement;
    const fileInput = modoContainer?.querySelector(".mc-file-input") as HTMLInputElement;
    const uploadIcon = modoContainer?.querySelector(".mc-file-upload-icon") as SVGElement;
    const removeIcon = modoContainer?.querySelector(".mc-file-remove-icon") as SVGElement;

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
export {ConversationMaster};
