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
};

const registerSendMessageListener = (modoContainer: HTMLDivElement) => {
  const chatInput = modoContainer.querySelector(".chat-input") as HTMLInputElement;
  const sendMessageBtn = modoContainer.querySelector(".send-message-btn") as HTMLButtonElement;
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const message = chatInput.value;
      sendMessage(message);
    }
  });
  sendMessageBtn.addEventListener("click", e => {
    e.preventDefault();
    console.log(e);
    const message = chatInput.value;
    sendMessage(message);
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

export {registerListeners};
