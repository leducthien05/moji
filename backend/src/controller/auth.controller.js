import User from '../model/user.model.js';
import Session from '../model/session.model.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const ACCESS_TOKEN_TLL = '30m';
const REFRESH_TOKEN_TLL = 30 * 24 * 60 * 60 * 1000;

// [POST] /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { userName, email, password, lastName, firstName } = req.body;
        if (!userName || !email || !password || !lastName || !firstName) {
            return res.status(400).json({ message: 'Không thể thiếu userName, email, password, lastName hoặc firstName' });
        }

        // Kiểm tra xem userName đã tồn tại chưa
        const existName = await User.findOne({
            userName: userName
        });

        if(existName) {
            return res.status(400).json({ message: "userName đã tồn tại" });
        }

        // Mã hóa password 
        const passwordHash = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            userName,
            email,
            password: passwordHash,
            displayName: `${firstName} ${lastName}`
        });

        // Lưu user mới vào cơ sở dữ liệu
        await newUser.save();

        // return 
        res.status(200).json({ message: "Đăng ký thành công", user: newUser });
    } catch (error) {
        console.log(`Lỗi đăng ký: ${error}`);
        return res.status(500).json({ message: "Đăng ký thất bại", error: error.message });
    }
}

// [POST] /api/auth/signin
export const signin = async (req, res) => {
    try {
        // Lấy input từ request body
        const { userName, password } = req.body;

        if(!userName || !password) {
            return res.status(400).json({ message: "Không thể thiếu userName hoặc password" });
        }

        // Lấy user bằng tên
        const user = await User.findOne({ userName: userName });
        if(!user) {
            return res.status(400).json({ message: "userName không tồn tại"});
        }

        // So sánh password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: "Mật khẩu không chính xác"} );
        }

        // Tạo accessToken với JWT
        const accessToken = jwt.sign(
            {userId: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TLL }
        );

        // Tạo refreshToken với JWT
        const refreshToken = crypto.randomBytes(64).toString('hex');
        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expriresAt: new Date(Date.now() + REFRESH_TOKEN_TLL)
        });

        // Trả refreshToken về trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none", // Backend và Fronted deloy riêng 
            maxAge: REFRESH_TOKEN_TLL
        });

        // Trả accessToken về trong res
        res.status(200).json({ 
            message: "Đăng nhập thành công", 
            accessToken: accessToken 
        });

    } catch (error) {
        console.log(`Lỗi đăng nhập: ${error}`);
        return res.status(500).json({ 
            message: "Đăng nhập thất bại", 
            error: error.message 
        });
    }
}

// [POST] /api/auth/signout
export const signout = async (req, res) => {
    try {
        const refreshToken = req.cookies.resfreshToken;
        if(refreshToken) {
            await Session.deleteOne({ refreshToken: refreshToken });
            res.clearCookie("refreshToken");
        }
        res.status(204);

    } catch (error) {
        console.log(`Lỗi đăng xuất: ${error}`);
        return res.status(500).json({ 
            message: "Đăng xuất thất bại", 
            error: error.message 
        });
    }
}