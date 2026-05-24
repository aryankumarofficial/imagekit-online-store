import {notFound} from "next/navigation";
import Product from "@/models/Product";
import AdminProductDetailClient from "../../../components/section/admin/AdminProductDetailClient";

async function getProduct(id: string) {
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
