'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface DomainSettings {
    domain: string;
    slug: string;
}

export default function StoreDomainSettings({ storeId }: { storeId: string }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<DomainSettings>({ domain: '', slug: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, [storeId]);

    async function fetchSettings() {
        const supabase = createBrowserClient();
        const { data } = await supabase
            .from('stores')
            .select('domain, slug')
            .eq('id', storeId)
            .single();

        if (data) {
            setSettings(data);
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        setMessage('');

        // TODO: Validate domain format and availability
        const supabase = createBrowserClient();
        const { error } = await supabase
            .from('stores')
            .update({
                domain: settings.domain,
                slug: settings.slug
            })
            .eq('id', storeId);

        if (error) {
            setMessage('Failed to save settings: ' + error.message);
        } else {
            setMessage('Domain settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
        setSaving(false);
    }

    if (loading) return <div className="animate-pulse h-20 bg-slate-50 rounded-lg"></div>;

    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">🌐 Domain configuration</h2>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Store Slug (Subdomain)
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            value={settings.slug}
                            onChange={(e) => setSettings({ ...settings, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg"
                            placeholder="my-store"
                        />
                        <span className="px-4 py-2 bg-slate-50 border border-l-0 border-slate-300 text-slate-500 rounded-r-lg">
                            .chameleon.app
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">This will be your default address.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Custom Domain
                    </label>
                    <input
                        type="text"
                        value={settings.domain}
                        onChange={(e) => setSettings({ ...settings, domain: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        placeholder="example.com"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        To connect your domain, set an A record pointing to <b>76.76.21.21</b> (Vercel).
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Domain Settings'}
                </button>
            </div>
        </div>
    );
}
