'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
    const subtotal = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    );

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [closeCart]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                            Your Cart ({items.length})
                        </h2>
                        <button
                            onClick={closeCart}
                            className="p-2 rounded-lg transition-colors hover:bg-black/5"
                            aria-label="Close cart"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <svg
                                    className="w-16 h-16 mb-4 opacity-30"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    style={{ color: 'var(--color-text)' }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                    Your cart is empty
                                </p>
                                <p className="text-sm opacity-60 mb-6" style={{ color: 'var(--color-text)' }}>
                                    Add some products to get started
                                </p>
                                <Link
                                    href="/products"
                                    onClick={closeCart}
                                    className="btn btn-primary"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={`${item.product_id}-${item.variant_id || 'default'}`}
                                        className="flex gap-4 p-3 rounded-xl"
                                        style={{ background: 'var(--color-background)' }}
                                    >
                                        {/* Product image */}
                                        <div
                                            className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ background: 'rgba(0,0,0,0.05)' }}
                                        >
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Product info */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="font-medium text-sm truncate mb-1"
                                                style={{ color: 'var(--color-text)' }}
                                            >
                                                {item.product.title}
                                            </h3>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: 'var(--color-primary)' }}
                                            >
                                                ${item.product.price.toFixed(2)}
                                            </p>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors hover:bg-black/5"
                                                    style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors hover:bg-black/5"
                                                    style={{ borderColor: 'rgba(0,0,0,0.2)' }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeItem(item.product_id, item.variant_id)}
                                            className="self-start p-1 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
                                            aria-label="Remove item"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-4 border-t space-y-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                            {/* Subtotal */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm opacity-60" style={{ color: 'var(--color-text)' }}>
                                    Subtotal
                                </span>
                                <span className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            {/* Shipping note */}
                            <p className="text-xs text-center opacity-50" style={{ color: 'var(--color-text)' }}>
                                Shipping and taxes calculated at checkout
                            </p>

                            {/* Checkout button */}
                            <Link
                                href="/checkout"
                                onClick={closeCart}
                                className="btn btn-primary w-full text-center"
                            >
                                Checkout — ${subtotal.toFixed(2)}
                            </Link>

                            {/* Continue shopping */}
                            <button
                                onClick={closeCart}
                                className="w-full text-center text-sm font-medium transition-colors hover:opacity-70"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CartDrawer;
