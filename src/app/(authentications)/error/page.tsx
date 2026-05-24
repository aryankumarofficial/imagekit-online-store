"use client";
import React from 'react'
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";

const ErrorPage = () => {

    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();

    useEffect(() => {
        router.replace("/");
    }, [router]);

    return (
        <main className={"flex justify-center items-center min-h-[50vh]"}>
            <h1 className={"font-bold text-4xl mb-2 text-red-600 capitalize"}
            >
                {error}
            </h1>
        </main>
    )
}
export default ErrorPage
