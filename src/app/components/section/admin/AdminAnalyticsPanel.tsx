"use client";

import {type ComponentType, useEffect, useMemo, useState} from "react";
import {apiClient, AdminAnalyticsResponse} from "@/lib/api-client";
import {BarChart3, Clock3, DollarSign, Package, RefreshCw, ShoppingBag, Users, Activity} from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

function formatMoney(paise: number) {
    return currency.format(paise / 100);
}

function formatDateLabel(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function formatMonthLabel(monthString: string) {
    const [year, month] = monthString.split("-").map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
    });
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}) {
    return (
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm text-base-content/60">{title}</p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight">{value}</h3>
                    <p className="mt-1 text-sm text-base-content/60">{description}</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default function AdminAnalyticsPanel() {
    const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadAnalytics = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.getAdminAnalytics();
                if (mounted) {
                    setData(response);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Failed to load analytics");
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadAnalytics();

        return () => {
            mounted = false;
        };
    }, []);

    const maxDailyRevenue = useMemo(
        () => Math.max(1, ...(data?.dailyRevenue.map((entry) => entry.revenuePaise) ?? [1])),
        [data]
    );
    const maxMonthlyRevenue = useMemo(
        () => Math.max(1, ...(data?.monthlyRevenue.map((entry) => entry.revenuePaise) ?? [1])),
        [data]
    );
    const totalOrders = useMemo(
        () => data?.statusBreakdown.reduce((sum, item) => sum + item.count, 0) ?? 0,
        [data]
    );

    if (loading) {
        return (
            <div className="space-y-4 rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 text-base-content/70">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Loading analytics...
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-28 animate-pulse rounded-2xl bg-base-200" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-error/20 bg-error/5 p-6 text-error">
                <p className="font-semibold">Analytics unavailable</p>
                <p className="mt-1 text-sm">{error}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const summary = data.summary;
    const completionRate = summary.orderCount > 0 ? Math.round((summary.completedCount / summary.orderCount) * 100) : 0;

    return (
        <section className="space-y-6 rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard analytics
                    </div>
                    <h2 className="mt-3 text-2xl font-black tracking-tight">Store performance</h2>
                    <p className="text-sm text-base-content/60">Live counts, revenue, recent orders, and product movers.</p>
                </div>
                <div className="rounded-2xl bg-base-200 px-4 py-3 text-sm text-base-content/70">
                    Completion rate: <span className="font-semibold text-base-content">{completionRate}%</span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Revenue"
                    value={formatMoney(summary.completedRevenuePaise)}
                    description="Completed orders only"
                    icon={DollarSign}
                />
                <StatCard
                    title="Orders"
                    value={summary.orderCount.toString()}
                    description={`${summary.completedCount} completed • ${summary.pendingCount} pending`}
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Products"
                    value={summary.productCount.toString()}
                    description="Active catalog items"
                    icon={Package}
                />
                <StatCard
                    title="Users"
                    value={summary.userCount.toString()}
                    description="Registered accounts"
                    icon={Users}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div className="rounded-2xl border border-base-200 bg-base-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Last 7 days</h3>
                            <p className="text-sm text-base-content/60">Completed revenue trend</p>
                        </div>
                        <div className="text-right text-sm text-base-content/70">
                            <p>AOV: <span className="font-semibold text-base-content">{formatMoney(summary.averageOrderValuePaise)}</span></p>
                        </div>
                    </div>

                    <div className="mt-6 flex h-64 items-end gap-3 overflow-hidden rounded-2xl bg-base-100 p-4">
                        {data.dailyRevenue.map((entry) => {
                            const barHeight = `${Math.max(6, (entry.revenuePaise / maxDailyRevenue) * 100)}%`;
                            return (
                                <div key={entry.date} className="flex-1 min-w-0 text-center">
                                    <div className="flex h-44 items-end justify-center">
                                        <div
                                            className="w-full max-w-12 rounded-t-2xl bg-primary/80 transition-all"
                                            style={{ height: barHeight }}
                                            title={`${formatDateLabel(entry.date)} - ${formatMoney(entry.revenuePaise)}`}
                                        />
                                    </div>
                                    <div className="mt-3 text-[11px] font-medium text-base-content/60">{formatDateLabel(entry.date)}</div>
                                    <div className="text-xs font-semibold text-base-content">{formatMoney(entry.revenuePaise)}</div>
                                    <div className="text-[11px] text-base-content/50">{entry.orders} order{entry.orders === 1 ? "" : "s"}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-base-200 bg-base-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Top products</h3>
                            <p className="text-sm text-base-content/60">By order volume</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {data.topProducts.length > 0 ? data.topProducts.map((product, index) => (
                            <div key={`${product.productName}-${index}`} className="rounded-2xl border border-base-200 bg-base-100 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-semibold leading-5">{product.productName}</p>
                                        <p className="text-sm text-base-content/60">{product.orders} orders</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-semibold">{formatMoney(product.revenuePaise)}</p>
                                        <p className="text-base-content/50">Revenue</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="rounded-2xl border border-dashed border-base-300 p-6 text-center text-sm text-base-content/60">
                                No completed sales yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-base-200 bg-base-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">6 month revenue</h3>
                            <p className="text-sm text-base-content/60">Completed order trend by month</p>
                        </div>
                        <Activity className="h-4 w-4 text-base-content/40" />
                    </div>

                    <div className="mt-6 flex h-56 items-end gap-3 rounded-2xl bg-base-100 p-4">
                        {data.monthlyRevenue.map((entry) => {
                            const barHeight = `${Math.max(8, (entry.revenuePaise / maxMonthlyRevenue) * 100)}%`;
                            return (
                                <div key={entry.date} className="flex-1 min-w-0 text-center">
                                    <div className="flex h-36 items-end justify-center">
                                        <div
                                            className="w-full max-w-12 rounded-t-2xl bg-secondary/80 transition-all"
                                            style={{ height: barHeight }}
                                            title={`${formatMonthLabel(entry.date)} - ${formatMoney(entry.revenuePaise)}`}
                                        />
                                    </div>
                                    <div className="mt-3 text-[11px] font-medium text-base-content/60">{formatMonthLabel(entry.date)}</div>
                                    <div className="text-xs font-semibold text-base-content">{formatMoney(entry.revenuePaise)}</div>
                                    <div className="text-[11px] text-base-content/50">{entry.orders} order{entry.orders === 1 ? "" : "s"}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-base-200 bg-base-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Order status</h3>
                            <p className="text-sm text-base-content/60">Breakdown of all orders in the system</p>
                        </div>
                        <Activity className="h-4 w-4 text-base-content/40" />
                    </div>

                    <div className="mt-5 space-y-4">
                        {data.statusBreakdown.map((item) => {
                            const percent = totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0;
                            return (
                                <div key={item._id} className="space-y-2 rounded-2xl border border-base-200 bg-base-100 p-4">
                                    <div className="flex items-center justify-between gap-4 text-sm">
                                        <span className="font-semibold capitalize">{item._id}</span>
                                        <span className="text-base-content/60">{item.count} orders • {percent}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-base-200">
                                        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, percent)}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-base-200 bg-base-50 p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Recent orders</h3>
                        <p className="text-sm text-base-content/60">Latest customer activity</p>
                    </div>
                    <Clock3 className="h-4 w-4 text-base-content/40" />
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Order</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.recentOrders.map((order) => (
                            <tr key={order.id}>
                                <td className="font-medium">#{order.id.slice(-6)}</td>
                                <td>{order.productName}</td>
                                <td>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                            order.status === "completed"
                                                ? "bg-success/15 text-success"
                                                : order.status === "pending"
                                                    ? "bg-warning/15 text-warning"
                                                    : "bg-error/15 text-error"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td>{formatMoney(order.amountPaise)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
