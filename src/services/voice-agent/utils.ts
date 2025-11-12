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

export {toggleVoiceAgentLayout, initVoiceAgentLayout};
