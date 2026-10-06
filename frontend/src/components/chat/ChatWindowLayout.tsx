import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";

const ChatWindowLayout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const clickSingOut = async () => {
        await signOut();
        navigate("/signin")
    }

    return (
        <>
            <div>ChatWindowLayout</div>

            <button onClick={clickSingOut}>
                Đăng xuất
            </button>
        </>
    );
};

export default ChatWindowLayout;