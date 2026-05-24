import {notFound} from "next/navigation";
import Product from "@/models/Product";
import {connectToDatabase} from "@/lib/db";
import AdminProductDetailClient from "../../../components/section/admin/AdminProductDetailClient";

async function getProduct(id: string) {
    await connectToDatabase();
    const product = await Product.findById(id).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
}

export default async function AdminProductDetailPage({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return <AdminProductDetailClient product={product} />;
}
