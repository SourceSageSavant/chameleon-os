'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface ThemeConfig {
    name: string;
    version: string;
    exportedAt: string;
    store: {
        name: string;
        theme: string;
        primary_color: string;
        accent_color: string;
        background_color: string;
        text_color: string;
        trust_badge_text: string;
        meta_title: string;
        meta_description: string;
    };
}

export default function ThemeSettingsPage() {
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [importData, setImportData] = useState('');

    async function handleExport() {
        setExporting(true);
        setMessage(null);

        try {
            const supabase = createBrowserClient();
            const { data: store, error } = await supabase
                .from('stores')
                .select('*')
                .eq('is_active', true)
                .limit(1)
                .single();

            if (error || !store) {
                setMessage({ type: 'error', text: 'No active store found to export' });
                setExporting(false);
                return;
            }

            const config: ThemeConfig = {
                name: `${store.name} Theme`,
                version: '1.0',
                exportedAt: new Date().toISOString(),
                store: {
                    name: store.name,
                    theme: store.theme,
                    primary_color: store.primary_color,
                    accent_color: store.accent_color,
                    background_color: store.background_color,
                    text_color: store.text_color,
                    trust_badge_text: store.trust_badge_text || '',
                    meta_title: store.meta_title || '',
                    meta_description: store.meta_description || '',
                },
            };

            // Download as JSON file
            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `theme-${store.slug}-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'Theme exported successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to export theme' });
        }

        setExporting(false);
    }

    async function handleImport() {
        if (!importData.trim()) {
            setMessage({ type: 'error', text: 'Please paste theme JSON configuration' });
            return;
        }

        setImporting(true);
        setMessage(null);

        try {
            const config: ThemeConfig = JSON.parse(importData);

            if (!config.store || !config.store.theme) {
                setMessage({ type: 'error', text: 'Invalid theme configuration format' });
                setImporting(false);
                return;
            }

            const supabase = createBrowserClient();

            // Get current active store
            const { data: store, error: fetchError } = await supabase
                .from('stores')
                .select('id')
                .eq('is_active', true)
                .limit(1)
                .single();

            if (fetchError || !store) {
                setMessage({ type: 'error', text: 'No active store found to apply theme' });
                setImporting(false);
                return;
            }

            // Update store with imported theme config
            const { error: updateError } = await supabase
                .from('stores')
                .update({
                    theme: config.store.theme,
                    primary_color: config.store.primary_color,
                    accent_color: config.store.accent_color,
                    background_color: config.store.background_color,
                    text_color: config.store.text_color,
                    trust_badge_text: config.store.trust_badge_text,
                    meta_title: config.store.meta_title,
                    meta_description: config.store.meta_description,
                })
                .eq('id', store.id);

            if (updateError) {
                setMessage({ type: 'error', text: `Failed to import: ${updateError.message}` });
                setImporting(false);
                return;
            }

            setMessage({ type: 'success', text: 'Theme imported successfully! Refresh storefront to see changes.' });
            setImportData('');
        } catch (err) {
            setMessage({ type: 'error', text: 'Invalid JSON format' });
        }

        setImporting(false);
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImportData(event.target?.result as string);
        };
        reader.readAsText(file);
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-900">Theme Settings</h1>
                <p className="text-slate-500 mt-1">Export, import, and manage your theme configuration</p>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Export */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Export Theme</h2>
                            <p className="text-sm text-slate-500">Download your current configuration</p>
                        </div>
                    </div>

                    <p className="text-slate-600 text-sm mb-6">
                        Export your theme settings as a JSON file. This includes colors, theme type,
                        and store settings. Share with others or use as backup.
                    </p>

                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="w-full px-4 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                    >
                        {exporting ? 'Exporting...' : 'Export Theme Config'}
                    </button>
                </div>

                {/* Import */}
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#1e3a5f]/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#1e3a5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Import Theme</h2>
                            <p className="text-sm text-slate-500">Apply a theme configuration</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Upload JSON file or paste configuration
                        </label>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-slate-100 file:rounded file:text-slate-700"
                        />
                    </div>

                    <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder='{"name": "My Theme", "store": {...}}'
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm font-mono mb-4 h-32 resize-none"
                    />

                    <button
                        onClick={handleImport}
                        disabled={importing || !importData.trim()}
                        className="w-full px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        {importing ? 'Importing...' : 'Import Theme Config'}
                    </button>
                </div>
            </div>

            {/* Example Config */}
            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Example Theme Configuration</h3>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                    {`{
  "name": "Cyber Gaming Theme",
  "version": "1.0",
  "store": {
    "theme": "cyber",
    "primary_color": "#00ff88",
    "accent_color": "#00d4ff",
    "background_color": "#0a0a0a",
    "text_color": "#ffffff",
    "trust_badge_text": "Free Shipping • 30-Day Returns"
  }
}`}
                </pre>
            </div>
        </div>
    );
}
