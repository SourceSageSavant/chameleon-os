'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';
import { Header, Footer } from '@/components/ui';

export default function CheckoutSuccessPage() {
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Clear the cart on successful payment
        clearCart();

        // In a real app, you would verify the payment intent status here
        // using stripe.retrievePaymentIntent(clientSecret)
    }, [clearCart]);

    return (
        <>
            <Header
                logoText="CreatinePro"
                trustBadgeText="Order Confirmed"
                navLinks={[]}
            />

            <main className="section min-h-[60vh] flex items-center justify-center">
                <div className="container max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Order Confirmed!
                    </h1>

                    <p className="opacity-70 mb-8" style={{ color: 'var(--color-text)' }}>
                        Thank you for your purchase. We've sent a confirmation email with your order details.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
                        <h3 className="font-semibold mb-2">Order #{(Math.random() * 1000000).toFixed(0)}</h3>
                        <p className="text-sm opacity-60">
                            Your order will be shipped within 1-2 business days.
                        </p>
                    </div>

                    <Link href="/" className="btn btn-primary w-full block">
                        Continue Shopping
                    </Link>
                </div>
            </main>

            <Footer logoText="CreatinePro" />
        </>
    );
}
