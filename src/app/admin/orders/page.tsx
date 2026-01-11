'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface Order {
    id: string;
    order_number: number;
    customer_email: string;
    customer_name: string | null;
    total: number;
    subtotal: number;
    shipping_cost: number;
    payment_status: string;
    fulfillment_status: string;
    line_items: Array<{
        title: string;
        quantity: number;
        price: number;
    }>;
    created_at: string;
}

interface Store {
    id: string;
    name: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createBrowserClient();

        const { data: storesData } = await supabase
            .from('stores')
            .select('id, name')
            .order('name');

        setStores(storesData || []);

        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        setOrders(ordersData || []);
        setLoading(false);
    }

    async function updateOrderStatus(orderId: string, field: 'payment_status' | 'fulfillment_status', value: string) {
        const supabase = createBrowserClient();
        await supabase
            .from('orders')
            .update({ [field]: value })
            .eq('id', orderId);

        fetchData();
        if (selectedOrder?.id === orderId) {
            setSelectedOrder({ ...selectedOrder, [field]: value });
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-slate-100 text-indigo-700',
            failed: 'bg-red-100 text-red-700',
            refunded: 'bg-slate-100 text-slate-700',
            unfulfilled: 'bg-yellow-100 text-yellow-700',
            fulfilled: 'bg-slate-100 text-indigo-700',
            shipped: 'bg-blue-100 text-blue-700',
        };
        return colors[status] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-600 mt-1">Manage orders across all stores</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex items-center gap-4">
                <div>
                    <label className="block text-sm text-slate-500 mb-1">Filter by Store</label>
                    <select
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                    >
                        <option value="all">All Stores</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>
                <div className="ml-auto text-sm text-slate-500">
                    {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
                {/* Orders List */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
                            <p className="text-slate-500">Orders will appear here when customers make purchases</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Order</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Customer</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Total</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Payment</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Fulfillment</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-slate-50' : ''}`}
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-900">#{order.order_number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-slate-900">{order.customer_name || 'Guest'}</p>
                                                    <p className="text-sm text-slate-500">{order.customer_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-900">${Number(order.total).toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.fulfillment_status)}`}>
                                                    {order.fulfillment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Order Detail Panel */}
                {selectedOrder && (
                    <div className="w-96 bg-white rounded-xl border border-slate-100 p-6 h-fit sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-slate-900">Order #{selectedOrder.order_number}</h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Customer</h3>
                            <p className="text-slate-900">{selectedOrder.customer_name || 'Guest'}</p>
                            <p className="text-sm text-slate-500">{selectedOrder.customer_email}</p>
                        </div>

                        {/* Status Controls */}
                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Status</label>
                                <select
                                    value={selectedOrder.payment_status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, 'payment_status', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fulfillment Status</label>
                                <select
                                    value={selectedOrder.fulfillment_status}
                                    onChange={(e) => updateOrderStatus(selectedOrder.id, 'fulfillment_status', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="unfulfilled">Unfulfilled</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="fulfilled">Fulfilled</option>
                                </select>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Items</h3>
                            <div className="space-y-2">
                                {selectedOrder.line_items?.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-slate-700">{item.quantity}x {item.title}</span>
                                        <span className="text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-slate-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="text-slate-900">${Number(selectedOrder.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Shipping</span>
                                <span className="text-slate-900">${Number(selectedOrder.shipping_cost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span className="text-slate-900">Total</span>
                                <span className="text-slate-900">${Number(selectedOrder.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


