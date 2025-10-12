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

// export const sendMessage = async (
//   conversationId: string,
//   content: string,
//   contentType: string = "TEXT",
//   senderType: string = "USER"
// ) => {
//   try {
//     const res = await httpRequest.post(
//       `conversations/${conversationId}/message`,
//       {
//         content,
//         contentType,
//         senderType,
//       }
//     );

//     return res; // { success: true, message: {...} }
//   } catch (error: any) {
//     if (error.response?.data?.error) {
//       return { error: error.response.data.error };
//     }
//     return { error: "Failed to send message" };
//   }
// };
