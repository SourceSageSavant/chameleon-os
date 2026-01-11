'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

const themes = [
    { id: 'organic', name: 'Organic', description: 'Soft pastels, rounded corners - for wellness/health' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean, white space, serif fonts - for high-ticket' },
    { id: 'cyber', name: 'Cyber', description: 'Dark mode, neon accents - for tech/gaming' },
];

const colorPresets = [
    { name: 'Forest Green', primary: '#2D5A27', accent: '#8B4513', background: '#F5F5DC' },
    { name: 'Ocean Blue', primary: '#1E40AF', accent: '#0891B2', background: '#F0F9FF' },
    { name: 'Midnight', primary: '#1F2937', accent: '#8B5CF6', background: '#111827' },
    { name: 'Sunset', primary: '#DC2626', accent: '#F97316', background: '#FEF2F2' },
];

export default function NewStorePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        slug: '',
        domain: '',
        theme: 'organic',
        primary_color: '#2D5A27',
        accent_color: '#8B4513',
        background_color: '#F5F5DC',
        text_color: '#1a1a1a',
        trust_badge_text: 'Free Shipping Over $50',
        meta_title: '',
        meta_description: '',
    });

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function handleNameChange(name: string) {
        setForm({
            ...form,
            name,
            slug: generateSlug(name),
        });
    }

    function applyColorPreset(preset: typeof colorPresets[0]) {
        setForm({
            ...form,
            primary_color: preset.primary,
            accent_color: preset.accent,
            background_color: preset.background,
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        const supabase = createBrowserClient();

        const { error: insertError } = await supabase.from('stores').insert({
            name: form.name,
            slug: form.slug,
            domain: form.domain || null,
            theme: form.theme,
            primary_color: form.primary_color,
            accent_color: form.accent_color,
            background_color: form.background_color,
            text_color: form.text_color,
            trust_badge_text: form.trust_badge_text,
            meta_title: form.meta_title || form.name,
            meta_description: form.meta_description || `Welcome to ${form.name}`,
            is_active: true,
        });

        if (insertError) {
            setError(insertError.message);
            setSaving(false);
            return;
        }

        router.push('/admin/stores');
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
                <h1 className="text-3xl font-bold text-slate-900">Create New Store</h1>
                <p className="text-slate-600 mt-1">Set up a new multi-tenant store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                placeholder="My Awesome Store"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                            <div className="flex items-center">
                                <span className="text-slate-400 mr-1">/</span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                    placeholder="my-awesome-store"
                                    required
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Custom Domain (optional)</label>
                            <input
                                type="text"
                                value={form.domain}
                                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                placeholder="mystore.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Point your domain's A record to Vercel for this to work</p>
                        </div>
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
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
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Colors</h2>

                    {/* Presets */}
                    <div className="mb-4">
                        <p className="text-sm text-slate-600 mb-2">Quick Presets:</p>
                        <div className="flex flex-wrap gap-2">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => applyColorPreset(preset)}
                                    className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: preset.primary }}
                                    />
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>

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
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Trust Badge</h2>
                    <input
                        type="text"
                        value={form.trust_badge_text}
                        onChange={(e) => setForm({ ...form, trust_badge_text: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        placeholder="Free Shipping Over $50"
                    />
                    <p className="text-xs text-slate-500 mt-1">Displayed in the header trust banner</p>
                </div>

                {/* SEO */}
                <div className="bg-white rounded-xl p-6 border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">SEO Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={form.meta_title}
                                onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                placeholder="My Store - Premium Products"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                            <textarea
                                value={form.meta_description}
                                onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                                rows={3}
                                placeholder="Discover premium products at My Store..."
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
                        {saving ? 'Creating...' : 'Create Store'}
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


