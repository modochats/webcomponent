interface SocketMessage {
  type: "new_message";
  message: Record<string, any>;
}

export type {SocketMessage, };
