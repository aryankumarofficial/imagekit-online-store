import Link from "next/link";
import {ArrowRight, BarChart3, Boxes, Sparkles} from "lucide-react";

const shortcuts = [
    {
        href: "/admin/analytics",
        label: "Open analytics",
        description: "See revenue, orders, and top products.",
        icon: BarChart3,
    },
    {
        href: "/admin/products",
        label: "Manage products",
        description: "Create, edit, search, and delete catalog items.",
        icon: Boxes,
    },
];

export default function AdminOverviewPage() {
    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-sm">
                <div className="grid gap-6 bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 px-6 py-8 lg:grid-cols-[1.5fr_1fr] lg:px-8 lg:py-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                            Admin dashboard
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">Manage the store from one place</h1>
                            <p className="max-w-2xl text-base leading-7 text-base-content/70 lg:text-lg">
                                Use the dashboard sections to move between analytics and catalog management without everything feeling stacked in one screen.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                            <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Overview</span>
                            <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Analytics</span>
                            <span className="rounded-full border border-base-300 bg-base-100 px-3 py-1">Products</span>
                        </div>
                    </div>

                    <div className="grid gap-3 rounded-3xl border border-base-200 bg-base-100/80 p-5 shadow-sm backdrop-blur">
                        <div className="rounded-2xl bg-base-200 px-4 py-3">
                            <p className="text-sm text-base-content/60">Navigation</p>
                            <p className="mt-1 text-lg font-semibold">Three focused pages</p>
                        </div>
                        <div className="rounded-2xl bg-base-200 px-4 py-3">
                            <p className="text-sm text-base-content/60">Workflow</p>
                            <p className="mt-1 text-lg font-semibold">Less clutter, clearer focus</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {shortcuts.map((shortcut) => {
                    const Icon = shortcut.icon;
                    return (
                        <Link
                            key={shortcut.href}
                            href={shortcut.href}
                            className="group rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold">{shortcut.label}</h2>
                                    <p className="mt-2 text-sm leading-6 text-base-content/60">{shortcut.description}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-base-content/40 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    );
                })}
            </section>

            <section className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                        <h2 className="text-2xl font-bold">Start here</h2>
                        <p className="text-sm text-base-content/60">Analytics are on their own page, and product operations live in the catalog section.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
