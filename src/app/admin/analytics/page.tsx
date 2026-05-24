import AdminAnalyticsPanel from "../../components/section/admin/AdminAnalyticsPanel";

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
                <p className="mt-2 text-base-content/60">Revenue, orders, top products, and recent activity.</p>
            </div>
            <AdminAnalyticsPanel />
        </div>
    );
}
