import {PhoneNumberRegex} from "#src/constants/regex.js";
import {Conversation} from "#src/models/conversation.js";
import {fetchSendMessage} from "#src/utils/fetch.js";
import {initSocket} from "../socket/socket.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasUniqueId()) {
      const modoInstance = window.modoChatInstance?.();
      try {
        if (modoInstance) {
          if (modoInstance?.conversation?.uuid) {
            modoInstance.conversation.addMessage({id: "temp", content: message, message_type: 0, created_at: new Date().toISOString()});
            const chatInput = modoInstance.container?.querySelector(".mc-chat-input") as HTMLInputElement;
            if (chatInput) chatInput.value = "";
          }

          const sendMsgRes = await fetchSendMessage(
            modoInstance?.publicData?.setting.chatbot as number,
            message,
            modoInstance?.userData.uniqueId as string,
            modoInstance?.conversation?.uuid
          );

          if (!modoInstance?.conversation?.uuid) {
            modoInstance.conversation = new Conversation(sendMsgRes.conversation);
            modoInstance.conversation?.addMessage(sendMsgRes);
            localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-uuid`, modoInstance.conversation?.uuid as string);
            await initSocket();
            if (modoInstance.conversation.status === "AI_CHAT") await modoInstance.conversation.loadMessages();
          }
        } else {
          console.error("ModoChat instance not found");
        }
      } catch {}
    } else throw new Error("message not send , user uniqueId not found");
  }
};

const checkIfUserHasUniqueId = () => {
  const modoInstance = window.modoChatInstance?.();
  if (modoInstance?.userData.uniqueId) {
    return true;
  } else if (modoInstance?.conversation?.uniqueId) {
    modoInstance.userData.uniqueId = modoInstance.conversation.uniqueId;
    return true;
  } else switchToUniqueIdFormView();
};

const switchToUniqueIdFormView = () => {
  const formOverlay = window.modoChatInstance?.().container?.querySelector(".mc-form-overlay");
  if (formOverlay) {
    formOverlay.classList.remove("mc-hidden");
    formOverlay.classList.add("mc-active");
  }
};
const submitUniqueIdForm = (uniqueId: string) => {
  if (PhoneNumberRegex.test(uniqueId)) {
    const modoChat = window.modoChatInstance?.();
    if (modoChat) {
      modoChat.userData.uniqueId = uniqueId;
      localStorage.setItem(`modo-chat:${modoChat.publicKey}-user-unique-id`, uniqueId);
      const formOverlay = modoChat.container?.querySelector(".mc-form-overlay");
      if (formOverlay) {
        formOverlay.classList.remove("mc-active");
        formOverlay.classList.add("mc-hidden");
      }

      (modoChat.container?.querySelector(".mc-send-message-btn") as HTMLButtonElement)?.click();
    } else {
      console.error("ModoChat instance not found");
    }
  } else {
    alert("لطفا شماره تلفن خود را وارد کنید.");
  }
};

const clearConversation = () => {
  const modoInstance = window.modoChatInstance?.();
  if (modoInstance) {
    modoInstance.conversation = undefined;
    modoInstance.socket?.close();
    modoInstance.socket = undefined;

    localStorage.removeItem(`modo-chat:${modoInstance.publicKey}-conversation-uuid`);
  }
};

export {sendMessage, submitUniqueIdForm, clearConversation};
