import {PhoneNumberRegex} from "#src/constants/regex.js";
import {Conversation} from "#src/models/conversation.js";
import {fetchSendMessage} from "#src/utils/fetch.js";
import {initSocket} from "../socket/socket.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasUniqueId()) {
      const modoInstance = window.modoChatInstance?.();
      try {
        const sendMsgRes = await fetchSendMessage(
          modoInstance?.publicData?.setting.chatbot as number,
          message,
          modoInstance?.userData.uniqueId as string,
          modoInstance?.conversation?.uuid
        );

        if (modoInstance) {
          if (modoInstance?.conversation?.uuid) {
            modoInstance.conversation.addMessage(sendMsgRes);
          } else {
            modoInstance.conversation = new Conversation(sendMsgRes.conversation);
            modoInstance.conversation?.addMessage(sendMsgRes);
            localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-uuid`, modoInstance.conversation?.uuid as string);
            await initSocket();
          }
        } else {
          console.error("ModoChat instance not found");
        }
      } catch {}
    } else throw new Error("message not send , user uniqueId not found");
  }
};

const checkIfUserHasUniqueId = () => {
  if (window.modoChatInstance?.().userData.uniqueId) {
    return true;
  } else switchToUniqueIdFormView();
};

const switchToUniqueIdFormView = () => {
  window.modoChatInstance?.().container?.querySelector(".form-overlay")?.classList.remove("hidden");
};
const submitUniqueIdForm = (uniqueId: string) => {
  if (PhoneNumberRegex.test(uniqueId)) {
    const modoChat = window.modoChatInstance?.();
    if (modoChat) {
      modoChat.userData.uniqueId = uniqueId;
      localStorage.setItem(`modo-chat:${modoChat.publicKey}-user-unique-id`, uniqueId);
      modoChat.container?.querySelector(".form-overlay")?.classList.add("hidden");
    } else {
      console.error("ModoChat instance not found");
    }
  } else {
    alert("Invalid phone number format.");
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
