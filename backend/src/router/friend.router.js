import express from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, listFriend, listFriendRequest, removeFriend } from "../controller/friend.controller.js";

const router = express.Router();

// Gửi yêu cầu kết bạn
router.post("/request/add", sendFriendRequest);

// Chấp nhận yêu cầu kết bạn
router.post("/request/:requestID/accept", acceptFriendRequest);

// Từ chối yêu cầu kết bạn
router.post("/request/:requestID/reject", rejectFriendRequest);

// Lấy danh sách bạn bè
router.get("/", listFriend);

// Xóa bạn bè
router.delete("/request/:requestID/remove", removeFriend);  

// Lấy danh sách gửi/nhận kết bạn
router.get("/request", listFriendRequest);

export default router;