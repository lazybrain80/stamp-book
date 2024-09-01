import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5분

const useTokenRefresh = () => {
    const { data: session } = useSession();
    useEffect(() => {
        const refreshToken = async () => {
            if (session) {
                try {
                    await signIn('credentials', {
                    redirect: false,
                    });
                } catch (error) {
                    console.error('Error refreshing token:', error);
                }
            }
        };
        const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
        return () => clearInterval(intervalId);
    }, [session]);
};

export default useTokenRefresh;