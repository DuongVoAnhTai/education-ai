import * as httpRequest from "@/utils/httpRequest";

export const getConversations = async () => {
  try {
    const res = await httpRequest.get("conversations");
    return res; // { success: true, conversations: [...], count: number }
  } catch (error: any) {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    return { error: "Failed to fetch conversations" };
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    const res = await httpRequest.get(`conversations/${conversationId}`);
    return res; // { success: true, conversation: {...} }
  } catch (error: any) {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    return { error: "Failed to fetch conversation details" };
  }
};

export const createConversation = async (
  title?: string,
  participantIds: string[] = [],
  isGroup: boolean = false,
  allowAi: boolean = false
) => {
  try {
    const res = await httpRequest.post("conversations", {
      title,
      participantIds,
      isGroup,
      allowAi,
    });
    console.log("createConversation response:", res);

    return res; // { success: true, conversation: {...} }
  } catch (error: any) {
    if (error.response?.data?.error) {
      return {
        error: error.response.data.error,
        existingConversationId: error.response.data.existingConversationId,
      };
    }
    return { error: "Failed to create conversation" };
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const res = await httpRequest.get(
      `conversations/${conversationId}/message`
    );
    return res; // { success: true, messages: [...], count: number }
  } catch (error: any) {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    return { error: "Failed to fetch messages" };
  }
};
