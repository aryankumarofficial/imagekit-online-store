"use client";

import {useEffect, useMemo, useState} from "react";
import {apiClient} from "@/lib/api-client";
import {IProduct} from "@/models/Product";
import AdminProductForm from "./AdminProductForm";
import {Search, Trash2, Edit2, ChevronLeft, ChevronRight, Loader2} from "lucide-react";

export default function AdminProductsList() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<IProduct | null>(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
    const pageSize = 6;

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

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        setPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return products;

        return products.filter((product) => {
            const haystack = `${product.name} ${product.description} ${product.variants.map((variant) => variant.type).join(" ")}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [products, query]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    const handleEdit = (p: IProduct) => {
        setSelected(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleDelete = async (product: IProduct) => {
        try {
            if (!product._id) return;
            await apiClient.deleteProduct(product._id.toString());
            setProducts((current) => current.filter((p) => p._id?.toString() !== product._id?.toString()));
            setProductToDelete(null);
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
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-2xl font-semibold">Products</h2>
                    <div className="text-sm text-base-content/60">
                        {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
                    </div>
                </div>

                <label className="input input-bordered flex items-center gap-2 w-full">
                    <Search className="w-4 h-4 opacity-60" />
                    <input
                        type="search"
                        className="grow"
                        placeholder="Search by name, description, or size..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </label>
            </div>

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
                    {paginatedProducts.map((p) => {
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
                                        <button className="btn btn-sm btn-error" onClick={() => setProductToDelete(p)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    {!loading && paginatedProducts.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-base-content/60">
                                No products match your search.
                            </td>
                        </tr>
                    )}
                    {loading && (
                        <tr>
                            <td colSpan={4} className="text-center py-8">
                                <div className="inline-flex items-center gap-2 text-base-content/60">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading products...
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                <div className="text-sm text-base-content/60">
                    Page {page} of {totalPages}
                </div>
                <div className="join">
                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        className="btn btn-sm join-item"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-xl">
                        <h3 className="text-xl font-semibold">Delete product?</h3>
                        <p className="mt-2 text-base-content/70">
                            This will permanently remove <span className="font-medium">{productToDelete.name}</span>.
                        </p>
                        <div className="mt-6 flex justify-end gap-3">
                            <button className="btn btn-ghost" onClick={() => setProductToDelete(null)}>
                                Cancel
                            </button>
                            <button className="btn btn-error" onClick={() => handleDelete(productToDelete)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
