"use client";

import {useRef, useState} from "react";
import AdminProductForm from "../../components/section/admin/AdminProductForm";
import AdminProductsList from "../../components/section/admin/AdminProductsList";
import {Plus, X} from "lucide-react";

export default function AdminProductsPage() {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const openDialog = () => {
        dialogRef.current?.showModal();
        setDialogOpen(true);
    };

    const closeDialog = () => {
        dialogRef.current?.close();
        setDialogOpen(false);
    };

    const handleSuccess = () => {
        closeDialog();
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Products</h1>
                    <p className="mt-2 max-w-2xl text-base-content/60">Create, edit, search, paginate, and remove catalog items from a dedicated page.</p>
                </div>

                <button className="btn btn-primary gap-2 w-full lg:w-auto" onClick={openDialog}>
                    <Plus className="h-4 w-4" />
                    Add product
                </button>
            </div>

            <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="mb-5 space-y-2">
                    <div className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                        Catalog
                    </div>
                    <h2 className="text-2xl font-bold">Product list</h2>
                    <p className="text-sm leading-6 text-base-content/60">
                        Search, view, or delete products from the catalog. Use the detail page for edits.
                    </p>
                </div>
                <AdminProductsList refreshKey={refreshKey} />
            </div>

            <dialog ref={dialogRef} className="modal">
                <div className="modal-box w-11/12 max-w-3xl rounded-3xl p-0">
                    <div className="flex items-start justify-between gap-4 border-b border-base-200 px-6 py-5">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Add new product</h3>
                            <p className="mt-1 text-sm text-base-content/60">Fill in the details and create the product from here.</p>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={closeDialog} aria-label="Close dialog">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-6 py-6">
                        <AdminProductForm onSuccess={handleSuccess} />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeDialog}>close</button>
                </form>
            </dialog>

            {dialogOpen && <div aria-hidden="true" className="hidden" />}
        </div>
    );
}
