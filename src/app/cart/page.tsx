'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { Header, Footer } from '@/components/ui';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
    const subtotal = getSubtotal();

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

            <main className="section min-h-[60vh]">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
                        Your Cart
                    </h1>

                    {items.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                            <p className="opacity-60 mb-8">Looks like you haven't added anything yet.</p>
                            <Link href="/products" className="btn btn-primary px-8">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={`${item.product_id}-${item.variant_id || 'default'}`}
                                        className="flex gap-4 sm:gap-6 p-4 bg-white rounded-xl border transition-shadow hover:shadow-sm"
                                        style={{ borderColor: 'rgba(0,0,0,0.05)' }}
                                    >
                                        {/* Image */}
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                                        <Link href={`/products/${item.product.slug}`}>
                                                            {item.product.title}
                                                        </Link>
                                                    </h3>
                                                    {item.variant_id && (
                                                        <p className="text-sm opacity-60">
                                                            {item.product.variants?.find(v => v.id === item.variant_id)?.title}
                                                        </p>
                                                    )}
                                                </div>
                                                <p className="font-bold text-lg">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="mt-auto flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.product_id, item.variant_id)}
                                                    className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-6 rounded-2xl border sticky top-24" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6 text-sm">
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Shipping</span>
                                            <span className="font-medium">{subtotal >= 50 ? 'Free' : '$5.99'}</span>
                                        </div>
                                        <div className="flex justify-between pt-4 border-t font-bold text-lg">
                                            <span>Total</span>
                                            <span style={{ color: 'var(--color-primary)' }}>${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="btn btn-primary w-full text-center py-4 text-lg mb-4"
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    <div className="flex justify-center gap-3 opacity-40 grayscale">
                                        {/* Simple card icons */}
                                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                        <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
