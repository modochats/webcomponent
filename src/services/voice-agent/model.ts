import {EventType, LogLevel} from "#src/lib/client-sdk/src/index.js";
import {ModoVoiceClient} from "#src/lib/client-sdk/src/ModoVoiceClient.js";
import {initVoiceAgentLayout} from "./utils.js";

class VoiceAgent {
  instance?: ModoVoiceClient;
  constructor() {
    const modoInstance = window.modoChatInstance?.();
    this.instance = new ModoVoiceClient({
      apiBase: "https://live.modochats.com",
      chatbotUuid: modoInstance?.publicData?.setting.uuid as string,
      userUniqueId: modoInstance?.customerData.uniqueId as string,
      logging: {
        level: LogLevel.DEBUG,
        enableConsole: true,
        enableEvents: false,
        includeTimestamp: true,
        includeContext: true
      }
    });
    this.instance.on(EventType.CONNECTED, event => {
      console.log("✅ Connected to Modo Voice Agent");
      console.log(`   Chatbot: ${event.chatbotUuid}`);
      console.log(`   User: ${event.userUniqueId}`);
    });

    this.instance.on(EventType.DISCONNECTED, event => {
      console.log("❌ Disconnected from Modo Voice Agent");
      if (event.reason) {
        console.log(`   Reason: ${event.reason}`);
      }
    });

    this.instance.on(EventType.CONNECTION_ERROR, event => {
      console.error("🔴 Connection Error:", event.message);
    });

    this.instance.on(EventType.AI_PLAYBACK_STARTED, () => {
      console.log("🤖 AI started speaking...");
    });

    this.instance.on(EventType.AI_PLAYBACK_COMPLETED, () => {
      console.log("✅ AI finished speaking");
    });

    this.instance.on(EventType.VOICE_DETECTED, event => {
      console.log(`🎤 Voice detected: RMS=${event.rms.toFixed(4)}, dB=${event.db.toFixed(1)}`);
    });

    this.instance.on(EventType.VOICE_ENDED, event => {
      console.log(`⏹ Voice ended: Duration=${event.duration}ms`);
    });

    this.instance.on(EventType.TRANSCRIPT_RECEIVED, event => {
      console.log(`📝 User said: "${event.text}"`);
    });

    this.instance.on(EventType.AI_RESPONSE_RECEIVED, event => {
      console.log(`💬 AI responded: "${event.text}"`);
    });

    // Initialize the voice agent UI
    this.initHtml();
  }
  async connect() {
    try {
      console.log("🔌 Connecting to Modo Voice Agent...");
      await this.instance?.connect();
      console.log("\n✨ Connected! Start speaking...\n");
    } catch (error) {
      console.error("Failed to connect:", error);
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
}
export {VoiceAgent};
