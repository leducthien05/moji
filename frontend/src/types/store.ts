import type { User, Friend, FriendRequest } from "./user.ts";
import type { Participant, SeenUser, Conversation, ConversationResponse, Group, LastMessage, Message} from "./chat.ts";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    clearState: () => void;
    setAccessToken: (accessToken: string) => void;
    signUp: (username: string, password: string, email: string, firstName: string, lastName: string) => Promise<void>;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
}

export interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

export interface ChatState {
    conversation: Conversation[];
    message: Record<string, {
        items: Message[],
        hasMore: boolean,
        nextCursor?: string | null //Phân trang
    }>;
    activeConversationId: string | null;
    loading: boolean;
    reset: () => void;
    setActiveConversation: (id: string | null) => void;
    fetchConversation: () => Promise<void>;
}