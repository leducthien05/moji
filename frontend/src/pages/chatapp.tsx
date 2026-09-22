import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import ChatWindowLayout from '@/components/chat/ChatWindowLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';

const ChatApp = () => {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className='flex h-screen w-full p-2'>
          <ChatWindowLayout />
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default ChatApp;
