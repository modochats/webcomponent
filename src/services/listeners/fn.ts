import {PhoneNumberRegex} from "#src/constants/regex.js";
import {Conversation} from "#src/models/conversation.js";
import {CustomerData} from "#src/models/customer-data.js";
import {fetchSendMessage} from "#src/utils/fetch.js";
import {initSocket} from "../socket/socket.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasPhoneNumber()) {
      const widget = window.getMWidget?.();
      if (widget) {
        const savedFile = widget.conversationMaster.fileMaster.file;
        const savedReply = widget.conversationMaster.replyMaster.replyingTo?.id;
        const fileSrc = savedFile ? URL.createObjectURL(savedFile) : undefined;
        if (widget?.conversation?.uuid) {
          widget.conversation.addMessage({
            id: "temp",
            content: message,
            message_type: 0,
            created_at: new Date().toISOString(),
            response_to: savedReply,
            file: fileSrc
          });
          const chatInput = widget.container?.querySelector(".mw-chat-input") as HTMLInputElement;
          if (chatInput) chatInput.value = "";
        }
        widget.conversationMaster.fileMaster.clearFile();
        widget.conversationMaster.replyMaster.clearReply();
        const sendMsgRes = await fetchSendMessage(
          widget?.chatbot?.id as number,
          message,
          widget?.customerData.uniqueId,
          widget?.conversation?.uuid,
          widget?.customerData.phoneNumber,
          {
            file: savedFile,
            replyTo: savedReply
          }
        );

        if (!widget?.conversation?.uuid) {
          widget.conversation = new Conversation(sendMsgRes.conversation);
          widget.conversation?.addMessage(sendMsgRes);
          localStorage.setItem(`modo-chat:${widget.publicKey}-conversation-uuid`, widget.conversation?.uuid as string);
          await initSocket();
          if (widget.conversation.status === "AI_CHAT") await widget.conversation.loadMessages();
        }
      } else {
        console.error("Widget instance not found");
      }
    } else {
      throw new Error("User has not submitted the phone number form");
    }
  }
};

const checkIfUserHasPhoneNumber = () => {
  const widget = window.getMWidget?.();
  if (widget?.customerData?.hasSubmittedPhoneForm()) {
    // User has already submitted the phone number form (whether empty or with phone number)
    return true;
  } else {
    // Show phone number form
    switchToPhoneNumberFormView();
    return false;
  }
};

const switchToPhoneNumberFormView = () => {
  const formOverlay = window.getMWidget?.().container?.querySelector(".mw-form-overlay");
  if (formOverlay) {
    formOverlay.classList.remove("mw-hidden");
    formOverlay.classList.add("mw-active");
  }
};
const submitPhoneNumberForm = (phoneNumber: string) => {
  // Allow empty phone number or valid phone number
  const parsedPhoneNumber = phoneNumber.replace(/[۰-۹٠-٩]/g, ch => {
    const fa = "۰۱۲۳۴۵۶۷۸۹".indexOf(ch);
    if (fa > -1) return String(fa);
    const ar = "٠١٢٣٤٥٦٧٨٩".indexOf(ch);
    if (ar > -1) return String(ar);
    return ch;
  });

  if (parsedPhoneNumber.trim() === "" || PhoneNumberRegex.test(parsedPhoneNumber)) {
    const widget = window.getMWidget?.();
    if (widget) {
      // Update the phone number
      widget.customerData.savePhoneNumber(phoneNumber.trim() || undefined);

      const formOverlay = widget.container?.querySelector(".mw-form-overlay");
      if (formOverlay) {
        formOverlay.classList.remove("mw-active");
        formOverlay.classList.add("mw-hidden");
      }

      (widget.container?.querySelector(".mw-send-message-btn") as HTMLButtonElement)?.click();
    } else {
      console.error("Widget instance not found");
    }
  } else {
    alert("لطفا شماره تلفن معتبر وارد کنید یا فیلد را خالی بگذارید.");
  }
};

const clearConversation = () => {
  const widget = window.getMWidget?.();
  if (widget) {
    widget.conversation = undefined;
    widget.socket?.close();
    widget.socket = undefined;

    localStorage.removeItem(`modo-chat:${widget.publicKey}-conversation-uuid`);
  }
};

export {sendMessage, submitPhoneNumberForm, clearConversation};
