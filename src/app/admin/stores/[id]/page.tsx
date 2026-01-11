'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

const themes = [
    { id: 'organic', name: 'Organic', description: 'Soft pastels, rounded corners - for wellness/health' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean, white space, serif fonts - for high-ticket' },
    { id: 'cyber', name: 'Cyber', description: 'Dark mode, neon accents - for tech/gaming' },
];

interface Store {
    id: string;
    name: string;
    slug: string;
    domain: string | null;
    theme: string;
    primary_color: string;
    accent_color: string;
    background_color: string;
    text_color: string;
    trust_badge_text: string;
    meta_title: string;
    meta_description: string;
    is_active: boolean;
}

export default function EditStorePage() {
    const router = useRouter();
    const params = useParams();
    const storeId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState<Store | null>(null);

    useEffect(() => {
        fetchStore();
    }, [storeId]);

    async function fetchStore() {
        const supabase = createBrowserClient();
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeId)
            .single();

        if (error || !data) {
            setError('Store not found');
            setLoading(false);
            return;
        }

        setForm(data);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form) return;

        setSaving(true);
        setError('');

        const supabase = createBrowserClient();
        const updateData = {
            name: form.name,
            slug: form.slug,
            domain: form.domain || null,
            theme: form.theme,
            primary_color: form.primary_color,
            accent_color: form.accent_color,
            background_color: form.background_color,
            text_color: form.text_color,
            trust_badge_text: form.trust_badge_text,
            meta_title: form.meta_title,
            meta_description: form.meta_description,
            is_active: form.is_active,
        };

        console.log('Attempting to update store:', storeId, updateData);

        const { data, error: updateError } = await supabase
            .from('stores')
            .update(updateData)
            .eq('id', storeId)
            .select();

        console.log('Update result:', { data, error: updateError });

        if (updateError) {
            setError(`Update failed: ${updateError.message}. You may need to enable RLS UPDATE policies in Supabase.`);
            setSaving(false);
            return;
        }

        if (!data || data.length === 0) {
            setError('Update failed: No rows were updated. Check RLS policies in Supabase allow UPDATE operations.');
            setSaving(false);
            return;
        }

        alert('Store updated successfully!');
        router.push('/admin/stores');
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this store? This will also delete all associated products.')) {
            return;
        }

        const supabase = createBrowserClient();
        await supabase.from('stores').delete().eq('id', storeId);
        router.push('/admin/stores');
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
                    Store not found
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/stores" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Stores
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Edit Store</h1>
                        <p className="text-slate-500 mt-1">{form.name}</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        Delete Store
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Status Toggle */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                            className="w-5 h-5 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                        />
                        <div>
                            <p className="font-medium text-slate-900">Active</p>
                            <p className="text-sm text-slate-500">Store is live and accessible</p>
                        </div>
                    </label>
                </div>

                {/* Basic Info */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain</label>
                            <input
                                type="text"
                                value={form.domain || ''}
                                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                placeholder="mystore.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Theme */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Theme</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                type="button"
                                onClick={() => setForm({ ...form, theme: theme.id })}
                                className={`p-4 rounded-lg border-2 text-left transition-colors ${form.theme === theme.id
                                    ? 'border-[#1e3a5f] bg-slate-50'
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <p className="font-medium text-slate-900">{theme.name}</p>
                                <p className="text-sm text-slate-500 mt-1">{theme.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Primary</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.primary_color}
                                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.primary_color}
                                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Accent</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.accent_color}
                                    onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.accent_color}
                                    onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.background_color}
                                    onChange={(e) => setForm({ ...form, background_color: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.background_color}
                                    onChange={(e) => setForm({ ...form, background_color: e.target.value })}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Text</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={form.text_color}
                                    onChange={(e) => setForm({ ...form, text_color: e.target.value })}
                                    className="w-10 h-10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={form.text_color}
                                    onChange={(e) => setForm({ ...form, text_color: e.target.value })}
                                    className="flex-1 px-2 py-1 text-sm border rounded"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Trust Badge</h2>
                    <input
                        type="text"
                        value={form.trust_badge_text}
                        onChange={(e) => setForm({ ...form, trust_badge_text: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        placeholder="Free Shipping Over $50"
                    />
                </div>

                {/* Shipping & Tax Settings */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Shipping & Tax</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Flat Shipping Rate ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={(form as any).shipping_rate || '5.99'}
                                onChange={(e) => setForm({ ...form, shipping_rate: parseFloat(e.target.value) } as any)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Free Shipping Threshold ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={(form as any).free_shipping_threshold || '50'}
                                onChange={(e) => setForm({ ...form, free_shipping_threshold: parseFloat(e.target.value) } as any)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                            />
                            <p className="text-xs text-slate-500 mt-1">Orders above this amount get free shipping</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={(form as any).tax_rate || '0'}
                                onChange={(e) => setForm({ ...form, tax_rate: parseFloat(e.target.value) } as any)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                            />
                            <p className="text-xs text-slate-500 mt-1">Applied to all orders (e.g., 8.25 for 8.25%)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="tax_included"
                                checked={(form as any).tax_included || false}
                                onChange={(e) => setForm({ ...form, tax_included: e.target.checked } as any)}
                                className="w-5 h-5 rounded text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <label htmlFor="tax_included" className="text-sm text-slate-700">
                                Prices include tax
                            </label>
                        </div>
                    </div>
                </div>

                {/* SEO */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={form.meta_title}
                                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                            <textarea
                                value={form.meta_description}
                                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                rows={3}
                            />
                        </div>
                    </div>
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
                        href="/admin/stores"
                        className="px-6 py-3 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
