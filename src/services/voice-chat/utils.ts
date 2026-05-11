import {t} from "i18next";

function toggleVoiceChatLayout() {
  const widget = window.getMWidget?.();
  const voiceOverlay = widget?.container?.querySelector(".mw-voice-agent-overlay");

  if (voiceOverlay) {
    voiceOverlay.classList.toggle("mw-active");
    voiceOverlay.classList.toggle("mw-hidden");
  }
}

function initVoiceChatLayout() {
  const widget = window.getMWidget?.();
  const voiceOverlay = widget?.container?.querySelector(".mw-voice-agent-overlay");
  const voiceCloseBtn = voiceOverlay?.querySelector(".mw-voice-close-btn");
  const voiceDisconnectBtn = voiceOverlay?.querySelector(".mw-voice-disconnect-btn");
  const voiceCallBtn = widget?.container?.querySelector(".mw-voice-call-btn");

  // Show voice call button
  if (voiceCallBtn) {
    voiceCallBtn.classList.remove("mw-hidden");
    voiceCallBtn.classList.add("mw-visible");
  }

  // Set logo from chatbot data
  const logoImg = voiceOverlay?.querySelector(".mw-voice-agent-logo") as HTMLImageElement;
  if (logoImg && widget?.chatbot?.image) {
    logoImg.src = widget.chatbot.image;
    logoImg.alt = widget.chatbot.name || t("chat.voiceChat.defaultName");
  }

  // Set title
  const titleEl = voiceOverlay?.querySelector(".mw-voice-agent-title") as HTMLElement;
  if (titleEl) {
    titleEl.textContent = widget?.chatbot?.name || t("chat.voiceChat.defaultTitle");
  }

  // Call button click handler
  voiceCallBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mw-hidden");
      voiceOverlay.classList.add("mw-active");
      // Connect to voice instance
      widget?.voiceChat?.connect();
    }
  });

  // Close button click handler
  voiceCloseBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mw-active");
      voiceOverlay.classList.add("mw-hidden");
      // Disconnect from voice instance
      widget?.voiceChat?.disconnect();
    }
  });

  // Disconnect button click handler
  voiceDisconnectBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mw-active");
      voiceOverlay.classList.add("mw-hidden");
      // Disconnect from voice instance
      widget?.voiceChat?.disconnect();
    }
  });
}

function updateVoiceChatStatus(status: string, color?: string) {
  const widget = window.getMWidget?.();
  const statusEl = widget?.container?.querySelector(".mw-voice-agent-status") as HTMLElement;

  if (statusEl) {
    statusEl.textContent = status;
    if (color) {
      statusEl.style.color = color;
    }
  }
}

function handleVoiceConnected() {
  const widget = window.getMWidget?.();
  const logoEl = widget?.container?.querySelector(".mw-voice-agent-logo") as HTMLElement;
  const statusEl = widget?.container?.querySelector(".mw-voice-agent-status") as HTMLElement;

  // Add animation classes when connected
  if (logoEl) {
    logoEl.style.animation = "mw-voice-pulse 2s ease-in-out infinite";
  }
  if (statusEl) {
    statusEl.style.animation = "mw-pulse 1.5s ease-in-out infinite";
  }

  updateVoiceChatStatus(t("chat.voiceChat.status.connected"), "#68d391"); // Green
}

function handleVoiceDisconnected(reason?: string) {
  const widget = window.getMWidget?.();
  const logoEl = widget?.container?.querySelector(".mw-voice-agent-logo") as HTMLElement;
  const statusEl = widget?.container?.querySelector(".mw-voice-agent-status") as HTMLElement;

  // Remove animations when disconnected
  if (logoEl) {
    logoEl.style.animation = "none";
  }
  if (statusEl) {
    statusEl.style.animation = "none";
  }

  const statusText = reason ? `${t("chat.voiceChat.status.disconnectedWithReason")}${reason}` : t("chat.voiceChat.status.disconnected");
  updateVoiceChatStatus(statusText, "#fc8181"); // Red
}

function handleVoiceConnectionError(message: string) {
  updateVoiceChatStatus(`${t("chat.voiceChat.status.errorPrefix")}${message}`, "#fbb040"); // Warning/Orange

  // Also show error in console with better visibility
  console.error("🔴 Voice Connection Error:", message);
}

function handleMicrophonePaused() {
  updateVoiceChatStatus(t("chat.voiceChat.status.microphonePaused"), "#fbb040"); // Orange
}

function handleMicrophoneResumed() {
  updateVoiceChatStatus(t("chat.voiceChat.status.microphoneResumed"), "#68d391"); // Green
}

export {
  toggleVoiceChatLayout,
  initVoiceChatLayout,
  updateVoiceChatStatus,
  handleVoiceConnected,
  handleVoiceDisconnected,
  handleVoiceConnectionError,
  handleMicrophonePaused,
  handleMicrophoneResumed
};
