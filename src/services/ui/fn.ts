import {isDev} from "#src/constants/index.js";
import {ConversationStatus} from "#src/types/conversation.js";

function switchToConversationLayout() {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".mc-new-conversation-btn")?.classList.remove("mc-hidden");
  modoInstance?.container?.querySelector(".mc-starters-con")?.classList.add("mc-hidden");
}
function switchToStarterLayout() {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".mc-new-conversation-btn")?.classList.add("mc-hidden");
  modoInstance?.container?.querySelector(".mc-starters-con")?.classList.remove("mc-hidden");
  modoInstance?.container?.querySelector(".mc-conversation-status-icon")?.classList.add("mc-hidden");
}

function setConversationType(type: keyof typeof ConversationStatus) {
  const modoInstance = window.modoChatInstance?.();
  modoInstance?.container?.querySelector(".mc-conversation-status-icon")?.classList.remove("mc-hidden");
  const statusIcon = modoInstance?.container?.querySelector(".mc-conversation-status-icon");

  if (statusIcon) {
    // Remove existing mode classes
    statusIcon.classList.remove("mc-ai-mode", "mc-human-mode");

    // Add appropriate mode class
    if (type === "AI_CHAT") {
      statusIcon.classList.add("mc-ai-mode");
    } else {
      statusIcon.classList.add("mc-human-mode");
    }
  }
}

function loadStarters() {
  const modoInstance = window.modoChatInstance?.();
  const startersContainer = modoInstance?.container?.querySelector(".mc-starters-con");
  const starterItemsContainer = modoInstance?.container?.querySelector(".mc-starter-items");

  startersContainer?.classList.remove("mc-hidden");

  for (const starter of modoInstance?.publicData?.starters || []) {
    const starterElement = document.createElement("div");
    starterElement.className = "mc-starter-item";
    starterElement.textContent = starter;
    starterElement.addEventListener("click", async () => {
      const inputEl = modoInstance?.container?.querySelector(".mc-chat-input") as HTMLInputElement;
      const sendMsgBtnEl = modoInstance?.container?.querySelector(".mc-send-message-btn") as HTMLButtonElement;
      switchToConversationLayout();
      if (inputEl) {
        inputEl.value = starter;
        sendMsgBtnEl.click();
      }
    });
    starterItemsContainer?.appendChild(starterElement);
  }
}

function updateChatToggleImage() {
  const modoInstance = window.modoChatInstance?.();
  const toggleImageEl = modoInstance?.container?.querySelector(".mc-chat-toggle-image") as HTMLImageElement;
  const starterLogoEl = modoInstance?.container?.querySelector(".mc-starter-logo") as HTMLImageElement;

  const defaultSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.9 23 5 23H11V21H5V3H13V9H21ZM23 18V16H15V18L19 22L15 26V28H23V26H19L23 22L19 18H23Z'/%3E%3C/svg%3E";

  // Update toggle button image
  if (toggleImageEl) {
    if (modoInstance?.publicData?.image) {
      toggleImageEl.src = modoInstance.publicData.image;
      toggleImageEl.alt = modoInstance.publicData.name || "شروع گفتگو";

      // Add error handling for failed image loads
      toggleImageEl.onerror = () => {
        toggleImageEl.src = defaultSvg;
        toggleImageEl.alt = "پشتیبانی چت";
      };
    } else {
      // Use default avatar if no image is provided
      toggleImageEl.src = defaultSvg;
      toggleImageEl.alt = "پشتیبانی چت";
    }
  }

  // Update starter logo
  if (starterLogoEl) {
    if (modoInstance?.publicData?.image) {
      starterLogoEl.src = modoInstance.publicData.image;
      starterLogoEl.alt = modoInstance.publicData.name || "لوگو چت بات";
      starterLogoEl.style.display = "block";

      // Add error handling for failed image loads
      starterLogoEl.onerror = () => {
        starterLogoEl.style.display = "none";
      };
    } else {
      // Hide logo if no image is provided
      starterLogoEl.style.display = "none";
    }
  }
}

function updateChatTitle() {
  const modoInstance = window.modoChatInstance?.();
  const chatTitleEl = modoInstance?.container?.querySelector(".mc-chat-title") as HTMLElement;
  const starterTitleEl = modoInstance?.container?.querySelector(".mc-starter-title") as HTMLElement;

  if (chatTitleEl || starterTitleEl) {
    // Use options title if no publicData name is available
    const displayTitle = modoInstance?.options?.title || modoInstance?.publicData?.name || "Modo";

    if (chatTitleEl) {
      chatTitleEl.textContent = displayTitle;
    }

    if (starterTitleEl) {
      starterTitleEl.textContent = displayTitle;
    }
  }
}

function applyModoOptions() {
  const modoInstance = window.modoChatInstance?.();
  if (!modoInstance?.container || !modoInstance?.options) return;

  const container = modoInstance.container;
  const options = modoInstance.options;

  // Apply position option
  applyPositionOption(container, options.position);

  // Apply theme option
  applyThemeOption(container, options.theme);

  // Apply primary color option
  applyPrimaryColorOption(container, options.primaryColor);

  // Apply foreground color option
  applyForegroundColorOption(container, options.foregroundColor);
}

function applyPositionOption(container: HTMLDivElement, position: "left" | "right") {
  const widget = window.modoChatInstance?.()?.container as HTMLElement;
  if (widget) {
    if (position === "left") {
      widget.style.right = "auto";
      widget.style.left = "32px";
      widget.style.direction = "ltr";

      // Update chat body position for left alignment
      const chatBody = widget.querySelector(".mc-chat-body") as HTMLElement;
      if (chatBody) {
        chatBody.style.right = "auto";
        chatBody.style.left = "0";
      }
    } else {
      // widget.style.left = "auto";
      // widget.style.right = "32px";
      // widget.style.direction = "rtl";

      // Update chat body position for right alignment
      const chatBody = widget.querySelector(".mc-chat-body") as HTMLElement;
      if (chatBody) {
        chatBody.style.left = "auto";
        chatBody.style.right = "0";
      }
    }
  }
}

function applyThemeOption(container: HTMLDivElement, theme: "dark" | "light") {
  // Set the theme attribute on the container or document
  const widget = document.querySelector(".modo-chat-widget");
  if (theme === "light") {
    widget?.setAttribute("data-theme", "light");
  } else {
    widget?.removeAttribute("data-theme");
  }

  // Store theme preference
  localStorage.setItem("modo-component:theme", theme);
}

function applyPrimaryColorOption(container: HTMLDivElement, primaryColor: string) {
  // Create CSS custom properties for the primary color
  const root = document.querySelector(".modo-chat-widget") as HTMLDivElement;
  if (root) {
    // Set the primary color
    root?.style.setProperty("--primary-color", primaryColor);

    // Generate hover color (slightly darker)
    const hoverColor = adjustColorBrightness(primaryColor, -20);
    root?.style.setProperty("--primary-hover", hoverColor);

    // Generate gradient using the primary color
    const gradientColor = adjustColorBrightness(primaryColor, 15);
    root?.style.setProperty("--primary-gradient", `linear-gradient(135deg, ${primaryColor} 0%, ${gradientColor} 100%)`);
  } else console.error("modo chat widget not found");
}

function applyForegroundColorOption(container: HTMLDivElement, foregroundColor: string) {
  // Create CSS custom properties for the foreground color
  const root = document.querySelector(".modo-chat-widget") as HTMLDivElement;
  if (root) {
    // Set the foreground color
    root?.style.setProperty("--foreground-color", foregroundColor);

    // Set white color to use foreground color for white text elements
    root?.style.setProperty("--white", foregroundColor);
  } else console.error("modo chat widget not found");
}

function adjustColorBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  // Ensure values stay within 0-255 range
  const newR = Math.max(0, Math.min(255, R));
  const newG = Math.max(0, Math.min(255, G));
  const newB = Math.max(0, Math.min(255, B));

  return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, "0")}`;
}
async function loadCss() {
  return await new Promise(resolve => {
    const link = document.createElement("link");
    const source = isDev ? "/css/index.css" : "https://modochats.s3.ir-thr-at1.arvanstorage.ir/index.css";
    link.rel = "stylesheet";
    link.href = source;
    document.head.appendChild(link);
    link.addEventListener("load", () => {
      resolve("css loaded");
    });
  });
}
export {
  switchToConversationLayout,
  switchToStarterLayout,
  setConversationType,
  loadStarters,
  loadCss,
  updateChatToggleImage,
  updateChatTitle,
  applyModoOptions,
  applyPositionOption,
  applyThemeOption,
  applyPrimaryColorOption
};
