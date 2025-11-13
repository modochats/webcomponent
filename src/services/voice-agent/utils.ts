function toggleVoiceAgentLayout() {
  const modoInstance = window.modoChatInstance?.();
  const voiceOverlay = modoInstance?.container?.querySelector(".mc-voice-agent-overlay");

  if (voiceOverlay) {
    voiceOverlay.classList.toggle("mc-active");
    voiceOverlay.classList.toggle("mc-hidden");
  }
}

function initVoiceAgentLayout() {
  const modoInstance = window.modoChatInstance?.();
  const voiceOverlay = modoInstance?.container?.querySelector(".mc-voice-agent-overlay");
  const voiceCloseBtn = voiceOverlay?.querySelector(".mc-voice-close-btn");
  const voiceDisconnectBtn = voiceOverlay?.querySelector(".mc-voice-disconnect-btn");
  const voiceCallBtn = modoInstance?.container?.querySelector(".mc-voice-call-btn");

  // Show voice call button
  if (voiceCallBtn) {
    voiceCallBtn.classList.remove("mc-hidden");
    voiceCallBtn.classList.add("mc-visible");
  }

  // Set logo from chatbot data
  const logoImg = voiceOverlay?.querySelector(".mc-voice-agent-logo") as HTMLImageElement;
  if (logoImg && modoInstance?.publicData?.image) {
    logoImg.src = modoInstance.publicData.image;
    logoImg.alt = modoInstance.publicData.name || "چت بات";
  }

  // Set title
  const titleEl = voiceOverlay?.querySelector(".mc-voice-agent-title") as HTMLElement;
  if (titleEl) {
    titleEl.textContent = modoInstance?.publicData?.name || "تماس صوتی";
  }

  // Call button click handler
  voiceCallBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-hidden");
      voiceOverlay.classList.add("mc-active");
      // Connect to voice instance
      modoInstance?.voiceAgent?.connect();
    }
  });

  // Close button click handler
  voiceCloseBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-active");
      voiceOverlay.classList.add("mc-hidden");
      // Disconnect from voice instance
      modoInstance?.voiceAgent?.disconnect();
    }
  });

  // Disconnect button click handler
  voiceDisconnectBtn?.addEventListener("click", () => {
    if (voiceOverlay) {
      voiceOverlay.classList.remove("mc-active");
      voiceOverlay.classList.add("mc-hidden");
      // Disconnect from voice instance
      modoInstance?.voiceAgent?.disconnect();
    }
  });
}

function updateVoiceAgentStatus(status: string, color?: string) {
  const modoInstance = window.modoChatInstance?.();
  const statusEl = modoInstance?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  if (statusEl) {
    statusEl.textContent = status;
    if (color) {
      statusEl.style.color = color;
    }
  }
}

function handleVoiceConnected() {
  const modoInstance = window.modoChatInstance?.();
  const logoEl = modoInstance?.container?.querySelector(".mc-voice-agent-logo") as HTMLElement;
  const statusEl = modoInstance?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  // Add animation classes when connected
  if (logoEl) {
    logoEl.style.animation = "mc-voice-pulse 2s ease-in-out infinite";
  }
  if (statusEl) {
    statusEl.style.animation = "mc-pulse 1.5s ease-in-out infinite";
  }

  updateVoiceAgentStatus("متصل ✓", "#68d391"); // Green
}

function handleVoiceDisconnected(reason?: string) {
  const modoInstance = window.modoChatInstance?.();
  const logoEl = modoInstance?.container?.querySelector(".mc-voice-agent-logo") as HTMLElement;
  const statusEl = modoInstance?.container?.querySelector(".mc-voice-agent-status") as HTMLElement;

  // Remove animations when disconnected
  if (logoEl) {
    logoEl.style.animation = "none";
  }
  if (statusEl) {
    statusEl.style.animation = "none";
  }

  const statusText = reason ? `قطع شد: ${reason}` : "قطع شد";
  updateVoiceAgentStatus(statusText, "#fc8181"); // Red
}

function handleVoiceConnectionError(message: string) {
  updateVoiceAgentStatus(`خطا: ${message}`, "#fbb040"); // Warning/Orange

  // Also show error in console with better visibility
  console.error("🔴 Voice Connection Error:", message);
}

function handleMicrophonePaused() {
  updateVoiceAgentStatus("⏸ میکروفن متوقف شد", "#fbb040"); // Orange
}

function handleMicrophoneResumed() {
  updateVoiceAgentStatus("🎤 میکروفن فعال", "#68d391"); // Green
}

export {
  toggleVoiceAgentLayout,
  initVoiceAgentLayout,
  updateVoiceAgentStatus,
  handleVoiceConnected,
  handleVoiceDisconnected,
  handleVoiceConnectionError,
  handleMicrophonePaused,
  handleMicrophoneResumed
};
