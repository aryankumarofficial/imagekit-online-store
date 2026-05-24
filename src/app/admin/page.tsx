"use client";

import AdminAnalyticsPanel from "../components/section/admin/AdminAnalyticsPanel";
import AdminProductForm from "../components/section/admin/AdminProductForm";
import AdminProductsList from "../components/section/admin/AdminProductsList";

export default function AdminPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                    <AdminAnalyticsPanel />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-medium mb-4">Add New Product</h2>
                        <AdminProductForm />
                    </div>
                    <div>
                        <AdminProductsList />
                    </div>
                </div>
            </div>
        </div>
    );
}