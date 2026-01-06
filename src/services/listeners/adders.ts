import {getMessageElement} from "#src/models/message-utils.js";
import {sendMessage, submitPhoneNumberForm} from "./fn.js";

const registerListeners = (widgetContainer: HTMLDivElement) => {
  let chatBody = widgetContainer.querySelector(".mw-chat-body");
  const toggleChatBtn = widgetContainer.querySelector(".mw-toggle-chat-btn") as HTMLButtonElement;
  let isBodyOpen = false;

  // Set footer link URL with origin parameter and version title
  const footerLink = widgetContainer.querySelector(".mw-footer-link") as HTMLAnchorElement;
  if (footerLink) {
    const widget = window.getMWidget?.();
    footerLink.href = `https://modochats.com?utm_source=${encodeURIComponent(window.location.origin)}`;
    footerLink.title = `مودوچت v${widget?.version || "0.1"}`;
  }

  // toggle chat body visibility (only if not in fullscreen mode)
  if (toggleChatBtn) {
    toggleChatBtn.addEventListener(
      "click",
      () => {
        const widget = window.getMWidget?.();
        isBodyOpen = !isBodyOpen;
        if (isBodyOpen) widget?.onOpen();
        else widget?.onClose();
        chatBody?.classList.toggle("mw-hidden");
        toggleChatBtn.classList.toggle("mw-chat-open", isBodyOpen);
      },
      {capture: false}
    );
  }

  registerSendMessageListener(widgetContainer);
  registerPhoneNumberFormListeners(widgetContainer);
  registerNewConversationListener(widgetContainer);
  registerFileUploadListener(widgetContainer);
  registerReplyPreviewListener(widgetContainer);
  registerTooltipCloseListener(widgetContainer);
};

const registerSendMessageListener = (widgetContainer: HTMLDivElement) => {
  const chatInput = widgetContainer.querySelector(".mw-chat-input") as HTMLInputElement;
  const sendMessageBtn = widgetContainer.querySelector(".mw-send-message-btn") as HTMLButtonElement;

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

const registerPhoneNumberFormListeners = (widgetContainer: HTMLDivElement) => {
  const formOverlay = widgetContainer.querySelector(".mw-form-overlay") as HTMLDivElement;
  const phoneInput = widgetContainer.querySelector(".mw-phone-input") as HTMLInputElement;
  const formSubmitBtn = widgetContainer.querySelector(".mw-form-submit-btn") as HTMLButtonElement;
  const formCancelBtn = widgetContainer.querySelector(".mw-form-cancel-btn") as HTMLButtonElement;
  formSubmitBtn.addEventListener("click", () => {
    const phoneNumber = phoneInput.value;
    submitPhoneNumberForm(phoneNumber);
  });
  formCancelBtn.addEventListener("click", () => {
    formOverlay.classList.add("mw-hidden");
  });
};

const registerNewConversationListener = (widgetContainer: HTMLDivElement) => {
  const newBtn = widgetContainer.querySelector(".mw-new-conversation-btn") as HTMLButtonElement;

  newBtn.addEventListener("click", () => {
    const widget = window.getMWidget?.();
    widget?.conversation?.clear();
    if (widget) {
      widget.chat.instance!.chat.conversation = undefined;
      widget.chat.instance?.socket.close();
    }
  });
};

const registerFileUploadListener = (widgetContainer: HTMLDivElement) => {
  const fileUploadBtn = widgetContainer.querySelector(".mw-file-upload-btn") as HTMLButtonElement;
  const fileInput = widgetContainer.querySelector(".mw-file-input") as HTMLInputElement;
  const widget = window?.getMWidget?.();

  // Trigger file input when button is clicked
  fileUploadBtn.addEventListener("click", () => {
    if (widget?.chat.fileMaster.file) {
      // If a file is selected, remove it
      widget?.chat.fileMaster.clearFile();
    } else {
      // Otherwise, open file picker
      fileInput.click();
    }
  });

  // Handle file selection
  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      widget?.chat.fileMaster.setFile(fileInput.files[0]);
    }
  });
};

const registerReplyPreviewListener = (widgetContainer: HTMLDivElement) => {
  const replyPreview = widgetContainer.querySelector(".mw-reply-preview") as HTMLDivElement;
  const replyPreviewClose = widgetContainer.querySelector(".mw-reply-preview-close") as HTMLButtonElement;
  const replyPreviewInfo = widgetContainer.querySelector(".mw-reply-preview-info") as HTMLDivElement;

  if (!replyPreview || !replyPreviewClose || !replyPreviewInfo) return;

  // Close button - clear reply
  replyPreviewClose.addEventListener("click", e => {
    e.stopPropagation();
    const widget = window.getMWidget?.();
    if (widget?.chat) {
      widget.chat.replyMaster.clearReply();
    }
  });

  // Click on preview info - scroll to message
  replyPreviewInfo.addEventListener("click", () => {
    const widget = window.getMWidget?.();
    const replyingToEl = getMessageElement(widget?.chat.replyMaster.replyingTo! || {});

    if (replyingToEl) {
      // Scroll to the message
      const messagesContainer = widgetContainer.querySelector(".mw-chat-messages-con") as HTMLDivElement;
      if (messagesContainer) {
        replyingToEl.scrollIntoView({behavior: "smooth", block: "center"});

        // Add a highlight effect
        replyingToEl.classList.add("mw-message-highlight");
        setTimeout(() => {
          replyingToEl?.classList.remove("mw-message-highlight");
        }, 2000);
      }
    }
  });
};

const registerTooltipCloseListener = (widgetContainer: HTMLDivElement) => {
  const widget = window.getMWidget?.();
  const tooltipCloseBtn = widgetContainer.querySelector(".mw-toggle-tooltip-close") as HTMLButtonElement;
  const tooltip = widgetContainer.querySelector(".mw-toggle-tooltip") as HTMLDivElement;
  if (tooltipCloseBtn) {
    tooltipCloseBtn.addEventListener("click", e => {
      localStorage.setItem(`modochats:${widget?.publicKey}-has-seen-greeting-message`, "true");
      e.stopPropagation();
      if (tooltip) {
        tooltip.classList.add("mw-hidden");
      }
    });
  }
};

export {registerListeners, registerNewConversationListener};
