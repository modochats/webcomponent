import {PhoneNumberRegex} from "#src/constants/regex.js";
import {Conversation} from "#src/models/conversation.js";
import {CustomerData} from "#src/models/customer-data.js";
import {fetchSendMessage} from "#src/utils/fetch.js";
import {initSocket} from "../socket/socket.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasPhoneNumber()) {
      const modoInstance = window.modoChatInstance?.();
      if (modoInstance) {
        if (modoInstance?.conversation?.uuid) {
          modoInstance.conversation.addMessage({id: "temp", content: message, message_type: 0, created_at: new Date().toISOString()});
          const chatInput = modoInstance.container?.querySelector(".mc-chat-input") as HTMLInputElement;
          if (chatInput) chatInput.value = "";
        }

        const sendMsgRes = await fetchSendMessage(
          modoInstance?.publicData?.setting.chatbot as number,
          message,
          modoInstance?.customerData.uniqueId,
          modoInstance?.conversation?.uuid,
          modoInstance?.customerData.phoneNumber
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
    } else {
      throw new Error("User has not submitted the phone number form");
    }
  }
};

const checkIfUserHasPhoneNumber = () => {
  const modoInstance = window.modoChatInstance?.();
  if (modoInstance?.customerData?.hasSubmittedPhoneForm()) {
    // User has already submitted the phone number form (whether empty or with phone number)
    return true;
  } else {
    // Show phone number form
    switchToPhoneNumberFormView();
    return false;
  }
};

const switchToPhoneNumberFormView = () => {
  const formOverlay = window.modoChatInstance?.().container?.querySelector(".mc-form-overlay");
  if (formOverlay) {
    formOverlay.classList.remove("mc-hidden");
    formOverlay.classList.add("mc-active");
  }
};
const submitPhoneNumberForm = (phoneNumber: string) => {
  // Allow empty phone number or valid phone number
  if (phoneNumber.trim() === "" || PhoneNumberRegex.test(phoneNumber)) {
    const modoChat = window.modoChatInstance?.();
    if (modoChat) {
      // Update the phone number
      modoChat.customerData.savePhoneNumber(phoneNumber.trim() || undefined);

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
    alert("لطفا شماره تلفن معتبر وارد کنید یا فیلد را خالی بگذارید.");
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

export {sendMessage, submitPhoneNumberForm, clearConversation};
