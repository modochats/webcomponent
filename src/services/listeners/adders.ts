import {sendMessage, submitPhoneNumberForm} from "./fn.js";

const registerListeners = (modoContainer: HTMLDivElement) => {
  let chatBody = modoContainer.querySelector(".mc-chat-body");
  const toggleChatBtn = modoContainer.querySelector(".mc-toggle-chat-btn") as HTMLButtonElement;
  let isBodyOpen = false;

  // Set footer link URL with origin parameter and version title
  const footerLink = modoContainer.querySelector(".mc-footer-link") as HTMLAnchorElement;
  if (footerLink) {
    const modoInstance = window.modoChatInstance?.();
    footerLink.href = `https://modochats.com?utm_source=${encodeURIComponent(window.location.origin)}`;
    footerLink.title = `مودوچت v${modoInstance?.version || "0.1"}`;
  }

  // toggle chat body visibility (only if not in fullscreen mode)
  if (toggleChatBtn) {
    toggleChatBtn.addEventListener(
      "click",
      () => {
        const modoInstance = window.modoChatInstance?.();
        isBodyOpen = !isBodyOpen;
        if (isBodyOpen) modoInstance?.onOpen();
        else modoInstance?.onClose();
        chatBody?.classList.toggle("mc-hidden");
        toggleChatBtn.classList.toggle("mc-chat-open", isBodyOpen);
      },
      {capture: false}
    );
  }

  registerSendMessageListener(modoContainer);
  registerPhoneNumberFormListeners(modoContainer);
  registerNewConversationListener(modoContainer);
  registerFileUploadListener(modoContainer);
};

const registerSendMessageListener = (modoContainer: HTMLDivElement) => {
  const chatInput = modoContainer.querySelector(".mc-chat-input") as HTMLInputElement;
  const sendMessageBtn = modoContainer.querySelector(".mc-send-message-btn") as HTMLButtonElement;

  let isDisabled = false;
  function toggleLoading() {
    isDisabled = !isDisabled;
    chatInput.disabled = isDisabled;
    sendMessageBtn.disabled = isDisabled;
    sendMessageBtn.setAttribute("data-is-loading", String(isDisabled));
  }

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const message = chatInput.value;
      toggleLoading();
      sendMessage(message)
        .then(() => {
          chatInput.value = "";
        })
        .finally(toggleLoading);
    }
  });
  sendMessageBtn.addEventListener("click", e => {
    e.preventDefault();
    const message = chatInput.value;
    toggleLoading();
    sendMessage(message)
      .then(() => {
        chatInput.value = "";
      })
      .finally(toggleLoading);
  });
};

const registerPhoneNumberFormListeners = (modoContainer: HTMLDivElement) => {
  const formOverlay = modoContainer.querySelector(".mc-form-overlay") as HTMLDivElement;
  const phoneInput = modoContainer.querySelector(".mc-phone-input") as HTMLInputElement;
  const formSubmitBtn = modoContainer.querySelector(".mc-form-submit-btn") as HTMLButtonElement;
  const formCancelBtn = modoContainer.querySelector(".mc-form-cancel-btn") as HTMLButtonElement;
  formSubmitBtn.addEventListener("click", () => {
    const phoneNumber = phoneInput.value;
    submitPhoneNumberForm(phoneNumber);
  });
  formCancelBtn.addEventListener("click", () => {
    formOverlay.classList.add("mc-hidden");
  });
};

const registerNewConversationListener = (modoContainer: HTMLDivElement) => {
  const newBtn = modoContainer.querySelector(".mc-new-conversation-btn") as HTMLButtonElement;

  newBtn.addEventListener("click", () => {
    const modoInstance = window.modoChatInstance?.();
    modoInstance?.conversation?.clear();
    modoInstance?.socket?.close();
    if (modoInstance) {
      modoInstance.conversation = undefined;
      modoInstance.socket = undefined;
    }
  });
};

const registerFileUploadListener = (modoContainer: HTMLDivElement) => {
  const fileUploadBtn = modoContainer.querySelector(".mc-file-upload-btn") as HTMLButtonElement;
  const fileInput = modoContainer.querySelector(".mc-file-input") as HTMLInputElement;
  const uploadIcon = modoContainer.querySelector(".mc-file-upload-icon") as SVGElement;
  const removeIcon = modoContainer.querySelector(".mc-file-remove-icon") as SVGElement;
  const fileName = modoContainer.querySelector(".mc-file-name") as HTMLElement;
  const sendMessageBtn = modoContainer.querySelector(".mc-send-message-btn") as HTMLButtonElement;

  // Store the selected file
  let selectedFile: File | null = null;

  // Trigger file input when button is clicked
  fileUploadBtn.addEventListener("click", () => {
    if (selectedFile) {
      // If a file is selected, remove it
      selectedFile = null;
      fileInput.value = "";
      uploadIcon.classList.remove("mc-hidden");
      removeIcon.classList.add("mc-hidden");
      fileName.classList.add("mc-hidden");
      fileName.textContent = "";
    } else {
      // Otherwise, open file picker
      fileInput.click();
    }
  });

  // Handle file selection
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      selectedFile = fileInput.files[0];
      const name = selectedFile.name;
      const truncatedName = name.length > 12 ? name.substring(0, 9) + "..." : name;

      fileName.textContent = truncatedName;
      fileName.title = name; // Full name on hover
      uploadIcon.classList.add("mc-hidden");
      removeIcon.classList.remove("mc-hidden");
      fileName.classList.remove("mc-hidden");
      fileUploadBtn.classList.add("mc-file-uploaded");
    }
  });

  // Attach file to message when sending
  const originalSendMessage = sendMessageBtn.onclick;
  sendMessageBtn.addEventListener("click", () => {
    if (selectedFile) {
      // Store file globally so sendMessage function can access it
      (window as any).modoChatSelectedFile = selectedFile;
      selectedFile = null;
      fileInput.value = "";
      uploadIcon.classList.remove("mc-hidden");
      removeIcon.classList.add("mc-hidden");
      fileName.classList.add("mc-hidden");
      fileName.textContent = "";
      fileUploadBtn.classList.remove("mc-file-uploaded");
    }
  });
};

export {registerListeners, registerNewConversationListener};
