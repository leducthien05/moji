import React from 'react';
import { cn } from 'cn';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { Participant } from "@/types/chat";
import AvatarChatCard from './AvatarChatCard';
import { Ellipsis } from 'lucide-react';

interface GroupAvatarProps {
    participant: Participant[];
    type: "chat" | "sidebar";
}



const GroupChatAvatar = ({ participant, type}: GroupAvatarProps) => {
    const avatar = [];
    const limit = Math.min(participant.length, 4);

    for(let i = 0; i < limit; i ++){
        const member = participant[i];
        avatar.push(
            <AvatarChatCard 
                key={i}
                type = {type}
                name={member.displayName}
                avatarUrl={member.avatarUrl ?? undefined}
            />
        );

    }

    return( 
        <div className="relative flex -space-x-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-2">
            {avatar}

            {
                participant.length > 4 && <div className="flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
                    <Ellipsis className="size-4"/>
                </div>
            }
        </div>
    )
}

export default GroupChatAvatar;