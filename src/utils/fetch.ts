import {$fetch} from "#src/tools/fetch.js";
import {FetchPaginationRes} from "#src/types/app.js";

const fetchModoPublicData = async (publicKey: string) => {
  return await $fetch<Record<string, any>>(`/v1/chatbot/public/${publicKey}`);
};

const fetchSendMessage = async (chatbotId: number, content: string, uniqueId: string, conversationUuid?: string, phoneNumber?: string) => {
  return await $fetch("/v2/conversations/website/send-message/", {
    method: "POST",
    body: {
      chatbot_id: chatbotId,
      content: content,
      message_type: 0,
      unique_id: uniqueId,
      conversation_id: conversationUuid ? conversationUuid : undefined,
      meta_data: {
        url: window?.location?.href,
        title: document?.title
      },
      phone_number: phoneNumber && phoneNumber !== "no phone number" ? phoneNumber : undefined
    }
  });
};
const fetchGetAccessTokenForSocket = async (chatbotId: string, conversationUuid: string, uniqueId: string) => {
  return await $fetch<{access_token: string; conversation_uuid: string; expires_in: number}>("/v2/conversations/websocket/auth/", {
    method: "POST",
    body: {
      chatbot_id: chatbotId,
      conversation_uuid: conversationUuid,
      unique_id: uniqueId
    }
  });
};
const fetchConversationMessages = async (conversationUuid: string, chatbotUuid: string) => {
  return await $fetch<Record<string, any>>(`/v2/conversations/website/conversations/${conversationUuid}/chatbot/${chatbotUuid}/messages/`);
};
const fetchUpdateUserData = async (chatbotUuid: string, uniqueId: string, userData: Record<string, any>) => {
  return await $fetch("/v1/chatbot/customners/set-user-data", {
    method: "POST",
    body: {
      chatbot_uuid: chatbotUuid,
      unique_id: uniqueId,
      user_data: userData
    }
  });
};
const fetchReadMessage = async (id: number) => {
  return await $fetch(`/v2/conversations/messages/${id}/`, {
    method: "POST"
  });
};
const fetchMarkConversationAsRead = async (conversationUuid: string, uniqueId: string) => {
  return await $fetch(`/v2/conversations/website/conversations/${conversationUuid}/messages/seen`, {
    method: "POST",
    body: {
      unique_id: uniqueId
    }
  });
};

const fetchMessageFeedback = async (id: number, uniqueId: string, conversationUuid: string, liked: boolean) => {
  return await $fetch(`/v2/conversations/website/conversations/messages/feedback`, {
    method: "POST",
    body: {
      unique_id: uniqueId,
      feedback: liked ? 1 : 0,
      message_id: id,
      conversation_uuid: conversationUuid
    }
  });
};

const fetchConversations = async (conversationUuid: string, uniqueId: string) => {
  return await $fetch<FetchPaginationRes>(`/v2/conversations/website/conversations/${conversationUuid}/customer/${uniqueId}`);
};
export {
  fetchModoPublicData,
  fetchSendMessage,
  fetchGetAccessTokenForSocket,
  fetchConversationMessages,
  fetchUpdateUserData,
  fetchReadMessage,
  fetchMarkConversationAsRead,
  fetchMessageFeedback,
  fetchConversations
};
