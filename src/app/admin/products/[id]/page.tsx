'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Store {
    id: string;
    name: string;
}

interface Product {
    id: string;
    store_id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    compare_at_price: number | null;
    images: string[];
    badges: string[];
    inventory: number;
    is_active: boolean;
    is_featured: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState<Product | null>(null);
    const [newImage, setNewImage] = useState('');
    const [newBadge, setNewBadge] = useState('');

    useEffect(() => {
        fetchData();
    }, [productId]);

    async function fetchData() {
        const supabase = createBrowserClient();

        const [storesRes, productRes] = await Promise.all([
            supabase.from('stores').select('id, name').order('name'),
            supabase.from('products').select('*').eq('id', productId).single()
        ]);

        setStores(storesRes.data || []);

        if (productRes.error || !productRes.data) {
            setError('Product not found');
            setLoading(false);
            return;
        }

        setForm({
            ...productRes.data,
            images: productRes.data.images || [],
            badges: productRes.data.badges || [],
        });
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form) return;

        setSaving(true);
        setError('');

        const supabase = createBrowserClient();
        const { error: updateError } = await supabase
            .from('products')
            .update({
                store_id: form.store_id,
                title: form.title,
                slug: form.slug,
                description: form.description,
                price: form.price,
                compare_at_price: form.compare_at_price || null,
                images: form.images,
                badges: form.badges,
                inventory: form.inventory,
                is_active: form.is_active,
                is_featured: form.is_featured,
            })
            .eq('id', productId);

        if (updateError) {
            setError(updateError.message);
            setSaving(false);
            return;
        }

        router.push('/admin/products');
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        const supabase = createBrowserClient();
        await supabase.from('products').delete().eq('id', productId);
        router.push('/admin/products');
    }

    function addImage() {
        if (newImage.trim() && form) {
            setForm({ ...form, images: [...form.images, newImage.trim()] });
            setNewImage('');
        }
    }

    function removeImage(index: number) {
        if (form) {
            setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
        }
    }

    function addBadge() {
        if (newBadge.trim() && form) {
            setForm({ ...form, badges: [...form.badges, newBadge.trim()] });
            setNewBadge('');
        }
    }

    function removeBadge(index: number) {
        if (form) {
            setForm({ ...form, badges: form.badges.filter((_, i) => i !== index) });
        }
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    Product not found
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/products" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Edit Product</h1>
                        <p className="text-slate-500 mt-1">{form.title}</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Delete Product
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Status Toggles */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-5 h-5 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <div>
                                <p className="font-medium text-slate-900">Active</p>
                                <p className="text-sm text-slate-500">Visible on storefront</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_featured}
                                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                className="w-5 h-5 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <div>
                                <p className="font-medium text-slate-900">Featured</p>
                                <p className="text-sm text-slate-500">Show on homepage</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store</label>
                            <select
                                value={form.store_id}
                                onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                required
                            >
                                {stores.map((store) => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Compare at Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.compare_at_price || ''}
                                    onChange={(e) => setForm({ ...form, compare_at_price: parseFloat(e.target.value) || null })}
                                    className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Inventory</label>
                            <input
                                type="number"
                                value={form.inventory}
                                onChange={(e) => setForm({ ...form, inventory: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        />
                        <button
                            type="button"
                            onClick={addImage}
                            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f]"
                        >
                            Add
                        </button>
                    </div>
                    {form.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {form.images.map((img, i) => (
                                <div key={i} className="relative group">
                                    <img src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Badges</h2>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newBadge}
                            onChange={(e) => setNewBadge(e.target.value)}
                            placeholder="e.g. Best Seller, New"
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        />
                        <button
                            type="button"
                            onClick={addBadge}
                            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f]"
                        >
                            Add
                        </button>
                    </div>
                    {form.badges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {form.badges.map((badge, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-2">
                                    {badge}
                                    <button
                                        type="button"
                                        onClick={() => removeBadge(i)}
                                        className="text-slate-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
