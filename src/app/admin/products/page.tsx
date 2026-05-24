import AdminProductForm from "../../components/section/admin/AdminProductForm";
import AdminProductsList from "../../components/section/admin/AdminProductsList";

export default function AdminProductsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Products</h1>
                <p className="mt-2 text-base-content/60">Create, edit, search, paginate, and remove catalog items.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[420px_1fr]">
                <aside className="xl:sticky xl:top-6 xl:self-start">
                    <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                        <div className="mb-5 space-y-2">
                            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Create product
                            </div>
                            <h2 className="text-2xl font-bold">New catalog item</h2>
                            <p className="text-sm leading-6 text-base-content/60">
                                Keep this form visible while you work through the catalog list.
                            </p>
                        </div>
                        <AdminProductForm />
                    </div>
                </aside>

                <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                    <div className="mb-5 space-y-2">
                        <div className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                            Catalog
                        </div>
                        <h2 className="text-2xl font-bold">Product list</h2>
                        <p className="text-sm leading-6 text-base-content/60">
                            Search, edit, paginate, or delete products from the catalog.
                        </p>
                    </div>
                    <AdminProductsList />
                </div>
            </div>
        </div>
    );
}
