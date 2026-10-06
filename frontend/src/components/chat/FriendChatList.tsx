import React from 'react';
import { useChatStore } from '@/stores/useChatStore';
import DirectMessageCard from './DirectMessageCard';

const FriendChatList = () => {
  const { conversation } = useChatStore();

  if (!conversation) {
    return;
  }

  const directConversation = conversation.filter((conver) => conver.type === "direct");
  return (

    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {
        directConversation.map((convo) => (
          <DirectMessageCard
            key={convo._id}
            conver={convo}
          />
        ))
      }
    </div>
  )
}

export default FriendChatList