'use client';

import { useState } from 'react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 mt-1">Configure your Chameleon Commerce OS</p>
            </div>

            {saved && (
                <div className="mb-6 p-4 bg-slate-50 border border-green-200 rounded-lg text-indigo-700 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Settings saved successfully!
                </div>
            )}

            {/* API Keys */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">API Keys</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Publishable Key</label>
                        <input
                            type="text"
                            placeholder="pk_test_..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] font-mono text-sm"
                            defaultValue={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
                        />
                        <p className="text-xs text-slate-500 mt-1">Set in Vercel Environment Variables</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Secret Key</label>
                        <input
                            type="password"
                            placeholder="sk_test_..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] font-mono text-sm"
                        />
                        <p className="text-xs text-slate-500 mt-1">Never expose this key on the frontend</p>
                    </div>
                </div>
            </div>

            {/* Supabase */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Database (Supabase)</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Supabase URL</label>
                        <input
                            type="text"
                            placeholder="https://xxx.supabase.co"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] font-mono text-sm"
                            defaultValue={process.env.NEXT_PUBLIC_SUPABASE_URL || ''}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Anon Key</label>
                        <input
                            type="text"
                            placeholder="eyJ..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] font-mono text-sm"
                            defaultValue={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || ''}
                            readOnly
                        />
                    </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                    <p className="font-medium">Database Connected ✓</p>
                    <p className="text-xs mt-1">Manage environment variables in Vercel Dashboard</p>
                </div>
            </div>

            {/* Default Settings */}
            <div className="bg-white rounded-xl p-6 border border-slate-100 mb-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Default Store Settings</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                        <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]">
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Default Shipping Cost</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                defaultValue="0"
                                className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Free Shipping Threshold</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                defaultValue="50"
                                className="w-full pl-7 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl p-6 border border-red-200 mb-6">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-100 rounded-lg">
                        <div>
                            <p className="font-medium text-slate-900">Clear All Data</p>
                            <p className="text-sm text-slate-500">Delete all stores, products, and orders</p>
                        </div>
                        <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                            Clear Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2d4a6f] transition-colors"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
}


