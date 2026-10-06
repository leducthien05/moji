import User from "../model/user.model.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        
        return res.status(200).json({
            message: "Truy xuất thành công",
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi thệ thống"
        });
    }
}

export const test = async (req, res) => {
    return res.sendStatus(204);
}