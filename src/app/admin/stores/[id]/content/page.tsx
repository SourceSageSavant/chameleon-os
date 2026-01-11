'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';

interface StoreContent {
    hero_headline: string;
    hero_subheadline: string;
    hero_button_text: string;
    about_title: string;
    about_content: string;
    features_title: string;
    features: string[];
    testimonial_title: string;
    footer_tagline: string;
    contact_email: string;
    contact_phone: string;
    contact_address: string;
}

const defaultContent: StoreContent = {
    hero_headline: 'Premium Quality Products',
    hero_subheadline: 'Discover our carefully curated collection',
    hero_button_text: 'Shop Now',
    about_title: 'About Us',
    about_content: 'We are dedicated to bringing you the finest products with exceptional service.',
    features_title: 'Why Choose Us',
    features: ['Free Shipping', 'Premium Quality', '30-Day Returns', '24/7 Support'],
    testimonial_title: 'What Our Customers Say',
    footer_tagline: 'Your trusted shopping destination',
    contact_email: 'support@store.com',
    contact_phone: '',
    contact_address: '',
};

export default function ContentEditorPage() {
    const params = useParams();
    const router = useRouter();
    const storeId = params.id as string;

    const [store, setStore] = useState<{ name: string } | null>(null);
    const [content, setContent] = useState<StoreContent>(defaultContent);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStore();
    }, [storeId]);

    async function fetchStore() {
        const supabase = createBrowserClient();
        const { data } = await supabase
            .from('stores')
            .select('name, content')
            .eq('id', storeId)
            .single();

        if (data) {
            setStore({ name: data.name });
            if (data.content) {
                setContent({ ...defaultContent, ...data.content });
            }
        }
    }

    async function handleSave() {
        setSaving(true);
        setMessage('');

        const supabase = createBrowserClient();
        const { error } = await supabase
            .from('stores')
            .update({ content })
            .eq('id', storeId);

        if (error) {
            setMessage('Failed to save');
        } else {
            setMessage('Saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
        setSaving(false);
    }

    function updateFeature(index: number, value: string) {
        const newFeatures = [...content.features];
        newFeatures[index] = value;
        setContent({ ...content, features: newFeatures });
    }

    function addFeature() {
        setContent({ ...content, features: [...content.features, 'New Feature'] });
    }

    function removeFeature(index: number) {
        setContent({ ...content, features: content.features.filter((_, i) => i !== index) });
    }

    if (!store) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700 mb-2">
                        ← Back
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Content Editor</h1>
                    <p className="text-slate-600 mt-1">{store.name}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-8">
                {/* Hero Section */}
                <section className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">🏠 Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                            <input
                                type="text"
                                value={content.hero_headline}
                                onChange={(e) => setContent({ ...content, hero_headline: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Subheadline</label>
                            <input
                                type="text"
                                value={content.hero_subheadline}
                                onChange={(e) => setContent({ ...content, hero_subheadline: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                            <input
                                type="text"
                                value={content.hero_button_text}
                                onChange={(e) => setContent({ ...content, hero_button_text: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">ℹ️ About Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={content.about_title}
                                onChange={(e) => setContent({ ...content, about_title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                            <textarea
                                value={content.about_content}
                                onChange={(e) => setContent({ ...content, about_content: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">✨ Features / Trust Badges</h2>
                        <button onClick={addFeature} className="text-sm text-[#1e3a5f] hover:underline">
                            + Add Feature
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Section Title</label>
                        <input
                            type="text"
                            value={content.features_title}
                            onChange={(e) => setContent({ ...content, features_title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
                        />
                    </div>
                    <div className="space-y-2">
                        {content.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => updateFeature(index, e.target.value)}
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                                />
                                <button
                                    onClick={() => removeFeature(index)}
                                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">📞 Contact Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={content.contact_email}
                                onChange={(e) => setContent({ ...content, contact_email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={content.contact_phone}
                                onChange={(e) => setContent({ ...content, contact_phone: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={content.contact_address}
                                onChange={(e) => setContent({ ...content, contact_address: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <section className="bg-white rounded-xl p-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">🔻 Footer</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                        <input
                            type="text"
                            value={content.footer_tagline}
                            onChange={(e) => setContent({ ...content, footer_tagline: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </section>
            </div>

            {/* SQL Reminder */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Database Update Required</h3>
                <pre className="text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {`ALTER TABLE stores ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';`}
                </pre>
            </div>
        </div>
    );
}
