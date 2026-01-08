interface SocketMessage {
  type: "new_message" | "ai_response" | "conversation_status_change";
  message: any;
  status: string;
}

export type {SocketMessage};
