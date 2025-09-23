interface SocketMessage {
  type: "new_message" | "ai_response";
  message: Record<string, any>;
}

export type {SocketMessage};
