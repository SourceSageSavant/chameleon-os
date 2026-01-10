'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { Appearance, StripeElementsOptions } from '@stripe/stripe-js';
import { useCartStore } from '@/stores/cart-store';
import { stripePromise } from '@/lib/stripe';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Header, Footer } from '@/components/ui';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal } = useCartStore();
    const [clientSecret, setClientSecret] = useState('');

    // Calculate total amount in cents
    const amount = Math.round(getSubtotal() * 100);

    useEffect(() => {
        // Redirect if cart is empty
        if (items.length === 0) {
            router.push('/products');
            return;
        }

        // Create PaymentIntent as soon as the page loads
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, amount }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => console.error('Error creating payment intent:', err));
    }, [items, amount, router]);

    const appearance: Appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#2D5A27', // Match organic theme
            colorBackground: '#ffffff',
            colorText: '#2C3E50',
        },
    };

    const options: StripeElementsOptions = {
        clientSecret,
        appearance,
    };

    if (items.length === 0) {
        return null; // or a loading spinner while redirecting
    }

    return (
        <>
            <Header
                logoText="CreatinePro"
                trustBadgeText="Secure Checkout • 256-bit Encryption"
                navLinks={[]} // Minimal nav for checkout
            />

            <main className="section bg-gray-50 min-h-screen">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--color-text)' }}>
                        Checkout
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 order-2 md:order-1">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product.images?.[0]}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="font-medium text-sm">{item.product.title}</h3>
                                                <p className="font-medium text-sm">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${getSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span>{getSubtotal() >= 50 ? 'Free' : '$5.99'}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${getSubtotal().toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Field */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm order-1 md:order-2">
                            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <CheckoutForm amount={amount} />
                                </Elements>
                            ) : (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer
                logoText="CreatinePro"
                showNewsletter={false}
                description="Secure Payment Processing by Stripe"
            />
        </>
    );
}
