import Signout from '@/components/auth/signout';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { LogOut } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export const ChatApp = () => {
  const user = useAuthStore((state) => state.user);
  const handOnClick = async ()=> {
    try {
      await api.get("/user/test", {withCredentials: true});
      toast.success("ok");
    } catch (error) {
      toast.error("Thất bại");
    }
  }
  return (
    <div>
      <h1>Chat App</h1>
      <p>Welcome, {user?.userName}!</p>
      <Signout></Signout>
      <Button onClick={handOnClick}>test</Button>
    </div>
  )
}
