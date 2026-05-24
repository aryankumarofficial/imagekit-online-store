"use client";

import AdminAnalyticsPanel from "../components/section/admin/AdminAnalyticsPanel";
import AdminProductForm from "../components/section/admin/AdminProductForm";
import AdminProductsList from "../components/section/admin/AdminProductsList";

export default function AdminPage() {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-10">
            <div className="mx-auto max-w-7xl space-y-8">
                <section className="overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm">
                    <div className="grid gap-6 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-6 py-8 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Admin dashboard
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Manage the store from one place</h1>
                                <p className="max-w-2xl text-base leading-7 text-base-content/70 lg:text-lg">
                                    Track performance, add and edit products, and keep the catalog clean without jumping between screens.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Analytics overview</span>
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Product CRUD</span>
                                <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Search and pagination</span>
                            </div>
                        </div>

                        <div className="grid gap-3 rounded-3xl border border-base-200 bg-base-100/80 p-5 shadow-sm backdrop-blur">
                            <div className="rounded-2xl bg-base-200 px-4 py-3">
                                <p className="text-sm text-base-content/60">Catalog management</p>
                                <p className="mt-1 text-lg font-semibold">Organized workflow</p>
                            </div>
                            <div className="rounded-2xl bg-base-200 px-4 py-3">
                                <p className="text-sm text-base-content/60">Performance tracking</p>
                                <p className="mt-1 text-lg font-semibold">Revenue and orders at a glance</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">Analytics</h2>
                            <p className="text-sm text-base-content/60">A compact view of store health and recent activity.</p>
                        </div>
                    </div>
                    <AdminAnalyticsPanel />
                </section>

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
                    <aside className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                            <div className="mb-5 space-y-2">
                                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                    Create product
                                </div>
                                <h2 className="text-2xl font-bold">New catalog item</h2>
                                <p className="text-sm leading-6 text-base-content/60">
                                    Keep this panel visible while you browse the product list on the right.
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
                            <h2 className="text-2xl font-bold">Products</h2>
                            <p className="text-sm leading-6 text-base-content/60">
                                Search, edit, paginate, or remove products from a dedicated catalog area.
                            </p>
                        </div>
                        <AdminProductsList />
                    </div>
                </section>
            </div>
        </div>
    );
}