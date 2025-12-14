import {EventType} from "@modochats/voice-client";
import {ModoVoiceClient} from "@modochats/voice-client";
import {
  initVoiceAgentLayout,
  handleVoiceConnected,
  handleVoiceDisconnected,
  handleVoiceConnectionError,
  handleMicrophonePaused,
  handleMicrophoneResumed
} from "./utils.js";

class VoiceAgent {
  instance?: ModoVoiceClient;
  holdMusicAudio?: HTMLAudioElement;
  isFirstInSession: boolean = true;
  constructor() {
    const modoInstance = window.modoChatInstance?.();
    this.holdMusicAudio = new Audio("https://modochats.s3.ir-thr-at1.arvanstorage.ir/on-hold.mp3");
    this.holdMusicAudio.loop = true;
    this.instance = new ModoVoiceClient({
      apiBase: "https://live.modochats.com",
      // apiBase: "http://localhost:8000",
      chatbotUuid: modoInstance?.chatbot?.uuid as string,
      userUniqueId: modoInstance?.customerData.uniqueId as string
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
    initVoiceAgentLayout();
  }
  toggleLayout() {
    this.toggleLayout();
  }

  showTooltip() {
    const tooltip = document.querySelector(".mc-voice-call-tooltip");
    tooltip?.classList.remove("mc-hidden");
    setTimeout(() => {
      tooltip?.classList.add("mc-hidden");
    }, 6000);
  }
}
export {VoiceAgent};
