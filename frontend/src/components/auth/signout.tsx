import React from 'react';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

const Signout = () => {
    const { signOut } = useAuthStore();
    const navigate = useNavigate();
    const handleSignOut = () => {
        signOut();
        navigate("/signin");
    };

    return (
        <Button onClick={handleSignOut}>Sign Out</Button>
    )
}

export default Signout;