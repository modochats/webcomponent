import {ModoChat} from "#src/app.js";
import {Conversation} from "#src/models/modo-conversation.js";
import {fetchConversationMessages} from "#src/utils/fetch.js";
import {parse} from "tldts";

const checkIfHostIsAllowed = (modo: ModoChat) => {
  const currentHost = parse(window.location.origin).hostname;
  const allowedHosts = modo.publicData?.setting.allowedHosts || [];
  if (currentHost) return allowedHosts.includes(currentHost);
};

const checkIfUserHasConversation = async (modo: ModoChat) => {
  const savedConversationUuid = localStorage.getItem(`modo-chat:${modo.publicKey}-conversation-uuid`);
  if (savedConversationUuid) {
    try {
      const res = await fetchConversationMessages(savedConversationUuid, modo.publicKey);
      modo.conversation = new Conversation(res.results[0]?.conversation);
      for (const message of res.results) modo.conversation.addMessage(message);
    } catch (err) {
      console.error("Failed to fetch conversation messages", err);
    }
  }
};
export {checkIfHostIsAllowed, checkIfUserHasConversation};
