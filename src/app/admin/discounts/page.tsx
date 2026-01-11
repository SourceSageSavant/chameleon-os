'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed' | 'free_shipping';
    value: number;
    min_order_amount: number | null;
    max_uses: number | null;
    uses_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
}

export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
        value: 10,
        min_order_amount: '',
        max_uses: '',
        expires_at: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDiscounts();
    }, []);

    async function fetchDiscounts() {
        const supabase = createBrowserClient();
        const { data } = await supabase
            .from('discounts')
            .select('*')
            .order('created_at', { ascending: false });

        setDiscounts(data || []);
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const supabase = createBrowserClient();

        // Get store ID
        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single();

        const { error } = await supabase.from('discounts').insert({
            store_id: store?.id,
            code: formData.code.toUpperCase(),
            type: formData.type,
            value: formData.value,
            min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
            max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            expires_at: formData.expires_at || null,
            is_active: true,
            uses_count: 0,
        });

        if (!error) {
            setShowForm(false);
            setFormData({ code: '', type: 'percentage', value: 10, min_order_amount: '', max_uses: '', expires_at: '' });
            fetchDiscounts();
        }
        setSaving(false);
    }

    async function toggleDiscount(id: string, isActive: boolean) {
        const supabase = createBrowserClient();
        await supabase.from('discounts').update({ is_active: !isActive }).eq('id', id);
        fetchDiscounts();
    }

    async function deleteDiscount(id: string) {
        if (!confirm('Are you sure you want to delete this discount?')) return;
        const supabase = createBrowserClient();
        await supabase.from('discounts').delete().eq('id', id);
        fetchDiscounts();
    }

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a5f]"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Discount Codes</h1>
                    <p className="text-slate-500 mt-1">Create and manage promotional codes</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Create Discount'}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
                    <h2 className="text-lg font-semibold mb-4">New Discount Code</h2>
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg uppercase"
                                placeholder="SUMMER20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            >
                                <option value="percentage">Percentage Off</option>
                                <option value="fixed">Fixed Amount Off</option>
                                <option value="free_shipping">Free Shipping</option>
                            </select>
                        </div>

                        {formData.type !== 'free_shipping' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Value {formData.type === 'percentage' ? '(%)' : '($)'}
                                </label>
                                <input
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                    min="0"
                                    max={formData.type === 'percentage' ? 100 : undefined}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Min Order Amount ($)</label>
                            <input
                                type="number"
                                value={formData.min_order_amount}
                                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Uses</label>
                            <input
                                type="number"
                                value={formData.max_uses}
                                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                placeholder="Unlimited"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Expires At</label>
                            <input
                                type="datetime-local"
                                value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Creating...' : 'Create Discount'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Discounts Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {discounts.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p>No discount codes yet. Create your first one!</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Code</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Type</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Value</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Uses</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-right px-6 py-3 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {discounts.map((discount) => (
                                <tr key={discount.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono font-semibold">{discount.code}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{discount.type.replace('_', ' ')}</td>
                                    <td className="px-6 py-4">
                                        {discount.type === 'percentage' && `${discount.value}%`}
                                        {discount.type === 'fixed' && `$${discount.value}`}
                                        {discount.type === 'free_shipping' && 'Free Shipping'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {discount.uses_count} / {discount.max_uses || '∞'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${discount.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {discount.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleDiscount(discount.id, discount.is_active)}
                                            className="text-sm text-slate-600 hover:text-slate-900 mr-3"
                                        >
                                            {discount.is_active ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => deleteDiscount(discount.id)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Setup Note */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-amber-800 mb-2">📋 Database Setup Required</h3>
                <p className="text-sm text-amber-700 mb-4">Run this SQL in your Supabase SQL Editor to create the discounts table:</p>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                    {`CREATE TABLE discounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES stores(id),
  code VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order_amount DECIMAL(10,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  starts_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now
CREATE POLICY "Allow all" ON discounts FOR ALL USING (true);`}
                </pre>
            </div>
        </div>
    );
}
