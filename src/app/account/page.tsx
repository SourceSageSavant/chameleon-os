'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';
import { Header, Footer } from '@/components/ui';

interface Order {
    id: string;
    order_number: string;
    total: number;
    fulfillment_status: string;
    created_at: string;
    line_items: Array<{ title: string; quantity: number }>;
}

interface UserData {
    email: string;
    name: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    async function checkAuthAndFetchData() {
        const supabase = createBrowserClient();

        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
            router.push('/account/login');
            return;
        }

        setUser({
            email: authUser.email || '',
            name: authUser.user_metadata?.name || '',
        });

        // Fetch orders for this customer
        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_email', authUser.email)
            .order('created_at', { ascending: false });

        setOrders(ordersData || []);
        setLoading(false);
    }

    async function handleLogout() {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
        router.push('/');
    }

    if (loading) {
        return (
            <>
                <Header logoText="Store" trustBadgeText="" navLinks={[]} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </main>
            </>
        );
    }

    const statusColors: Record<string, string> = {
        unfulfilled: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
    };

    return (
        <>
            <Header
                logoText="Store"
                trustBadgeText=""
                navLinks={[
                    { label: 'Shop', href: '/products' },
                    { label: 'My Account', href: '/account' },
                ]}
            />

            <main className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
                            <p className="text-gray-500 mt-1">Welcome back, {user?.name || user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Account Info */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="font-semibold text-gray-900 mb-4">Account Details</h2>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Email</span>
                                    <p className="text-gray-900">{user?.email}</p>
                                </div>
                                {user?.name && (
                                    <div>
                                        <span className="text-gray-500">Name</span>
                                        <p className="text-gray-900">{user.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="text-center">
                                <p className="text-4xl font-bold text-green-600">{orders.length}</p>
                                <p className="text-gray-500">Total Orders</p>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                            <h2 className="font-semibold text-gray-900 mb-4">Quick Links</h2>
                            <div className="space-y-2">
                                <Link href="/products" className="block text-green-600 hover:underline">
                                    → Continue Shopping
                                </Link>
                                <Link href="/contact" className="block text-green-600 hover:underline">
                                    → Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>

                        {orders.length === 0 ? (
                            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
                                <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
                                <Link href="/products" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                                            <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{order.order_number}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {order.line_items?.length || 0} item(s)
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.fulfillment_status] || 'bg-gray-100 text-gray-600'}`}>
                                                        {order.fulfillment_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                    ${Number(order.total).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer logoText="Store" showNewsletter={false} description="" />
        </>
    );
}
