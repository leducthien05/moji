import type { Conversation } from '@/types/chat'
import React from 'react'
import ChatCard from './ChatCard'
import { useChatStore } from '@/stores/useChatStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from 'cn'
import AvatarChatCard from './AvatarChatCard'
import StatusBadge from './StatusBadge'
import UnreadCountBadge from './UnreadCountBadge'

const DirectMessageCard = ({ conver }: { conver: Conversation }) => {
    const {user} = useAuthStore();
    const {activeConversationId, setActiveConversation, message} = useChatStore();
    if(!user) return null;
    
    const otherUser = conver.participants.find((p) => p._id !== user._id);
    if(!otherUser) return null;

    const unreadCount = conver.unreadCount[user._id] ?? 0;

    const lastMessage = conver.lastMessage?.content ?? "";

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if(!message[id]){

        }
    }
    return (
        <ChatCard
            convoId={conver._id}
            name={otherUser.displayName ?? ""}
            timestamp={
                conver.lastMessage?.createdAt ? new Date(conver.lastMessage.createdAt) : undefined
            }
            isActive = {activeConversationId === conver._id}
            onSelect={handleSelectConversation}
            unreadCount={unreadCount}
            leftSection={
                <>
                    {/* user avatar */}
                    <AvatarChatCard 
                        type="sidebar" 
                        name={otherUser.displayName ?? ""}
                        avatarUrl={otherUser.avatarUrl ?? undefined}
                    />
                    {/* status badge */}
                    {/* unreadcount */}
                    <StatusBadge status="offline"/>
                    {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
                </>
            }

            // Tin nhắn cuối cùng
            subtitle={
                <p className={cn("text-sm truncate", unreadCount > 0 ? "font-medium text-foreground": "text-muted-foreground")}>
                    {lastMessage}
                </p>
            }
        />
    )
}

export default DirectMessageCard;