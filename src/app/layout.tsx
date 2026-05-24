import type {Metadata} from "next";
import {Space_Grotesk} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/app/components/Providers";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import React from "react";

const spaceGrotesk = Space_Grotesk({subsets: ["latin"]});

const siteDescription =
    "A premium digital marketplace for optimized image assets, flexible licenses, and secure Razorpay checkout.";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
    title: {
        default: "ImageKit Shop",
        template: "%s | ImageKit Shop",
    },
    description: siteDescription,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "ImageKit Shop",
        description: siteDescription,
        type: "website",
        siteName: "ImageKit Shop",
    },
    twitter: {
        card: "summary_large_image",
        title: "ImageKit Shop",
        description: siteDescription,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${spaceGrotesk.className} antialiased min-h-screen flex flex-col`}
        >
        <Script
            src={"https://checkout.razorpay.com/v1/checkout.js"}
            strategy={"lazyOnload"}
        />
        <Providers>
            <Header/>
            <main className={"flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8"}>
                {children}
            </main>
            <Footer/>
        </Providers>
        </body>
        </html>
    );
}
