import Link from "next/link";
import {BarChart3, Boxes, LayoutDashboard, PackagePlus} from "lucide-react";

const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/products", label: "Products", icon: Boxes },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-8 lg:py-10">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[260px_1fr]">
                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <div className="rounded-3xl border border-base-200 bg-base-100 p-5 shadow-sm">
                        <div className="mb-5 space-y-2">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                                Admin center
                            </div>
                            <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
                            <p className="text-sm leading-6 text-base-content/60">
                                Switch between overview, analytics, and catalog management.
                            </p>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-2xl border border-base-200 px-4 py-3 text-sm font-medium text-base-content/80 transition-colors hover:border-primary/30 hover:bg-primary/5"
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-5 rounded-2xl bg-base-200 px-4 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <PackagePlus className="h-4 w-4" />
                                Quick action
                            </div>
                            <p className="mt-2 text-sm text-base-content/60">
                                Use the products page for create, edit, and delete operations.
                            </p>
                        </div>
                    </div>
                </aside>

                <main className="min-w-0">{children}</main>
            </div>
        </div>
    );
}
