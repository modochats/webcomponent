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
  connect() {
    const modoInstance = window.modoChatInstance?.();
    const wsUrl = `${BASE_WEBSOCKET_URL}/conversations/${modoInstance?.conversation?.uuid}/messages/?token=${this.token}`;
    this.socket = new WebSocket(wsUrl);
    this.socket.addEventListener("open", () => {
      this.isConnected = true;
      this.socket?.send(
        JSON.stringify({
          type: "join_messages"
        })
      );
    });
    this.socket.onmessage = event => {
      const message: SocketMessage = JSON.parse(event.data);
      this.onMessage(message);
    };
    this.socket.onclose = () => {
      this.isConnected = false;
    };
  }
  onMessage(message: SocketMessage) {
    const modoInstance = window.modoChatInstance?.();

    switch (message.type) {
      case "new_message":
        const newMessage = new ConversationMessage(message.message);
        if (newMessage.type !== "USER") modoInstance?.conversation?.addMessage(message.message);
        break;
      default:
        console.log("unknown message type :", message);
    }
  }
  close() {
    this.socket?.close();
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
        modoInstance.userData.uniqueId as string
      );
      localStorage.setItem(`modo-chat:${modoInstance.publicKey}-conversation-access-token`, accessTokenRes.access_token);
      accessToken = accessTokenRes.access_token;
    }
    modoInstance.socket = new Socket(accessToken);
  }
};
export {Socket, initSocket};
