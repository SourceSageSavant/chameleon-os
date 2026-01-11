'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface AbandonedCart {
    id: string;
    customer_email: string;
    items: Array<{
        product_id: string;
        title: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
    total: number;
    created_at: string;
    last_activity: string;
    recovery_sent: boolean;
    recovered: boolean;
    store_id: string;
}

export default function AbandonedCartsPage() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingRecovery, setSendingRecovery] = useState<string | null>(null);

    useEffect(() => {
        fetchAbandonedCarts();
    }, []);

    async function fetchAbandonedCarts() {
        const supabase = createBrowserClient();
        const { data } = await supabase
            .from('abandoned_carts')
            .select('*')
            .eq('recovered', false)
            .order('last_activity', { ascending: false });

        setCarts(data || []);
        setLoading(false);
    }

    async function sendRecoveryEmail(cart: AbandonedCart) {
        if (!cart.customer_email) return;

        setSendingRecovery(cart.id);

        try {
            const response = await fetch('/api/carts/send-recovery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartId: cart.id,
                    customerEmail: cart.customer_email,
                    items: cart.items,
                    total: cart.total,
                }),
            });

            if (response.ok) {
                // Update cart to mark recovery sent
                const supabase = createBrowserClient();
                await supabase
                    .from('abandoned_carts')
                    .update({ recovery_sent: true })
                    .eq('id', cart.id);

                fetchAbandonedCarts();
            }
        } catch (error) {
            console.error('Failed to send recovery email:', error);
        }

        setSendingRecovery(null);
    }

    async function markAsRecovered(cartId: string) {
        const supabase = createBrowserClient();
        await supabase
            .from('abandoned_carts')
            .update({ recovered: true })
            .eq('id', cartId);

        fetchAbandonedCarts();
    }

    async function deleteCart(cartId: string) {
        const supabase = createBrowserClient();
        await supabase
            .from('abandoned_carts')
            .delete()
            .eq('id', cartId);

        fetchAbandonedCarts();
    }

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const totalRecoverable = carts.reduce((sum, cart) => sum + cart.total, 0);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Abandoned Carts</h1>
                    <p className="text-slate-600 mt-1">Recover lost sales with targeted emails</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-xl">
                    <p className="text-sm text-yellow-700">Potential recovery</p>
                    <p className="text-2xl font-bold text-yellow-800">${totalRecoverable.toFixed(2)}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Active Carts</p>
                    <p className="text-2xl font-bold text-slate-900">{carts.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Recovery Sent</p>
                    <p className="text-2xl font-bold text-slate-900">{carts.filter(c => c.recovery_sent).length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">Pending</p>
                    <p className="text-2xl font-bold text-slate-900">{carts.filter(c => !c.recovery_sent).length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-500">With Email</p>
                    <p className="text-2xl font-bold text-slate-900">{carts.filter(c => c.customer_email).length}</p>
                </div>
            </div>

            {/* Carts List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
                </div>
            ) : carts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No abandoned carts!</h3>
                    <p className="text-slate-500">All customers are completing their purchases</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {carts.map((cart) => (
                        <div key={cart.id} className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-medium text-slate-900">
                                            {cart.customer_email || 'Anonymous'}
                                        </span>
                                        {cart.recovery_sent && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                                Recovery sent
                                            </span>
                                        )}
                                        <span className="text-sm text-slate-500">
                                            {formatTimeAgo(cart.last_activity)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3">
                                        {cart.items?.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <span>{item.quantity}x</span>
                                                <span className="truncate max-w-[150px]">{item.title}</span>
                                            </div>
                                        ))}
                                        {(cart.items?.length || 0) > 3 && (
                                            <span className="text-sm text-slate-400">
                                                +{cart.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-bold text-slate-900">${cart.total.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        {cart.customer_email && !cart.recovery_sent && (
                                            <button
                                                onClick={() => sendRecoveryEmail(cart)}
                                                disabled={sendingRecovery === cart.id}
                                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                            >
                                                {sendingRecovery === cart.id ? '...' : '📧 Send Recovery'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => markAsRecovered(cart.id)}
                                            className="px-3 py-1 border border-green-300 text-green-700 text-sm rounded-lg hover:bg-green-50"
                                        >
                                            ✓ Recovered
                                        </button>
                                        <button
                                            onClick={() => deleteCart(cart.id)}
                                            className="px-3 py-1 text-slate-400 hover:text-red-500 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SQL Setup Note */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Database Setup Required</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {`CREATE TABLE abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  customer_email TEXT,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  recovery_sent BOOLEAN DEFAULT false,
  recovered BOOLEAN DEFAULT false
);

ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON abandoned_carts FOR ALL USING (true);`}
                </pre>
            </div>
        </div>
    );
}
