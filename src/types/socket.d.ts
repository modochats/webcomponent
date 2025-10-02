interface SocketMessage {
  type: "new_message" | "ai_response" | "conversation_status_change";
  message: Record<string, any> | string;
  status: string;
}

export type {SocketMessage};
