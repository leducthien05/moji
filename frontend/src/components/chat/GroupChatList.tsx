import React from 'react';
import { useChatStore } from '@/stores/useChatStore';
import GroupChatCard from './GroupChatCard';

const GroupChatList = () => {
  const { conversation } = useChatStore();

  if (!conversation) {
    return;
  }

  const directConversation = conversation.filter((conver) => conver.type === "group");
  return (

    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {
        directConversation.map((convo) => (
          <GroupChatCard
            key={convo._id}
            conver={convo}
          />
        ))
      }
    </div>
  )
}

export default GroupChatList