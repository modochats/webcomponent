import {EventType} from "@modochats/voice-client";
import {ModoVoiceClient} from "@modochats/voice-client";
import {
  initVoiceChatLayout,
  handleVoiceConnected,
  handleVoiceDisconnected,
  handleVoiceConnectionError,
  handleMicrophonePaused,
  handleMicrophoneResumed
} from "./utils.js";

class VoiceChat {
  instance?: ModoVoiceClient;
  isFirstInSession: boolean = true;
  constructor() {
    const widget = window.getMWidget?.();
    this.instance = new ModoVoiceClient({
      apiBase: "https://live.modochats.com",
      // apiBase: "http://localhost:8000",
      chatbotUuid: widget?.chatbot?.uuid as string,
      userUniqueId: widget?.customerData.uniqueId as string
    });
    this.instance.on(EventType.CONNECTED, (event: any) => {
      handleVoiceConnected();
    });

    this.instance.on(EventType.DISCONNECTED, (event: any) => {
      if (event.reason) {
      }
      handleVoiceDisconnected(event.reason);
    });

    this.instance.on(EventType.CONNECTION_ERROR, (event: any) => {
      // console.error("🔴 Connection Error:", event.message);
      handleVoiceConnectionError(event.message);
    });

    this.instance.on(EventType.MICROPHONE_PAUSED, () => {
      handleMicrophonePaused();
    });

    this.instance.on(EventType.MICROPHONE_RESUMED, () => {
      handleMicrophoneResumed();
    });
    // Initialize the voice agent UI
    this.initHtml();

    // session check
    const hasSeen = sessionStorage.getItem("modochats:voice-agent-seen") === "true";
    if (hasSeen) this.isFirstInSession = false;
    else sessionStorage.setItem("modochats:voice-agent-seen", "true");
    if (this.isFirstInSession) this.showTooltip();
  }
  async connect() {
    try {
      await this.instance?.connect();
    } catch (error) {
      // console.error("Failed to connect:", error);
    }
  }
  async disconnect() {
    await this.instance?.disconnect();
  }
  initHtml() {
    initVoiceChatLayout();
  }
  toggleLayout() {
    this.toggleLayout();
  }

  showTooltip() {
    const tooltip = document.querySelector(".mw-voice-call-tooltip");
    tooltip?.classList.remove("mw-hidden");
    setTimeout(() => {
      tooltip?.classList.add("mw-hidden");
    }, 6000);
  }
}
export {VoiceChat};
