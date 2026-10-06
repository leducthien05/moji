import type { Conversation } from '@/types/chat'
import React from 'react'
import ChatCard from './ChatCard'
import { useChatStore } from '@/stores/useChatStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from 'cn'
import UnreadCountBadge from './UnreadCountBadge'
import GroupChatAvatar from './GroupChatAvatar'

const GroupChatCard = ({ conver }: { conver: Conversation }) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, message} = useChatStore();
    console.log(user)
    if(!user) return null;

    const unreadCount = conver.unreadCount[user._id];
    const name = conver.group?.name ?? ""; 

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if(!message[id]){

        }
    }
    return (
        <ChatCard
            convoId={conver._id}
            name={name}
            timestamp={
                conver.lastMessage?.createdAt ? new Date(conver.lastMessage.createdAt) : undefined
            }
            isActive = {activeConversationId === conver._id}
            onSelect={handleSelectConversation}
            unreadCount={unreadCount}
            leftSection={
                <>
                    {/* group avatar */}
                    {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount}/>}
                    <GroupChatAvatar
                        participant= {conver.participants}
                        type="chat"    
                    />
                    {/* status badge */}
                    {/* unreadcount */}
                </>
            }

            // Tin nhắn cuối cùng
            subtitle={
                <p className={cn("text-sm truncate text-muted-foreground")}>
                    {conver.participants.length} Thành viên
                </p>
            }
        />
    )
}

export default GroupChatCard;