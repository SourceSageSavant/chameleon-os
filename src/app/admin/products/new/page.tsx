'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Store {
    id: string;
    name: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [stores, setStores] = useState<Store[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        store_id: '',
        title: '',
        slug: '',
        description: '',
        price: '',
        compare_at_price: '',
        images: [''],
        badges: [''],
        inventory_quantity: '100',
        is_active: true,
        is_featured: false,
    });

    useEffect(() => {
        fetchStores();
    }, []);

    async function fetchStores() {
        const supabase = createBrowserClient();
        const { data } = await supabase.from('stores').select('id, name').order('name');
        setStores(data || []);
        if (data && data.length > 0) {
            setForm(f => ({ ...f, store_id: data[0].id }));
        }
    }

    function generateSlug(title: string) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function handleTitleChange(title: string) {
        setForm({
            ...form,
            title,
            slug: generateSlug(title),
        });
    }

    function updateImage(index: number, value: string) {
        const newImages = [...form.images];
        newImages[index] = value;
        setForm({ ...form, images: newImages });
    }

    function addImage() {
        setForm({ ...form, images: [...form.images, ''] });
    }

    function removeImage(index: number) {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: newImages.length ? newImages : [''] });
    }

    function updateBadge(index: number, value: string) {
        const newBadges = [...form.badges];
        newBadges[index] = value;
        setForm({ ...form, badges: newBadges });
    }

    function addBadge() {
        setForm({ ...form, badges: [...form.badges, ''] });
    }

    function removeBadge(index: number) {
        const newBadges = form.badges.filter((_, i) => i !== index);
        setForm({ ...form, badges: newBadges.length ? newBadges : [''] });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const supabase = createBrowserClient();

        const { error: insertError } = await supabase.from('products').insert({
            store_id: form.store_id,
            title: form.title,
            slug: form.slug,
            description: form.description,
            price: parseFloat(form.price) || 0,
            compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
            images: form.images.filter(img => img.trim() !== ''),
            badges: form.badges.filter(badge => badge.trim() !== ''),
            inventory_quantity: parseInt(form.inventory_quantity) || 0,
            is_active: form.is_active,
            is_featured: form.is_featured,
        });

        if (insertError) {
            setError(insertError.message);
            setSaving(false);
            return;
        }

        router.push('/admin/products');
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
                <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
                <p className="text-slate-600 mt-1">Create a new product for your store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Store Selection */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Store</h2>
                    <select
                        value={form.store_id}
                        onChange={(e) => setForm({ ...form, store_id: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                        required
                    >
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="Product Name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="product-name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                rows={4}
                                placeholder="Product description..."
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Pricing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="0.00"
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
                                    value={form.compare_at_price}
                                    onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })}
                                    className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Original price for showing discount</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Inventory</label>
                            <input
                                type="number"
                                value={form.inventory_quantity}
                                onChange={(e) => setForm({ ...form, inventory_quantity: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Images</h2>
                    <div className="space-y-3">
                        {form.images.map((img, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={img}
                                    onChange={(e) => updateImage(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="/products/image.png"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImage}
                            className="text-sm text-[#1e3a5f] hover:text-indigo-700 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Image
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Use paths like /products/image.png (files in public folder)</p>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Badges</h2>
                    <div className="space-y-3">
                        {form.badges.map((badge, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={badge}
                                    onChange={(e) => updateBadge(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                                    placeholder="NSF Certified"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeBadge(index)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addBadge}
                            className="text-sm text-[#1e3a5f] hover:text-indigo-700 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Badge
                        </button>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Status</h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="w-5 h-5 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <div>
                                <p className="font-medium text-slate-900">Active</p>
                                <p className="text-sm text-slate-500">Product is visible on the storefront</p>
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
                                <p className="text-sm text-slate-500">Show this product in featured sections</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create Product'}
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


