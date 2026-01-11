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

            const [storesRes, productsRes, ordersRes] = await Promise.all([
                supabase.from('stores').select('id', { count: 'exact', head: true }),
                supabase.from('products').select('id', { count: 'exact', head: true }),
                supabase.from('orders').select('id, total', { count: 'exact' }),
            ]);

            const orders = ordersRes.data || [];
            const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

            setStats({
                totalStores: storesRes.count || 0,
                totalProducts: productsRes.count || 0,
                totalOrders: ordersRes.count || 0,
                revenue,
            });

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

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome to Chameleon Commerce OS</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <Link href="/admin/stores" className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Stores</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">
                                {loading ? '—' : stats.totalStores}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/products" className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Products</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">
                                {loading ? '—' : stats.totalProducts}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/orders" className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Orders</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">
                                {loading ? '—' : stats.totalOrders}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/orders" className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Revenue</p>
                            <p className="text-2xl font-semibold text-slate-900 mt-1">
                                {loading ? '—' : `$${stats.revenue.toFixed(2)}`}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/stores/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-[#1e3a5f] hover:bg-slate-50 transition-all"
                        >
                            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">New Store</p>
                                <p className="text-sm text-slate-500">Create a store</p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-[#1e3a5f] hover:bg-slate-50 transition-all"
                        >
                            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">New Product</p>
                                <p className="text-sm text-slate-500">Add a product</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-[#1e3a5f] hover:underline font-medium">
                            View all
                        </Link>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading...</div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>No orders yet</p>
                            <p className="text-sm">Orders will appear here once customers start buying</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-slate-900">Order #{order.order_number}</p>
                                        <p className="text-sm text-slate-500">{order.customer_email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-slate-900">${Number(order.total).toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${order.payment_status === 'paid'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
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

