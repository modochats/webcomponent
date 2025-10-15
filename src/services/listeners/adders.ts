import {sendMessage, submitPhoneNumberForm} from "./fn.js";

const registerListeners = (modoContainer: HTMLDivElement) => {
  let chatBody = modoContainer.querySelector(".mc-chat-body");
  const toggleChatBtn = modoContainer.querySelector(".mc-toggle-chat-btn") as HTMLButtonElement;
  let isBodyOpen = false;

  // Set footer link URL with origin parameter
  const footerLink = modoContainer.querySelector(".mc-footer-link") as HTMLAnchorElement;
  if (footerLink) {
    footerLink.href = `https://modochats.com?utm_source=${encodeURIComponent(window.location.origin)}`;
  }

  // toggle chat body visibility
  toggleChatBtn.addEventListener(
    "click",
    () => {
      const modoInstance = window.modoChatInstance?.();
      isBodyOpen = !isBodyOpen;
      if (isBodyOpen) modoInstance?.onOpen();
      chatBody?.classList.toggle("mc-hidden");
      toggleChatBtn.classList.toggle("mc-chat-open", isBodyOpen);
    },
    {capture: false}
  );

  registerSendMessageListener(modoContainer);
  registerPhoneNumberFormListeners(modoContainer);
  registerNewConversationListener(modoContainer);
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

export {registerListeners, registerNewConversationListener};
