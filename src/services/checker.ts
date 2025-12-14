import {ModoChat} from "#src/app.js";
import {Conversation} from "#src/models/conversation.js";
import {fetchConversationMessages, fetchConversations, fetchUpdateUserData} from "#src/utils/fetch.js";
import {parse} from "tldts";
import {initSocket} from "./socket/socket.js";
import {loadStarters, switchToStarterLayout} from "./ui/fn.js";

const checkIfHostIsAllowed = (modo: ModoChat) => {
  const currentHost = parse(window.location.origin).hostname;
  const allowedHosts = modo.chatbot?.allowedHosts || [];
  if (currentHost) return allowedHosts.includes(currentHost);
};

const loadConversation = async (modo: ModoChat) => {
  const savedUUid = localStorage.getItem(`modo-chat:${modo.publicKey}-conversation-uuid`);
  if (savedUUid) {
    const res = await fetchConversations(savedUUid, modo.customerData.uniqueId);
    if (res.results.length > 0) {
      modo.conversation = new Conversation(res.results[0]);
      modo.conversation?.addBadge();
    }
  }
  // modo.conversation = new Conversation(res.conversation);
  // for (const message of res.messages) modo.conversation.addMessage(message);
  // modo.conversation.scrollToBottom();
  // await initSocket();
};
export {checkIfHostIsAllowed, loadConversation};
