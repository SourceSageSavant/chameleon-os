'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    getThemeById,
    ThemeConfig,
    FONT_OPTIONS,
    RADIUS_OPTIONS,
    BUTTON_STYLE_OPTIONS,
    HERO_LAYOUT_OPTIONS
} from '@/lib/themes';
import { createBrowserClient } from '@/lib/supabase';

interface CustomTheme extends ThemeConfig {
    customColors?: {
        primary?: string;
        accent?: string;
        background?: string;
        text?: string;
    };
    customFonts?: {
        heading?: string;
        body?: string;
    };
    customRadius?: string;
    customButtonStyle?: string;
    customHeroLayout?: string;
}

export default function ThemeCustomizePage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.id as string;

    const [baseTheme, setBaseTheme] = useState<ThemeConfig | null>(null);
    const [customizations, setCustomizations] = useState({
        primary: '',
        accent: '',
        background: '',
        text: '',
        headingFont: '',
        bodyFont: '',
        radius: '',
        buttonStyle: '',
        heroLayout: '',
    });
    const [selectedStore, setSelectedStore] = useState('');
    const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const theme = getThemeById(themeId);
        if (theme) {
            setBaseTheme(theme);
            setCustomizations({
                primary: theme.colors.primary,
                accent: theme.colors.accent,
                background: theme.colors.background,
                text: theme.colors.text,
                headingFont: theme.fonts.heading,
                bodyFont: theme.fonts.body,
                radius: theme.radius,
                buttonStyle: theme.buttonStyle,
                heroLayout: theme.heroLayout,
            });
        }
        fetchStores();
    }, [themeId]);

    async function fetchStores() {
        const supabase = createBrowserClient();
        const { data } = await supabase.from('stores').select('id, name');
        setStores(data || []);
    }

    async function applyToStore() {
        if (!selectedStore) return;

        setSaving(true);
        const supabase = createBrowserClient();

        try {
            const themeSettings = {
                theme: themeId,
                primary_color: customizations.primary,
                accent_color: customizations.accent,
                background_color: customizations.background,
                text_color: customizations.text,
                theme_settings: {
                    fonts: {
                        heading: customizations.headingFont,
                        body: customizations.bodyFont,
                    },
                    radius: customizations.radius,
                    buttonStyle: customizations.buttonStyle,
                    heroLayout: customizations.heroLayout,
                },
            };

            const { error } = await supabase
                .from('stores')
                .update(themeSettings)
                .eq('id', selectedStore);

            if (error) {
                alert('Failed to apply theme: ' + error.message);
                console.error(error);
            } else {
                alert('Theme applied successfully!');
                router.push('/admin/stores');
            }
        } catch (err: any) {
            alert('An unexpected error occurred: ' + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (!baseTheme) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/themes" className="text-slate-500 hover:text-slate-700 text-sm mb-2 block">
                    ← Back to Themes
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Customize {baseTheme.name} Theme</h1>
                <p className="text-slate-600 mt-1">Adjust colors, fonts, and styling to match your brand</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Customization Panel */}
                <div className="space-y-6">
                    {/* Colors */}
                    <section className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">🎨 Colors</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customizations.primary}
                                        onChange={(e) => setCustomizations({ ...customizations, primary: e.target.value })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customizations.primary}
                                        onChange={(e) => setCustomizations({ ...customizations, primary: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Accent</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customizations.accent}
                                        onChange={(e) => setCustomizations({ ...customizations, accent: e.target.value })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customizations.accent}
                                        onChange={(e) => setCustomizations({ ...customizations, accent: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Background</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customizations.background}
                                        onChange={(e) => setCustomizations({ ...customizations, background: e.target.value })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customizations.background}
                                        onChange={(e) => setCustomizations({ ...customizations, background: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Text</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customizations.text}
                                        onChange={(e) => setCustomizations({ ...customizations, text: e.target.value })}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={customizations.text}
                                        onChange={(e) => setCustomizations({ ...customizations, text: e.target.value })}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Fonts */}
                    <section className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">🔤 Typography</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Heading Font</label>
                                <select
                                    value={customizations.headingFont}
                                    onChange={(e) => setCustomizations({ ...customizations, headingFont: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    {FONT_OPTIONS.headings.map(font => (
                                        <option key={font.name} value={font.value}>{font.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Body Font</label>
                                <select
                                    value={customizations.bodyFont}
                                    onChange={(e) => setCustomizations({ ...customizations, bodyFont: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    {FONT_OPTIONS.body.map(font => (
                                        <option key={font.name} value={font.value}>{font.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Styling */}
                    <section className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">✨ Styling</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Corner Radius</label>
                                <div className="flex gap-2">
                                    {RADIUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setCustomizations({ ...customizations, radius: opt.value })}
                                            className={`px-4 py-2 text-sm rounded-lg border ${customizations.radius === opt.value
                                                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Button Style</label>
                                <div className="flex gap-2">
                                    {BUTTON_STYLE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setCustomizations({ ...customizations, buttonStyle: opt.value })}
                                            className={`px-4 py-2 text-sm rounded-lg border ${customizations.buttonStyle === opt.value
                                                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Hero Layout</label>
                                <div className="flex gap-2">
                                    {HERO_LAYOUT_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setCustomizations({ ...customizations, heroLayout: opt.value })}
                                            className={`px-4 py-2 text-sm rounded-lg border ${customizations.heroLayout === opt.value
                                                ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white'
                                                : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Apply to Store */}
                    <section className="bg-white rounded-xl p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">🚀 Apply to Store</h2>
                        <div className="space-y-4">
                            <select
                                value={selectedStore}
                                onChange={(e) => setSelectedStore(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            >
                                <option value="">Select a store...</option>
                                {stores.map(store => (
                                    <option key={store.id} value={store.id}>{store.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={applyToStore}
                                disabled={!selectedStore || saving}
                                className="w-full px-4 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2d4a6f] disabled:opacity-50"
                            >
                                {saving ? 'Applying...' : 'Apply Theme to Store'}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Live Preview */}
                <div className="sticky top-8">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b bg-slate-50">
                            <h3 className="font-semibold text-slate-900">Live Preview</h3>
                        </div>
                        <div
                            className="p-8"
                            style={{
                                backgroundColor: customizations.background,
                                color: customizations.text,
                            }}
                        >
                            {/* Hero Preview */}
                            <div className={`mb-8 ${customizations.heroLayout === 'center' ? 'text-center' : customizations.heroLayout === 'right' ? 'text-right' : ''}`}>
                                <h1
                                    className="text-3xl font-bold mb-3"
                                    style={{ fontFamily: customizations.headingFont }}
                                >
                                    Your Brand Headline
                                </h1>
                                <p
                                    className="text-lg opacity-80 mb-6"
                                    style={{ fontFamily: customizations.bodyFont }}
                                >
                                    Compelling subheadline that converts.
                                </p>
                                <button
                                    className="px-6 py-3 font-medium"
                                    style={{
                                        backgroundColor: customizations.buttonStyle === 'solid' ? customizations.primary :
                                            customizations.buttonStyle === 'soft' ? customizations.primary + '20' : 'transparent',
                                        color: customizations.buttonStyle === 'solid' ? '#fff' : customizations.primary,
                                        border: customizations.buttonStyle === 'outline' ? `2px solid ${customizations.primary}` : 'none',
                                        borderRadius: customizations.radius === 'none' ? '0' :
                                            customizations.radius === 'sm' ? '0.25rem' :
                                                customizations.radius === 'md' ? '0.5rem' :
                                                    customizations.radius === 'lg' ? '1rem' : '9999px',
                                        background: customizations.buttonStyle === 'gradient'
                                            ? `linear-gradient(135deg, ${customizations.primary}, ${customizations.accent})`
                                            : undefined,
                                    }}
                                >
                                    Shop Now
                                </button>
                            </div>

                            {/* Products Preview */}
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2].map(i => (
                                    <div
                                        key={i}
                                        className="p-4"
                                        style={{
                                            backgroundColor: customizations.background === '#ffffff' ? '#f5f5f5' : 'rgba(255,255,255,0.1)',
                                            borderRadius: customizations.radius === 'none' ? '0' : '0.75rem',
                                        }}
                                    >
                                        <div
                                            className="aspect-square mb-3"
                                            style={{
                                                backgroundColor: customizations.primary + '30',
                                                borderRadius: customizations.radius === 'none' ? '0' : '0.5rem',
                                            }}
                                        />
                                        <p
                                            className="font-medium"
                                            style={{ fontFamily: customizations.bodyFont }}
                                        >
                                            Product Name
                                        </p>
                                        <p style={{ color: customizations.accent, fontWeight: 'bold' }}>
                                            $29.99
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
