import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { authService } from "@/services/authService";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create<AuthState>()(
    persist((set, get) => ({
        accessToken: null,
        user: null,
        loading: false,

        clearState: () => {
            set({ accessToken: null, user: null, loading: false });
            localStorage.clear();
            useChatStore.getState().reset();

        },

        setAccessToken: (accessToken) => {
            set({ accessToken });
        },
        signUp: async (username, password, email, firstName, lastName) => {
            try {
                set({ loading: true });
                // Gọi API đăng ký người dùng
                await authService.signUp(
                    username,
                    password,
                    email,
                    firstName,
                    lastName
                );
                toast.success("Đăng ký thành công");
            } catch (error) {
                console.error(error);
                toast.error("Đăng ký thất bại");
            } finally {
                set({ loading: false });
            }
        },

        signIn: async (username, password) => {
            try {
                set({ loading: true });
                localStorage.clear();
                useChatStore.getState().reset();
                const { accessToken } = await authService.signIn(username, password);
                get().setAccessToken(accessToken);
                await get().fetchMe();
                // await chatService.fetchConversations();
                useChatStore.getState().fetchConversation();
                toast.success("Đăng nhập thành công");
            } catch (error) {
                console.error(error);
                toast.error("Đăng nhập thất bại");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        signOut: async () => {
            try {
                set({ loading: true });
                await authService.signOut();
                console.log("Đã đăng xuất")
                get().clearState();
                toast.success("Đăng xuất thành công");
            } catch (error) {
                console.error(error);
                toast.error("Đăng xuất thất bại");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        fetchMe: async () => {
            try {
                set({ loading: true });
                const { user } = await authService.fetchMe();
                console.log(user)
                set({ user: user });
            } catch (error) {
                console.error(error);
                set({ user: null });
                toast.error("Lấy thông tin người dùng thất bại");
                throw error;
            } finally {
                set({ loading: false });
            }
        },

        refresh: async () => {
            try {
                set({ loading: true });
                const { user, fetchMe, setAccessToken } = get();
                const accessToken = await authService.refresh();
                setAccessToken(accessToken);

                if (!user) {
                    await fetchMe();
                }
            } catch (error) {
                console.error(error);
                toast.error("Làm mới token thất bại");
                get().clearState();
            } finally {
                set({ loading: false });
            }
        }
    }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }) // Chỉ persist user
        }
    )
);