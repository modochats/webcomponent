import {EventType, LogLevel} from "@modochats/voice-client";
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
  constructor() {
    const modoInstance = window.modoChatInstance?.();
    this.holdMusicAudio = new Audio("https://modochats.s3.ir-thr-at1.arvanstorage.ir/on-hold.mp3");
    this.holdMusicAudio.loop = true;
    this.instance = new ModoVoiceClient({
      apiBase: "https://live.modochats.com",
      // apiBase: "http://localhost:8000",
      chatbotUuid: modoInstance?.publicData?.setting.uuid as string,
      userUniqueId: modoInstance?.customerData.uniqueId as string,
      logging: {
        level: LogLevel.DEBUG,
        enableConsole: true,
        enableEvents: true,
        includeTimestamp: true,
        includeContext: true
      },
      audio: {
        constraints: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        processor: {
          voiceThreshold: 0.08,
          silenceThreshold: 0.05,
          minSilenceFrames: 8,
          maxPreRollBuffers: 5,
          sampleRate: 16000
        },
        processorPath: "https://modochats.s3.ir-thr-at1.arvanstorage.ir/audio-processor.js",
        minBufferSize: 32000,
        targetChunks: 16,
        resumeDelay: 150
      }
    });
    this.instance.on(EventType.CONNECTED, (event: any) => {
      console.log("✅ Connected to Modo Voice Agent");
      console.log(`   Chatbot: ${event.chatbotUuid}`);
      console.log(`   User: ${event.userUniqueId}`);
      handleVoiceConnected();
    });

    this.instance.on(EventType.DISCONNECTED, (event: any) => {
      console.log("❌ Disconnected from Modo Voice Agent");
      if (event.reason) {
        console.log(`   Reason: ${event.reason}`);
      }
      handleVoiceDisconnected(event.reason);
    });

    this.instance.on(EventType.CONNECTION_ERROR, (event: any) => {
      console.error("🔴 Connection Error:", event.message);
      handleVoiceConnectionError(event.message);
    });

    this.instance.on(EventType.AI_PLAYBACK_STARTED, () => {
      console.log("🤖 AI started speaking...");
      handleMicrophonePaused();
    });

    this.instance.on(EventType.AI_PLAYBACK_COMPLETED, () => {
      console.log("✅ AI finished speaking");
      handleMicrophoneResumed();
    });

    this.instance.on(EventType.VOICE_DETECTED, (event: any) => {
      console.log(`🎤 Voice detected: RMS=${event.rms.toFixed(4)}, dB=${event.db.toFixed(1)}`);
    });
    this.instance.on(EventType.VOICE_METRICS, (event: any) => {
      console.log(`📊 Voice metrics: RMS=${event.rms.toFixed(4)}, dB=${event.db.toFixed(1)}  `, event.isActive);
    });
    this.instance.on(EventType.VOICE_ENDED, (event: any) => {
      console.log(`⏹ Voice ended: Duration=${event.duration}ms`);
    });

    this.instance.on(EventType.TRANSCRIPT_RECEIVED, (event: any) => {
      console.log(`📝 User said: "${event.text}"`);
    });

    this.instance.on(EventType.AI_RESPONSE_RECEIVED, (event: any) => {
      console.log(`💬 AI responded: "${event.text}"`);
    });
    this.instance.on(EventType.MICROPHONE_PAUSED, () => {
      console.log("⏸ Microphone paused");
      handleMicrophonePaused();
    });

    this.instance.on(EventType.MICROPHONE_RESUMED, () => {
      console.log("▶ Microphone resumed");
      handleMicrophoneResumed();
    });

    this.instance.on(EventType.ON_HOLD_STARTED, () => {
      console.log("🎵 On-hold started - Playing hold music");
      this.holdMusicAudio?.play().catch(err => {
        console.error("Failed to play hold music:", err);
      });
    });

    this.instance.on(EventType.ON_HOLD_STOPPED, () => {
      console.log("⏹ On-hold stopped - Stopping hold music");
      if (this.holdMusicAudio) {
        this.holdMusicAudio.pause();
        this.holdMusicAudio.currentTime = 0;
      }
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
