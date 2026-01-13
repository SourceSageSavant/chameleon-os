'use client';

import { useState } from 'react';
import Link from 'next/link';

type Step = 'url' | 'preview' | 'launching' | 'done';

interface ScrapedProduct {
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    source: string;
}

interface GeneratedBrand {
    storeName: string;
    storeSlug: string;
    tagline: string;
    theme: 'organic' | 'minimalist' | 'cyber';
    primaryColor: string;
    accentColor: string;
    trustBadges: string[];
    productTitle: string;
    productDescription: string;
    aboutContent: string;
}

interface LaunchResult {
    store: { id: string; name: string; slug: string };
    product: { id: string; title: string; slug: string } | null;
    urls: { admin: string; storefront: string; product: string };
}

export default function LaunchPage() {
    const [step, setStep] = useState<Step>('url');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [product, setProduct] = useState<ScrapedProduct | null>(null);
    const [brand, setBrand] = useState<GeneratedBrand | null>(null);
    const [result, setResult] = useState<LaunchResult | null>(null);

    async function handleScrape() {
        if (!url.trim()) return;

        setLoading(true);
        setError('');

        try {
            // Step 1: Scrape product
            const scrapeRes = await fetch('/api/ai/scrape-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const scrapeData = await scrapeRes.json();
            if (!scrapeRes.ok) {
                throw new Error(scrapeData.error || 'Failed to scrape URL');
            }

            setProduct(scrapeData.product);

            // Step 2: Generate brand
            const brandRes = await fetch('/api/ai/generate-brand', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: scrapeData.product }),
            });

            const brandData = await brandRes.json();
            if (!brandRes.ok) {
                throw new Error(brandData.error || 'Failed to generate brand');
            }

            setBrand(brandData.brand);
            setStep('preview');

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    async function handleLaunch() {
        if (!brand || !product) return;

        setStep('launching');
        setError('');

        try {
            const launchRes = await fetch('/api/ai/launch-store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand, product }),
            });

            const launchData = await launchRes.json();
            if (!launchRes.ok) {
                throw new Error(launchData.error || 'Failed to launch store');
            }

            setResult(launchData);
            setStep('done');

        } catch (err: any) {
            setError(err.message || 'Launch failed');
            setStep('preview');
        }
    }

    function reset() {
        setStep('url');
        setUrl('');
        setProduct(null);
        setBrand(null);
        setResult(null);
        setError('');
    }

    const themeColors = {
        organic: 'from-green-500 to-emerald-600',
        minimalist: 'from-slate-700 to-slate-900',
        cyber: 'from-purple-600 to-blue-600',
    };

    // Helper function to determine step circle styling
    const getStepStatus = (s: string, i: number): 'active' | 'completed' | 'pending' => {
        if (step === s || (step === 'launching' && s === 'preview')) {
            return 'active';
        }
        if (step === 'done' || (step === 'preview' && i === 0)) {
            return 'completed';
        }
        return 'pending';
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-sm font-medium mb-4">
                    🚀 AI-Powered
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Store Launcher</h1>
                <p className="text-lg text-slate-600">Paste a product URL → Get a complete store in seconds</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
                {['url', 'preview', 'done'].map((s, i) => {
                    const status = getStepStatus(s, i);
                    return (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${status === 'active'
                                    ? 'bg-purple-600 text-white'
                                    : status === 'completed'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-200 text-slate-500'
                                }`}>
                                {status === 'completed' ? '✓' : i + 1}
                            </div>
                            {i < 2 && <div className="w-20 h-1 bg-slate-200 mx-2" />}
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {/* Step 1: URL Input */}
            {step === 'url' && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Paste Product URL</h2>
                    <p className="text-slate-500 mb-6">Works with AliExpress, Amazon, Shopify stores, and more</p>

                    <div className="flex gap-3">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/product..."
                            className="flex-1 px-5 py-4 border border-slate-300 rounded-xl text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                            onClick={handleScrape}
                            disabled={loading || !url.trim()}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                '🔍 Analyze'
                            )}
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600 mb-2 font-medium">Try with:</p>
                        <button
                            onClick={() => setUrl('https://www.amazon.com/Creatine-Monohydrate-Gummies/dp/B0EXAMPLE')}
                            className="text-sm text-purple-600 hover:underline"
                        >
                            Example: Creatine Gummies Product
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && brand && product && (
                <div className="space-y-6">
                    {/* Brand Preview Card */}
                    <div className={`bg-gradient-to-r ${themeColors[brand.theme]} rounded-2xl p-8 text-white`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-white/70 text-sm mb-1">Generated Store</p>
                                <h2 className="text-3xl font-bold">{brand.storeName}</h2>
                                <p className="text-white/80 mt-1">{brand.tagline}</p>
                            </div>
                            <div className="text-right">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                    {brand.theme} theme
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-4">
                            {brand.trustBadges.map((badge, i) => (
                                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                                    ✓ {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Product Preview */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
                        <div className="flex gap-6">
                            {product.images.length > 0 && (
                                <img
                                    src={product.images[0]}
                                    alt=""
                                    className="w-32 h-32 object-cover rounded-xl"
                                />
                            )}
                            <div className="flex-1">
                                <h4 className="text-lg font-medium text-slate-900">{brand.productTitle}</h4>
                                <p className="text-2xl font-bold text-green-600 mt-2">${product.price?.toFixed(2)}</p>
                                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{product.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Colors Preview */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">Brand Colors</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg border-2 border-slate-200"
                                    style={{ backgroundColor: brand.primaryColor }}
                                />
                                <div>
                                    <p className="text-sm text-slate-500">Primary</p>
                                    <p className="font-mono text-sm">{brand.primaryColor}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg border-2 border-slate-200"
                                    style={{ backgroundColor: brand.accentColor }}
                                />
                                <div>
                                    <p className="text-sm text-slate-500">Accent</p>
                                    <p className="font-mono text-sm">{brand.accentColor}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={reset}
                            className="px-6 py-3 text-slate-700 font-medium rounded-xl border border-slate-300 hover:bg-slate-50"
                        >
                            ← Start Over
                        </button>
                        <button
                            onClick={handleLaunch}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 text-lg"
                        >
                            🚀 Launch Store Now
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Launching */}
            {step === 'launching' && (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6">
                        <svg className="animate-spin w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Launching Your Store...</h2>
                    <p className="text-slate-500">Creating store, adding products, setting up discounts...</p>
                </div>
            )}

            {/* Step 4: Done */}
            {step === 'done' && result && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-3xl font-bold mb-2">Store Launched!</h2>
                        <p className="text-white/80 text-lg">{result.store.name} is now live</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h3 className="font-semibold text-slate-900 mb-4">What was created:</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                                <span>Store: <strong>{result.store.name}</strong></span>
                            </li>
                            {result.product && (
                                <li className="flex items-center gap-3">
                                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                                    <span>Product: <strong>{result.product.title}</strong></span>
                                </li>
                            )}
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</span>
                                <span>Discount code: <strong>WELCOME10</strong> (10% off)</span>
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href={result.urls.admin}
                            className="px-6 py-4 bg-slate-900 text-white font-medium rounded-xl text-center hover:bg-slate-800"
                        >
                            ⚙️ Edit Store Settings
                        </Link>
                        <Link
                            href={result.urls.product}
                            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl text-center hover:opacity-90"
                        >
                            👁️ View Store
                        </Link>
                    </div>

                    <button
                        onClick={reset}
                        className="w-full px-6 py-3 text-slate-600 font-medium hover:text-slate-900"
                    >
                        🔄 Launch Another Store
                    </button>
                </div>
            )}
        </div>
    );
}
