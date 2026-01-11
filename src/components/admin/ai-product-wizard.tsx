'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';

interface AIWizardProps {
    storeId: string;
    onSuccess: () => void;
    onClose: () => void;
}

export default function AIProductWizard({ storeId, onSuccess, onClose }: AIWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');
    const [tone, setTone] = useState('persuasive');
    const [generatedData, setGeneratedData] = useState<any>(null);

    async function handleGenerate() {
        if (!input) return;
        setLoading(true);

        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, tone })
            });
            const data = await res.json();

            if (data.success) {
                setGeneratedData(data.data);
                setStep(2);
            } else {
                alert('Generation failed');
            }
        } catch (e) {
            alert('Error generating content');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setLoading(true);
        const supabase = createBrowserClient();

        // Save to Supabase
        const { error } = await supabase.from('products').insert({
            store_id: storeId,
            title: generatedData.title,
            description: generatedData.long_description, // HTML content
            slug: generatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            price: 29.99, // Default placeholder
            is_active: false // Draft
        });

        if (error) {
            alert('Failed to save product: ' + error.message);
        } else {
            onSuccess();
            onClose();
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ✨ AI Product Generator
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">What are you selling?</label>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="e.g. Portable Neck Fan, Anti-Gravity Humidifier..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tone of Voice</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['persuasive', 'hype', 'luxury'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`py-2 px-4 rounded-lg border text-sm font-medium capitalize transition-all ${tone === t
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !input}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                        Magic happening...
                                    </span>
                                ) : 'Generate High-Converting Copy 🚀'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                                    <input
                                        value={generatedData.title}
                                        onChange={e => setGeneratedData({ ...generatedData, title: e.target.value })}
                                        className="w-full mt-1 p-2 border rounded font-semibold text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Description</label>
                                    <textarea
                                        value={generatedData.short_description}
                                        onChange={e => setGeneratedData({ ...generatedData, short_description: e.target.value })}
                                        className="w-full mt-1 p-2 border rounded text-slate-600 h-20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sales Copy Preview</label>
                                    <div
                                        className="mt-1 p-4 bg-slate-50 border rounded-lg prose prose-sm max-w-none max-h-60 overflow-y-auto"
                                        dangerouslySetInnerHTML={{ __html: generatedData.long_description }}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg"
                                >
                                    {loading ? 'Saving...' : 'Import to Store'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
