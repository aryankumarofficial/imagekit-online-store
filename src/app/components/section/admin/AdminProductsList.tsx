"use client";

import {useEffect, useState} from "react";
import {apiClient} from "@/lib/api-client";
import {IProduct} from "@/models/Product";
import AdminProductForm from "./AdminProductForm";
import {Trash2, Edit2} from "lucide-react";

export default function AdminProductsList() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<IProduct | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await apiClient.getProducts(new AbortController().signal as any);
            setProducts(res.products || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (p: IProduct) => {
        setSelected(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        try {
            await apiClient.deleteProduct(id);
            setProducts(products.filter(p => p._id?.toString() !== id));
        } catch (e) {
            console.error(e);
            alert("Failed to delete product");
        }
    }

    const handleSuccess = () => {
        setSelected(null);
        fetchProducts();
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            {selected && (
                <div className="mb-6">
                    <h3 className="font-medium">Editing: {selected.name}</h3>
                    <AdminProductForm initialData={selected} onSuccess={handleSuccess} />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price (lowest)</th>
                        <th>Variants</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((p) => {
                        const lowest = p.variants?.reduce((m, v) => v.price < m ? v.price : m, p.variants[0]?.price || 0) || 0;
                        return (
                            <tr key={p._id?.toString()}>
                                <td>{p.name}</td>
                                <td>₹{lowest.toFixed(2)}</td>
                                <td>{p.variants?.length || 0}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button className="btn btn-sm" onClick={() => handleEdit(p)}>
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="btn btn-sm btn-error" onClick={() => handleDelete(p._id!.toString())}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
