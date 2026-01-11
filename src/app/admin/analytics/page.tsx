'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalProducts: number;
    totalStores: number;
    recentOrders: Order[];
    revenueByDay: { date: string; revenue: number }[];
    ordersByStatus: { status: string; count: number }[];
}

interface Order {
    id: string;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    async function fetchAnalytics() {
        setLoading(true);
        const supabase = createBrowserClient();

        // Calculate date range
        const now = new Date();
        const daysBack = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

        // Fetch orders
        const { data: orders } = await supabase
            .from('orders')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: false });

        // Fetch counts
        const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        const { count: storeCount } = await supabase
            .from('stores')
            .select('*', { count: 'exact', head: true });

        // Calculate metrics
        const orderList = orders || [];
        const totalRevenue = orderList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        const totalOrders = orderList.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Revenue by day
        const revenueByDay: { [key: string]: number } = {};
        orderList.forEach((order) => {
            const date = new Date(order.created_at).toISOString().split('T')[0];
            revenueByDay[date] = (revenueByDay[date] || 0) + (Number(order.total) || 0);
        });

        // Fill in missing days
        const revenueData: { date: string; revenue: number }[] = [];
        for (let i = daysBack - 1; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            revenueData.push({
                date: dateStr,
                revenue: revenueByDay[dateStr] || 0,
            });
        }

        // Orders by status
        const statusCount: { [key: string]: number } = {};
        orderList.forEach((order) => {
            const status = order.status || 'pending';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        setData({
            totalRevenue,
            totalOrders,
            averageOrderValue,
            totalProducts: productCount || 0,
            totalStores: storeCount || 0,
            recentOrders: orderList.slice(0, 5),
            revenueByDay: revenueData,
            ordersByStatus: Object.entries(statusCount).map(([status, count]) => ({ status, count })),
        });

        setLoading(false);
    }

    if (loading || !data) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    const maxRevenue = Math.max(...data.revenueByDay.map((d) => d.revenue), 1);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
                    <p className="text-slate-600 mt-1">Track your store performance</p>
                </div>
                <div className="flex gap-2">
                    {(['7d', '30d', '90d'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-[#1e3a5f] text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${data.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon="💰"
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Total Orders"
                    value={data.totalOrders.toString()}
                    icon="📦"
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Avg Order Value"
                    value={`$${data.averageOrderValue.toFixed(2)}`}
                    icon="📊"
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Products / Stores"
                    value={`${data.totalProducts} / ${data.totalStores}`}
                    icon="🏪"
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Revenue Over Time</h2>
                    <div className="h-64 flex items-end gap-1">
                        {data.revenueByDay.map((day, index) => (
                            <div
                                key={day.date}
                                className="flex-1 flex flex-col items-center group relative"
                            >
                                <div
                                    className="w-full bg-[#1e3a5f] rounded-t transition-all hover:bg-[#2d4a6f]"
                                    style={{
                                        height: `${(day.revenue / maxRevenue) * 100}%`,
                                        minHeight: day.revenue > 0 ? '4px' : '0',
                                    }}
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                    {new Date(day.date).toLocaleDateString()}: ${day.revenue.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>{new Date(data.revenueByDay[0]?.date).toLocaleDateString()}</span>
                        <span>{new Date(data.revenueByDay[data.revenueByDay.length - 1]?.date).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6">Orders by Status</h2>
                    {data.ordersByStatus.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No orders yet</p>
                    ) : (
                        <div className="space-y-4">
                            {data.ordersByStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={item.status} />
                                        <span className="text-slate-700 capitalize">{item.status}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                </div>
                {data.recentOrders.length === 0 ? (
                    <p className="text-slate-400 text-center py-12">No orders in this period</p>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Order ID</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Date</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Payment</th>
                                <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">
                                        {order.id.slice(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.payment_status} type="payment" />
                                    </td>
                                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                                        ${Number(order.total).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                    {icon}
                </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function StatusBadge({ status, type = 'order' }: { status: string; type?: 'order' | 'payment' }) {
    const colors: Record<string, string> = {
        // Order statuses
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        // Payment statuses
        paid: 'bg-green-100 text-green-700',
        unpaid: 'bg-red-100 text-red-700',
        refunded: 'bg-slate-100 text-slate-700',
    };

    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
}
