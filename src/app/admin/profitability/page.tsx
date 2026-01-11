'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface StoreProfit {
    id: string;
    name: string;
    theme: string;
    revenue: number;
    adSpend: number;
    profit: number;
    roas: number;
    orders: number;
    status: 'winner' | 'testing' | 'loser';
}

interface AdSpendEntry {
    id: string;
    store_id: string;
    date: string;
    platform: string;
    amount: number;
    notes: string;
}

export default function ProfitabilityPage() {
    const [stores, setStores] = useState<StoreProfit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddSpend, setShowAddSpend] = useState(false);
    const [selectedStore, setSelectedStore] = useState('');
    const [spendForm, setSpendForm] = useState({
        platform: 'facebook',
        amount: '',
        notes: '',
    });
    const [storeList, setStoreList] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createBrowserClient();

        // Fetch stores
        const { data: storesData } = await supabase
            .from('stores')
            .select('id, name, theme');

        if (!storesData) {
            setLoading(false);
            return;
        }

        setStoreList(storesData.map(s => ({ id: s.id, name: s.name })));

        // Fetch orders and ad spend for each store
        const profitData = await Promise.all(storesData.map(async (store) => {
            const [ordersRes, spendRes] = await Promise.all([
                supabase
                    .from('orders')
                    .select('total')
                    .eq('store_id', store.id)
                    .eq('payment_status', 'paid'),
                supabase
                    .from('ad_spend')
                    .select('amount')
                    .eq('store_id', store.id),
            ]);

            const revenue = (ordersRes.data || []).reduce((sum, o) => sum + Number(o.total), 0);
            const adSpend = (spendRes.data || []).reduce((sum, s) => sum + Number(s.amount), 0);
            const profit = revenue - adSpend;
            const roas = adSpend > 0 ? revenue / adSpend : 0;
            const orders = ordersRes.data?.length || 0;

            // Determine status
            let status: 'winner' | 'testing' | 'loser' = 'testing';
            if (orders >= 5) {
                if (roas >= 2) status = 'winner';
                else if (roas < 1 && adSpend > 50) status = 'loser';
            }

            return {
                id: store.id,
                name: store.name,
                theme: store.theme,
                revenue,
                adSpend,
                profit,
                roas,
                orders,
                status,
            };
        }));

        setStores(profitData);
        setLoading(false);
    }

    async function handleAddSpend() {
        if (!selectedStore || !spendForm.amount) return;

        const supabase = createBrowserClient();
        await supabase.from('ad_spend').insert({
            store_id: selectedStore,
            platform: spendForm.platform,
            amount: parseFloat(spendForm.amount),
            notes: spendForm.notes,
            date: new Date().toISOString(),
        });

        setShowAddSpend(false);
        setSpendForm({ platform: 'facebook', amount: '', notes: '' });
        setSelectedStore('');
        fetchData();
    }

    const totals = stores.reduce(
        (acc, s) => ({
            revenue: acc.revenue + s.revenue,
            adSpend: acc.adSpend + s.adSpend,
            profit: acc.profit + s.profit,
        }),
        { revenue: 0, adSpend: 0, profit: 0 }
    );

    const overallRoas = totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0;

    const statusStyles = {
        winner: 'bg-green-100 text-green-700',
        testing: 'bg-yellow-100 text-yellow-700',
        loser: 'bg-red-100 text-red-700',
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Profitability Tracker</h1>
                    <p className="text-slate-600 mt-1">Track ad spend, revenue, and ROAS per store</p>
                </div>
                <button
                    onClick={() => setShowAddSpend(true)}
                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f]"
                >
                    + Log Ad Spend
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${totals.revenue.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Ad Spend</p>
                    <p className="text-3xl font-bold text-red-500">${totals.adSpend.toFixed(2)}</p>
                </div>
                <div className={`bg-white rounded-xl p-6 border ${totals.profit >= 0 ? 'border-green-200' : 'border-red-200'}`}>
                    <p className="text-sm text-slate-500">Net Profit</p>
                    <p className={`text-3xl font-bold ${totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${totals.profit.toFixed(2)}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Overall ROAS</p>
                    <p className={`text-3xl font-bold ${overallRoas >= 2 ? 'text-green-600' : overallRoas >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {overallRoas.toFixed(2)}x
                    </p>
                </div>
            </div>

            {/* Store Profitability Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">No stores yet</h3>
                    <p className="text-slate-500">Create stores to start tracking profitability</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Store</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Orders</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Revenue</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Ad Spend</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Profit</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">ROAS</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{store.name}</p>
                                        <p className="text-xs text-slate-500">{store.theme}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">{store.orders}</td>
                                    <td className="px-6 py-4 text-right font-medium text-green-600">
                                        ${store.revenue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-red-500">
                                        ${store.adSpend.toFixed(2)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${store.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${store.profit.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`font-bold ${store.roas >= 2 ? 'text-green-600' : store.roas >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {store.roas.toFixed(2)}x
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[store.status]}`}>
                                            {store.status === 'winner' ? '🏆 Winner' : store.status === 'loser' ? '❌ Loser' : '🧪 Testing'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Spend Modal */}
            {showAddSpend && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Log Ad Spend</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Store</label>
                                <select
                                    value={selectedStore}
                                    onChange={(e) => setSelectedStore(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="">Select store...</option>
                                    {storeList.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                                <select
                                    value={spendForm.platform}
                                    onChange={(e) => setSpendForm({ ...spendForm, platform: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="facebook">Facebook Ads</option>
                                    <option value="google">Google Ads</option>
                                    <option value="tiktok">TikTok Ads</option>
                                    <option value="instagram">Instagram Ads</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={spendForm.amount}
                                    onChange={(e) => setSpendForm({ ...spendForm, amount: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
                                <input
                                    type="text"
                                    value={spendForm.notes}
                                    onChange={(e) => setSpendForm({ ...spendForm, notes: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                    placeholder="Campaign name, etc."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddSpend(false)}
                                className="flex-1 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSpend}
                                disabled={!selectedStore || !spendForm.amount}
                                className="flex-1 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] disabled:opacity-50"
                            >
                                Log Spend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SQL Setup */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Database Setup Required</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {`CREATE TABLE ad_spend (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  platform TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  date TIMESTAMP DEFAULT NOW()
);

ALTER TABLE ad_spend ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON ad_spend FOR ALL USING (true);`}
                </pre>
            </div>
        </div>
    );
}
