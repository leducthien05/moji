import React from 'react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
import { LogOutIcon } from 'lucide-react';

const Signout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut();
        navigate("/signin");
    };

    return (
        <Button variant="completeGhost" onClick={handleSignOut}>
            <LogOutIcon className="text-destructive"/>
            Log out
        </Button>
    )
}

export default Signout;