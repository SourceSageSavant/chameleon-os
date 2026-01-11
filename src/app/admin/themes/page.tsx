'use client';

import { useState } from 'react';
import Link from 'next/link';
import { THEMES, ThemeConfig } from '@/lib/themes';

export default function ThemeGalleryPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

    const categories = ['all', 'modern', 'classic', 'bold', 'minimal'];

    const filteredThemes = selectedCategory === 'all'
        ? THEMES
        : THEMES.filter(t => t.category === selectedCategory);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Theme Gallery</h1>
                <p className="text-slate-600 mt-1">Choose from 10 professionally designed themes</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-8">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${selectedCategory === cat
                                ? 'bg-[#1e3a5f] text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Theme Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map(theme => (
                    <div
                        key={theme.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
                    >
                        {/* Preview Header */}
                        <div
                            className="h-32 relative"
                            style={{ background: theme.preview }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                <div
                                    className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center"
                                    style={{ fontFamily: theme.fonts.heading }}
                                >
                                    <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                                        {theme.name}
                                    </span>
                                </div>
                            </div>
                            <span className="absolute top-3 right-3 px-2 py-1 bg-white/80 rounded-full text-xs font-medium capitalize">
                                {theme.category}
                            </span>
                        </div>

                        {/* Theme Details */}
                        <div className="p-4">
                            <h3 className="font-semibold text-slate-900">{theme.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{theme.description}</p>

                            {/* Color Palette */}
                            <div className="flex gap-1 mb-4">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.colors.primary }}
                                    title="Primary"
                                />
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.colors.accent }}
                                    title="Accent"
                                />
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-slate-200"
                                    style={{ backgroundColor: theme.colors.background }}
                                    title="Background"
                                />
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: theme.colors.text }}
                                    title="Text"
                                />
                            </div>

                            {/* Properties */}
                            <div className="flex flex-wrap gap-2 text-xs mb-4">
                                <span className="px-2 py-1 bg-slate-100 rounded">
                                    {theme.buttonStyle}
                                </span>
                                <span className="px-2 py-1 bg-slate-100 rounded">
                                    {theme.radius} radius
                                </span>
                                <span className="px-2 py-1 bg-slate-100 rounded">
                                    {theme.heroLayout} hero
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPreviewTheme(theme)}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                                >
                                    Preview
                                </button>
                                <Link
                                    href={`/admin/themes/${theme.id}/customize`}
                                    className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-[#1e3a5f] rounded-lg hover:bg-[#2d4a6f]"
                                >
                                    Customize
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewTheme && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-bold">{previewTheme.name} Theme Preview</h2>
                            <button
                                onClick={() => setPreviewTheme(null)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="overflow-auto max-h-[70vh]">
                            {/* Preview Hero */}
                            <div
                                className="p-12"
                                style={{
                                    backgroundColor: previewTheme.colors.background,
                                    color: previewTheme.colors.text,
                                }}
                            >
                                <div className={`max-w-2xl ${previewTheme.heroLayout === 'center' ? 'mx-auto text-center' : previewTheme.heroLayout === 'right' ? 'ml-auto text-right' : ''}`}>
                                    <h1
                                        className="text-4xl font-bold mb-4"
                                        style={{ fontFamily: previewTheme.fonts.heading }}
                                    >
                                        Premium Quality Products
                                    </h1>
                                    <p
                                        className="text-lg mb-6 opacity-80"
                                        style={{ fontFamily: previewTheme.fonts.body }}
                                    >
                                        Discover our carefully curated collection of the finest products.
                                    </p>
                                    <button
                                        className="px-6 py-3 font-semibold transition-colors"
                                        style={{
                                            backgroundColor: previewTheme.buttonStyle === 'solid' ? previewTheme.colors.primary : 'transparent',
                                            color: previewTheme.buttonStyle === 'solid' ? '#fff' : previewTheme.colors.primary,
                                            border: previewTheme.buttonStyle === 'outline' ? `2px solid ${previewTheme.colors.primary}` : 'none',
                                            borderRadius: previewTheme.radius === 'none' ? '0' : previewTheme.radius === 'full' ? '9999px' : '0.5rem',
                                            background: previewTheme.buttonStyle === 'gradient' ? `linear-gradient(135deg, ${previewTheme.colors.primary}, ${previewTheme.colors.accent})` : undefined,
                                        }}
                                    >
                                        Shop Now
                                    </button>
                                </div>
                            </div>

                            {/* Preview Product Cards */}
                            <div
                                className="p-8"
                                style={{ backgroundColor: previewTheme.colors.background }}
                            >
                                <h2
                                    className="text-2xl font-bold mb-6"
                                    style={{
                                        fontFamily: previewTheme.fonts.heading,
                                        color: previewTheme.colors.text,
                                    }}
                                >
                                    Featured Products
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className="p-4"
                                            style={{
                                                backgroundColor: previewTheme.colors.background === '#ffffff' ? '#f8f8f8' : 'rgba(255,255,255,0.1)',
                                                borderRadius: previewTheme.radius === 'none' ? '0' : '0.75rem',
                                            }}
                                        >
                                            <div
                                                className="aspect-square mb-3"
                                                style={{
                                                    backgroundColor: previewTheme.colors.muted + '40',
                                                    borderRadius: previewTheme.radius === 'none' ? '0' : '0.5rem',
                                                }}
                                            />
                                            <p
                                                className="font-medium"
                                                style={{
                                                    fontFamily: previewTheme.fonts.body,
                                                    color: previewTheme.colors.text,
                                                }}
                                            >
                                                Product Name
                                            </p>
                                            <p style={{ color: previewTheme.colors.primary, fontWeight: 'bold' }}>
                                                $29.99
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setPreviewTheme(null)}
                                className="px-4 py-2 text-slate-700 border border-slate-200 rounded-lg hover:bg-white"
                            >
                                Close
                            </button>
                            <Link
                                href={`/admin/themes/${previewTheme.id}/customize`}
                                className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f]"
                                onClick={() => setPreviewTheme(null)}
                            >
                                Customize This Theme
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
