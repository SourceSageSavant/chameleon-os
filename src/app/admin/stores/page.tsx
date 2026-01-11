'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Store {
    id: string;
    slug: string;
    name: string;
    domain: string | null;
    theme: string;
    primary_color: string;
    is_active: boolean;
    created_at: string;
}

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    async function fetchStores() {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setStores(data);
        }
        setLoading(false);
    }

    async function toggleStoreStatus(storeId: string, currentStatus: boolean) {
        const supabase = createBrowserClient();
        await supabase
            .from('stores')
            .update({ is_active: !currentStatus })
            .eq('id', storeId);

        fetchStores();
    }

    async function deleteStore(storeId: string) {
        if (!confirm('Are you sure you want to delete this store? This will also delete all associated products.')) {
            return;
        }

        const supabase = createBrowserClient();
        await supabase.from('stores').delete().eq('id', storeId);
        fetchStores();
    }

    async function cloneStore(storeId: string, storeName: string) {
        if (!confirm(`Clone "${storeName}" with all products and discounts?`)) {
            return;
        }

        try {
            const response = await fetch('/api/stores/clone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ storeId }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Store cloned! ${data.cloned.products} products, ${data.cloned.discounts} discounts copied.`);
                fetchStores();
            } else {
                alert('Failed to clone store: ' + data.error);
            }
        } catch (error) {
            alert('Failed to clone store');
        }
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Stores</h1>
                    <p className="text-slate-600 mt-1">Manage your multi-tenant stores</p>
                </div>
                <Link
                    href="/admin/stores/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Store
                </Link>
            </div>

            {/* Stores Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : stores.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No stores yet</h3>
                    <p className="text-slate-500 mb-4">Create your first store to get started</p>
                    <Link
                        href="/admin/stores/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Store
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <div
                            key={store.id}
                            className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Store Header with Color */}
                            <div
                                className="h-20 relative"
                                style={{ backgroundColor: store.primary_color }}
                            >
                                <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center font-bold text-xl"
                                        style={{ color: store.primary_color }}
                                    >
                                        {store.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${store.is_active
                                        ? 'bg-slate-100 text-indigo-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {store.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Store Info */}
                            <div className="pt-10 p-4">
                                <h3 className="font-semibold text-lg text-slate-900">{store.name}</h3>
                                <p className="text-sm text-slate-500 mb-2">/{store.slug}</p>

                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                    <span className="px-2 py-1 bg-slate-100 rounded">{store.theme}</span>
                                    {store.domain && (
                                        <span className="text-[#1e3a5f]">{store.domain}</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    <Link
                                        href={`/admin/stores/${store.id}`}
                                        className="flex-1 px-3 py-2 text-sm font-medium text-center text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => toggleStoreStatus(store.id, store.is_active)}
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${store.is_active
                                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                                            : 'text-indigo-700 bg-slate-100 hover:bg-green-200'
                                            }`}
                                    >
                                        {store.is_active ? 'Pause' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => cloneStore(store.id, store.name)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Clone Store"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteStore(store.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


