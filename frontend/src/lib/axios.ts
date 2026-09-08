import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
});

// Gắn accessToken vào header của tất cả các request nếu có
api.interceptors.request.use(
    (config) => {
        // Thêm token vào header nếu có
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);  

// Tự động gọi api refresh khi accessToken hết hạn
api.interceptors.response.use((res) => res, async (error) => {
    const oringinalRequest = error.config;

    // Những api không cần check 
    if(oringinalRequest.url.includes("/auth/signin") || oringinalRequest.url.includes("/auth/signup") || oringinalRequest.url.includes("/auth/refresh")){
        return Promise.reject(error);
    }

    oringinalRequest._retryCount = oringinalRequest._retryCount || 0;
    if(error.response?.status == 403 && oringinalRequest._retryCount < 4){
        oringinalRequest._retryCount ++;
        console.log("refresh", oringinalRequest._retryCount);
        try {
            const res = await api.post("/auth/refresh", { withCredentials: true});
            const newAccessToken = res.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);

            oringinalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(oringinalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError)
        }
    }

    return Promise.reject(error)
});

export default api;