export const updateConversationAfterCreateMessage = (conversation, message, senderID) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId: senderID,
            createdAt: message.createdAt
        },

    });

    conversation.participants.forEach((p) => {
        const memberID = p.userId.toString();
        const isSender = memberID === senderID;
        const  prevCount = conversation.unreadCount.get(memberID) || 0;
        conversation.unreadCount.set(memberID, isSender ? 0 : prevCount + 1);
    });
}