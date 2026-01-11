'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase';

interface CSVProduct {
    title: string;
    slug: string;
    description: string;
    price: number;
    compare_at_price?: number;
    inventory_quantity: number;
    images: string[];
    is_active: boolean;
}

export default function ImportPage() {
    const [csvText, setCsvText] = useState('');
    const [products, setProducts] = useState<CSVProduct[]>([]);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
    const [error, setError] = useState('');

    function parseCSV(text: string): CSVProduct[] {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const products: CSVProduct[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const product: any = {};

            headers.forEach((header, idx) => {
                const value = values[idx] || '';

                switch (header) {
                    case 'title':
                    case 'name':
                        product.title = value;
                        break;
                    case 'slug':
                        product.slug = value || value.toLowerCase().replace(/\s+/g, '-');
                        break;
                    case 'description':
                        product.description = value;
                        break;
                    case 'price':
                        product.price = parseFloat(value) || 0;
                        break;
                    case 'compare_at_price':
                    case 'compare_price':
                        product.compare_at_price = parseFloat(value) || null;
                        break;
                    case 'inventory':
                    case 'stock':
                    case 'quantity':
                    case 'inventory_quantity':
                        product.inventory_quantity = parseInt(value) || 0;
                        break;
                    case 'image':
                    case 'images':
                    case 'image_url':
                        product.images = value ? value.split(';').map(s => s.trim()) : [];
                        break;
                    case 'active':
                    case 'is_active':
                        product.is_active = value.toLowerCase() === 'true' || value === '1';
                        break;
                }
            });

            // Generate slug if not provided
            if (!product.slug && product.title) {
                product.slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            }

            // Set defaults
            product.description = product.description || '';
            product.inventory_quantity = product.inventory_quantity || 0;
            product.images = product.images || [];
            product.is_active = product.is_active ?? true;

            if (product.title && product.price) {
                products.push(product);
            }
        }

        return products;
    }

    function handleParse() {
        setError('');
        const parsed = parseCSV(csvText);
        if (parsed.length === 0) {
            setError('No valid products found. Make sure CSV has at least title and price columns.');
            return;
        }
        setProducts(parsed);
    }

    async function handleImport() {
        setImporting(true);
        setResult(null);

        const supabase = createBrowserClient();

        // Get store ID
        const { data: store } = await supabase
            .from('stores')
            .select('id')
            .eq('is_active', true)
            .limit(1)
            .single();

        if (!store) {
            setError('No active store found');
            setImporting(false);
            return;
        }

        let success = 0;
        let failed = 0;

        for (const product of products) {
            const { error } = await supabase.from('products').insert({
                store_id: store.id,
                title: product.title,
                slug: product.slug,
                description: product.description,
                price: product.price,
                compare_at_price: product.compare_at_price,
                inventory_quantity: product.inventory_quantity,
                images: product.images,
                is_active: product.is_active,
                is_featured: false,
            });

            if (error) {
                console.error('Import error:', error);
                failed++;
            } else {
                success++;
            }
        }

        setResult({ success, failed });
        setImporting(false);

        if (success > 0) {
            setProducts([]);
            setCsvText('');
        }
    }

    const sampleCSV = `title,price,compare_at_price,inventory,image,description
Premium Widget,29.99,39.99,100,https://example.com/widget.jpg,A high-quality widget
Super Gadget,49.99,,50,https://example.com/gadget.jpg,The best gadget around
Basic Item,9.99,,200,,A simple item`;

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/products" className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block">
                    ← Back to Products
                </Link>
                <h1 className="text-2xl font-semibold text-slate-900">Bulk Import Products</h1>
                <p className="text-slate-500 mt-1">Import multiple products from CSV</p>
            </div>

            {/* Result Message */}
            {result && (
                <div className={`mb-6 p-4 rounded-lg ${result.failed === 0
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                    }`}>
                    Imported {result.success} products successfully.
                    {result.failed > 0 && ` ${result.failed} failed.`}
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {error}
                </div>
            )}

            {products.length === 0 ? (
                <>
                    {/* CSV Input */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                        <h2 className="font-semibold text-slate-900 mb-4">Paste CSV Data</h2>
                        <textarea
                            value={csvText}
                            onChange={(e) => setCsvText(e.target.value)}
                            placeholder="title,price,inventory,image,description..."
                            className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm resize-none"
                        />
                        <button
                            onClick={handleParse}
                            disabled={!csvText.trim()}
                            className="mt-4 px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] disabled:opacity-50"
                        >
                            Parse CSV
                        </button>
                    </div>

                    {/* Sample CSV */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h2 className="font-semibold text-slate-900 mb-4">CSV Format Example</h2>
                        <p className="text-sm text-slate-600 mb-4">
                            Required columns: <code className="bg-slate-200 px-1 rounded">title</code>, <code className="bg-slate-200 px-1 rounded">price</code>
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                            Optional: <code className="bg-slate-200 px-1 rounded">slug</code>, <code className="bg-slate-200 px-1 rounded">description</code>, <code className="bg-slate-200 px-1 rounded">compare_at_price</code>, <code className="bg-slate-200 px-1 rounded">inventory</code>, <code className="bg-slate-200 px-1 rounded">image</code>
                        </p>
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                            {sampleCSV}
                        </pre>
                        <button
                            onClick={() => setCsvText(sampleCSV)}
                            className="mt-4 text-sm text-[#1e3a5f] hover:underline"
                        >
                            Use sample CSV
                        </button>
                    </div>
                </>
            ) : (
                <>
                    {/* Preview */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-slate-900">Preview ({products.length} products)</h2>
                            <button
                                onClick={() => setProducts([])}
                                className="text-sm text-slate-500 hover:text-slate-700"
                            >
                                ← Back to edit
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left px-4 py-2">Title</th>
                                        <th className="text-left px-4 py-2">Price</th>
                                        <th className="text-left px-4 py-2">Compare</th>
                                        <th className="text-left px-4 py-2">Stock</th>
                                        <th className="text-left px-4 py-2">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="px-4 py-2 font-medium">{p.title}</td>
                                            <td className="px-4 py-2">${p.price.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-slate-500">
                                                {p.compare_at_price ? `$${p.compare_at_price.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-4 py-2">{p.inventory_quantity}</td>
                                            <td className="px-4 py-2">
                                                {p.images.length > 0 ? '✓' : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Import Button */}
                    <button
                        onClick={handleImport}
                        disabled={importing}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                    >
                        {importing ? 'Importing...' : `Import ${products.length} Products`}
                    </button>
                </>
            )}
        </div>
    );
}
