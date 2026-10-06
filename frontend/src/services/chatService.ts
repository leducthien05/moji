import api from "../lib/axios";
import type { ConversationResponse, Message } from "@/types/chat";

export const chatService = {
    fetchConversations: async (): Promise<ConversationResponse> => {
        const res = await api.get("/conversation");
        return res.data;
    },

    fetchMessage: async (conversationId: string): Promise<Message> => {
        try {
            const response = await api.get(`/${conversationId}message`);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    signOut: async () => {
        try {
            return await api.post("/auth/signout");
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    fetchMe: async () => {
        const res = await api.get("/user/me", { withCredentials: true });
        return res.data.user;
    },

    refresh: async () => {
        const res = await api.post( "/auth/refresh", { withCredentials: true });

        return res.data.accessToken;
    }
}