import User from '../model/user.model.js';

import jwt from 'jsonwebtoken';

// Xác thực bạn là ai - authorization
export const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];

        if(!token) {
            return res.status(401).json({
                message: "Không tìm thấy access token"
            });
        }

        // Xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err) {
                console.log(err);
                return res.status(403).json({
                    message: "Access Token hết hạn hoặc không đúng"
                });
            }

            // Tìm user
            const user = await User.findById(decodedUser.userId).select("-password");

            // Trả về trong req
            req.user = user;
            next();
        });
    } catch (error) {
        console.log("Lỗi khi xác minh JWT trong middleware", error);
        return res.status(500).json({
            message: "Lỗi hệ thống"
        });
    }
}
