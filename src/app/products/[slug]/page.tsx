'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Header, CartDrawer, Footer } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';
import { useCartStore } from '@/stores/cart-store';

interface DBProduct {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    images: string[];
    badges: string[];
    is_active: boolean;
}

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [product, setProduct] = useState<DBProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            const supabase = createBrowserClient();

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (error || !data) {
                setError(true);
                setLoading(false);
                return;
            }

            setProduct(data);
            setLoading(false);
        }

        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <>
                <Header
                    logoText="CreatinePro"
                    trustBadgeText="NSF Certified for Sport • Free Shipping Over $50"
                    navLinks={[]}
                />
                <main className="section min-h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
                </main>
                <Footer logoText="CreatinePro" />
            </>
        );
    }

    if (error || !product) {
        notFound();
    }

    return <ProductContent product={product} />;
}

function ProductContent({ product }: { product: DBProduct }) {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const { addItem, openCart } = useCartStore();

    const currentPrice = Number(product.price);
    const comparePrice = product.compare_at_price ? Number(product.compare_at_price) : null;

    const handleAddToCart = () => {
        setIsAdding(true);

        // Convert DB product to cart-compatible format
        const productToAdd = {
            id: product.slug,
            slug: product.slug,
            title: product.title,
            description: product.description || '',
            price: currentPrice,
            compare_at_price: comparePrice,
            images: product.images || [],
            badges: product.badges || [],
            features: [],
            variants: [],
            inStock: true,
        };

        addItem(productToAdd, quantity);

        // Show feedback then open cart
        setTimeout(() => {
            setIsAdding(false);
            openCart();
        }, 500);
    };

    return (
        <>
            <Header
                logoText="CreatinePro"
                trustBadgeText="NSF Certified for Sport • Free Shipping Over $50"
                navLinks={[
                    { label: 'Shop', href: '/products' },
                    { label: 'Benefits', href: '/#benefits' },
                    { label: 'Certifications', href: '/#trust' },
                    { label: 'FAQ', href: '/#faq' },
                ]}
            />
            <CartDrawer />

            <main className="section">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link href="/" className="opacity-50 hover:opacity-100">
                                    Home
                                </Link>
                            </li>
                            <li className="opacity-50">/</li>
                            <li>
                                <Link href="/products" className="opacity-50 hover:opacity-100">
                                    Shop
                                </Link>
                            </li>
                            <li className="opacity-50">/</li>
                            <li style={{ color: 'var(--color-text)' }}>{product.title}</li>
                        </ol>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left: Images */}
                        <div className="space-y-4">
                            {/* Main image */}
                            <div
                                className="aspect-square rounded-2xl overflow-hidden"
                                style={{ background: 'var(--color-background)' }}
                            >
                                {product.images?.[activeImage] ? (
                                    <img
                                        src={product.images[activeImage]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="text-center p-8">
                                            <svg
                                                className="w-24 h-24 mx-auto opacity-20"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{ color: 'var(--color-text)' }}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="mt-4 opacity-50">Product Image</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail gallery */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx
                                                ? 'border-primary opacity-100'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            style={{
                                                borderColor: activeImage === idx ? 'var(--color-primary)' : 'transparent',
                                                background: 'var(--color-background)'
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.title} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Product info */}
                        <div className="space-y-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {product.badges?.map((badge, i) => (
                                    <span key={i} className="trust-badge">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {badge}
                                    </span>
                                ))}
                                {(!product.badges || product.badges.length === 0) && (
                                    <span className="trust-badge">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        NSF Certified
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1
                                className="text-3xl md:text-4xl font-bold"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {product.title}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                                    4.9 (2,400+ reviews)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span
                                    className="text-3xl font-bold"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    ${currentPrice.toFixed(2)}
                                </span>
                                {comparePrice && comparePrice > currentPrice && (
                                    <>
                                        <span className="text-lg line-through opacity-50" style={{ color: 'var(--color-text)' }}>
                                            ${comparePrice.toFixed(2)}
                                        </span>
                                        <span
                                            className="px-2 py-1 rounded text-sm font-medium text-white"
                                            style={{ background: 'var(--color-error, #EF4444)' }}
                                        >
                                            Save ${(comparePrice - currentPrice).toFixed(0)}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                                    Quantity
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border flex items-center justify-center transition-colors hover:bg-black/5"
                                        style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border flex items-center justify-center transition-colors hover:bg-black/5"
                                        style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`w-full btn btn-primary text-lg py-4 ${isAdding ? 'opacity-70' : ''}`}
                            >
                                {isAdding ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Adding...
                                    </span>
                                ) : (
                                    `Add to Cart — $${(currentPrice * quantity).toFixed(2)}`
                                )}
                            </button>

                            {/* Trust signals */}
                            <div className="flex flex-wrap items-center gap-4 text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Free Shipping Over $50
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    30-Day Returns
                                </span>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure Checkout
                                </span>
                            </div>

                            {/* Description */}
                            <div
                                className="pt-6 border-t"
                                style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'var(--color-text)' }}
                            >
                                <h3 className="text-lg font-semibold mb-3">Description</h3>
                                <div className="opacity-80 whitespace-pre-line leading-relaxed text-sm">
                                    {product.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer
                logoText="CreatinePro"
                description="Premium creatine gummies backed by science. NSF Certified for Sport."
                copyrightText="© 2026 CreatinePro. All rights reserved."
            />
        </>
    );
}
