import { create } from "zustand";
import { toast } from "sonner";
import type { ChatState } from "@/types/store";
import { persist } from "zustand/middleware";
import { chatService } from "@/services/chatService";

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            conversation: [],
            message: {},
            activeConversationId: null,
            loading: false,

            setActiveConversation: (id) => {
                set({
                    activeConversationId: id,
                });
            },

            fetchConversation: async () => {
                try {
                    set({ loading: true });

                    const { conversation } = await chatService.fetchConversations();
                    set({
                        conversation: conversation,
                    });
                } catch (error) {
                    console.error(
                        "Lỗi xảy ra khi fetchConversation:",
                        error
                    );

                    toast.error("Lỗi khi lấy conversation");
                } finally {
                    set({
                        loading: false,
                    });
                }
            },

            reset: () => {
                set({
                    conversation: [],
                    message: {},
                    activeConversationId: null,
                    loading: false,
                });
            },
        }),
        {
            name: "chat-storage",

            partialize: (state) => ({
                conversation: state.conversation,
            }),
        }
    )
);