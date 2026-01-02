function toggleVoiceChatLayout() {
  const widget = window.getMWidget?.();
  const voiceOverlay = widget?.container?.querySelector(".mc-voice-agent-overlay");

  if (voiceOverlay) {
    voiceOverlay.classList.toggle("mc-active");
    voiceOverlay.classList.toggle("mc-hidden");
  }
}

function initVoiceChatLayout() {
  const widget = window.getMWidget?.();
  const voiceOverlay = widget?.container?.querySelector(".mc-voice-agent-overlay");
  const voiceCloseBtn = voiceOverlay?.querySelector(".mc-voice-close-btn");
  const voiceDisconnectBtn = voiceOverlay?.querySelector(".mc-voice-disconnect-btn");
  const voiceCallBtn = widget?.container?.querySelector(".mc-voice-call-btn");

  // Show voice call button
  if (voiceCallBtn) {
    voiceCallBtn.classList.remove("mc-hidden");
    voiceCallBtn.classList.add("mc-visible");
  }

  // Set logo from chatbot data
  const logoImg = voiceOverlay?.querySelector(".mc-voice-agent-logo") as HTMLImageElement;
  if (logoImg && widget?.chatbot?.image) {
    logoImg.src = widget.chatbot.image;
    logoImg.alt = widget.chatbot.name || "چت بات";
  }

  // Set title
  const titleEl = voiceOverlay?.querySelector(".mc-voice-agent-title") as HTMLElement;
  if (titleEl) {
    titleEl.textContent = widget?.chatbot?.name || "تماس صوتی";
  }

  // Call button click handler
  voiceCallBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-hidden");
      voiceOverlay.classList.add("mc-active");
      // Connect to voice instance
      widget?.voiceChat?.connect();
    }
  });

  // Close button click handler
  voiceCloseBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-active");
      voiceOverlay.classList.add("mc-hidden");
      // Disconnect from voice instance
      widget?.voiceChat?.disconnect();
    }
  });

  // Disconnect button click handler
  voiceDisconnectBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-active");
      voiceOverlay.classList.add("mc-hidden");
      // Disconnect from voice instance
      widget?.voiceChat?.disconnect();
    }
  });
}

function updateVoiceChatStatus(status: string, color?: string) {
  const widget = window.getMWidget?.();
  const statusEl = widget?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  if (statusEl) {
    statusEl.textContent = status;
    if (color) {
      statusEl.style.color = color;
    }
  }
}

function handleVoiceConnected() {
  const widget = window.getMWidget?.();
  const logoEl = widget?.container?.querySelector(".mc-voice-agent-logo") as HTMLElement;
  const statusEl = widget?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  // Add animation classes when connected
  if (logoEl) {
    logoEl.style.animation = "mc-voice-pulse 2s ease-in-out infinite";
  }
  if (statusEl) {
    statusEl.style.animation = "mc-pulse 1.5s ease-in-out infinite";
  }

  updateVoiceChatStatus("متصل ✓", "#68d391"); // Green
}

function handleVoiceDisconnected(reason?: string) {
  const widget = window.getMWidget?.();
  const logoEl = widget?.container?.querySelector(".mc-voice-agent-logo") as HTMLElement;
  const statusEl = widget?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  // Remove animations when disconnected
  if (logoEl) {
    logoEl.style.animation = "none";
  }
  if (statusEl) {
    statusEl.style.animation = "none";
  }

  const statusText = reason ? `قطع شد: ${reason}` : "قطع شد";
  updateVoiceChatStatus(statusText, "#fc8181"); // Red
}

function handleVoiceConnectionError(message: string) {
  updateVoiceChatStatus(`خطا: ${message}`, "#fbb040"); // Warning/Orange

  // Also show error in console with better visibility
  console.error("🔴 Voice Connection Error:", message);
}

function handleMicrophonePaused() {
  updateVoiceChatStatus("⏸ میکروفن متوقف شد", "#fbb040"); // Orange
}

function handleMicrophoneResumed() {
  updateVoiceChatStatus("🎤 میکروفن فعال", "#68d391"); // Green
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
