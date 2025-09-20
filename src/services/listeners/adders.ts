import {sendMessage, submitUniqueIdForm} from "./fn.js";

const registerListeners = (modoContainer: HTMLDivElement) => {
  let chatBody = modoContainer.querySelector(".chat-body");
  const toggleChatBtn = modoContainer.querySelector(".toggle-chat-btn") as HTMLButtonElement;
  let isBodyOpen = false;

  // toggle chat body visibility
  toggleChatBtn.addEventListener(
    "click",
    () => {
      isBodyOpen = !isBodyOpen;

      chatBody?.classList.toggle("hidden");
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
  function toggleDisabled() {
    isDisabled = !isDisabled;
    chatInput.disabled = isDisabled;
    sendMessageBtn.disabled = isDisabled;
  }

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const message = chatInput.value;
      toggleDisabled();
      sendMessage(message)
        .then(() => {
          chatInput.value = "";
        })
        .finally(toggleDisabled);
    }
  });
  sendMessageBtn.addEventListener("click", e => {
    e.preventDefault();
    const message = chatInput.value;
    toggleDisabled();
    sendMessage(message)
      .then(() => {
        chatInput.value = "";
      })
      .finally(toggleDisabled);
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
  });
};

export {registerListeners, registerNewConversationListener};
