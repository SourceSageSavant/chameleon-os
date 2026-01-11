'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface DashboardStats {
    totalStores: number;
    totalProducts: number;
    totalOrders: number;
    revenue: number;
}

interface RecentOrder {
    id: string;
    order_number: number;
    customer_email: string;
    total: number;
    payment_status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStores: 0,
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            const supabase = createBrowserClient();

            // Fetch counts
            const [storesRes, productsRes, ordersRes] = await Promise.all([
                supabase.from('stores').select('id', { count: 'exact', head: true }),
                supabase.from('products').select('id', { count: 'exact', head: true }),
                supabase.from('orders').select('id, total', { count: 'exact' }),
            ]);

            // Calculate revenue from orders
            const orders = ordersRes.data || [];
            const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

            setStats({
                totalStores: storesRes.count || 0,
                totalProducts: productsRes.count || 0,
                totalOrders: ordersRes.count || 0,
                revenue,
            });

            // Fetch recent orders
            const { data: recent } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentOrders(recent || []);
            setLoading(false);
        }

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Stores', value: stats.totalStores, icon: 'store', color: 'bg-blue-500', href: '/admin/stores' },
        { label: 'Total Products', value: stats.totalProducts, icon: 'package', color: 'bg-green-500', href: '/admin/products' },
        { label: 'Total Orders', value: stats.totalOrders, icon: 'orders', color: 'bg-purple-500', href: '/admin/orders' },
        { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: 'revenue', color: 'bg-yellow-500', href: '/admin/orders' },
    ];

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Chameleon Commerce OS</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {loading ? '...' : stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/stores/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">New Store</p>
                                <p className="text-sm text-gray-500">Create a store</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">New Product</p>
                                <p className="text-sm text-gray-500">Add a product</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-green-600 hover:underline">
                            View all
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Loading...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No orders yet</p>
                            <p className="text-sm">Orders will appear here once customers start buying</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                                        <p className="text-sm text-gray-500">{order.customer_email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">${Number(order.total).toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.payment_status === 'paid'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
