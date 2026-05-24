"use client";

import Link from "next/link";
import {signOut, useSession} from "next-auth/react";
import {Home, LayoutGrid, LogIn, ShoppingBag, User} from "lucide-react";
import {useNotification} from "./Notification";

export default function Header() {
    const {data: session} = useSession();
    const {showNotification} = useNotification();

    const handleSignOut = async () => {
        try {
            await signOut();
            showNotification("Signed out successfully", "success");
        } catch {
            showNotification("Failed to sign out", "error");
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-base-100/80 backdrop-blur-xl">
            <div className="navbar mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex-1 gap-3 px-0 lg:flex-none">
                    <Link
                        href="/"
                        className="btn btn-ghost text-xl gap-2 normal-case font-black tracking-tight"
                        prefetch={true}
                    >
                        <Home className="w-5 h-5"/>
                        ImageKit Shop
                    </Link>
                    <div className="hidden lg:flex items-center gap-2 text-sm text-base-content/60">
                        <span className="badge badge-outline badge-sm">Premium digital assets</span>
                        <span className="badge badge-outline badge-sm">Secure Razorpay checkout</span>
                    </div>
                </div>
                <div className="flex flex-none items-center gap-2">
                    <nav className="hidden md:flex items-center gap-1 mr-2">
                        <Link href="/#catalog" className="btn btn-ghost btn-sm gap-2">
                            <LayoutGrid className="w-4 h-4"/>
                            Catalog
                        </Link>
                        <Link href="/orders" className="btn btn-ghost btn-sm gap-2">
                            <ShoppingBag className="w-4 h-4"/>
                            Orders
                        </Link>
                    </nav>
                    <div className="flex items-stretch gap-2">
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle border border-white/10 bg-base-200/60"
                            >
                                <User className="w-5 h-5"/>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] shadow-2xl bg-base-100 rounded-box w-64 mt-4 py-2 border border-white/10"
                            >
                                {session ? (
                                    <>
                                        <li className="px-4 py-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium opacity-80">
                                                    {session.user?.email?.split("@")[0]}
                                                </span>
                                                {session.user?.role === "admin" && (
                                                    <span className="badge badge-primary badge-sm">Admin</span>
                                                )}
                                            </div>
                                        </li>
                                        <div className="divider my-1"></div>
                                        {session.user?.role === "admin" && (
                                            <li>
                                                <Link
                                                    href="/admin"
                                                    className="px-4 py-2 hover:bg-base-200 block w-full"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link
                                                href="/orders"
                                                className="px-4 py-2 hover:bg-base-200 block w-full"
                                            >
                                                My Orders
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleSignOut}
                                                className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
                                            >
                                                Sign Out
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 hover:bg-base-200 block w-full"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <LogIn className="w-4 h-4"/>
                                                Login
                                            </span>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}