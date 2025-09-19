class Conversation {
  id: number;
  uuid: string;
  chatbot: number;
  unreadMessageCount: number;
  messages: ConversationMessage[] = [];
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.uuid = init.uuid;
    this.chatbot = init.chatbot;
    this.unreadMessageCount = init.unread_messages_count;
  }
  addMessage(init: Record<string, any>) {
    this.messages.push(new ConversationMessage(init));
  }
}
class ConversationMessage {
  id: number;
  content: string;
  messageType: "USER" | "SUPPORTER";
  createdAt: string;
  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.content = init.content;
    if (init.message_type === 0) this.messageType = "USER";
    else this.messageType = "SUPPORTER";
    this.createdAt = init.created_at;
  }
}
export {Conversation, ConversationMessage};
