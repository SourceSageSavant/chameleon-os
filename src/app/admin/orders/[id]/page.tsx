'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Order {
    id: string;
    order_number: string;
    customer_email: string;
    customer_name: string;
    line_items: Array<{
        title: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    subtotal: number;
    shipping_cost: number;
    total: number;
    payment_status: string;
    fulfillment_status: string;
    tracking_number?: string;
    tracking_url?: string;
    notes?: string;
    created_at: string;
    updated_at?: string;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [fulfillmentStatus, setFulfillmentStatus] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [params.id]);

    async function fetchOrder() {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error || !data) {
            router.push('/admin/orders');
            return;
        }

        setOrder(data);
        setTrackingNumber(data.tracking_number || '');
        setTrackingUrl(data.tracking_url || '');
        setFulfillmentStatus(data.fulfillment_status || 'unfulfilled');
        setNotes(data.notes || '');
        setLoading(false);
    }

    async function handleSave() {
        if (!order) return;
        setSaving(true);
        setMessage(null);

        const supabase = createBrowserClient();
        const { error } = await supabase
            .from('orders')
            .update({
                tracking_number: trackingNumber || null,
                tracking_url: trackingUrl || null,
                fulfillment_status: fulfillmentStatus,
                notes: notes || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', order.id);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update order' });
        } else {
            setMessage({ type: 'success', text: 'Order updated successfully' });
            fetchOrder();
        }
        setSaving(false);
    }

    async function handleSendShippingEmail() {
        if (!order || !trackingNumber) {
            setMessage({ type: 'error', text: 'Please add a tracking number first' });
            return;
        }

        setSendingEmail(true);
        setMessage(null);

        try {
            const response = await fetch('/api/orders/send-shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderNumber: order.order_number,
                    customerEmail: order.customer_email,
                    customerName: order.customer_name,
                    trackingNumber: trackingNumber,
                    trackingUrl: trackingUrl,
                    storeName: 'Store',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Shipping notification sent!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send email' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to send email' });
        }

        setSendingEmail(false);
    }

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    if (!order) return null;

    const statusColors: Record<string, string> = {
        unfulfilled: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/orders" className="text-sm text-slate-500 hover:text-slate-700 mb-2 inline-block">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Order {order.order_number}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.fulfillment_status] || 'bg-slate-100'}`}>
                    {order.fulfillment_status}
                </span>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-4">Customer</h2>
                        <div className="space-y-2">
                            <p className="text-slate-700">{order.customer_name || 'No name provided'}</p>
                            <p className="text-slate-500">{order.customer_email}</p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-4">Items</h2>
                        <div className="space-y-4">
                            {order.line_items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-lg overflow-hidden">
                                        {item.image && (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span>${order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Shipping</span>
                                <span>{order.shipping_cost === 0 ? 'Free' : `$${order.shipping_cost?.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>${order.total?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fulfillment */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-4">Fulfillment</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    value={fulfillmentStatus}
                                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="unfulfilled">Unfulfilled</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="e.g., 1Z999AA10123456784"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tracking URL</label>
                                <input
                                    type="url"
                                    value={trackingUrl}
                                    onChange={(e) => setTrackingUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Internal notes..."
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg h-20 resize-none"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Shipping Notification */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-4">Notifications</h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Send a shipping notification email with tracking info to the customer.
                        </p>
                        <button
                            onClick={handleSendShippingEmail}
                            disabled={sendingEmail || !trackingNumber}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {sendingEmail ? 'Sending...' : '📧 Send Shipping Email'}
                        </button>
                        {!trackingNumber && (
                            <p className="text-xs text-slate-400 mt-2">Add a tracking number first</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
