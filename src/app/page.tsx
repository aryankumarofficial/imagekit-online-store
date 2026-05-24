import type {Metadata} from "next";
import HomeClient from "@/app/components/home/HomeClient";
import {connectToDatabase} from "@/lib/db";
import Product, {IProduct} from "@/models/Product";

const pageDescription =
    "Browse premium image assets with optimized previews, flexible licenses, and secure Razorpay checkout.";

export const metadata: Metadata = {
    title: "Premium Digital Marketplace",
    description: pageDescription,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "ImageKit Shop",
        description: pageDescription,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "ImageKit Shop",
        description: pageDescription,
    },
};

async function getProducts(): Promise<IProduct[]> {
    try {
        await connectToDatabase();
        const products = await Product.find().sort({createdAt: -1}).lean();
        return JSON.parse(JSON.stringify(products)) as IProduct[];
    } catch (error) {
        console.error("Error loading homepage products", error);
        return [];
    }
}

export default async function Home() {
    const products = await getProducts();

    return <HomeClient products={products}/>;
}
