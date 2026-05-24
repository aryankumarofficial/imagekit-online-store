"use client";

import React from "react";
import {usePathname} from "next/navigation";
import {ImageKitProvider} from "imagekitio-next";
import {SessionProvider} from "next-auth/react";
import {NotificationProvider} from "@/app/components/Notification";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;

export default function Providers({children}: { children: React.ReactNode }) {
    const pathname = usePathname();
    const authenticator = async () => {
        try {
            const response = await fetch('/api/imagekit-auth');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const {signature, token, expire} = data;
            return {signature, token, expire};
        } catch (error: any) {
            console.error('Error fetching authentication data:', error);
            throw new Error(`Authentication failed: ${error?.message}`);
        }
    };

    return (
        <SessionProvider refetchInterval={5 * 60}>
            <NotificationProvider>
                <ImageKitProvider
                    urlEndpoint={urlEndpoint}
                    publicKey={publicKey}
                    authenticator={pathname?.startsWith("/admin") ? authenticator : undefined}
                >
                    {children}
                </ImageKitProvider>
            </NotificationProvider>
        </SessionProvider>
    );
}