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
    const widget = window.getMWidget?.();
    const wsUrl = `${BASE_WEBSOCKET_URL}/conversations/${widget?.conversation?.uuid}/messages/?token=${this.token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      this.socket?.send(
        JSON.stringify({
          type: "join_messages"
        })
      );
      if (isReconnect) widget?.conversation?.loadMessages();
    });
    this.socket.onmessage = event => {
      const message: SocketMessage = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => this.onclose();
  }

  updateConnectionStatus(connected: boolean) {
    const widget = window.getMWidget?.();
    const connectionIndicator = widget?.container?.querySelector(".mc-connection-status");

    if (connectionIndicator) {
      connectionIndicator.className = `mc-connection-status ${connected ? "mc-connected" : "mc-disconnected"}`;
    }
  }

  onMessage(message: SocketMessage) {
    const widget = window.getMWidget?.();
    switch (message.type) {
      case "new_message":
        const newMessage = new ConversationMessage(message.message);
        if (newMessage.type === "USER") return;
        else {
          widget?.conversation?.addMessage(message.message, {incoming: true});
        }
        break;
      case "ai_response":
        widget?.conversation?.addMessage(message.message, {incoming: true});
        break;
      case "conversation_status_change":
        widget?.conversation?.setStatus(message.status);
        widget?.conversation?.addSystemMessage(message.message);
        break;
      default:
        console.info("modo chat : unknown message type :", message);
    }
  }
  close() {
    const widget = window.getMWidget?.();
    this.forceClosed = true;
    this.isConnected = false;
    this.updateConnectionStatus(false);
    this.socket?.close();
    localStorage.removeItem(`modo-chat:${widget?.publicKey}-conversation-access-token`);
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
  const widget = window.getMWidget?.();
  if (widget) {
    const savedAccessToken = localStorage.getItem(`modo-chat:${widget.publicKey}-conversation-access-token`);
    let accessToken = "";
    if (savedAccessToken) accessToken = savedAccessToken;
    if (!savedAccessToken) {
      const accessTokenRes = await fetchGetAccessTokenForSocket(
        widget.chatbot?.uuid as string,
        widget.conversation?.uuid as string,
        widget.customerData.uniqueId
      );
      localStorage.setItem(`modo-chat:${widget.publicKey}-conversation-access-token`, accessTokenRes.access_token);
      accessToken = accessTokenRes.access_token;
    }
    widget.socket = new Socket(accessToken);
  }
};
export {Socket, initSocket};
