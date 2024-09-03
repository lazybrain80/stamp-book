'use client';

import { useEffect } from 'react';
import { getSession, SessionProvider, signOut } from "next-auth/react";

type Props = ({
    children: React.ReactNode;
});

const checkTokenExpiration = async () => {
    const session = await getSession();
    if (session && session.expires) {
        const expiresAt = new Date(session.expires).getTime();
        const now = Date.now();
        if (now >= expiresAt) {
            console.log('Token has expired, signing out...');
            signOut()
        }
    }
}

export default function AuthSession({ children }: Props) {
    useEffect(() => {
        checkTokenExpiration();
    }, []);
    return (
    <SessionProvider
        refetchInterval={180}
    >
        {children}
    </SessionProvider>)
}