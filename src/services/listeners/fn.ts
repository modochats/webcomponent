import {PhoneNumberRegex} from "#src/constants/regex.js";

const sendMessage = async (message: string) => {
  if (message.trim().length) {
    if (checkIfUserHasPhoneNumber()) {
      const widget = window.getMWidget?.();
      if (widget) {
        if (widget?.conversation?.d?.uuid) {
          const chatInput = widget.container?.querySelector(".mw-chat-input") as HTMLInputElement;
          if (chatInput) chatInput.value = "";
        }
        await widget?.chat.instance?.chat.sendMessage(message);
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
    widget.chat.instance!.chat.conversation = undefined;
    widget.chat.instance?.socket?.close();

    localStorage.removeItem(`modo-chat:${widget.publicKey}-conversation-uuid`);
  }
};

export {sendMessage, submitPhoneNumberForm, clearConversation};
