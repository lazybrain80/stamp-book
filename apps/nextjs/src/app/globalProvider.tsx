'use client';
import useTokenRefresh from "./tokenRefresh";

type Props = ({
    children: React.ReactNode;
});

export default function GlobalProvider({ children }: Props) {
    useTokenRefresh()
    return <>{children}</>
}