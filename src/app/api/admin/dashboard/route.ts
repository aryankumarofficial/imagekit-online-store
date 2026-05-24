export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withDatabase } from "@/lib/withDatabase";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

type RecentOrderRow = {
    id: string;
    productName: string;
    status: string;
    amountPaise: number;
    createdAt: string;
};

type SeriesPoint = {
    date: string;
    revenuePaise: number;
    orders: number;
};

async function handler() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [productCount, userCount, orderCount, completedCount, pendingCount, failedCount] = await Promise.all([
            Product.countDocuments(),
            User.countDocuments(),
            Order.countDocuments(),
            Order.countDocuments({ status: "completed" }),
            Order.countDocuments({ status: "pending" }),
            Order.countDocuments({ status: "failed" }),
        ]);

        const revenueAgg = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, revenuePaise: { $sum: "$amount" }, averagePaise: { $avg: "$amount" } } },
        ]);

        const completedRevenuePaise = revenueAgg[0]?.revenuePaise ?? 0;
        const averageOrderValuePaise = revenueAgg[0]?.averagePaise ?? 0;

        const recentOrders = (await Order.find()
            .populate({
                path: "productId",
                select: "name",
                options: { strictPopulate: false },
            })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean()) as any[];

        const recentOrdersFormatted: RecentOrderRow[] = recentOrders.map((order) => ({
            id: order._id.toString(),
            productName: order.productId?.name || "Unknown product",
            status: order.status,
            amountPaise: order.amount,
            createdAt: order.createdAt.toISOString(),
        }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);

        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    revenuePaise: { $sum: "$amount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const dailyRevenueMap = new Map(dailyRevenue.map((entry: { _id: string; revenuePaise: number; orders: number }) => [entry._id, entry]));

        const sevenDaySeries: SeriesPoint[] = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            const key = date.toISOString().slice(0, 10);
            const hit = dailyRevenueMap.get(key);

            return {
                date: key,
                revenuePaise: hit?.revenuePaise ?? 0,
                orders: hit?.orders ?? 0,
            };
        });

        const monthCursor = new Date();
        monthCursor.setDate(1);
        monthCursor.setHours(0, 0, 0, 0);
        monthCursor.setMonth(monthCursor.getMonth() - 5);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: { $gte: monthCursor },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$createdAt" },
                    },
                    revenuePaise: { $sum: "$amount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const monthlyRevenueMap = new Map(monthlyRevenue.map((entry: { _id: string; revenuePaise: number; orders: number }) => [entry._id, entry]));

        const sixMonthSeries: SeriesPoint[] = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(monthCursor);
            date.setMonth(monthCursor.getMonth() + index);
            const key = date.toISOString().slice(0, 7);
            const hit = monthlyRevenueMap.get(key);

            return {
                date: key,
                revenuePaise: hit?.revenuePaise ?? 0,
                orders: hit?.orders ?? 0,
            };
        });

        const statusBreakdown = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        const topProducts = await Order.aggregate([
            {
                $group: {
                    _id: "$productId",
                    orders: { $sum: 1 },
                    revenuePaise: { $sum: "$amount" },
                },
            },
            { $sort: { orders: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    productName: { $ifNull: ["$product.name", "Unknown product"] },
                    orders: 1,
                    revenuePaise: 1,
                },
            },
        ]);

        return NextResponse.json(
            {
                summary: {
                    productCount,
                    userCount,
                    orderCount,
                    completedCount,
                    pendingCount,
                    failedCount,
                    completedRevenuePaise,
                    averageOrderValuePaise,
                },
                recentOrders: recentOrdersFormatted,
                dailyRevenue: sevenDaySeries,
                monthlyRevenue: sixMonthSeries,
                statusBreakdown,
                topProducts,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while loading analytics" }, { status: 500 });
    }
}

export const GET = await withDatabase(handler);
