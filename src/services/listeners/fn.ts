import {ModoChat} from "#src/app.js";
import {PhoneNumberRegex} from "#src/constants/regex.js";
import {Conversation} from "#src/models/modo-conversation.js";
import {fetchGetAccessTokenForSocket, fetchSendMessage} from "#src/utils/fetch.js";
import {initSocket} from "../socket/fn.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasUniqueId()) {
      const modoInstance = window.modoChatInstance?.();
      console.log(modoInstance);
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
            modoInstance.conversation.addMessage(sendMsgRes);
            localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-uuid`, modoInstance.conversation.uuid);
            try {
              const accessTokenRes = await fetchGetAccessTokenForSocket(
                modoInstance.publicData?.setting.uuid as string,
                modoInstance.conversation.uuid,
                modoInstance.userData.uniqueId as string
              );
              localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-access-token`, accessTokenRes.access_token);
              initSocket();
            } catch (err) {
              console.error("failed to get access token");
            }
          }
        } else {
          console.error("ModoChat instance not found");
        }
      } catch {}
    }
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
export {sendMessage, submitUniqueIdForm};
