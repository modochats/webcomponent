import {Widget} from "#src/app.js";
import {Conversation} from "#src/models/conversation.js";
import {fetchConversations} from "#src/utils/fetch.js";
import {parse} from "tldts";

const checkIfHostIsAllowed = (widget: Widget) => {
  const currentHost = parse(window.location.origin).hostname;
  const allowedHosts = widget.chatbot?.allowedHosts || [];
  if (currentHost) return allowedHosts.includes(currentHost);
};

const loadConversation = async (widget: Widget) => {
  const savedUUid = localStorage.getItem(`widget-chat:${widget.publicKey}-conversation-uuid`);
  if (savedUUid) {
    const res = await fetchConversations(savedUUid, widget.customerData.uniqueId);
    if (res.results.length > 0) {
      widget.conversation = new Conversation(res.results[0]);
      widget.conversation?.addBadge();
    }
  }
};
export {checkIfHostIsAllowed, loadConversation};
