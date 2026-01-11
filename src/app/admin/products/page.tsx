'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Product {
    id: string;
    store_id: string;
    slug: string;
    title: string;
    price: number;
    compare_at_price: number | null;
    images: string[];
    is_active: boolean;
    is_featured: boolean;
    inventory_quantity: number;
    created_at: string;
}

interface Store {
    id: string;
    name: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const supabase = createBrowserClient();

        // Fetch stores
        const { data: storesData } = await supabase
            .from('stores')
            .select('id, name')
            .order('name');

        setStores(storesData || []);

        // Fetch products
        const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        setProducts(productsData || []);
        setLoading(false);
    }

    async function toggleProductStatus(productId: string, currentStatus: boolean) {
        const supabase = createBrowserClient();
        await supabase
            .from('products')
            .update({ is_active: !currentStatus })
            .eq('id', productId);

        fetchData();
    }

    async function toggleFeatured(productId: string, currentFeatured: boolean) {
        const supabase = createBrowserClient();
        await supabase
            .from('products')
            .update({ is_featured: !currentFeatured })
            .eq('id', productId);

        fetchData();
    }

    async function deleteProduct(productId: string) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const supabase = createBrowserClient();
        await supabase.from('products').delete().eq('id', productId);
        fetchData();
    }

    const filteredProducts = selectedStore === 'all'
        ? products
        : products.filter(p => p.store_id === selectedStore);

    const getStoreName = (storeId: string) => {
        const store = stores.find(s => s.id === storeId);
        return store?.name || 'Unknown Store';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-600 mt-1">Manage products across all stores</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Product
                </Link>
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
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-100">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No products yet</h3>
                    <p className="text-slate-500 mb-4">Add your first product to get started</p>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Product</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Store</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Price</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Stock</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{product.title}</p>
                                                <p className="text-sm text-slate-500">/{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{getStoreName(product.store_id)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <span className="font-medium text-slate-900">${Number(product.price).toFixed(2)}</span>
                                            {product.compare_at_price && (
                                                <span className="text-sm text-slate-400 line-through ml-2">
                                                    ${Number(product.compare_at_price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm ${product.inventory_quantity > 0 ? 'text-[#1e3a5f]' : 'text-red-600'}`}>
                                            {product.inventory_quantity} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-slate-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {product.is_active ? 'Active' : 'Draft'}
                                            </span>
                                            {product.is_featured && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toggleFeatured(product.id, product.is_featured)}
                                                className={`p-2 rounded-lg transition-colors ${product.is_featured
                                                        ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                                                        : 'text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                title={product.is_featured ? 'Remove from featured' : 'Mark as featured'}
                                            >
                                                <svg className="w-5 h-5" fill={product.is_featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            </button>
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <button
                                                onClick={() => toggleProductStatus(product.id, product.is_active)}
                                                className={`p-2 rounded-lg ${product.is_active
                                                        ? 'text-yellow-600 hover:bg-yellow-50'
                                                        : 'text-[#1e3a5f] hover:bg-slate-50'
                                                    }`}
                                            >
                                                {product.is_active ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}


