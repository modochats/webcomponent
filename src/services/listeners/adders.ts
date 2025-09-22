import {sendMessage, submitUniqueIdForm} from "./fn.js";

const registerListeners = (modoContainer: HTMLDivElement) => {
  let chatBody = modoContainer.querySelector(".chat-body");
  const toggleChatBtn = modoContainer.querySelector(".toggle-chat-btn") as HTMLButtonElement;
  let isBodyOpen = false;

  // Set footer link URL with origin parameter
  const footerLink = modoContainer.querySelector(".footer-link") as HTMLAnchorElement;
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
      chatBody?.classList.toggle("hidden");
      toggleChatBtn.classList.toggle("chat-open", isBodyOpen);
    },
    {capture: false}
  );

  registerSendMessageListener(modoContainer);
  registerUniqueIdFormListeners(modoContainer);
  registerNewConversationListener(modoContainer);
};

const registerSendMessageListener = (modoContainer: HTMLDivElement) => {
  const chatInput = modoContainer.querySelector(".chat-input") as HTMLInputElement;
  const sendMessageBtn = modoContainer.querySelector(".send-message-btn") as HTMLButtonElement;

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

const registerUniqueIdFormListeners = (modoContainer: HTMLDivElement) => {
  const formOverlay = modoContainer.querySelector(".form-overlay") as HTMLDivElement;
  const phoneInput = modoContainer.querySelector(".phone-input") as HTMLInputElement;
  const formSubmitBtn = modoContainer.querySelector(".form-submit-btn") as HTMLButtonElement;
  const formCancelBtn = modoContainer.querySelector(".form-cancel-btn") as HTMLButtonElement;
  formSubmitBtn.addEventListener("click", () => {
    const uniqueId = phoneInput.value;
    submitUniqueIdForm(uniqueId);
  });
  formCancelBtn.addEventListener("click", () => {
    formOverlay.classList.add("hidden");
  });
};

const registerNewConversationListener = (modoContainer: HTMLDivElement) => {
  const newBtn = modoContainer.querySelector(".new-conversation-btn") as HTMLButtonElement;

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

const applyTheme = (theme: string) => {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
};

const updateThemeButton = (button: HTMLButtonElement, theme: string) => {
  button.textContent = theme === "dark" ? "☀️" : "🌙";
  button.title = theme === "dark" ? "تغییر به تم روشن" : "تغییر به تم تاریک";
};

export {registerListeners, registerNewConversationListener};
