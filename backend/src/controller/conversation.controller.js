import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";

export const createConversation = async (req, res) => {
    try {
        const { type, name, memberIDs } = req.body;
        const userID = req.user._id;

        if (!type || (type === "group" && !name) || !Array.isArray(memberIDs) || memberIDs.length === 0) {
            return res.status(400).json({ message: "Tên nhóm và danh dách thành viên là bắt buộc" });
        }

        let conversation;

        if (type === "direct") {
            const participantID = memberIDs[0];
            conversation = await Conversation.findOne({
                type: "direct",
                "participants.userId": { $all: [userID, participantID] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    type: "direct",
                    participants: [
                        {
                            userId: userID,
                            joinedAt: new Date()
                        },
                        {
                            userId: participantID,
                            joinedAt: new Date()
                        }
                    ],
                });

                conversation.save();
            }
        }

        if (type === "group") {
            conversation = await Conversation.create({
                type: "group",
                participants: [
                    { userId: userID, joinedAt: new Date() },
                    ...memberIDs.map((id) => ({ userId: id, joinedAt: new Date() }))
                ],
                group: {
                    name: name,
                    createdBy: userID
                }
            });
            conversation.save();
        }

        if (!conversation) {
            return res.status(400).json({ message: "Conversation type không hợp lệ" });
        }

        await conversation.populate([
            {
                path: "participants.userId", select: "_id displayName avatarUrl"
            },
            {
                path: "seenBy", select: "_id displayName avatarUrl"
            },
            {
                path: "lastMessage", select: "_id displayName avatarUrl"
            }
        ]);

        return res.status(201).json(conversation);
    } catch (error) {
        console.error("Lỗi tạo nhóm chat", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getConversation = async (req, res) => {
    try {
        const userID = req.user._id;
        const conversation = await Conversation.find({
            "participants.userId": userID
        })
            .sort({ lastMessageAt: -1, updatedAt: -1 })
            .populate(
                [
                    {
                        path: "lastMessage.senderId", select: "_id displayName avatarUrl"
                    },
                    {
                        path: "participants.userId", select: "_id displayName avatarUrl"
                    },
                    {
                        path: "seenBy", select: "avatarUrl displayName"
                    }
                ]
            )
            ;

        const formatted = conversation.map((conver) => {
            const participant = (conver.participants).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl ?? null,
                joinedAt: p.joinedAt
            }));

            return {
                ...conver.toObject(),
                unreadCount: conver.unreadCount || {},
                participants: participant
            }
        });

        return res.status(200).json({
            conversation: formatted
        });
    } catch (error) {
        console.error("Lỗi khi lấy nhóm chat", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const {conversationId} = req.params;
        const { limit = 50, cursor} = req.query;

        const query = { conversationId };
        if(cursor){
            query.createdAt = {$lt: new Date(cursor)};
        }

        let messages = await Message.find(query)
            .sort({createdAt: -1})
            .limit(Number(limit) + 1)
        ;
        let nextCursor = null;

        if(messages.length > Number(limit)){
            const nextMessage = messages[messages.length - 1];
            nextCursor = nextMessage.createdAt.toISOString();
            messages.pop(); 
        }

        messages.reverse();

        return res.status(200).json({
            messages: messages,
            nextCursor
        });


    } catch (error) {
        console.error("Lỗi khi lấy nhóm chat", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}