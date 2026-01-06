import {ConversationMessage} from "@modochats/chat-client";
import {marked} from "marked";

type MessageRelatedUtil<T extends Array<any> = [], R = void> = (message: ConversationMessage, ...args: T) => R;

const initMessageElement: MessageRelatedUtil = message => {
  const element = document.createElement("div");
  const widget = window.getMWidget?.();
  element.id = `message-${message.id}`;
  // Format time from createdAt
  const messageTime = new Date(message.createdAt);
  const timeString = messageTime.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  // Build the HTML with replied-to message preview if exists
  let repliedToHtml = "";
  if (message.repliedTo) {
    const repliedContent = message.repliedTo.content.length > 40 ? message.repliedTo.content.substring(0, 40) + "..." : message.repliedTo.content;
    repliedToHtml = `
        <div class="mw-replied-to-preview" data-reply-message-id="${message.repliedTo.id}">
          <div class="mw-replied-to-header">
            <span class="mw-replied-to-sender">${message.repliedTo.type === "USER" ? "شما" : "پشتیبان"}</span>
          </div>
          <div class="mw-replied-to-content">${repliedContent}</div>
        </div>
      `;
  }

  // Build file preview HTML if file exists
  let filePreviewHtml = "";
  if (message.fileSrc) {
    const displayFileName = message.fileSrc.length > 20 ? message.fileSrc.substring(0, 17) + "..." : message.fileSrc;
    filePreviewHtml = `
        <a href="${message.fileSrc}" target="_blank" rel="noopener noreferrer" class="mw-file-preview" title="دانلود فایل">
          <div class="mw-file-preview-icon">
            ${'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6m4 18H6V4h7v5h5v11z"/></svg>'}
          </div>
          <div class="mw-file-preview-info">
            <div class="mw-file-preview-name">${displayFileName}</div>
            <div class="mw-file-preview-type">${"file"}</div>
          </div>
        </a>
      `;
  }

  element.innerHTML = `
    <div class="mw-chat-message ${message.type === "USER" ? "mw-chat-message-user" : "mw-chat-message-supporter"}">
    ${repliedToHtml}
    ${filePreviewHtml}
        <div class="mw-message-content">${marked.parse(message.content) as string}</div>
      </div>
      <div class="mw-message-footer">
      ${
        message.type !== "USER"
          ? `
        <div class="mw-message-feedback">
        <button class="mw-feedback-btn mw-feedback-dislike" data-message-id="${message.id}" title="مفید نبود">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 14l-.986.164A1 1 0 0 1 15 13zM4 14v1a1 1 0 0 1-1-1zm16.522-2.392l.98-.196zM6 3h11.36v2H6zm12.56 12H15v-2h3.56zm-2.573-1.164l.805 4.835L14.82 19l-.806-4.836zM14.82 21h-.214v-2h.214zm-3.543-1.781l-2.515-3.774l1.664-1.11l2.516 3.774zM7.93 15H4v-2h3.93zM3 14V6h2v8zm17.302-8.588l1.2 6l-1.96.392l-1.2-6zM8.762 15.445A1 1 0 0 0 7.93 15v-2a3 3 0 0 1 2.496 1.336zm8.03 3.226A2 2 0 0 1 14.82 21v-2zM18.56 13a1 1 0 0 0 .981-1.196l1.961-.392A3 3 0 0 1 18.561 15zm-1.2-10a3 3 0 0 1 2.942 2.412l-1.96.392A1 1 0 0 0 17.36 5zm-2.754 18a4 4 0 0 1-3.328-1.781l1.664-1.11a2 2 0 0 0 1.664.891zM6 5a1 1 0 0 0-1 1H3a3 3 0 0 1 3-3z"/><path stroke="currentColor" stroke-width="2" d="M8 14V4"/></g></svg>
        </button>
        <button class="mw-feedback-btn mw-feedback-like" data-message-id="${message.id}" title="مفید بود">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="m15 10l-.74-.123a.75.75 0 0 0 .74.873zM4 10v-.75a.75.75 0 0 0-.75.75zm16.522 2.392l.735.147zM6 20.75h11.36v-1.5H6zm12.56-11.5H15v1.5h3.56zm-2.82.873l.806-4.835l-1.48-.247l-.806 4.836zm-.92-6.873h-.214v1.5h.213zm-3.335 1.67L8.97 8.693l1.248.832l2.515-3.773zM7.93 9.25H4v1.5h3.93zM3.25 10v8h1.5v-8zm16.807 8.54l1.2-6l-1.47-.295l-1.2 6zM8.97 8.692a1.25 1.25 0 0 1-1.04.557v1.5c.92 0 1.778-.46 2.288-1.225zm7.576-3.405A1.75 1.75 0 0 0 14.82 3.25v1.5a.25.25 0 0 1 .246.291zm2.014 5.462c.79 0 1.38.722 1.226 1.495l1.471.294A2.75 2.75 0 0 0 18.56 9.25zm-1.2 10a2.75 2.75 0 0 0 2.697-2.21l-1.47-.295a1.25 1.25 0 0 1-1.227 1.005zm-2.754-17.5a3.75 3.75 0 0 0-3.12 1.67l1.247.832a2.25 2.25 0 0 1 1.873-1.002zM6 19.25c-.69 0-1.25-.56-1.25-1.25h-1.5A2.75 2.75 0 0 0 6 20.75z"/><path stroke="currentColor" stroke-width="1.5" d="M8 10v10"/></g></svg>
        </button>
        </div>
        `
          : ""
      }
    <div class="mw-message-time">${timeString}</div>
    </div>
    `;

  element.className = `mw-message-wrapper ${message.type === "USER" ? "mw-message-wrapper-user" : "mw-message-wrapper-supporter"}`;
  widget?.chat?.conversation.containerElement?.appendChild(element);

  addMessageElementListeners(message);

  // Add feedback event listeners for non-user messages
  if (message.type !== "USER") {
    addMessageFeedbackListeners(message);
  }

  // Add clicked listener for replied-to preview
  if (message.repliedTo) {
    addMessageRepliedToListener(message);
  }
};

const addMessageElementListeners: MessageRelatedUtil = message => {
  const widget = window.getMWidget?.();
  const element = getMessageElement(message);

  element?.addEventListener("dblclick", () => {
    widget?.chat.replyMaster.setReply(message);
  });
};

const addMessageFeedbackListeners: MessageRelatedUtil = message => {
  const element = getMessageElement(message);
  const likeBtn = element?.querySelector(".mw-feedback-like") as HTMLButtonElement;
  const dislikeBtn = element?.querySelector(".mw-feedback-dislike") as HTMLButtonElement;

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      sendMessageFeedBack(message, true);
    });
  }

  if (dislikeBtn) {
    dislikeBtn.addEventListener("click", () => {
      sendMessageFeedBack(message, false);
    });
  }
};

const sendMessageFeedBack: MessageRelatedUtil<[liked: boolean]> = async (message, liked) => {
  const element = getMessageElement(message);
  if (message.hasFeedback) return; // Prevent multiple feedback submissions
  disableMessageFeedbackButtons(message);
  try {
    await message.sendFeedBack(liked);
    const likeBtn = element?.querySelector(".mw-feedback-like") as HTMLButtonElement;
    const dislikeBtn = element?.querySelector(".mw-feedback-dislike") as HTMLButtonElement;

    if (liked && likeBtn) {
      likeBtn.classList.add("mw-feedback-active");
    } else if (!liked && dislikeBtn) {
      dislikeBtn.classList.add("mw-feedback-active");
    }
  } catch {
    enableMessageFeedbackButtons(message);
  }
};

const disableMessageFeedbackButtons: MessageRelatedUtil = message => {
  const element = getMessageElement(message);
  const likeBtn = element?.querySelector(".mw-feedback-like") as HTMLButtonElement;
  const dislikeBtn = element?.querySelector(".mw-feedback-dislike") as HTMLButtonElement;

  if (likeBtn) {
    likeBtn.disabled = true;
    likeBtn.classList.add("mw-feedback-disabled");
  }

  if (dislikeBtn) {
    dislikeBtn.disabled = true;
    dislikeBtn.classList.add("mw-feedback-disabled");
  }
};

const addMessageRepliedToListener: MessageRelatedUtil = message => {
  const element = getMessageElement(message);

  const repliedToEl = getMessageElement(message.repliedTo! || {});
  const repliedToPreview = element?.querySelector(".mw-replied-to-preview") as HTMLDivElement;
  if (repliedToPreview && repliedToEl) {
    repliedToPreview.addEventListener("click", () => {
      // Scroll to the replied message
      repliedToEl?.scrollIntoView({behavior: "smooth", block: "center"});

      // Add highlight effect
      repliedToEl?.classList.add("mw-message-highlight");
      setTimeout(() => {
        repliedToEl?.classList.remove("mw-message-highlight");
      }, 2000);
    });
  }
};

const getMessageElement: MessageRelatedUtil<[], HTMLDivElement | undefined | null> = message => {
  const widget = window.getMWidget?.();
  return widget?.chat.conversation.containerElement?.querySelector(`#message-${message.id}`);
};

const showMessageTooltip: MessageRelatedUtil = message => {
  const widget = window.getMWidget?.();
  const tooltip = widget?.container?.querySelector(".mw-toggle-tooltip");
  const tooltipText = widget?.container?.querySelector(".mw-toggle-tooltip-text");
  if (tooltip && tooltipText) {
    // Show the tooltip
    tooltip.classList.remove("mw-hidden");

    // Update tooltip text with message preview
    const preview = message.content.length > 50 ? message.content.substring(0, 50) + "..." : message.content;
    tooltipText.textContent = preview;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      tooltip.classList.add("mw-hidden");
    }, 3000);
  }
};

const enableMessageFeedbackButtons: MessageRelatedUtil = message => {
  const element = getMessageElement(message);
  const likeBtn = element?.querySelector(".mw-feedback-like") as HTMLButtonElement;
  const dislikeBtn = element?.querySelector(".mw-feedback-dislike") as HTMLButtonElement;

  if (likeBtn) {
    likeBtn.disabled = false;
    likeBtn.classList.remove("mw-feedback-disabled");
  }

  if (dislikeBtn) {
    dislikeBtn.disabled = false;
    dislikeBtn.classList.remove("mw-feedback-disabled");
  }
};

export {
  initMessageElement,
  addMessageElementListeners,
  addMessageFeedbackListeners,
  sendMessageFeedBack,
  disableMessageFeedbackButtons,
  addMessageRepliedToListener,
  getMessageElement,
  showMessageTooltip,
  enableMessageFeedbackButtons
};
