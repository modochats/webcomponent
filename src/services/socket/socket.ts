import {BASE_WEBSOCKET_URL} from "#src/constants/index.js";
import {ConversationMessage} from "#src/models/conversation.js";
import {SocketMessage} from "#src/types/socket.js";
import {fetchGetAccessTokenForSocket} from "#src/utils/fetch.js";
class Socket {
  private socket: WebSocket | null = null;
  private token: string;
  isConnected: boolean = false;
  constructor(token: string) {
    this.token = token;
    this.connect();
  }
  private forceClosed: boolean = false;
  connect(isReconnect: boolean = false) {
    const modoInstance = window.modoChatInstance?.();
    const wsUrl = `${BASE_WEBSOCKET_URL}/conversations/${modoInstance?.conversation?.uuid}/messages/?token=${this.token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      this.socket?.send(
        JSON.stringify({
          type: "join_messages"
        })
      );
      if (isReconnect) modoInstance?.conversation?.loadMessages();
    });
    this.socket.onmessage = event => {
      const message: SocketMessage = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => this.onclose();
  }

  updateConnectionStatus(connected: boolean) {
    const modoInstance = window.modoChatInstance?.();
    const connectionIndicator = modoInstance?.container?.querySelector(".mc-connection-status");

    if (connectionIndicator) {
      connectionIndicator.className = `mc-connection-status ${connected ? "mc-connected" : "mc-disconnected"}`;
    }
  }

  onMessage(message: SocketMessage) {
    const modoInstance = window.modoChatInstance?.();
    switch (message.type) {
      case "new_message":
        const newMessage = new ConversationMessage(message.message as Record<string, any>);
        if (newMessage.type === "USER") return;
        else modoInstance?.conversation?.addMessage(message.message as Record<string, any>);
        break;
      case "ai_response":
        modoInstance?.conversation?.addMessage(message.message as Record<string, any>);
        break;
      case "conversation_status_change":
        modoInstance?.conversation?.setStatus(message.status);
        modoInstance?.conversation?.addSystemMessage(message.message as string);
        break;
      default:
        console.info("modo chat : unknown message type :", message);
    }
  }
  close() {
    const modoInstance = window.modoChatInstance?.();
    this.forceClosed = true;
    this.isConnected = false;
    this.updateConnectionStatus(false);
    this.socket?.close();
    localStorage.removeItem(`modo-chat:${modoInstance?.publicKey}-conversation-access-token`);
  }
  onclose() {
    this.isConnected = false;
    this.updateConnectionStatus(false);
    if (this.forceClosed === false) {
      // Reconnect after a delay
      setTimeout(() => {
        this.connect(true);
      }, 3000);
    }
  }
}
const initSocket = async () => {
  const modoInstance = window.modoChatInstance?.();
  if (modoInstance) {
    const savedAccessToken = localStorage.getItem(`modo-chat:${modoInstance.publicKey}-conversation-access-token`);
    let accessToken = "";
    if (savedAccessToken) accessToken = savedAccessToken;
    if (!savedAccessToken) {
      const accessTokenRes = await fetchGetAccessTokenForSocket(
        modoInstance.publicData?.setting.uuid as string,
        modoInstance.conversation?.uuid as string,
        modoInstance.customerData.uniqueId
      );
      localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-access-token`, accessTokenRes.access_token);
      accessToken = accessTokenRes.access_token;
    }
    modoInstance.socket = new Socket(accessToken);
  }
};
export {Socket, initSocket};
