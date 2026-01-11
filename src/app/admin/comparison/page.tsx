'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface StoreMetrics {
    id: string;
    name: string;
    theme: string;
    is_active: boolean;
    productCount: number;
    orderCount: number;
    totalRevenue: number;
    avgOrderValue: number;
    conversionRate: number;
}

export default function ComparisonPage() {
    const [stores, setStores] = useState<StoreMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'revenue' | 'orders' | 'products'>('revenue');

    useEffect(() => {
        fetchStoreMetrics();
    }, []);

    async function fetchStoreMetrics() {
        const supabase = createBrowserClient();

        // Fetch stores
        const { data: storesData } = await supabase
            .from('stores')
            .select('id, name, theme, is_active');

        if (!storesData) {
            setLoading(false);
            return;
        }

        // Fetch products and orders for each store
        const metricsPromises = storesData.map(async (store) => {
            const [productsRes, ordersRes] = await Promise.all([
                supabase.from('products').select('id').eq('store_id', store.id),
                supabase.from('orders').select('total, payment_status').eq('store_id', store.id),
            ]);

            const products = productsRes.data || [];
            const orders = (ordersRes.data || []).filter(o => o.payment_status === 'paid');
            const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
            const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

            return {
                id: store.id,
                name: store.name,
                theme: store.theme,
                is_active: store.is_active,
                productCount: products.length,
                orderCount: orders.length,
                totalRevenue,
                avgOrderValue,
                conversionRate: 0, // Would need visitor tracking
            };
        });

        const metrics = await Promise.all(metricsPromises);
        setStores(metrics);
        setLoading(false);
    }

    const sortedStores = [...stores].sort((a, b) => {
        if (sortBy === 'revenue') return b.totalRevenue - a.totalRevenue;
        if (sortBy === 'orders') return b.orderCount - a.orderCount;
        return b.productCount - a.productCount;
    });

    const totals = stores.reduce(
        (acc, store) => ({
            products: acc.products + store.productCount,
            orders: acc.orders + store.orderCount,
            revenue: acc.revenue + store.totalRevenue,
        }),
        { products: 0, orders: 0, revenue: 0 }
    );

    const maxRevenue = Math.max(...stores.map(s => s.totalRevenue), 1);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Store Comparison</h1>
                    <p className="text-slate-600 mt-1">Compare performance across all stores</p>
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                    <option value="revenue">Sort by Revenue</option>
                    <option value="orders">Sort by Orders</option>
                    <option value="products">Sort by Products</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Stores</p>
                    <p className="text-3xl font-bold text-slate-900">{stores.length}</p>
                    <p className="text-xs text-green-600 mt-1">{stores.filter(s => s.is_active).length} active</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Products</p>
                    <p className="text-3xl font-bold text-slate-900">{totals.products}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900">{totals.orders}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${totals.revenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Comparison Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">No stores to compare</h3>
                    <p className="text-slate-500">Create some stores first</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Store</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Products</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Orders</th>
                                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500">Avg Order</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Revenue</th>
                                <th className="px-6 py-4 text-sm font-medium text-slate-500 w-48">Revenue Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStores.map((store, index) => (
                                <tr key={store.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                                                    index === 1 ? 'bg-slate-400' :
                                                        index === 2 ? 'bg-amber-600' : 'bg-slate-300'
                                                }`}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-slate-900">{store.name}</p>
                                                <p className="text-xs text-slate-500">{store.theme}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full ${store.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {store.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center font-medium">{store.productCount}</td>
                                    <td className="px-6 py-4 text-center font-medium">{store.orderCount}</td>
                                    <td className="px-6 py-4 text-center font-medium">
                                        ${store.avgOrderValue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600">
                                        ${store.totalRevenue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-slate-100 rounded-full h-3">
                                            <div
                                                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                                style={{ width: `${(store.totalRevenue / maxRevenue) * 100}%` }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Performance Tips */}
            {stores.length > 1 && !loading && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Insights</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        {sortedStores[0] && (
                            <li>🏆 <strong>{sortedStores[0].name}</strong> is your top performer with ${sortedStores[0].totalRevenue.toFixed(2)} in revenue</li>
                        )}
                        {sortedStores.length > 1 && sortedStores[sortedStores.length - 1].orderCount === 0 && (
                            <li>⚠️ <strong>{sortedStores[sortedStores.length - 1].name}</strong> has no orders yet - consider running a promotion</li>
                        )}
                        <li>📦 Average products per store: {Math.round(totals.products / stores.length)}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
