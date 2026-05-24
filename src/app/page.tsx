"use client";

import React, { useEffect, useState } from 'react'
import { IProduct } from "@/models/Product";
import { apiClient, HTTPError } from "@/lib/api-client";
import ImageGallery from "@/app/components/section/products/ImageGallery";
import { NotificationTypes, useNotification } from "./components/Notification"



const Home = () => {
    const { showNotification } = useNotification();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            setLoading(true);
            try {
                const data = await apiClient.getProducts(controller.signal);
                setProducts(data.products);
            } catch (e: any) {
                console.error("Error fetching products", e);

                if (e.name !== "AbortError")

                    if (e instanceof HTTPError) {
                        const errorMsg = e.body?.error || "An API Error Occurred";
                        showNotification(errorMsg, NotificationTypes.ERROR);
                    } else
                        showNotification("Unknown Error Occurred", NotificationTypes.ERROR);
            } finally {
                setLoading(false);
            }
        })()
        return () => {
            controller.abort()
        }

    }, [showNotification]);

    if (loading) {
        return (
            <main className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="flex justify-center items-center h-96">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="mb-12">
                <h1 className="text-5xl font-extrabold mb-4">ImageKit Shop</h1>
                <p className="text-xl text-base-content/70">
                    High-quality products delivered with optimized images
                </p>
            </div>
            <ImageGallery products={products} />
        </main>
    )
}
export default Home
