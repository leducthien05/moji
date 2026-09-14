import Conversation from "../model/conversation.model.js";
import Friend from "../model/friend.model.js";
import Message from "../model/message.model.js";

import { updateConversationAfterCreateMessage } from "../util/message.util.js";

// [POST] /message/direct
export const sendDirectMessage = async (req, res) => {
    try {
        const { recipientID, content, conversationID } = req.body;
        const senderID = req.user._id;

        let conversation;

        if (!content) {
            return res.status(400).json({ message: "Thiếu nội dung" });
        }

        if (conversationID) {
            conversation = await Conversation.findById(conversationID);
        }

        if (!conversation) {
            const existConversation = await Conversation.findOne({
                type: "direct",
                "participants.userId": { $all: [senderID, recipientID] }
            });
            if (existConversation) {
                conversation = existConversation;
            } else {
                conversation = await Conversation.create({
                    type: "direct",
                    participants: [
                        {
                            userId: senderID,
                            joinedAt: new Date()
                        },
                        {
                            userId: recipientID,
                            joinedAt: new Date()
                        }
                    ],
                    lastMessageAt: new Date(),

                    lastMessage: {
                        content: content,
                        senderId: senderID,
                        createdAt: new Date()
                    },
                    unreadCount: new Map()
                });
            }

        }

        const message = await Message.create({
            conversationId: conversation._id,
            senderId: senderID,
            content: content
        });

        updateConversationAfterCreateMessage(conversation, message, senderID);

        await conversation.save();

        return res.status(201).json({ message: message });
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

// [POST] /message/group
export const sendGroupMessage = async (req, res) => {
    try {
        const { conversationID, content } = req.body;
        const userID = req.user._id;
        if (!conversationID) {
            return res.status(404).json({ message: "Vui lòng gửi id nhóm" });
        }

        const conversation = req.conversation;

        if (!content) {
            return res.status(404).json({ message: "Thiếu nội dung" });
        }

        const message = await Message.create({
            conversationId: conversationID,
            senderId: userID,
            content: content
        });

        await message.save();

        updateConversationAfterCreateMessage(conversation, message, userID);

        return res.status(200).json({
            message: "Đã gửi tin nhắn",
            message: message
        });


    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn vào nhóm", error);
        return res.status(500).json("Lỗi hệ thống");
    }
}