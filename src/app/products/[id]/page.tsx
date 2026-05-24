import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {connectToDatabase} from "@/lib/db";
import Product, {IProduct} from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";

type ProductPageParams = {
    params: Promise<{ id: string }>;
};

async function loadProduct(id: string): Promise<IProduct | null> {
    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) {
        return null;
    }

    return JSON.parse(JSON.stringify(product)) as IProduct;
}

export async function generateMetadata({params}: ProductPageParams): Promise<Metadata> {
    const {id} = await params;
    const product = await loadProduct(id);

    if (!product) {
        return {
            title: "Product not found",
        };
    }

    const description = product.description.length > 160
        ? `${product.description.slice(0, 157)}...`
        : product.description;

    return {
        title: product.name,
        description,
        openGraph: {
            title: product.name,
            description,
            type: "website",
        },
        twitter: {
            card: "summary",
            title: product.name,
            description,
        },
    };
}

export default async function ProductPage({params}: ProductPageParams) {
    const {id} = await params;
    const product = await loadProduct(id);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product}/>;
}