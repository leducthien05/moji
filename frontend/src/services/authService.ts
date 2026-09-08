import api from "../lib/axios";

export const authService = {
    signUp: async (userName: string, password: string, email: string, firstName: string, lastName: string) => {
        try {
            const response = await api.post("/auth/signup", {
                userName,
                password,
                email,
                firstName,
                lastName
            }, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    signIn: async (userName: string, password: string) => {
        try {
            const response = await api.post("/auth/signin", {
                userName,
                password
            }, { withCredentials: true });
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