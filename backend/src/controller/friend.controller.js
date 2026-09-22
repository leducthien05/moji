import Friend from "../model/friend.model.js";
import FriendRequest from "../model/friend.request.model.js";
import User from "../model/user.model.js";
import Conversation from "../model/conversation.model.js";

// [POST] /friend/request/add
export const sendFriendRequest = async (req, res) => {
    try {
        const { to, message } = req.body;

        const from = req.user._id;

        if(to.toString() === from.toString()){
            return res.status(400).json({ message: "Không thể gửi yêu cầu kết bạn cho chính mình" });
        }

        const userExists = await User.exists({ _id: to });
        if (!userExists) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        let userA = from.toString();
        let userB = to.toString();

        if( userA > userB){
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriend, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({ 
                $or: [
                    {from, to},
                    {from: to, to: from}
                ]
            })
        ]);

        if(alreadyFriend){
            return res.status(400).message("Hai người đã là bạn bè");
        }

        if(existingRequest){
            return res.status(400).message("Đã có lời mời kết bạn đang chờ")
        }

        const request = await FriendRequest.create({
            from: from,
            to: to,
            message: message
        });

        res.status(201).json({ message: "Yêu cầu kết bạn đã được gửi", request });

    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu kết bạn: ", error);
        res.status(500).json({ message: "Lỗi khi gửi yêu cầu kết bạn" });
    }
}

// [POST] /friend/request/:requestID/accept
export const acceptFriendRequest = async (req, res) => {
    try {
        const requestID = req.params.requestID;
        const userID = req.user._id;

        const existRequest = await FriendRequest.findById(requestID);

        if(!existRequest){
            return res.status(404).json({message: "Không tìm thấy lời mời kết bạn!"});
        }

        if(existRequest.to.toString() !== userID.toString()){
            return res.status(404).json({ message: "Bạn không có quyền chấp nhận lời mời kết bạn này"});
        }

        const friend = await Friend.create({
            userA: existRequest.from,
            userB: existRequest.to
        });

        await FriendRequest.findOneAndDelete(requestID); 

        const from = await User.findById(friend.userA).select("_id displayName avatarUrl").lean();
        return res.status(200).json({
            message: "Chập nhận kết bạn thành công",
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                avatarUrl: from?.avatarUrl
            }
        });
    } catch (error) {
        console.error("Lỗi khi chấp nhận yêu cầu kết bạn: ", error);
        res.status(500).json({ message: "Lỗi khi chấp nhận yêu cầu kết bạn" });
    }
}

// [POST] /friend/request/:requestID/reject
export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestID } = req.params.requestID;
        const userID = req.user._id;

        const existRequest = await FriendRequest.findById(requestID);

        if(!existRequest){
            return res.status(404).json({message: "Không tìm thấy lời mời kết bạn nào"});
        }

        if(existRequest.to.toString() !== userID.toString()){
            return res.status(404).json({ message: "Bạn không có quyền từ chối lời mời kết bạn này"});
        }

        await FriendRequest.findByIdAndDelete(requestID);

        return res.status(200).json({message: "Từ chối lời mời kết bạn thành công"});

    } catch (error) {
        console.error("Lỗi khi từ chối yêu cầu kết bạn: ", error);
        res.status(500).json({ message: "Lỗi khi từ chối yêu cầu kết bạn" });
    }
}

// [GET] friend/
export const listFriend = async (req, res) => {
    try {
        const userID = req.user._id;
        const friendShips = await Friend.find({
            $or: [
                {
                    userA: userID
                },
                {
                    userB: userID
                }
            ]
        })
            .populate("userA", "_id avatarUrl displayName")
            .populate("userB", "_id avatarUrl displayName")
            .lean();
        if(!friendShips){
            return res.status(200).json({friend: []});
        }

        const friend = friendShips.map((f) => (f.userA._id.toString() === userID.toString()) ? f.userB : f.userA );

        return res.status(200).json(friend);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè: ", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bạn bè" });
    }
}

// [DELETE] friend/:friendID/remove
export const removeFriend = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Lỗi khi xóa bạn bè: ", error);
        res.status(500).json({ message: "Lỗi khi xóa bạn bè" });
    }
}

// [GET] friend/request
export const listFriendRequest = async (req, res) => {
    try {
        const userID = req.user._id;

        const populateFriends = "_id avatarUrl displayName";

        const [sendFriendRequest, requestFriend] = await Promise.all([
            FriendRequest.find({from: userID}).populate("to", populateFriends),
            FriendRequest.find({to: userID}).populate("from", populateFriends)
        ]);

        return res.status(200).json({
            sendFriendRequest: sendFriendRequest,
            requestFriend: requestFriend
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu kết bạn: ", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách yêu cầu kết bạn" });
    }
}
