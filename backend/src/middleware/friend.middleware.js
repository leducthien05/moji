import Conversation from "../model/conversation.model.js";
import Friend from "../model/friend.model.js";

const pair = (a, b) => (a < b) ? [a, b] : [b, a];

export const checkFriend = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const checkID = req.body?.recipientID ?? null;
        const memberIDs = req.body?.memberIDs ?? [];
        if (checkID) {
            const [userA, userB] = pair(userID, checkID);

            const isFriend = await Friend.findOne({
                userA: userA,
                userB: userB
            });

            if (!isFriend) {
                return res.status(403).json({ message: "Bạn chưa kết bạn với người này" });
            }

            return next();

        }

        // todo: chat nhóm, chỉ bạn bè mới có thể tạo nhóm
        const checkFriend = memberIDs.map( async (member) => {
            const [userA, userB] = pair(userID, member);
            const friend = await Friend.findOne({
                userA: userA,
                userB: userB
            });
            return friend ? null : member
        });

        const result = await Promise.all(checkFriend);
        const notFriend = result.filter(Boolean);

        if(notFriend.length > 0){
            return res.status(403).json({message: "Bạn chỉ có thể tạo nhóm với bạn bè"});
        }

        next();

    } catch (error) {
        console.error("Lỗi khi check FriendShip", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const checkGroup = async (req, res, next) => {
    try {
        const { conversationID } = req.body;
        const userID = req.user._id

        const conversation = await Conversation.findById(conversationID);
        const isMember = conversation.participants.some((p) => p.userId.toString() === userID.toString());
        if(!isMember){
            return res.status(403).json({message: "Bạn chưa tham gia nhóm để gửi tin"});
        }
        req.conversation = conversation;
        next();
    } catch (error) {
        console.error("Lỗi khi checkGroup", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}